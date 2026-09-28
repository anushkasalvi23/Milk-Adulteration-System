# Monitoring & Deployment Setup

This document describes the monitoring stack and deployment pieces set up for the Milk Adulteration System.

## Architecture & Services

The `docker-compose.yml` configures the following stack:

1. **`api` (FastAPI Service - Port 8000)**
   - Exposes predictions and health endpoints.
   - Specifically exposes `/metrics` for Prometheus to scrape request volume, latency, predictions by band/adulterant, and risk score distribution.
   - Built from `Dockerfile`, runs as a non-root user, and has an explicit health check.
   - Connects to MLflow tracking UI via the `MLFLOW_TRACKING_URI` environment variable.

2. **`prometheus` (Metrics Storage - Port 9090)**
   - Runs `prom/prometheus`.
   - Mounts `prometheus.yml` which instructs it to scrape the `api` service at `/metrics` every 15 seconds.
   - Has a persistent volume `prometheus_data` so metric history survives container restarts.

3. **`grafana` (Visualization - Port 3000)**
   - Runs `grafana/grafana`.
   - Configured with `grafana_data` volume to persist dashboards.
   - Automatically provisions Prometheus as its data source.
   - Pre-loaded with the **Milk Adulteration Monitoring** dashboard (provisioned from `grafana/dashboards/milk_adulteration.json`).

4. **`mlflow` (Experiment Tracking & Model Registry - Port 5000)**
   - Runs the `mlflow server`.
   - Uses a SQLite backend (`mlflow.db`) and a local artifact store, mounted into a persistent volume `mlflow_data`.
   - This ensures the model registry and historical experiments remain intact when the stack is recreated.

## Getting Started

To bring up the entire stack locally:

```bash
docker compose up -d --build
```

### Accessing the Services

- **FastAPI Application**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **MLflow UI**: [http://localhost:5000](http://localhost:5000)
- **Prometheus**: [http://localhost:9090](http://localhost:9090)
- **Grafana Dashboard**: [http://localhost:3000](http://localhost:3000)
  - Default credentials are **Username**: `admin`, **Password**: `admin`.
  - Navigate to Dashboards -> General -> Milk Adulteration Monitoring to view the pre-configured charts.

### Grafana Dashboard Features

The dashboard includes the following metrics based on the `/metrics` endpoint:
- **Request Latency**: Visualizes the p50 and p95 latencies for each route over time.
- **Request Volume**: Total requests grouped by the API route.
- **Predictions**: Breaks down model predictions by band and adulterant class.
- **Rejected-row Rate**: The proportion of rows rejected vs. successfully scored.
- **Risk-score Histogram**: A heatmap representing the distribution of calculated risk scores for samples.
