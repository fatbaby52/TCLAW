# How to Edit the Website Using Claude

These instructions will walk you through everything step by step.

---

## ONE-TIME SETUP (you only do this once)

### Step 1: Install Git

1. Go to https://git-scm.com/downloads
2. Click the download for your computer (Windows or Mac)
3. Run the installer — just click "Next" on every screen and then "Install"
4. When it's done, restart your computer

### Step 2: Download the Website Files

1. Open the **Command Prompt** (on Windows, click the Start menu and type "cmd", then click "Command Prompt")
2. Type this exactly and hit Enter:

```
cd Desktop
```

3. Then type this exactly and hit Enter:

```
git clone https://github.com/fatbaby52/TCLAW.git
```

4. You should now see a folder called **TCLAW** on your Desktop

### Step 3: Open the Project in Claude

1. Open the **Claude** app on your desktop
2. Look for the option to open a project/folder
3. Navigate to your **Desktop** and select the **TCLAW** folder
4. You're in! Claude can now see all the website files

---

## MAKING CHANGES (do this every time)

### Step 1: Get the Latest Version

Before making any changes, tell Claude:

> "Run git pull"

This makes sure you have the most up-to-date version of the site.

### Step 2: Tell Claude What You Want

Just type what you want in plain English. For example:

- "Change the office phone number to (555) 123-4567"
- "Update the office address to 123 Main Street, Suite 200, Houston, TX 77001"
- "Add a new practice area called Immigration Law"
- "Change the photo on the homepage"

Claude will make the edits for you. You don't need to know any code.

### Step 3: Publish Your Changes

When you're happy with the changes, tell Claude:

> "Commit and push these changes"

Claude will ask you for a short description of what you changed. Just describe it
in a few words like "updated phone number."

The website will automatically update within a couple of minutes after you push.

---

## TIPS

- **Always start with "Run git pull"** before making changes. This prevents conflicts.
- **You can ask Claude to show you what changed** by saying "Show me what I changed" before you push.
- **If something goes wrong**, just tell Claude: "Undo my changes." Nothing is permanent until you push.
- **To see the live site**, just go to your normal website URL. Changes take 1-2 minutes to show up after pushing.

---

## NEED HELP?

If you get stuck, copy and paste any error message you see and send it to John.
