def test_dashboard_summary_counts_entities_and_low_stock(client):
    customer = client.post(
        "/customers",
        json={"full_name": "Morgan Chen", "email": "morgan@example.com", "phone": "+1 555 0133"},
    ).json()["data"]
    product = client.post(
        "/products",
        json={"product_name": "Receipt Roll", "sku": "ROLL-1", "price": "5.00", "quantity": 8},
    ).json()["data"]
    client.post("/orders", json={"customer_id": customer["id"], "items": [{"product_id": product["id"], "quantity": 1}]})

    response = client.get("/dashboard/summary")

    assert response.status_code == 200
    assert response.json()["data"] == {
        "total_products": 1,
        "total_customers": 1,
        "total_orders": 1,
        "low_stock_products": 1,
    }
