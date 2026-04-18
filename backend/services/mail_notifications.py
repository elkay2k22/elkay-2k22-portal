import os
import smtplib
from email.message import EmailMessage
from pathlib import Path
from typing import Iterable

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")
load_dotenv(BASE_DIR / "backend" / ".env")

SMTP_HOST = os.getenv("SMTP_HOST", "").strip()
SMTP_PORT = int(os.getenv("SMTP_PORT", "587").strip() or "587")
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "").strip()
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "").strip()
SMTP_FROM_EMAIL = os.getenv("SMTP_FROM_EMAIL", "").strip() or SMTP_USERNAME
SMTP_TO_EMAILS = os.getenv("SMTP_TO_EMAILS", "").strip()
SMTP_USE_TLS = os.getenv("SMTP_USE_TLS", "true").strip().lower() == "true"
SMTP_USE_SSL = os.getenv("SMTP_USE_SSL", "false").strip().lower() == "true"


def _parse_recipients(raw: str) -> list[str]:
    return [email.strip() for email in raw.split(",") if email.strip()]


def _is_configured() -> bool:
    if not SMTP_HOST or not SMTP_FROM_EMAIL:
        return False

    recipients = _parse_recipients(SMTP_TO_EMAILS)
    if not recipients:
        return False

    if SMTP_USERNAME and not SMTP_PASSWORD:
        return False

    return True


def _format_amount(value: object) -> str:
    try:
        amount = float(value)
        return f"{amount:,.0f}"
    except Exception:
        return str(value or "")


def _build_help_request_email(data: dict, recipients: Iterable[str]) -> EmailMessage:
    subject = f"New Help Request: {data.get('name', 'Unknown Applicant')}"

    body = "\n".join(
        [
            "A new help request has been submitted.",
            "",
            f"Name: {data.get('name', '')}",
            f"Phone: {data.get('phone', '')}",
            f"Address: {data.get('address', '')}",
            f"Amount Needed: Rs { _format_amount(data.get('amountNeeded')) }",
            "",
            "Problem Description:",
            str(data.get('problemDescription', '')).strip(),
            "",
            f"Submitted At: {data.get('submittedAt', '')}",
        ]
    )

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = SMTP_FROM_EMAIL
    message["To"] = ", ".join(recipients)
    message.set_content(body)
    return message


def send_help_request_notification(data: dict) -> tuple[bool, str]:
    if not _is_configured():
        return False, "SMTP is not configured"

    recipients = _parse_recipients(SMTP_TO_EMAILS)
    message = _build_help_request_email(data, recipients)

    try:
        if SMTP_USE_SSL:
            with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, timeout=20) as client:
                if SMTP_USERNAME:
                    client.login(SMTP_USERNAME, SMTP_PASSWORD)
                client.send_message(message)
        else:
            with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=20) as client:
                if SMTP_USE_TLS:
                    client.starttls()
                if SMTP_USERNAME:
                    client.login(SMTP_USERNAME, SMTP_PASSWORD)
                client.send_message(message)
    except Exception as exc:
        return False, str(exc)

    return True, "sent"
