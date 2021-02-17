FROM python:3.8

COPY requirements.txt ./requirements.txt

RUN pip install -r requirements.txt

EXPOSE 80

COPY . .

CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "80"]


