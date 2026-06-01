from secrets import token_urlsafe


def generate_request_id() -> str:
    return token_urlsafe(12)
