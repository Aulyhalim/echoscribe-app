# Gunakan base image Python
FROM python:3.11-slim

# Set direktori kerja di dalam container
WORKDIR /code

# Salin file requirements dan install semua library
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Salin semua file proyek Anda ke dalam container
COPY . /code/

# Beri tahu Hugging Face bahwa aplikasi Anda berjalan di port 8001
EXPOSE 8001

# Perintah untuk menjalankan aplikasi FastAPI dengan Uvicorn di port 8001
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]