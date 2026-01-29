# 🛒 Admin Guide: How to Add & Manage Products

Welcome to your store's admin portal! This guide will help you manage your products even if you're not technical.

## 1. How to Access the Admin Portal

1. Make sure you are **Logged In** to your account.
2. Go to the **Account** page.
3. Scroll down and click the **"Go to Admin Panel"** button.
4. Or, simply type `/admin` at the end of your website address in the browser.

## 2. Adding a New Product

Once you are in the Admin Portal, click on **"Add New Product"**.

### Basic Information

- **Product Name**: What the customer sees (e.g., "Pure Sidr Honey").
- **Category**: Choose where this product belongs. The website will automatically set some defaults for you based on the category!
- **Description**: Tell your customers why this product is great.
- **Base Price**: The starting price for one unit.
- **Image URL**: If you have a link to the product photo, paste it here.

### Ordering Rules (Units & Minimums)

- **Base Unit**: How do you sell it? (Grams, kg, Bottle, etc.)
- **Min. Quantity**: The smallest amount a customer can buy.
  - _Tip: The system automatically suggests common minimums for you (e.g., 1kg for Honey, 10g for Premium items)._

### Product Variants (Optional)

If you sell the same product in different sizes (e.g., 250g, 500g, 1kg), use variants:

1. Click **"Add Variant"**.
2. Give it a name like "500g Jar".
3. Set the specific weight and price for this size.

### Bulk Discounts (Optional)

Reward customers who buy more:

1. Click **"Add Tier"**.
2. Set the **Min. Quantity** (e.g., if they buy 5 units).
3. Set the **Discount %** (e.g., they get 10% off).

## 3. Managing Existing Products

Click on **"Manage Products"** in the Admin Portal to see all your items.

- You can search for products.
- Click **Edit** to change details or prices.
- Click **Delete** to remove a product from the shop.

## 4. Supabase Configuration (Important!)

To ensure the login system works correctly, you must adjust these settings in your **Supabase Dashboard**:

### 🚫 Disable Email Confirmation

Because this website uses phone numbers as identifiers (formatted as `phone@phone-user.com`), Supabase will try to send confirmation emails that don't exist.

1. Go to **Authentication** > **Providers** > **Email**.
2. **Turn OFF** "Confirm email".
3. Click **Save**.

### ⏳ Managing Rate Limits

Supabase's free tier has limits on how many sign-ups or logins can happen per hour (usually 3 per hour).
If you see an **"Email rate limit exceeded"** error, you must increase the limit:

1. Go to your **Supabase Dashboard**.
2. Go to **Authentication** > **Settings** (or **Auth Settings**).
3. Scroll down to **Rate Limits**.
4. Increase **"Email rate limit"** (e.g., from 3 to 30).
5. Click **Save**.

---

> [!TIP]
> **Always click "Save Product"** at the bottom of the page when you're done making changes!
