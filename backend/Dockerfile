FROM python:3.13.2-slim
WORKDIR /HospitalApp/backend

# Install backend dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY . .
RUN export PYTHONPATH="$PYTHONPATH:/HospitalApp/backend/app/"

# Copy Angular dist folder from previous stage
# COPY --from=frontend /HospitalApp/frontend/dist/app ./static

# Run FastAPI with uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]