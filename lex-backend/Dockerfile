FROM nvidia/cuda:12.9.1-cudnn-devel-ubuntu24.04

ENV DEBIAN_FRONTEND=noninteractive PYTHONUNBUFFERED=1 PIP_NO_CACHE_DIR=1
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3.12 python3.12-venv python3-pip git ffmpeg build-essential patch \
    libgl1 libglib2.0-0 ca-certificates && rm -rf /var/lib/apt/lists/*

RUN ln -sf /usr/bin/python3.12 /usr/local/bin/python && ln -sf /usr/bin/python3.12 /usr/local/bin/python3
WORKDIR /opt
RUN git clone https://github.com/Pika-Labs/Pika-H3-Flex.git /opt/Pika-H3-Flex
WORKDIR /opt/Pika-H3-Flex
RUN python -m pip install --break-system-packages -r requirements.txt \
    && python tools/apply_diffusers_patches.py \
    && python -m pip install --break-system-packages --no-deps -e .

WORKDIR /app
COPY requirements.txt .
RUN python -m pip install --break-system-packages -r requirements.txt
COPY main.py .
ENV LEX_DATA_DIR=/data/lex MODEL_REPO=Pika-Labs/Pika-H3-Flex MODEL_REVISION=0ddf55ad7067ca1e76812253bd7b4600df87f759
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
