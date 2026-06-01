def create_customer(client):
    return client.post(
        "/customers",
        json={"full_name": "Jordan Lee", "email": "jordan@example.com", "phone": "+1 555 0100"},
    ).json()["data"]


def create_product(client, quantity=10):
    return client.post(
        "/products",
        json={"product_name": "Barcode Reader", "sku": "BAR-001", "price": "50.00", "quantity": quantity},
    ).json()["data"]


def test_order_creation_reduces_inventory_and_calculates_total(client):
    customer = create_customer(client)
    product = create_product(client, quantity=10)

    response = client.post(
        "/orders",
        json={"customer_id": customer["id"], "items": [{"product_id": product["id"], "quantity": 3}]},
    )

    assert response.status_code == 201
    order = response.json()["data"]
    assert order["total_amount"] == "150.00"

    product_response = client.get(f"/products/{product['id']}").json()["data"]
    assert product_response["quantity"] == 7


def test_order_creation_rejects_insufficient_stock(client):
    customer = create_customer(client)
    product = create_product(client, quantity=2)

    response = client.post(
        "/orders",
        json={"customer_id": customer["id"], "items": [{"product_id": product["id"], "quantity": 3}]},
    )

    assert response.status_code == 422
    assert "Insufficient stock" in response.json()["message"]

    product_response = client.get(f"/products/{product['id']}").json()["data"]
    assert product_response["quantity"] == 2
