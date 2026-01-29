# 🔗 How to Connect Your Supabase Database to Your Website

## Step 1: Get Your Supabase Credentials

1. **Go to Supabase**:
   - Open your browser and go to [supabase.com](https://supabase.com)
   - Click "Sign In" and log into your account

2. **Open Your Project**:
   - You'll see your project(s) listed
   - Click on the project you want to connect

3. **Find Your API Keys**:
   - On the left sidebar, click the ⚙️ **Settings** icon (at the bottom)
   - Click **API** from the menu
   - You'll see two important things:
     - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
     - **anon/public key** (a long text string)

4. **Copy These**:
   - Copy the **Project URL** somewhere safe (like Notepad)
   - Copy the **anon public key** somewhere safe
   - ⚠️ Keep these private! Don't share them publicly

---

## Step 2: Create Your Environment File

1. **Open Your Project Folder**:
   - Go to: `C:\Users\DELL\Downloads\ecommerce-website-design`

2. **Create a New File**:
   - Right-click in the folder
   - Choose "New" → "Text Document"
   - Name it **exactly**: `.env.local` (including the dots!)
   - ⚠️ Important: Make sure it's not named `.env.local.txt`

3. **Open the File**:
   - Right-click the `.env.local` file
   - Choose "Open with Notepad"

4. **Add Your Credentials**:
   - Copy and paste this into the file:

```
NEXT_PUBLIC_SUPABASE_URL=paste_your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste_your_anon_key_here
```

5. **Replace the Values**:
   - Replace `paste_your_project_url_here` with your actual Project URL
   - Replace `paste_your_anon_key_here` with your actual anon key

   Example:

```
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFi...
```

6. **Save the File**:
   - Press `Ctrl + S` to save
   - Close Notepad

---

## Step 3: Set Up Your Database Table

You need a `products` table in Supabase to store your products.

1. **Go to Supabase Dashboard**:
   - In your Supabase project, click the 🗄️ **Table Editor** icon on the left

2. **Create a New Table**:
   - Click "Create a new table"
   - Name it: **products**

3. **Add These Columns**:

| Column Name | Type        | Settings                      |
| ----------- | ----------- | ----------------------------- |
| id          | int8        | Primary Key, Auto-increment ✓ |
| name        | text        | Required ✓                    |
| description | text        | Optional                      |
| price       | float8      | Required ✓                    |
| category    | text        | Required ✓                    |
| image       | text        | Optional                      |
| inStock     | bool        | Default: true ✓               |
| reviews     | int8        | Default: 0                    |
| rating      | float8      | Default: 0                    |
| created_at  | timestamptz | Default: now() ✓              |

4. **Click "Save"**

---

## Step 4: Test the Connection

1. **Restart Your Development Server**:
   - If your website is running, stop it (press `Ctrl + C` in the terminal)
   - Start it again with: `npm run dev`

2. **Test Adding a Product**:
   - Go to your website
   - Navigate to `/admin/add-product`
   - Try adding a test product
   - If it works, you're connected! 🎉

---

## Common Issues & Solutions

### ❌ "Cannot find .env.local file"

- Make sure the file is named `.env.local` (not `.env.local.txt`)
- Make sure it's in the root folder: `C:\Users\DELL\Downloads\ecommerce-website-design`

### ❌ "Supabase error: relation 'products' does not exist"

- You haven't created the `products` table in Supabase yet
- Follow Step 3 to create the table

### ❌ "Invalid credentials"

- Double-check your URL and Key are correct
- Make sure there are no extra spaces
- The URL should start with `https://`

### ❌ Changes not showing

- Restart your development server (`Ctrl + C`, then `npm run dev`)
- The `.env.local` file is only read when the server starts

---

## 🎯 Quick Checklist

- [ ] I have my Supabase Project URL
- [ ] I have my Supabase anon key
- [ ] I created the `.env.local` file in the correct location
- [ ] I added both credentials to the `.env.local` file
- [ ] I created the `products` table in Supabase with all columns
- [ ] I restarted my development server
- [ ] I can successfully add a product from `/admin/add-product`

---

## Need More Help?

If you're still having issues, take a screenshot of:

1. Your Supabase dashboard showing the Products table
2. Your `.env.local` file (blur out the keys!)
3. Any error messages you see

And I'll help you troubleshoot! 😊
