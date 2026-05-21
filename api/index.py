import json
import os
import re
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qs, urlparse
from urllib.request import Request, urlopen

PROFILE = {
    "name": "Khaled Mohamed",
    "role": "AI Engineer",
    "email": "devkhaled.ai@gmail.com",
}

MAX_MESSAGE_LENGTH = 1200
MAX_CONTEXT_LENGTH = 16000

PROJECT_ROOT = Path(__file__).resolve().parents[1]


def load_local_env():
    for file_name in (".env.local", ".env"):
        env_path = PROJECT_ROOT / file_name

        if not env_path.exists():
            continue

        for line in env_path.read_text(encoding="utf-8").splitlines():
            line = line.strip()

            if not line or line.startswith("#") or "=" not in line:
                continue

            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")

            if key and key not in os.environ:
                os.environ[key] = value


load_local_env()


class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self._send_json({"ok": True})

    def do_GET(self):
        self._send_json(
            {
                "ok": True,
                "service": "Khaled Mohamed portfolio API",
                "actions": ["chat", "contact"],
            }
        )

    def do_POST(self):
        action = get_action(self.path)
        payload = self._read_json()

        if action == "chat":
            status, body = chat_agent(payload, self.headers.get("origin"), self.headers.get("host"))
            self._send_json(body, status)
            return

        if action == "contact":
            status, body = send_contact_email(payload)
            self._send_json(body, status)
            return

        self._send_json({"error": "Unknown API action. Use ?action=chat or ?action=contact."}, 404)

    def _read_json(self):
        try:
            content_length = int(self.headers.get("content-length", "0"))
        except ValueError:
            content_length = 0

        if content_length <= 0:
            return {}

        raw_body = self.rfile.read(content_length).decode("utf-8")

        try:
            return json.loads(raw_body)
        except json.JSONDecodeError:
            return {}

    def _send_json(self, body, status=200):
        encoded = json.dumps(body).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", os.getenv("NEXT_PUBLIC_SITE_URL", "*"))
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.send_header("Content-Length", str(len(encoded)))
        self.end_headers()
        self.wfile.write(encoded)


def get_action(path):
    parsed = urlparse(path)
    query_action = parse_qs(parsed.query).get("action", [""])[0].strip().lower()

    if query_action:
        return query_action

    last_path_part = parsed.path.rstrip("/").split("/")[-1].strip().lower()

    if last_path_part in {"chat", "contact"}:
        return last_path_part

    return ""


def chat_agent(payload: dict[str, Any], origin: str | None, host: str | None):
    api_key = os.getenv("OPEN_ROUTER") or os.getenv("OPENROUTER_API_KEY")

    if not api_key:
        return 500, {"error": "OpenRouter is not configured yet."}

    messages = parse_messages(payload)

    if not messages:
        return 400, {"error": "Send at least one message."}

    latest_user_message = next(
        (message["content"] for message in reversed(messages) if message["role"] == "user"),
        "",
    )

    body = {
        "model": os.getenv("OPENROUTER_MODEL", "openai/gpt-4o-mini"),
        "temperature": 0.35,
        "max_tokens": 650,
        "messages": [
            {
                "role": "system",
                "content": "\n".join(
                    [
                        f"You are the portfolio assistant for {PROFILE['name']}, an {PROFILE['role']}.",
                        "Answer recruiters and HR teams using only the profile context below.",
                        "Be concise, specific, polished, and honest. Prefer concrete project and experience details over generic claims.",
                        "If a question asks for information that is not in the profile, say it is not available in the portfolio context.",
                        "If the user wants to contact, interview, hire, or email Khaled, tell them the page includes a secure email tool.",
                        "",
                        "PROFILE CONTEXT:",
                        get_profile_markdown_context()[:MAX_CONTEXT_LENGTH],
                    ]
                ),
            },
            *messages[-10:],
        ],
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": os.getenv("NEXT_PUBLIC_SITE_URL") or origin or f"http://{host or 'localhost:3000'}",
        "X-Title": f"{PROFILE['name']} Portfolio",
    }

    try:
        response = post_json("https://openrouter.ai/api/v1/chat/completions", body, headers)
    except ApiError as error:
        return error.status, {"error": error.message}

    reply = (
        response.get("choices", [{}])[0]
        .get("message", {})
        .get("content", "")
        .strip()
    )

    if not reply:
        return 502, {"error": "OpenRouter returned an empty response."}

    return 200, {
        "reply": reply,
        "showContactTool": should_show_contact_tool(latest_user_message),
    }


def send_contact_email(payload: dict[str, Any]):
    api_key = os.getenv("SENDGRID_API_KEY")

    if not api_key:
        return 500, {"error": "SendGrid is not configured yet."}

    contact = parse_contact_payload(payload)
    validation_error = validate_contact(contact)

    if validation_error:
        return 400, {"error": validation_error}

    from_email = os.getenv("SENDGRID_FROM_EMAIL")

    if not from_email:
        return 500, {
            "error": "Email is not fully configured. Add a verified SendGrid sender to SENDGRID_FROM_EMAIL."
        }

    to_email = os.getenv("CONTACT_TO_EMAIL") or os.getenv("SENDGRID_TO_EMAIL") or PROFILE["email"]
    from_name = os.getenv("SENDGRID_FROM_NAME", f"{PROFILE['name']} Portfolio")
    subject = contact["subject"] or "New HR message from portfolio"

    plain_text = "\n".join(
        [
            f"New portfolio message for {PROFILE['name']}",
            "",
            f"Name: {contact['name']}",
            f"Email: {contact['email']}",
            f"Company: {contact['company'] or 'Not provided'}",
            f"Subject: {subject}",
            "",
            contact["message"],
        ]
    )

    body = {
        "personalizations": [
            {
                "to": [{"email": to_email, "name": PROFILE["name"]}],
                "subject": f"Portfolio inquiry: {subject}",
            }
        ],
        "from": {"email": from_email, "name": from_name},
        "reply_to": {"email": contact["email"], "name": contact["name"]},
        "content": [
            {"type": "text/plain", "value": plain_text},
            {
                "type": "text/html",
                "value": "".join(
                    [
                        f"<h2>New portfolio message for {escape_html(PROFILE['name'])}</h2>",
                        f"<p><strong>Name:</strong> {escape_html(contact['name'])}</p>",
                        f"<p><strong>Email:</strong> {escape_html(contact['email'])}</p>",
                        f"<p><strong>Company:</strong> {escape_html(contact['company'] or 'Not provided')}</p>",
                        f"<p><strong>Subject:</strong> {escape_html(subject)}</p>",
                        f"<p style=\"white-space:pre-line\">{escape_html(contact['message'])}</p>",
                    ]
                ),
            },
        ],
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    try:
        post_json("https://api.sendgrid.com/v3/mail/send", body, headers, empty_success_status=202)
    except ApiError as error:
        return error.status, {"error": build_sendgrid_error(error.status, error.message)}

    return 200, {"ok": True}


def parse_messages(payload):
    raw_messages = payload.get("messages", []) if isinstance(payload, dict) else []
    messages = []

    if not isinstance(raw_messages, list):
        return messages

    for message in raw_messages:
        if not isinstance(message, dict):
            continue

        role = message.get("role")
        content = message.get("content")

        if role not in {"user", "assistant"} or not isinstance(content, str):
            continue

        content = content.strip()[:MAX_MESSAGE_LENGTH]

        if content:
            messages.append({"role": role, "content": content})

    return messages


def parse_contact_payload(payload):
    payload = payload if isinstance(payload, dict) else {}

    return {
        "name": clean_field(payload.get("name"), 80),
        "email": clean_field(payload.get("email"), 120),
        "company": clean_field(payload.get("company"), 120),
        "subject": clean_field(payload.get("subject"), 140),
        "message": clean_field(payload.get("message"), 2000),
    }


def validate_contact(contact):
    if not contact["name"]:
        return "Please enter your name."

    if not re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", contact["email"]):
        return "Please enter a valid email."

    if len(contact["message"]) < 20:
        return "Please write a message of at least 20 characters."

    return ""


def get_profile_markdown_context():
    profile_path = PROJECT_ROOT / "my data" / "myInformation.md"

    try:
        return normalize_profile_text(profile_path.read_text(encoding="utf-8"))
    except OSError:
        return f"{PROFILE['name']} is an {PROFILE['role']}. Email: {PROFILE['email']}."


def normalize_profile_text(value):
    replacements = {
        "â€“": "-",
        "â€™": "'",
        "â€œ": '"',
        "â€": '"',
    }

    for old, new in replacements.items():
        value = value.replace(old, new)

    return value


def should_show_contact_tool(message):
    return bool(re.search(r"\b(contact|email|message|interview|hire|recruit|reach|send)\b", message, re.I))


def post_json(url, body, headers, empty_success_status=None):
    request = Request(
        url,
        data=json.dumps(body).encode("utf-8"),
        headers=headers,
        method="POST",
    )

    try:
        with urlopen(request, timeout=30) as response:
            status = response.status
            response_body = response.read().decode("utf-8")
    except HTTPError as error:
        status = error.code
        response_body = error.read().decode("utf-8")
        raise ApiError(status, extract_api_error(response_body))
    except URLError as error:
        raise ApiError(500, f"Request failed: {error.reason}")

    if empty_success_status and status == empty_success_status:
        return {}

    if status >= 400:
        raise ApiError(status, extract_api_error(response_body))

    if not response_body:
        return {}

    try:
        return json.loads(response_body)
    except json.JSONDecodeError:
        return {}


def extract_api_error(response_body):
    if not response_body:
        return "The API rejected the request."

    try:
        parsed = json.loads(response_body)
    except json.JSONDecodeError:
        return response_body[:240]

    if isinstance(parsed, dict):
        if isinstance(parsed.get("error"), dict):
            return parsed["error"].get("message", "The API rejected the request.")

        if isinstance(parsed.get("error"), str):
            return parsed["error"]

        errors = parsed.get("errors")

        if isinstance(errors, list):
            messages = [error.get("message") for error in errors if isinstance(error, dict)]
            return " ".join(message for message in messages if message) or "The API rejected the request."

    return "The API rejected the request."


def build_sendgrid_error(status, detail):
    if status == 401:
        return "SendGrid rejected the API key. Check SENDGRID_API_KEY and make sure it has Mail Send permission."

    if status == 403:
        return "SendGrid requires SENDGRID_FROM_EMAIL to be a verified sender. The visitor email can still be any valid email and is used as Reply-To."

    if status == 400:
        return f"SendGrid rejected the email request: {detail}" if detail else "SendGrid rejected the email request."

    return f"SendGrid rejected the message: {detail}" if detail else "SendGrid rejected the message."


def clean_field(value, max_length):
    return value.strip()[:max_length] if isinstance(value, str) else ""


def escape_html(value):
    return (
        value.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
        .replace("'", "&#039;")
    )


class ApiError(Exception):
    def __init__(self, status, message):
        super().__init__(message)
        self.status = status
        self.message = message


if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    server = HTTPServer(("localhost", port), handler)
    print(f"Python portfolio API running at http://localhost:{port}/api")
    server.serve_forever()
