from .conftest import *
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_network_endpoint():
    response = client.get("/api/network")
    assert response.status_code == 200
    data = response.json()
    assert "ipv4" in data
    assert "mac_address" in data
    assert "public_ip" in data
    assert "interface_name" in data
    assert "interface_status" in data


def test_network_has_required_fields():
    response = client.get("/api/network")
    data = response.json()
    required_fields = [
        "ipv4",
        "ipv6",
        "mac_address",
        "gateway",
        "dns",
        "public_ip",
        "interface_name",
        "interface_status",
    ]
    for field in required_fields:
        assert field in data, f"Missing field: {field}"
