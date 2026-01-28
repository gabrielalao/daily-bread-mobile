#!/usr/bin/env python3
"""
Upload devotional audio + album art to Cloudflare R2 (S3-compatible).

Usage:
  1) Create an R2 API token in Cloudflare with "Object Read & Write" for your bucket.
  2) Export env vars:
       export R2_ACCESS_KEY_ID="..."
       export R2_SECRET_ACCESS_KEY="..."
       export R2_ENDPOINT="https://<accountid>.r2.cloudflarestorage.com"
       export R2_BUCKET="dailybreadaudio"
       # Optional prefix inside bucket (default: none)
       export R2_PREFIX="audio"
  3) Run:
       python3 scripts/upload-r2-audio.py

Notes:
 - This uploads:
     assets/audio/*.mp3
     assets/audio/*.jpg
 - It sets Content-Type and Cache-Control headers.
"""

import os
import sys
from pathlib import Path


def require_env(name: str) -> str:
    v = os.environ.get(name, "").strip()
    if not v:
        print(f"Missing env var: {name}", file=sys.stderr)
        sys.exit(2)
    return v


def main() -> int:
    try:
        import boto3  # type: ignore
        from botocore.config import Config  # type: ignore
    except Exception:
        print(
            "Missing dependency: boto3\n\n"
            "Install it with:\n"
            "  python3 -m pip install --user boto3\n",
            file=sys.stderr,
        )
        return 2

    access_key_id = require_env("R2_ACCESS_KEY_ID")
    secret_access_key = require_env("R2_SECRET_ACCESS_KEY")
    endpoint = require_env("R2_ENDPOINT").rstrip("/")
    bucket = require_env("R2_BUCKET")
    prefix = os.environ.get("R2_PREFIX", "").strip().strip("/")

    root = Path(__file__).resolve().parents[1]
    audio_dir = root / "assets" / "audio"
    if not audio_dir.exists():
        print(f"Not found: {audio_dir}", file=sys.stderr)
        return 2

    files = sorted(list(audio_dir.glob("*.mp3")) + list(audio_dir.glob("*.jpg")))
    if not files:
        print(f"No .mp3/.jpg files found in {audio_dir}", file=sys.stderr)
        return 2

    # Cloudflare R2 expects region "auto" and SigV4
    s3 = boto3.client(
        "s3",
        endpoint_url=endpoint,
        aws_access_key_id=access_key_id,
        aws_secret_access_key=secret_access_key,
        region_name="auto",
        config=Config(signature_version="s3v4"),
    )

    def key_for(p: Path) -> str:
        k = p.name
        if prefix:
            return f"{prefix}/{k}"
        return k

    uploaded = 0
    for p in files:
        key = key_for(p)
        ext = p.suffix.lower()
        content_type = "application/octet-stream"
        if ext == ".mp3":
            content_type = "audio/mpeg"
        elif ext == ".jpg" or ext == ".jpeg":
            content_type = "image/jpeg"

        print(f"Uploading {p.name} -> s3://{bucket}/{key}")
        s3.upload_file(
            Filename=str(p),
            Bucket=bucket,
            Key=key,
            ExtraArgs={
                "ContentType": content_type,
                # Cache aggressively; you can invalidate by changing filename.
                "CacheControl": "public, max-age=31536000, immutable",
            },
        )
        uploaded += 1

    print(f"\nDone. Uploaded {uploaded} files.")
    if prefix:
        print(f"Objects are under: s3://{bucket}/{prefix}/")
    else:
        print(f"Objects are at bucket root: s3://{bucket}/")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

