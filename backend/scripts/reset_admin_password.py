import argparse
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[2]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from backend.mongo import upsert_admin_password


def main():
    parser = argparse.ArgumentParser(description="Create or reset admin password in MongoDB")
    parser.add_argument("--username", required=True, help="Admin username")
    parser.add_argument("--password", required=True, help="Admin password")
    args = parser.parse_args()

    upsert_admin_password(args.username.strip(), args.password)
    print(f"Admin password set for username: {args.username}")


if __name__ == "__main__":
    main()
