# Uploading audio to Cloudflare R2

This app includes many devotional MP3/JPG files under `assets/audio/`. For Android size limits, those files should be hosted on Cloudflare R2 and fetched/cached on-device.

## 1) Create credentials (Cloudflare)

- Go to Cloudflare Dashboard → **R2** → **Manage R2 API Tokens**
- Create a token with **Object Read & Write** for your bucket (e.g. `dailybreadaudio`)
- Copy the **Access Key ID** and **Secret Access Key**

## 2) Install uploader dependency (one-time)

```bash
python3 -m pip install --user boto3
```

## 3) Upload from this repo

From repo root:

```bash
export R2_ACCESS_KEY_ID="YOUR_KEY"
export R2_SECRET_ACCESS_KEY="YOUR_SECRET"
export R2_ENDPOINT="https://db8309951e7542842bc484758b062751.r2.cloudflarestorage.com"
export R2_BUCKET="dailybreadaudio"
export R2_PREFIX="" # or "audio" if you want objects under /audio/

python3 scripts/upload-r2-audio.py
```

## 4) Set the app base URL

Set `EXPO_PUBLIC_AUDIO_BASE_URL` to the **public bucket URL** you enabled (or your custom domain).

- If you uploaded to bucket root: `EXPO_PUBLIC_AUDIO_BASE_URL=https://<your-public-bucket-host>`
- If you used `R2_PREFIX=audio`: `EXPO_PUBLIC_AUDIO_BASE_URL=https://<your-public-bucket-host>/audio`

