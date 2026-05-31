# Support Chat

This page provides a basic support chat UI and connects to the backend proxy at `POST /api/support/chat`.

## Setup

1. Add your Hugging Face token in `backend/.env`:

```
HUGGINGFACE_API_KEY=your_token_here
HUGGINGFACE_MODEL=mistralai/Mistral-7B-Instruct-v0.2
```

2. Run backend and frontend as usual.

## Notes

- The frontend uses `frontend/src/features/support/supportService.js` to call the backend.
- The backend proxies to Hugging Face to keep the API key private.

