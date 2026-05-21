# AI Engineer Portfolio

A recruiter-facing portfolio built with Next.js and a Python serverless API. It is designed so another developer can replace the data, add their own projects, connect OpenRouter and SendGrid, then deploy the portfolio to Vercel.

## What This App Includes

- A professional portfolio homepage for HR and hiring teams.
- Sections for projects, experience, skills, education, GitHub, and LinkedIn.
- A floating 3D robot that opens the portfolio chatbot.
- A chatbot powered by OpenRouter.
- A contact form powered by SendGrid so recruiters can send a message by email.
- A Markdown knowledge file that the chatbot uses as portfolio context.

## Tech Stack

- Next.js, React, TypeScript, Tailwind CSS
- Three.js for the floating robot
- Python serverless API in `api/index.py`
- OpenRouter for chatbot answers
- SendGrid for recruiter email messages
- Vercel for deployment

## Prerequisites

- Node.js 20 or newer
- npm
- Python 3.10 or newer
- A Vercel account
- An OpenRouter API key
- A SendGrid API key with Mail Send permission
- A verified SendGrid sender email

## Project Structure

```text
api/index.py                Python API for chat and contact email
lib/profileData.ts          Main portfolio data shown in the UI
my data/myInformation.md    Markdown context used by the chatbot
my data/my image.jpeg       Profile image used in the header
pages/index.tsx             Main portfolio page
styles/globals.css          Global styles
.env.example                Environment variable template
```

## Customize It For Your Own Portfolio

1. Update the visible portfolio data in `lib/profileData.ts`.
   - Change the name, role, email, phone, GitHub, LinkedIn, summary, projects, experience, skills, and education.

2. Update the chatbot knowledge in `my data/myInformation.md`.
   - Add your CV summary, project details, work history, education, skills, links, and anything recruiters may ask about.
   - The chatbot is instructed to answer from this Markdown context.

3. Replace the profile image.
   - Replace `my data/my image.jpeg` with your own image using the same file name, or update the import in `pages/index.tsx`.

4. Update the backend profile values in `api/index.py`.
   - Edit the `PROFILE` object near the top of the file.
   - This is used by the chatbot prompt and as the fallback contact email.

## How The Data Deploys

The portfolio data is stored directly in the project:

- The UI reads structured data from `lib/profileData.ts`.
- The chatbot reads Markdown data from `my data/myInformation.md`.
- The profile image is loaded from `my data/my image.jpeg`.

When these files are inside the project folder, Vercel includes them in the deployment. There is no database required for the default setup.

## Environment Variables

Create a local environment file from the example:

```bash
copy .env.example .env.local
```

On macOS or Linux:

```bash
cp .env.example .env.local
```

Fill these values in `.env.local`:

```bash
OPEN_ROUTER=your_openrouter_key_here
OPENROUTER_MODEL=openai/gpt-4o-mini

SENDGRID_API_KEY=your_sendgrid_key_here
SENDGRID_FROM_EMAIL=verified-sender@example.com
SENDGRID_FROM_NAME=Your Portfolio Name
CONTACT_TO_EMAIL=your-inbox@example.com

NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_PYTHON_API_URL=http://localhost:8000/api
```

Important notes:

- `OPEN_ROUTER` is your OpenRouter API key.
- `OPENROUTER_MODEL` is the model used by the chatbot.
- `SENDGRID_API_KEY` must have Mail Send permission.
- `SENDGRID_FROM_EMAIL` must be a verified SendGrid sender identity.
- `CONTACT_TO_EMAIL` is where recruiter messages will be delivered.
- The visitor's email can be any valid email. It is used as `reply_to`, not as the SendGrid sender.
- Do not commit `.env`, `.env.local`, or any real API keys.

## Run Locally

Install dependencies:

```bash
npm install
```

Run the Python API in one terminal:

```bash
python api/index.py
```

Run the Next.js app in another terminal:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Local API URL:

```text
http://localhost:8000/api
```

## Deploy To Vercel

Install the Vercel CLI globally:

```bash
npm install -g vercel
```

Login to Vercel:

```bash
vercel login
```

Then:

1. Enter the email address you used to sign up for Vercel.
2. Open your email inbox.
3. Click the verification link from Vercel.
4. Return to the terminal. It should confirm that you are logged in.

Deploy from the project folder:

```bash
vercel .
```

Vercel automatically builds the Next.js frontend and serves the Python API in `api/index.py` at `/api`.

When Vercel asks for a project name, use a lowercase name with no spaces, for example:

```text
my-ai-portfolio
```

Valid Vercel project names can include lowercase letters, numbers, `.`, `_`, and `-`.

For a production deployment, run:

```bash
vercel --prod
```

## Add Environment Variables In Vercel

After creating the Vercel project, open:

```text
Vercel Dashboard -> Your Project -> Settings -> Environment Variables
```

Add these variables:

```bash
OPEN_ROUTER=your_openrouter_key_here
OPENROUTER_MODEL=openai/gpt-4o-mini
SENDGRID_API_KEY=your_sendgrid_key_here
SENDGRID_FROM_EMAIL=verified-sender@example.com
SENDGRID_FROM_NAME=Your Portfolio Name
CONTACT_TO_EMAIL=your-inbox@example.com
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
NEXT_PUBLIC_PYTHON_API_URL=/api
```

For Vercel, keep:

```bash
NEXT_PUBLIC_PYTHON_API_URL=/api
```

Do not use `http://localhost:8000/api` in Vercel. That value is only for local development.

After changing `NEXT_PUBLIC_*` variables in Vercel, redeploy the project because these values are included in the frontend build.

## SendGrid Setup

SendGrid requires a verified sender identity.

1. Open SendGrid.
2. Go to Sender Authentication.
3. Verify a single sender or domain.
4. Use that verified email as `SENDGRID_FROM_EMAIL`.
5. Use your real receiving email as `CONTACT_TO_EMAIL`.

If email fails with a sender identity error, the fix is in SendGrid, not in the form. The sender address must be verified before SendGrid will send mail.

## Common Problems

### Failed to fetch after deployment

Check these values in Vercel:

```bash
NEXT_PUBLIC_PYTHON_API_URL=/api
NEXT_PUBLIC_SITE_URL=https://your-vercel-domain.vercel.app
```

Then redeploy.

### Chatbot says OpenRouter is not configured

Add this variable in Vercel and redeploy:

```bash
OPEN_ROUTER=your_openrouter_key_here
```

### Email says SendGrid is not configured

Add this variable in Vercel:

```bash
SENDGRID_API_KEY=your_sendgrid_key_here
```

Also make sure the key has Mail Send permission.

### SendGrid rejects the sender

Use a verified SendGrid sender identity:

```bash
SENDGRID_FROM_EMAIL=verified-sender@example.com
```

The sender must be verified in SendGrid. The recruiter's email should be entered in the form and will be used as the reply-to address.

## Useful Commands

```bash
npm run dev
npm run lint
npm run build
python api/index.py
vercel .
vercel --prod
```

## Before Sharing Your Version

- Replace all Khaled-specific data in `lib/profileData.ts`.
- Replace the Markdown profile in `my data/myInformation.md`.
- Replace the image in `my data/my image.jpeg`.
- Update the `PROFILE` object in `api/index.py`.
- Add your own OpenRouter and SendGrid credentials.
- Verify your SendGrid sender.
- Deploy with Vercel.
