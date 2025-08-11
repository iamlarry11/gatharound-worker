# apple-aasa (Cloudflare Worker)

A tiny Cloudflare Worker that serves the `apple-app-site-association` file for Universal Links and iCloud Keychain (webcredentials).

## What it serves
- **URL**: `/.well-known/apple-app-site-association`
- **Content-Type**: `application/json`
- **JSON**:
  ```json
  {"applinks":{"details":[{"appID":"K4CWFUNVVK.com.gatharound","paths":["/recipes/*/*","/invites/*","/emailConfirm"]}]}, "webcredentials":{"apps":["K4CWFUNVVK.com.gatharound"]}}
  ```

## Deploy

1. Install Wrangler and log in:
   ```bash
   npm install -g wrangler
   wrangler login
   ```

2. Deploy from the project folder:
   ```bash
   wrangler deploy
   ```

3. In Cloudflare Dashboard, attach a Route in **gatharound.com → Workers Routes**:
   - **Route**: `gatharound.com/.well-known/apple-app-site-association`
   - **Worker**: `apple-aasa`

4. Verify:
   ```bash
   curl -I https://gatharound.com/.well-known/apple-app-site-association
   # Expect: HTTP/2 200 and content-type: application/json
   ```

## Notes
- `appID` = `TeamID.BundleID`: **K4CWFUNVVK.com.gatharound**
- Update paths if your link structure changes.
- If you prefer keeping JSON in a separate file, embed it via bundling or KV and return with `Content-Type: application/json`.
