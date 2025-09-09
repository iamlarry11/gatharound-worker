const AASA_JSON =
  '{"applinks":{"details":[{"appID":"K4CWFUNVVK.com.appgatharound.app","paths":["/recipes/*","/invites/*","/emailConfirm*","/test*"]}]},"webcredentials":{"apps":["K4CWFUNVVK.com.appgatharound.app"]}}';

const APP_STORE_URL = "https://apps.apple.com/app/idXXXXXXXXX"; // TODO: put real App Store URL
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.appgatharound.app"; // TODO: verify package

// Updated assets
const INVITES_BG_IMG = "https://github.com/iamlarry11/gatharound-worker/blob/main/bg_invite.png?raw=true";
const INVITES_QR_IMG = ""; // optional: fixed QR image; if empty, a dynamic QR will be generated from currentUrl
const APP_STORE_BADGE_IMG = "https://github.com/iamlarry11/gatharound-worker/blob/main/button_apple.png?raw=true";
const PLAY_STORE_BADGE_IMG = "https://github.com/iamlarry11/gatharound-worker/blob/main/button_play.png?raw=true";

function isDeepLinkPath(pathname) {
  return pathname.includes("gatharound://");
}

function toDeepLink(pathname, search = "") {
  const clean = pathname.replace(/^\/+/, "");
  return `gatharound://${clean}${search || ""}`;
}

function interstitialHTML({ currentUrl, deepLink }) {
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    currentUrl
  )}`;
  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Open in App</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="refresh" content="5;url=${deepLink}">
    <style>
      :root { --bg:#f7f7f8; --fg:#111; --muted:#555; }
      * { box-sizing: border-box; }
      body {
        font-family: system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;
        margin:0;display:grid;min-height:100dvh;place-items:center;
        background:var(--bg);color:var(--fg)
      }
      .card{max-width:720px;width:92vw;padding:28px;background:#fff;
        border-radius:16px;box-shadow:0 6px 30px rgba(0,0,0,.08)}
      h1{margin:0 0 10px;font-size:24px}
      p{margin:0 0 14px;line-height:1.5;color:#333}
      .row{display:flex;gap:20px;flex-wrap:wrap;align-items:center}
      .qr{width:200px;height:200px;border-radius:12px;border:1px solid #eee}
      .btn{display:inline-block;background:#111;color:#fff;padding:10px 16px;border-radius:10px;text-decoration:none}
      .badges{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:10px}
      .badges img{height:50px}
      .muted{color:var(--muted);font-size:12px;margin-top:8px}
      .stack{display:flex;flex-direction:column;gap:12px;min-width:260px}
      .code{font-family:ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size:12px; color:#444}
    </style>
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        const deepLink = ${JSON.stringify(deepLink)};
        setTimeout(function(){ window.location.href = deepLink; }, 700);
      });
    </script>
  </head>
  <body>
    <div class="card">
      <h1>Open in the app</h1>
      <p class="code">${currentUrl.replace(/&/g,'&amp;')}</p>
      <div class="row">
        <img class="qr" src="${qr}" alt="QR code to this link" loading="eager" width="200" height="200" />
        <div class="stack">
          <a class="btn" href="${deepLink}">Open in App</a>
          <div class="badges">
            <a href="${APP_STORE_URL}" target="_blank" rel="noopener">
              <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
                   alt="Download on the App Store">
            </a>
            <a href="${PLAY_STORE_URL}" target="_blank" rel="noopener">
              <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" 
                   alt="Get it on Google Play">
            </a>
          </div>
          <p class="muted">If the app didn’t open automatically, click “Open in App” or install it from the store.</p>
        </div>
      </div>
    </div>
  </body>
</html>
`.trim();
}

function invitesHTML({ currentUrl, deepLink }) {
  const dynamicQR = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
    currentUrl
  )}`;
  const qrSrc = INVITES_QR_IMG || dynamicQR;

  return `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Open in App</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="refresh" content="5;url=${deepLink}">
    <style>
      :root { --overlay: rgba(0,0,0,.45); --fg:#fff; --muted:rgba(255,255,255,.85); }
      * { box-sizing: border-box; }
      html, body { height: 100%; }
      body {
        margin:0; display:grid; place-items:center; min-height:100dvh;
        color: var(--fg);
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif;
        background: #000 url('${INVITES_BG_IMG}') center/cover no-repeat fixed;
        position: relative;
      }
      body::before {
        content:""; position:absolute; inset:0; background: var(--overlay);
      }
      .card {
        position: relative; z-index: 1;
        width:min(960px,92vw);
        border-radius:18px;
        padding:28px 28px 24px;
        background: rgba(20,20,22,.75);
        box-shadow: 0 25px 80px rgba(0,0,0,.45);
        backdrop-filter: blur(6px);
      }
      h1 {
        margin:0 0 6px; font-size: clamp(22px,3.2vw,36px); font-weight:700; text-align:center;
      }
      .subtitle {
        margin:0 0 18px; text-align:center; font-size: clamp(14px,1.8vw,18px); color: var(--muted);
      }
      .url {
        text-align:center; font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 13px; color:#e8e8e8; opacity:.95; margin: 0 0 18px;
        word-break: break-all;
      }
      .row {
        display:flex; gap:32px; align-items:center; justify-content:center; flex-wrap:wrap;
      }
      .qr {
        width:320px; height:320px; border-radius:16px; background:#fff; padding:10px;
        box-shadow: 0 12px 40px rgba(0,0,0,.35);
      }
      .stack { display:flex; flex-direction:column; gap:14px; min-width:260px; align-items:center; }
      .btn {
        display:inline-block; padding:12px 18px; border-radius:12px; background:#4b77ff; color:#fff; text-decoration:none;
        font-weight:600; box-shadow: 0 8px 24px rgba(75,119,255,.35);
      }
      .badges { display:flex; gap:12px; flex-wrap:wrap; justify-content:center; }
      .badges img { height:54px }
      .foot { margin-top:10px; font-size:12px; color:#eee; opacity:.85; text-align:center; }
    </style>
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        const deepLink = ${JSON.stringify(deepLink)};
        setTimeout(function(){ window.location.href = deepLink; }, 700);
      });
    </script>
  </head>
  <body>
    <main class="card">
      <h1>A cherished recipe has arrived, carrying the spirit of family.</h1>
      <p class="subtitle">It was shared with you in mind, meant to be preserved.</p>
      <p class="url">${currentUrl.replace(/&/g,'&amp;')}</p>
      <section class="row">
        <img class="qr" src="${qrSrc}" alt="QR code to this link" loading="eager" width="320" height="320" />
        <div class="stack">
          <a class="btn" href="${deepLink}">Open in App</a>
          <div class="badges">
            <a href="${PLAY_STORE_URL}" target="_blank" rel="noopener">
              <img src="${PLAY_STORE_BADGE_IMG}" alt="Get it on Google Play">
            </a>
            <a href="${APP_STORE_URL}" target="_blank" rel="noopener">
              <img src="${APP_STORE_BADGE_IMG}" alt="Download on the App Store">
            </a>
          </div>
          <p class="foot">If the app didn’t open automatically, click “Open in App” or install it from the store.</p>
        </div>
      </section>
    </main>
  </body>
</html>
  `.trim();
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const { pathname, search } = url;

    if (pathname === "/.well-known/apple-app-site-association") {
      return new Response(AASA_JSON, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=86400"
        }
      });
    }

    if (pathname === "/test") {
      return new Response('{"test":"details"}', {
        headers: { "Content-Type": "application/json; charset=utf-8" }
      });
    }

    if (isDeepLinkPath(pathname)) {
      return new Response(null, { status: 204 });
    }

    if (pathname.startsWith("/emailConfirm")) {
      const deepLink = `gatharound://emailConfirm${search || ""}`;
      return Response.redirect(deepLink, 302);
    }

    if (pathname.startsWith("/recipes/")) {
      const deepLink = toDeepLink(pathname, search);
      const html = interstitialHTML({ currentUrl: url.href, deepLink });
      return new Response(html, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store"
        }
      });
    }

    if (pathname.startsWith("/invites/")) {
      const deepLink = toDeepLink(pathname, search);
      const html = invitesHTML({ currentUrl: url.href, deepLink });
      return new Response(html, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store"
        }
      });
    }

    return new Response(
      `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Not Found</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;
           margin:0;display:grid;min-height:100dvh;place-items:center;background:#f7f7f8;color:#111}
      .card{max-width:560px;padding:32px 28px;background:#fff;border-radius:16px;
        box-shadow:0 6px 30px rgba(0,0,0,.08)}
      h1{margin:0 0 8px;font-size:28px}
      p{margin:0 0 16px;line-height:1.5;color:#333}
      a{display:inline-block;margin-top:8px;text-decoration:none}
      .btn{background:#111;color:#fff;padding:10px 16px;border-radius:10px}
    </style>
  </head>
  <body>
    <div class="card">
      <h1>404</h1>
      <p>Page not found.</p>
      <a class="btn" href="https://gatharound.com">Back to Home</a>
    </div>
  </body>
</html>
      `.trim(),
      {
        status: 404,
        headers: { "Content-Type": "text/html; charset=utf-8" }
      }
    );
  }
};