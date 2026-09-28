FROM python:3.11-slim

# Create a non-root user
RUN useradd -m -s /bin/bash app_user

WORKDIR /app

# Install dependencies (simulated based on README)
# The README mentions `xgboost-cpu` is used to avoid CUDA dependency
RUN pip install --no-cache-dir fastapi uvicorn xgboost-cpu pandas pydantic prometheus-client mlflow

# Copy application code
COPY . /app
RUN chown -R app_user:app_user /app

USER app_user

EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

CMD ["uvicorn", "milk_adulteration.api.app:app", "--host", "0.0.0.0", "--port", "8000"]
