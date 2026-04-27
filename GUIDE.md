# 📈 Stock Tracker — Complete Beginner's Guide

This guide will take you from zero to a fully working app running on your computer,
then published online so anyone can use it, and saved on GitHub.

No experience needed. Every single step is explained.

---

## What you're building

A real-time stock price tracker with:
- Sign in / sign up (real accounts, saved securely)
- A live chart for any stock you click
- A watchlist you can customize (add/remove stocks)
- A profile page showing your total portfolio value
- Your data saved to a real database so it persists when you close the browser

---

## The 3 services you'll use (all free)

| Service | What it does | Cost |
|---|---|---|
| **Supabase** | Your database + user accounts | Free forever tier |
| **Finnhub** | Real stock prices | Free tier (60 calls/min) |
| **Vercel** | Publishes your app online | Free forever tier |

---

## PART 1 — Install the tools on your computer

### Step 1 — Install Node.js

Node.js lets your computer run JavaScript apps.

1. Go to **https://nodejs.org**
2. Click the big green button that says **"LTS"** (the recommended version)
3. Download and run the installer — click Next/Continue through all the steps
4. When it's done, open your **Terminal** (Mac) or **Command Prompt** (Windows):
   - **Mac:** Press `Cmd + Space`, type "Terminal", press Enter
   - **Windows:** Press `Win + R`, type "cmd", press Enter
5. Type this and press Enter to check it worked:
   ```
   node --version
   ```
   You should see something like `v20.11.0` — any number is fine ✅

### Step 2 — Install Git

Git is the tool that saves your code to GitHub.

1. Go to **https://git-scm.com/downloads**
2. Download and install for your operating system
3. In your terminal, check it worked:
   ```
   git --version
   ```
   You should see something like `git version 2.43.0` ✅

---

## PART 2 — Get your free API keys

### Step 3 — Get a Finnhub key (stock prices)

1. Go to **https://finnhub.io**
2. Click **"Get free API key"** in the top right
3. Sign up with your email and a password
4. After signing up, you'll see your dashboard with your API key
5. It looks like: `ct12ab34cd56efgh`
6. **Copy it and save it somewhere** (like a notes app) — you'll need it soon

### Step 4 — Set up Supabase (database + accounts)

1. Go to **https://supabase.com**
2. Click **"Start your project"** and sign up (you can use GitHub to sign in)
3. Click **"New project"**
4. Fill in:
   - **Project name:** `stock-tracker` (or anything you like)
   - **Database password:** Create a strong password and **save it** somewhere safe
   - **Region:** Pick the one closest to where you live
5. Click **"Create new project"** and wait about 1 minute for it to set up

#### Run the database setup

6. In the left sidebar, click **"SQL Editor"** (it looks like `>_`)
7. Click **"New query"**
8. Open the file `schema.sql` from the files I gave you
9. Copy **all** of its contents and paste it into the SQL editor
10. Click the green **"Run"** button
11. You should see **"Success. No rows returned"** at the bottom ✅

#### Disable email confirmation (so you can log in right away during testing)

12. In the left sidebar click **"Authentication"**
13. Click **"Providers"**
14. Click on **"Email"**
15. Turn **OFF** the toggle that says **"Confirm email"**
16. Click **"Save"**

#### Get your Supabase keys

17. In the left sidebar click **"Project Settings"** (the gear icon ⚙️ at the bottom)
18. Click **"API"**
19. You'll see two things you need to copy and save:
    - **Project URL** — looks like `https://abcdefgh.supabase.co`
    - **anon / public** key — a very long string starting with `eyJ...`
20. **Copy both and save them** in your notes app

---

## PART 3 — Set up the project files

### Step 5 — Put the project on your computer

1. Download the `stock-tracker` folder I've given you
2. Move it somewhere easy to find, like your Desktop or Documents folder
3. In your terminal, navigate into it:

**Mac:**
```bash
cd ~/Desktop/stock-tracker
```

**Windows:**
```cmd
cd C:\Users\YourName\Desktop\stock-tracker
```

> 💡 **Tip:** You can also type `cd ` (with a space) and then drag the folder from Finder/Explorer into the terminal window — it will fill in the path automatically!

### Step 6 — Create your secret keys file

1. In the `stock-tracker` folder, find the file called `.env.example`
2. Make a **copy** of it (right-click → Copy, then Paste in same folder)
3. Rename the copy to exactly: `.env` (remove the word "example")
4. Open `.env` in any text editor (Notepad on Windows, TextEdit on Mac, or VS Code)
5. Replace the placeholder values with your real keys:

```
VITE_SUPABASE_URL=https://YOUR_ACTUAL_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyYOUR_ACTUAL_LONG_KEY_HERE
VITE_FINNHUB_KEY=YOUR_ACTUAL_FINNHUB_KEY
```

6. Save the file

> ⚠️ **Important:** The `.env` file contains your secret keys. Never share it with anyone or put it on the internet. The `.gitignore` file I've included will automatically prevent it from being uploaded to GitHub.

### Step 7 — Install the app's dependencies

In your terminal (make sure you're still in the stock-tracker folder), run:

```bash
npm install
```

This downloads all the libraries the app needs. It might take 1-2 minutes.
You'll see a lot of text scrolling — that's normal. Wait for it to finish.

### Step 8 — Run the app!

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

Open your web browser and go to: **http://localhost:5173**

🎉 **Your app is running!** You should see the Sign In screen.

Try creating an account and logging in — your watchlist will load with AAPL, GOOGL, MSFT, and TSLA.

> To stop the app, press `Ctrl + C` in the terminal.

---

## PART 4 — Put your code on GitHub

GitHub is like Google Drive for code. It saves your work and lets you share it.

### Step 9 — Create a GitHub account

1. Go to **https://github.com**
2. Click **"Sign up"** and create a free account

### Step 10 — Create a new repository (a "repo" = a folder on GitHub)

1. Once logged in, click the **"+"** button in the top right
2. Click **"New repository"**
3. Fill in:
   - **Repository name:** `stock-tracker`
   - **Description:** `Real-time stock price tracker built with React and Supabase`
   - Select **"Public"** (so anyone can see it) or **"Private"** (just you)
   - Do **NOT** check "Add a README file" (we already have our files)
4. Click **"Create repository"**
5. GitHub will show you a page with some commands — leave this page open

### Step 11 — Upload your code to GitHub

In your terminal (in the stock-tracker folder), run these commands **one at a time**, pressing Enter after each:

```bash
git init
```
(This sets up Git tracking in your folder)

```bash
git add .
```
(This marks all files to be saved — the dot means "everything")

```bash
git commit -m "Initial commit: Stock Tracker app"
```
(This takes a snapshot of your code with a message)

Now copy the two commands from the GitHub page you left open. They look like this (but with YOUR username):

```bash
git remote add origin https://github.com/YOURUSERNAME/stock-tracker.git
git branch -M main
git push -u origin main
```

Run each of those three lines.

GitHub might ask for your username and password.
> 💡 For the password, GitHub uses a "Personal Access Token" not your regular password. If it asks, go to GitHub → Settings → Developer Settings → Personal Access Tokens → Generate new token → check "repo" → copy the token and use that as your password.

5. Refresh your GitHub repository page — you should see all your files there! ✅

---

## PART 5 — Publish your app online (free!)

### Step 12 — Deploy to Vercel

Vercel publishes your app so anyone can visit it with a web link.

1. Go to **https://vercel.com**
2. Click **"Sign Up"** — choose **"Continue with GitHub"** (easiest!)
3. Click **"Add New Project"**
4. You'll see your `stock-tracker` repo — click **"Import"**
5. On the next screen, find the section called **"Environment Variables"**
6. Add each of your three keys:
   - Name: `VITE_SUPABASE_URL` → Value: your Supabase URL
   - Name: `VITE_SUPABASE_ANON_KEY` → Value: your Supabase anon key
   - Name: `VITE_FINNHUB_KEY` → Value: your Finnhub key
7. Click **"Deploy"**
8. Wait about 1 minute...

🎉 **Your app is live on the internet!** Vercel will give you a URL like:
`https://stock-tracker-yourusername.vercel.app`

Share this link with anyone!

---

## Updating your app in the future

Whenever you make changes to your code and want to publish them:

```bash
git add .
git commit -m "Describe what you changed"
git push
```

Vercel automatically detects the push and redeploys your app. That's it!

---

## Troubleshooting

**"npm: command not found"**
→ Node.js isn't installed. Go back to Step 1.

**The app shows a white screen or crashes**
→ Check your `.env` file — make sure all three keys are there with no extra spaces.

**"Invalid API key" or quotes show $0.00**
→ Your Finnhub key is wrong. Go to finnhub.io, log in, copy the key again.

**Can't sign up or sign in**
→ Make sure you ran `schema.sql` in Supabase AND disabled email confirmation.

**Git asks for a password and doesn't accept it**
→ Use a Personal Access Token (see Step 11 note above).

**"Permission denied" errors on Mac**
→ Try putting `sudo ` before the command (it will ask for your Mac password).

---

## What each file does (for the curious)

```
stock-tracker/
├── src/
│   ├── StockTracker.jsx   ← The entire app UI and logic
│   ├── main.jsx           ← The entry point (just starts the app)
│   └── index.css          ← Base styles + Tailwind setup
├── public/
│   └── favicon.svg        ← The little icon in the browser tab
├── .env                   ← YOUR SECRET KEYS (never share/commit this)
├── .env.example           ← Template showing what keys are needed
├── .gitignore             ← Tells Git what NOT to upload (like .env)
├── index.html             ← The HTML shell the app runs inside
├── package.json           ← Lists all the libraries the app uses
├── schema.sql             ← The database table setup for Supabase
├── tailwind.config.js     ← Tailwind CSS configuration
├── postcss.config.js      ← CSS processing tool config
└── vite.config.js         ← Vite (the build tool) configuration
```
