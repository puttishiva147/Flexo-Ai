FROM nvidia/cuda:12.4.1-cudnn-devel-ubuntu22.04
ENV DEBIAN_FRONTEND=noninteractive PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
RUN apt-get update && apt-get install -y --no-install-recommends python3 python3-pip git ffmpeg libgl1 libglib2.0-0 && rm -rf /var/lib/apt/lists/*
WORKDIR /srv/flexo-worker
COPY requirements.txt .
RUN python3 -m pip install --no-cache-dir -r requirements.txt
COPY app.py .
EXPOSE 8001
CMD ["python3","-m","uvicorn","app:app","--host","0.0.0.0","--port","8001"]
