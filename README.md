# Pixel Perfect Chat

hey borhter. please build this Chatbot. full 100% pixel perfect disign. please use react, tailwind, framermotion and others.

This project was built with [Lovable](https://lovable.dev).

## OpenRouter setup (shared team usage)

The chat uses `cohere/north-mini-code:free` (North Mini Code) through OpenRouter.
Model availability and free-tier limits can change; free does not mean unlimited or guaranteed fastest.

1. Create a key at https://openrouter.ai/settings/keys.
2. In Vercel → project → Settings → Environment Variables, add `OPENROUTER_API_KEY` with your key as its value. Select Production and Preview as needed.
3. Redeploy. Every team member uses the server's key through `/api/chat`; nobody needs a separate key.
4. For the Lovable preview, save the same key in Project Settings → Secrets.

Never put the key in React code, a `VITE_*` variable, or Git. The server reads it in `src/routes/api.chat.ts`.
The key stored in Lovable is not automatically copied to Vercel.

OpenRouter currently documents 20 free requests/minute and 50/day for accounts with less than $10 purchased credits; purchasing at least $10 raises the daily free limit to 1,000. The team shares the account's quota.
See https://openrouter.ai/docs/api/reference/limits for current limits.

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b54f72fd-bc5d-4572-894e-364f8985ab50).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
