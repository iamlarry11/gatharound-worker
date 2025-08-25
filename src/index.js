const AASA_JSON =
  '{"applinks":{"details":[{"appID":"K4CWFUNVVK.com.appgatharound.app","paths":["/recipes/*","/invites/*","/emailConfirm*","/test*"]}]},"webcredentials":{"apps":["K4CWFUNVVK.com.appgatharound.app"]}}';

const APP_STORE_URL = "https://apps.apple.com/app/idXXXXXXXXX"; // TODO: put real App Store URL
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.appgatharound.app"; // TODO: verify package

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
      return Response.redirect(deepLink, 302);
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
