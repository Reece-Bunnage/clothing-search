# Clothing Search App

A React app that searches multiple clothing stores at once.

---

## SETUP INSTRUCTIONS (read top to bottom, do not skip steps)

---

### STEP 1 — Install Node.js (if you haven't already)

Node.js is a program that lets you run JavaScript on your computer.
React requires it to work.

1. Go to https://nodejs.org
2. Download the **LTS** version (the one that says "Recommended for most users")
3. Run the installer — click Next through all the defaults
4. When it's done, open a terminal (see Step 2) and type:
       node --version
   You should see something like: v20.11.0
   That means it worked.

---

### STEP 2 — Open a terminal in VS Code

In VS Code, go to the top menu:
   Terminal → New Terminal

A panel will open at the bottom of VS Code.
This is where you type commands.

---

### STEP 3 — Navigate to the project folder

In the terminal, type:
   cd path/to/clothing-search

Replace "path/to/clothing-search" with the actual path to the folder.

TIP: You can drag the folder onto the terminal and it will type the path for you.
Or in VS Code: File → Open Folder → select "clothing-search" → then open a terminal.

---

### STEP 4 — Install dependencies

In the terminal, type:
   npm install

This reads package.json and downloads all the required packages
into a folder called "node_modules". This may take 1–2 minutes.
You will see a lot of text scroll by — that's normal.

---

### STEP 5 — Run the app locally

In the terminal, type:
   npm start

This starts a local development server.
Your browser should automatically open to:
   http://localhost:3000

If it doesn't open automatically, open your browser and go to that address.

To stop the server: press Ctrl+C in the terminal.

---

### STEP 6 — Deploy to GitHub Pages

#### 6a. Create a GitHub account (if needed)
Go to https://github.com and sign up for a free account.

#### 6b. Create a new repository
1. Click the "+" button (top right) → "New repository"
2. Name it: clothing-search
3. Set it to Public
4. Do NOT check "Add a README" (we already have one)
5. Click "Create repository"

#### 6c. Add your GitHub username to package.json
Open package.json and find this line near the top:
   "homepage": ".",

Change it to:
   "homepage": "https://YOUR-GITHUB-USERNAME.github.io/clothing-search",

Replace YOUR-GITHUB-USERNAME with your actual username.

#### 6d. Connect your local folder to GitHub
In the terminal (run these one at a time):
   git init
   git add .
   git commit -m "first commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/clothing-search.git
   git push -u origin main

#### 6e. Deploy
   npm run deploy

This builds the app and pushes it to a special "gh-pages" branch.

#### 6f. Enable GitHub Pages
1. Go to your repository on github.com
2. Click Settings (gear icon, top right of the repo)
3. Click Pages (in the left sidebar)
4. Under "Branch" select: gh-pages
5. Click Save

Wait 1–2 minutes, then your app is live at:
   https://YOUR-USERNAME.github.io/clothing-search/

---

## FILE STRUCTURE EXPLAINED

```
clothing-search/
├── public/
│   └── index.html        ← The HTML shell. React mounts into <div id="root">
├── src/
│   ├── index.js          ← Entry point. Mounts <App /> into index.html
│   ├── index.css         ← Global styles (page, header, footer, fonts)
│   ├── App.jsx           ← Main component: all the logic and UI
│   ├── App.css           ← Component styles (card, form, buttons)
│   └── data.js           ← Static data: clothing types, sizes, stores
├── package.json          ← Project config and dependencies
└── README.md             ← This file
```

---

## HOW TO ADD A NEW STORE

1. Open `src/data.js`
2. Find a clothing item on the store's website and search for it
3. Copy the URL from your browser — it will look like:
      https://www.example.com/search?q=blue+dress
4. Add a new entry to the SITES array:

```js
{
  id: 'mystore',
  name: 'My Store',
  buildUrl: (term) =>
    `https://www.example.com/search?q=${encodeURIComponent(term)}`,
},
```

5. Save the file — the app updates automatically in your browser.

---

## COMMON ISSUES

**Tabs aren't opening when I click Search**
→ Your browser is blocking pop-ups. Click the notification in the address bar
  and choose "Always allow pop-ups from this site".

**npm install gives errors**
→ Make sure Node.js is installed: type `node --version` in the terminal.
  If you don't see a version number, reinstall Node from nodejs.org.

**"command not found: npm"**
→ Node.js isn't installed or didn't add itself to your PATH.
  Reinstall Node.js and restart VS Code.
