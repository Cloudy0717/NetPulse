from .conftest import *
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_system_endpoint():
    response = client.get("/api/system")
    assert response.status_code == 200
    data = response.json()
    assert "hostname" in data
    assert "cpu_percent" in data
    assert "ram_percent" in data
    assert "disk_percent" in data
    assert 0 <= data["cpu_percent"] <= 100
    assert 0 <= data["ram_percent"] <= 100
    assert 0 <= data["disk_percent"] <= 100


def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_system_has_required_fields():
    response = client.get("/api/system")
    data = response.json()
    required_fields = [
        "hostname",
        "os",
        "cpu_cores",
        "cpu_percent",
        "ram_total_gb",
        "ram_used_gb",
        "ram_percent",
        "disk_total_gb",
        "disk_used_gb",
        "disk_percent",
    ]
    for field in required_fields:
        assert field in data, f"Missing field: {field}"
