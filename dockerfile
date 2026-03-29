FROM python:3.11-slim

WORKDIR /app

# Dependencias del sistema para face_recognition y psycopg2
RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    libpq-dev \
    libboost-python-dev \
    libboost-thread-dev \
    libopenblas-dev \
    liblapack-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./app ./app
COPY ./templates ./templates
COPY ./static ./static
COPY face_utils.py .

EXPOSE 5000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5000", "--reload"]
