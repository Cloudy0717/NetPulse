from .conftest import *
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_get_settings():
    response = client.get("/api/settings")
    assert response.status_code == 200
    data = response.json()
    assert "refresh_rate" in data
    assert "theme" in data
    assert "ping_target" in data
    assert "notifications_enabled" in data


def test_update_settings():
    response = client.put(
        "/api/settings",
        json={"theme": "light"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["theme"] == "light"


def test_update_settings_partial():
    response = client.get("/api/settings")
    original = response.json()

    client.put("/api/settings", json={"refresh_rate": 5})

    response = client.get("/api/settings")
    data = response.json()
    assert data["refresh_rate"] == 5
    assert data["theme"] == original["theme"]
