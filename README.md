# NirmayNet
NiramayNet : first rural care continuity platform. SIH 2026 | PS SIH26133 | Government of Maharashtra
<img width="1024" height="577" alt="1788785212061-f3a91e03-a3f3-46a7-9a7f-b9d9aba9991a_1" src="https://github.com/user-attachments/assets/e4f79b82-1621-4a48-9158-584fd3e9beea" />
<img width="1024" height="577" alt="1788785212061-f3a91e03-a3f3-46a7-9a7f-b9d9aba9991a_2" src="https://github.com/user-attachments/assets/b0869d5b-e437-4677-b1e3-1beafe7ef6fa" />
<img width="1024" height="577" alt="1788785212061-f3a91e03-a3f3-46a7-9a7f-b9d9aba9991a_3" src="https://github.com/user-attachments/assets/85c868a0-bea5-4cb2-b296-3dadb07d5be5" />
<img width="1024" height="577" alt="1788785212061-f3a91e03-a3f3-46a7-9a7f-b9d9aba9991a_4" src="https://github.com/user-attachments/assets/a2c152ca-227d-49b7-a0b6-0d5fbd1eca7c" />
<img width="1024" height="577" alt="1788785212061-f3a91e03-a3f3-46a7-9a7f-b9d9aba9991a_5" src="https://github.com/user-attachments/assets/562d0367-9e79-4873-8f48-d9f361ad9d10" />
<img width="1024" height="577" alt="1788785212061-f3a91e03-a3f3-46a7-9a7f-b9d9aba9991a_6" src="https://github.com/user-attachments/assets/bd0f43f5-a08c-410c-9f7f-0fcfe25fce0f" />

## How to Run on Any Laptop (Any Wi-Fi)

The website frontend dynamically auto-detects the backend hostname (`localhost` or local IP). Follow these steps to run the complete platform:

### 1. Backend (Terminal 1)
```bash
cd backend
python -m venv venv
# On Windows: .\venv\Scripts\activate
# On macOS/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
> The API will be running at `http://127.0.0.1:8000` (docs at `http://127.0.0.1:8000/docs`).

### 2. Frontend Web (Terminal 2)
```bash
cd web
npm install
npm run dev
```
> Open [http://localhost:3000](http://localhost:3000) in your browser. It will automatically connect to the local backend on port 8000.
