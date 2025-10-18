FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

RUN pip install gunicorn uvicorn[standard]

COPY . .

EXPOSE 8000

CMD ["bash", "-c", "\
  gunicorn main:app \
  --worker-class uvicorn.workers.UvicornWorker \
  --workers $(( $(nproc) * 2 + 1 )) \
  --bind 0.0.0.0:${PORT:-8000}"]