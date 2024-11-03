# EASEREADER-GENAI

# SETUP INSTRUCTIONS:
# CLONE THE DIRECTORY:
```
git clone https://github.com/Aadhithya1806/EASEREADER-GENAI.git
```

# FRONTEND SETUP:
# Go to root/frontend/

```
npm install
```
# Go to src/components/MessageInput.jsx 
change the url in the fetch api to 'http://127.0.0.1:8000/ask_question/'
# Go to src/components/Header.jsx
change the url in the fetch api to 'http://127.0.0.1:8000/process_documents/'

save and run the following command.
```
npm run dev
```
# BACKEND SETUP:

# Go to root/backend/

# Activate the environment
```
conda activate venv/
```

# Install required packages
```
pip install -r requirements.txt
```
# Start Server 
```
unicorn main:app --host 127.0.0.1 --port 8000
```



