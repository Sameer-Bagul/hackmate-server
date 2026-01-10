## Azure Deployment

### Recommended: Azure App Service (GitHub / Zip Deploy)

Since this is a Monorepo, you must deploy the **ENTIRE ROOT FOLDER**.

1.  **Push to GitHub** (Recommended):
    - Connect your Azure Web App to your GitHub Repo within the "Deployment Center".
    - Choose "App Service Build Service".

2.  **Startup Command (Crucial)**:
    Azure needs to know how to build and start your app.
    Go to **Configuration** -> **General Settings** -> **Startup Command**:
    ```bash
    npm install -g pnpm && pnpm install && pnpm build && node apps/api/dist/start.js
    ```

3.  **Environment Variables**:
    - Go to **Configuration** -> **Application Settings**.
    - Add `MONGO_URI`, `REDIS_URI`, `JWT_SECRET`, etc.

If you cannot use Docker, you can deploy the code directly.

**Which folder to deploy?**
You must deploy the **ENTIRE ROOT FOLDER**.
Because this is a monorepo, `apps/api` depends on `packages/shared` and `packages/db`. You cannot deploy just the `api` folder.

1.  **Prepare zip**:
    Zip the entire project (excluding `node_modules`, `.git`).
    ```bash
    zip -r hackmate.zip . -x "node_modules/*" -x ".git/*" -x "dist/*"
    ```

2.  **Deploy**:
    - Create Web App (Publish: Code, Runtime: Node 20).
    - Deploy via Zip Deploy (Kudu) or VS Code Azure Extension.

3.  **Startup Command**:
    Set the Startup Command in Azure Configuration:
    ```bash
    npm install -g pnpm && pnpm install && pnpm build && node apps/api/dist/start.js
    ```
    *(Note: This might be slow on standard tiers due to build time. Pre-building locally and using `node_modules` matching the target OS is harder without Docker)*.

### Option 3: Azure VM (Manual VPS)
1.  Provision Ubuntu VM.
2.  Install Node.js 20, MongoDB, Redis.
3.  Clone repo.
4.  Run:
    ```bash
    npm install -g pnpm
    pnpm install
    pnpm build
    pm2 start apps/api/dist/start.js --name hackmate-api
    ```

