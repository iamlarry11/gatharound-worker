const AASA_JSON =
  '{"applinks":{"details":[{"appID":"K4CWFUNVVK.com.appgatharound.app","paths":["/recipes/*","/invites/*","/emailConfirm*","/test*"]}]},"webcredentials":{"apps":["K4CWFUNVVK.com.appgatharound.app"]}}';

const APP_STORE_URL = "https://apps.apple.com/app/idXXXXXXXXX"; // TODO
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.appgatharound.app"; // TODO

// Assets
const INVITES_BG_IMG = "https://github.com/iamlarry11/gatharound-worker/blob/main/bg_invite.png?raw=true";
const INVITES_QR_IMG = ""; // leave empty to auto-generate from current URL
const APP_STORE_BADGE_IMG = "https://github.com/iamlarry11/gatharound-worker/blob/main/button_apple.png?raw=true";
const PLAY_STORE_BADGE_IMG = "https://github.com/iamlarry11/gatharound-worker/blob/main/button_play.png?raw=true";

function isDeepLinkPath(pathname) {
  return pathname.includes("gatharound://");
}
function toDeepLink(pathname, search = "") {
  const clean = pathname.replace(/^\/+/, "");
  return `gatharound://${clean}${search || ""}`;
}

/** Adaptive landing (the nice mobile layout) — now for /recipes/* */
function recipesLandingHTML({ currentUrl, deepLink }) {
  const dynamicQR = `https://api.qrserver.com/v1/create-qr-code/?size=520x520&data=${encodeURIComponent(
    currentUrl
  )}`;
  const qrSrc = INVITES_QR_IMG || dynamicQR;

  return `
<!doctype html><html lang="en"><head>
<meta charset="utf-8"/><title>Open in App</title>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"/>
<meta http-equiv="refresh" content="5;url=${deepLink}">
<style>
:root{
  --fg:#fff; --muted:rgba(255,255,255,.9);
  --overlay: linear-gradient(180deg, rgba(15,16,20,.55) 0%, rgba(15,16,20,.55) 60%, rgba(15,16,20,.75) 100%);
  --btn:#5f8fe9;
}
*{box-sizing:border-box}
html,body{height:100%}
body{
  margin:0; color:var(--fg);
  font-family:ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif;
  background:#000 url('${INVITES_BG_IMG}') center/cover no-repeat fixed;
  position:relative;
}
body::before{content:"";position:fixed;inset:0;background:var(--overlay);}

/* Wrapper respecting iOS safe areas */
.main{
  position:relative; z-index:1;
  min-height:100dvh; display:flex; flex-direction:column; align-items:center; justify-content:flex-start;
  padding: calc(20px + env(safe-area-inset-top)) 18px calc(18px + env(safe-area-inset-bottom));
  gap:16px;
  max-width:460px; margin-inline:auto;
}

/* Text */
.h1{
  margin:10px 0 6px;
  font-weight:800; line-height:1.25; text-align:left;
  font-size: clamp(18px, 5.6vw, 28px);
  text-shadow: 0 2px 12px rgba(0,0,0,.45);
}
.sub{
  margin:0; opacity:.95; color:var(--muted); text-align:left;
  font-size: clamp(13px, 3.6vw, 15px);
  word-break: break-word;
}

/* QR */
.qr-wrap{
  margin-top:8px;
  background:#fff; padding:14px; border-radius:18px;
  box-shadow: 0 20px 60px rgba(0,0,0,.45);
  align-self:center;
}
.qr{
  width: clamp(240px, 70vw, 360px);
  height: clamp(240px, 70vw, 360px);
  display:block; border-radius:12px;
}

/* Hint */
.hint{
  margin:6px 6px 0; text-align:center; color:var(--muted);
  font-size:12px;
}

/* CTA */
.btn{
  display:block; width:100%;
  margin-top:8px; text-align:center; text-decoration:none; font-weight:700;
  background:var(--btn); color:#fff; padding:14px 18px; border-radius:14px;
  box-shadow: 0 12px 40px rgba(95,143,233,.35);
}

/* Store badges */
.badges{ display:flex; gap:10px; justify-content:center; align-items:center; margin-top:6px; flex-wrap:wrap; }
.badges img{ height:48px; display:block }

/* Desktop/tablet card */
@media (min-width: 700px){
  .main{ max-width:960px; gap:22px; padding:48px 28px; }
  .card{
    background:rgba(18,18,20,.62);
    backdrop-filter: blur(8px);
    border-radius:22px;
    box-shadow:0 30px 100px rgba(0,0,0,.5);
    padding:28px;
    display:grid; grid-template-columns: 1fr auto; align-items:center; column-gap:32px;
    width:min(960px, 92vw);
  }
  .left{max-width:560px}
  .qr-wrap{margin-top:0}
  .qr{width:360px;height:360px}
  .btn{width:260px}
  .badges{justify-content:flex-start}
}
</style>
<script>document.addEventListener('DOMContentLoaded',()=>{ setTimeout(()=>{ location.href=${JSON.stringify(deepLink)} },700); });</script>
</head><body>
  <section class="main card">
    <div class="left">
      <h1 class="h1">A cherished recipe has arrived for you, carrying tradition and memories.</h1>
      <p class="sub">It was shared with you in mind, a gift to save and treasure.</p>
      <p class="sub" style="opacity:.92;margin-top:8px;">${currentUrl.replace(/&/g,'&amp;')}</p>
    </div>
    <div class="right">
      <div class="qr-wrap">
        <img class="qr" src="${qrSrc}" alt="QR code"/>
      </div>
    </div>
    <div class="full" style="grid-column:1/-1;width:100%;">
      <p class="hint">If the app didn’t open automatically, click “Open in App” or install it from the store.</p>
      <a class="btn" href="${deepLink}">Open in App</a>
      <div class="badges">
        <a href="${PLAY_STORE_URL}" target="_blank" rel="noopener"><img src="${PLAY_STORE_BADGE_IMG}" alt="Get it on Google Play"></a>
        <a href="${APP_STORE_URL}" target="_blank" rel="noopener"><img src="${APP_STORE_BADGE_IMG}" alt="Download on the App Store"></a>
      </div>
    </div>
  </section>
</body></html>
  `.trim();
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const { pathname, search } = url;

    // AASA
    if (pathname === "/.well-known/apple-app-site-association") {
      return new Response(AASA_JSON, {
        headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=86400" }
      });
    }

    // Simple test
    if (pathname === "/test") {
      return new Response('{"test":"details"}', {
        headers: { "Content-Type": "application/json; charset=utf-8" }
      });
    }

    // Deep link ping
    if (isDeepLinkPath(pathname)) {
      return new Response(null, { status: 204 });
    }

    // Email confirm -> redirect
    if (pathname.startsWith("/emailConfirm")) {
      const deepLink = `gatharound://emailConfirm${search || ""}`;
      return Response.redirect(deepLink, 302);
    }

    // RECIPES -> show adaptive landing page (this block moved here)
    if (pathname.startsWith("/recipes/")) {
      const deepLink = toDeepLink(pathname, search);
      const html = recipesLandingHTML({ currentUrl: url.href, deepLink });
      return new Response(html, {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" }
      });
    }

    // INVITES -> back to original: direct deep link redirect
    if (pathname.startsWith("/invites/")) {
      const deepLink = toDeepLink(pathname, search);
      return Response.redirect(deepLink, 302);
    }

    // 404
    return new Response(
      `<!doctype html><html lang="en"><head>
         <meta charset="utf-8"/><title>Not Found</title>
         <meta name="viewport" content="width=device-width, initial-scale=1"/>
         <style>
           body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;margin:0;display:grid;place-items:center;min-height:100dvh;background:#f7f7f8;color:#111}
           .card{max-width:560px;padding:32px 28px;background:#fff;border-radius:16px;box-shadow:0 6px 30px rgba(0,0,0,.08)}
           a{display:inline-block;margin-top:8px;text-decoration:none;background:#111;color:#fff;padding:10px 16px;border-radius:10px}
         </style></head>
       <body><div class="card"><h1>404</h1><p>Page not found.</p>
       <a href="https://gatharound.com">Back to Home</a></div></body></html>`.trim(),
      { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }
};