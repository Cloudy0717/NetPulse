from .conftest import *
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_ping_endpoint():
    response = client.get("/api/ping?host=google.com")
    assert response.status_code == 200
    data = response.json()
    assert "host" in data
    assert "status" in data
    assert data["status"] in ["online", "timeout", "error"]


def test_ping_default_host():
    response = client.get("/api/ping")
    assert response.status_code == 200
    data = response.json()
    assert data["host"] == "google.com"


def test_ping_custom_host():
    response = client.get("/api/ping?host=cloudflare.com")
    assert response.status_code == 200
    data = response.json()
    assert data["host"] == "cloudflare.com"
