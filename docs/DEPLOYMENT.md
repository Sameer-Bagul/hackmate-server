# Azure Deployment Guide (GitHub Method)

This guide walks you through deploying **HackMate** to Azure App Service directly from your GitHub repository.

## Prerequisites
1.  **GitHub Repository**: Your code must be pushed to a GitHub repository.
2.  **Azure Account**: You need an active Azure subscription.
3.  **Database**:
    - **MongoDB Atlas** (Cloud) connection string.
    - **Upstash Redis** (Cloud) connection string.

---

## Step 1: Create Azure App Service

1.  Log in to the **[Azure Portal](https://portal.azure.com)**.
2.  Search for **"App Services"** and click **Create** -> **Web App**.
3.  **Basics Tab**:
    - **Name**: `hackmate-api` (or unique name).
    - **Publish**: `Code` (NOT Docker).
    - **Runtime Stack**: `Node.js 20 LTS`.
    - **Operating System**: `Linux`.
    - **Region**: Choose one close to you.
    - **Pricing Plan**: `Basic B1` (Recommended) or `Free F1` (Might be slow/timeout during build).
4.  Click **Review + create** -> **Create**.

---

## Step 2: Connect GitHub Repository

1.  Go to your newly created **Web App**.
2.  In the left menu, click **Deployment Center**.
3.  **Source**: Select **GitHub**.
4.  **Authorize**: Sign in to your GitHub account if asked.
5.  **Organization / Repository**: Select `Sameer-Bagul/hackmate`.
6.  **Branch**: Select `main`.
7.  **Build Provider**:
    - Choose **"App Service Build Service"** (Simplest, no YAML needed).
    - *Note: If that option is missing, choose "GitHub Actions" and Azure will create a workflow file for you.*
8.  Click **Save**.

Azure will now pull your code and try to deploy. **It will fail initially** because we haven't set the startup command yet. That is normal.

---

## Step 3: Configure Startup Command (Crucial)

Since this is a Monorepo, we need a custom command to install dependencies, build the project, and start the API.

1.  In the Web App menu, go to **Configuration** (or **Settings** -> **Configuration**).
2.  Click on the **General Settings** tab.
3.  In the **Startup Command** field, paste exactly this:

    ```bash
    npm install -g pnpm && pnpm install && pnpm build && node apps/api/dist/start.js
    ```

4.  Click **Save**.

---

## Step 4: Set Environment Variables

Your app needs to connect to the database.

1.  Still in **Configuration**, go to the **Environment variables** (or **Application Settings**) tab.
2.  Click **+ Add** (or **New application setting**) for each of the following:

    | Name | Value (Example) |
    | :--- | :--- |
    | `NODE_ENV` | `production` |
    | `PORT` | `3001` |
    | `MONGO_URI` | `mongodb+srv://...` (Your Atlas URL) |
    | `REDIS_URI` | `redis://...` (Your Upstash URL) |
    | `JWT_SECRET` | `your-super-long-secret-key` |
    | `SMTP_HOST` | `smtp.gmail.com` (Optional) |
    | `SMTP_USER` | `your@email.com` (Optional) |
    | `SMTP_PASS` | `your-app-password` (Optional) |

3.  Click **Apply** / **Save**.
4.  **Restart** the Web App (Overview -> Restart).

---

## Step 5: Verification

1.  Wait 5-10 minutes for the deployment to finish.
2.  Go to **Deployment Center** -> **Logs** to see progress.
3.  Visit your app URL: `https://hackmate-api.azurewebsites.net/health`
    - You should see: `{"status":"ok", ...}`

---

## Troubleshooting

- **Deployment Failed / Build Error**:
    - Check **Deployment Center** logs.
    - Ensure your `package.json` scripts are correct (we verified they are).
    - If using Free Tier (F1), build might timeout. Use Basic (B1) or build locally and use Zip Deploy.

- **App Application Error :(`**:
    - Go to **Log Stream** in the left menu.
    - Look for errors like `MONGO_URI not defined` (Step 4 missed) or `Module not found` (Build failed).
