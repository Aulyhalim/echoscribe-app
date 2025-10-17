import whisper
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import os
import time
from pyannote.audio import Pipeline
import torch
import google.generativeai as genai
from dotenv import load_dotenv

# --- Konfigurasi Awal ---

# Memuat semua environment variables dari file .env
load_dotenv()

app = FastAPI()

# CORS Middleware - PENTING untuk Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "https://*.vercel.app",  # Untuk production nanti
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Memuat Kunci API dari environment variables (file .env) - LEBIH AMAN
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
PYANNOTE_AUTH_TOKEN = os.getenv("PYANNOTE_AUTH_TOKEN")

# Validasi bahwa kunci API ada
if not GOOGLE_API_KEY:
    raise ValueError("Error: GOOGLE_API_KEY tidak ditemukan. Pastikan ada di dalam file .env")
if not PYANNOTE_AUTH_TOKEN:
    raise ValueError("Error: PYANNOTE_AUTH_TOKEN tidak ditemukan. Pastikan ada di dalam file .env")

# Konfigurasi Google Gemini dengan kunci API yang sudah dimuat
genai.configure(api_key=GOOGLE_API_KEY)


# --- Memuat Model AI ---
print("Memuat model Whisper...")
model_whisper = whisper.load_model("base")
print("Model Whisper selesai dimuat.")

print("Memuat pipeline Pyannote...")
device = "cuda" if torch.cuda.is_available() else "cpu"
pipeline_diarize = Pipeline.from_pretrained(
    "pyannote/speaker-diarization-3.1",
    use_auth_token=PYANNOTE_AUTH_TOKEN  # Menggunakan token dari .env
).to(torch.device(device))
print("Pipeline Pyannote selesai dimuat.")


# --- Endpoints ---
@app.get("/")
def read_root():
    return {"Project": "EchoScribe", "status": "active", "version": "1.0.0"}

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "models_loaded": True,
        "device": device
    }

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    os.makedirs("temp", exist_ok=True)
    temp_file_path = f"temp/{int(time.time())}_{file.filename}"

    try:
        # 1. Menyimpan file audio sementara
        with open(temp_file_path, "wb") as buffer:
            buffer.write(await file.read())
        
        # 2. Transkripsi dengan Whisper (dengan stempel waktu per kata)
        print(f"Memulai transkripsi pada {temp_file_path}...")
        result_whisper = model_whisper.transcribe(temp_file_path, fp16=False, word_timestamps=True)
        print("Transkripsi selesai.")
        
        # 3. Speaker Diarization dengan Pyannote
        print(f"Menjalankan diarisasi pembicara pada {temp_file_path}...")
        diarization_result = pipeline_diarize(temp_file_path)
        print("Diarisasi selesai.")

        # 4. Menggabungkan hasil Whisper dan Pyannote
        final_transcript = []
        for turn, _, speaker in diarization_result.itertracks(yield_label=True):
            segment_words = []
            for segment in result_whisper['segments']:
                for word_info in segment['words']:
                    word_start = word_info['start']
                    if turn.start <= word_start < turn.end:
                        segment_words.append(word_info['word'])
            
            if segment_words:
                final_transcript.append({
                    "speaker": speaker,
                    "text": "".join(segment_words).strip(),
                    "start": f"{turn.start:.2f}",
                    "end": f"{turn.end:.2f}"
                })
        
        # 5. Membuat Ringkasan dengan Gemini
        print("Membuat ringkasan dengan Gemini...")
        
        # Format transkrip agar mudah dibaca oleh AI
        formatted_transcript_for_gemini = ""
        for item in final_transcript:
            formatted_transcript_for_gemini += f"{item['speaker']}: {item['text']}\n"
            
        # Membuat prompt yang canggih untuk Gemini
        generation_config = {"temperature": 0.3}
        model_gemini = genai.GenerativeModel("gemini-pro", generation_config=generation_config) 
        
        prompt = f"""
        Anda adalah asisten rapat profesional yang ahli dalam meringkas transkrip.
        Berdasarkan transkrip rapat di bawah ini, lakukan tiga hal:
        1.  Buat ringkasan eksekutif singkat (2-3 kalimat).
        2.  Identifikasi dan daftar semua poin keputusan penting yang dibuat.
        3.  Identifikasi dan daftar semua action items (tugas yang harus dilakukan), siapa yang ditugaskan jika disebutkan.

        Format output Anda dengan jelas menggunakan judul "Ringkasan", "Poin Keputusan", dan "Action Items".

        TRANSKRIP RAPAT:
        ---
        {formatted_transcript_for_gemini}
        ---
        """
        
        summary_result = model_gemini.generate_content(prompt)
        print("Ringkasan selesai dibuat.")
        
        # Mengembalikan SEMUA hasil
        return {
            "full_transcript": result_whisper["text"], 
            "speaker_transcript": final_transcript,
            "summary": summary_result.text
        }

    except Exception as e:
        print(f"Error: {str(e)}")
        # Mengembalikan respons error yang lebih informatif ke client
        return {"error": f"Terjadi kesalahan saat memproses file: {str(e)}"}
        
    finally:
        # Selalu hapus file sementara setelah selesai
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
            print(f"File sementara dihapus: {temp_file_path}")