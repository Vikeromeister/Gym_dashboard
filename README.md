# Gym Dashboard

A Vite + React starter dashboard for Hevy workout webhook notifications.

Target GitHub Pages URL:

```txt
https://vikeromeister.github.io/Gym_dashboard/
```

## What this package includes

```txt
Gym_dashboard/
├─ .github/workflows/deploy.yml
├─ src/
│  ├─ App.jsx
│  ├─ main.jsx
│  └─ styles.css
├─ webhook-receiver/
│  └─ cloudflare-worker.js
├─ index.html
├─ package.json
├─ vite.config.js
├─ README.md
└─ .gitignore
```

## Important architecture note

GitHub Pages hosts the frontend only. It cannot receive Hevy webhook `POST` requests directly.

Use this repository for the dashboard UI, then deploy a separate serverless webhook receiver later, such as Cloudflare Workers, Netlify Functions, or Vercel Functions.

The included `webhook-receiver/cloudflare-worker.js` is a starter for that future backend.

## Hevy API key note

You said your Hevy API key is saved as a GitHub Actions repository secret named `HEVY_API_KEY`.

Do **not** inject that secret into this GitHub Pages frontend. Anything built into a static frontend can be viewed by visitors.

For production, save `HEVY_API_KEY` in the secret manager of your webhook backend/serverless provider, for example Cloudflare Worker secrets.

## Local development

```bash
npm install
npm run dev
```

## Build locally

```bash
npm run build
npm run preview
```

## GitHub Pages settings

In your GitHub repository:

1. Open **Settings**.
2. Open **Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Push this package to the `main` branch.
5. Open the **Actions** tab and wait for **Deploy Gym Dashboard to GitHub Pages** to finish.

## Why `base: "/Gym_dashboard/"` is configured

Because this site is intended for:

```txt
https://vikeromeister.github.io/Gym_dashboard/
```

Vite needs the repository path as the base path when deploying to a project page.

## Uploading to GitHub

From inside the extracted `Gym_dashboard` folder:

```bash
git init
git add .
git commit -m "Initial Gym Dashboard"
git branch -M main
git remote add origin https://github.com/vikeromeister/Gym_dashboard.git
git push -u origin main
```

If the repository already has files, clone it first and copy these files into it instead.

## Future webhook setup

1. Deploy `webhook-receiver/cloudflare-worker.js` to a backend/serverless provider.
2. Add your Hevy API key to that provider's secret store.
3. Add the deployed webhook URL in Hevy's API/webhook settings.
4. Store incoming `workoutId` values in a database or key-value store.
5. Add a read endpoint for this frontend to display real workouts.
