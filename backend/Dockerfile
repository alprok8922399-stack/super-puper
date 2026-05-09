FROM python:3.11-slim
WORKDIR /app

# Скопировать только requirements и установить зависимости (быстрее кэшируется)
COPY backend/requirements.txt /app/requirements.txt
RUN python -m pip install --upgrade pip \
 && pip install --no-cache-dir -r /app/requirements.txt

# Скопировать код
COPY backend /app/backend

ENV PYTHONPATH=/app

# Запуск uvicorn; порт Render по умолчанию 10000 (можно поменять)
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "10000"]
