def test_duplicate_sku_is_rejected(client):
    payload = {"product_name": "Scanner", "sku": "SCAN-1", "price": "125.00", "quantity": 12}
    assert client.post("/products", json=payload).status_code == 201

    response = client.post("/products", json=payload)

    assert response.status_code == 409
    assert response.json()["success"] is False
    assert response.json()["message"] == "SKU already exists"


def test_negative_quantity_is_rejected(client):
    response = client.post(
        "/products",
        json={"product_name": "Printer", "sku": "PRINT-1", "price": "199.00", "quantity": -1},
    )

    assert response.status_code == 422
    assert response.json()["success"] is False


def test_duplicate_email_is_rejected(client):
    payload = {"full_name": "Avery Stone", "email": "avery@example.com", "phone": "+1 555 0199"}
    assert client.post("/customers", json=payload).status_code == 201

    response = client.post("/customers", json=payload)

    assert response.status_code == 409
    assert response.json()["message"] == "Email already exists"
