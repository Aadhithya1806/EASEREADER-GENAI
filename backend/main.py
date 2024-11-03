from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain.chains.question_answering import load_qa_chain
from langchain.prompts import PromptTemplate
import google.generativeai as genai
import uvicorn
import os

# Load environment variables and configure Gemini API
load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

app = FastAPI(title="EaseReader API", description="Chat with multiple PDFs")


origins = [
    "http://localhost:5173",
    "https://easereader-genai-3ni1.vercel.app",  
    # Add other trusted origins here if necessary
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)
# Helper Functions


def get_pdf_text(pdf_files):
    """Extract text from uploaded PDF files."""
    text = ""
    for pdf in pdf_files:
        pdf_reader = PdfReader(pdf.file)
        for page in pdf_reader.pages:
            text += page.extract_text()
    return text


def get_text_chunks(raw_text):
    """Split text into manageable chunks."""
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=10000, chunk_overlap=1000)
    chunks = text_splitter.split_text(raw_text)
    return chunks


def get_vectorstore(text_chunks):
    """Create and save a vector store from text chunks."""
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    vector_store = FAISS.from_texts(texts=text_chunks, embedding=embeddings)
    vector_store.save_local("faiss_index")
    return vector_store


def get_conversational_chain():
    """Load the question-answering chain with the Gemini model."""
    prompt_template = '''
    Answer the question as detailed as possible from the provided context. If the answer is not in the context, respond with "answer is not available in the context".\n\n
    Context: \n {context} \n
    Question: \n {question} \n
    Answer:
    '''
    model = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0.3)
    prompt = PromptTemplate(template=prompt_template,
                            input_variables=["context", "question"])
    chain = load_qa_chain(model, chain_type="stuff", prompt=prompt)
    return chain

# API Models


class QuestionRequest(BaseModel):
    question: str

# API Endpoints


@app.post("/process_documents/")
async def process_documents(files: list[UploadFile]):
    """Endpoint to upload PDFs, process them, and build the vector store."""
    raw_text = get_pdf_text(files)
    text_chunks = get_text_chunks(raw_text)
    get_vectorstore(text_chunks)
    return {"message": "Documents processed and vector store created"}


@app.post("/ask_question/")
async def ask_question(question_data: QuestionRequest):
    """Endpoint to ask a question based on the processed PDF documents."""
    user_question = question_data.question
    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    new_db = FAISS.load_local(
        "faiss_index", embeddings, allow_dangerous_deserialization=True)
    docs = new_db.similarity_search(user_question)
    chain = get_conversational_chain()
    response = chain(
        {"input_documents": docs, "question": user_question}, return_only_outputs=True)
    return {
        "sender": "bot",
        "message": response["output_text"]}

# Run FastAPI with Uvicorn when this script is executed
if __name__ == "__main__":

    uvicorn.run(app, host="localhost", port=8000)
