const AASA_JSON =
  '{"applinks":{"details":[{"appID":"K4CWFUNVVK.com.appgatharound.app","paths":["/recipes/*","/invites/*","/emailConfirm*","/test*"]}]},"webcredentials":{"apps":["K4CWFUNVVK.com.appgatharound.app"]}}';

const APP_STORE_URL = "https://apps.apple.com/app/idXXXXXXXXX"; // TODO
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.appgatharound.app"; // TODO

// Assets
const BG_IMG = "https://github.com/iamlarry11/gatharound-worker/blob/main/bg_invite.png?raw=true";
const BADGE_APPLE = "https://github.com/iamlarry11/gatharound-worker/blob/main/button_apple.png?raw=true";
const BADGE_PLAY  = "https://github.com/iamlarry11/gatharound-worker/blob/main/button_play.png?raw=true";

function isDeepLinkPath(pathname){ return pathname.includes("gatharound://"); }
function toDeepLink(pathname, search=""){ return `gatharound://${pathname.replace(/^\/+/,"")}${search||""}`; }

/* ---------- RECIPES: адаптивная посадочная (мобайл как на скрине, десктоп аккуратно центрованная карточка) ---------- */
function recipesLandingHTML({ currentUrl, deepLink }) {
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=520x520&data=${encodeURIComponent(currentUrl)}`;
  return `
<!doctype html><html lang="en"><head>
<meta charset="utf-8" />
<title>Open in App</title>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta http-equiv="refresh" content="5;url=${deepLink}">
<style>
:root{
  --fg:#fff;
  --muted:rgba(255,255,255,.92);
  --overlay:rgba(12,14,18,.55);
  --overlay-strong:rgba(12,14,18,.70);
  --btn:#4b77ff;
  --btn-shadow:rgba(75,119,255,.35);
}

/* Base */
*{box-sizing:border-box}
html,body{height:100%}
body{
  margin:0; color:var(--fg);
  font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Ubuntu,Cantarell,"Noto Sans",sans-serif;
  background:#000 url('${BG_IMG}') center/cover no-repeat fixed;
}
body::before{content:"";position:fixed;inset:0;background:linear-gradient(180deg,var(--overlay) 0%,var(--overlay) 60%,var(--overlay-strong) 100%);}

/* Mobile-first stack */
.main{
  position:relative; z-index:1;
  min-height:100dvh;
  display:flex; flex-direction:column; align-items:center; gap:16px;
  padding: calc(18px + env(safe-area-inset-top)) 16px calc(18px + env(safe-area-inset-bottom));
  max-width:460px; margin-inline:auto;
}
.h1{
  margin:8px 0 6px; text-align:left; line-height:1.25; font-weight:800;
  font-size:clamp(18px,5.8vw,28px); letter-spacing:-.02em;
  text-shadow:0 2px 12px rgba(0,0,0,.45);
}
.sub{ margin:0; color:var(--muted); text-align:left; font-size:clamp(13px,3.6vw,15px); }
.url{ margin:6px 0 0; font-family:ui-monospace,SFMono-Regular,Menlo,monospace; font-size:12px; opacity:.95; word-break:break-all; }

.qrWrap{
  margin-top:8px; background:#fff; padding:14px; border-radius:18px;
  box-shadow:0 20px 60px rgba(0,0,0,.45);
}
.qr{
  width:clamp(240px,70vw,360px);
  height:clamp(240px,70vw,360px);
  display:block; border-radius:12px;
}

.hint{ margin:10px 6px 0; text-align:center; color:var(--muted); font-size:12px; }
.btn{
  display:block; width:100%; text-align:center; text-decoration:none; font-weight:700;
  background:var(--btn); color:#fff; padding:14px 18px; border-radius:14px; margin-top:8px;
  box-shadow:0 12px 40px var(--btn-shadow);
}
.badges{ display:flex; gap:10px; justify-content:center; align-items:center; margin-top:8px; flex-wrap:wrap; }
.badges img{ height:48px; display:block }

/* Desktop / large tablets */
@media (min-width: 900px){
  .main{
    max-width:1120px; width:min(92vw,1120px);
    padding:48px 32px;
  }
  .card{
    width:100%;
    background:rgba(18,18,20,.62);
    backdrop-filter:blur(8px);
    border-radius:26px;
    box-shadow:0 30px 100px rgba(0,0,0,.5);
    padding:36px 40px;
    display:grid;
    grid-template-columns: 460px 1fr;
    grid-template-rows: auto auto 1fr;
    column-gap:40px;
    align-items:center;
  }
  .h1{ grid-column:1 / -1; text-align:center; font-size:clamp(28px,3.3vw,44px); margin:0 0 6px; }
  .sub{ grid-column:1 / -1; text-align:center; font-size:16px; margin:0 0 10px; }
  .url{ grid-column:1 / -1; text-align:center; opacity:.9; }
  .qrWrap{ grid-column:1; justify-self:center; margin-top:16px; padding:16px; }
  .qr{ width:420px; height:420px; }
  .cta{ grid-column:2; justify-self:center; width:100%; max-width:520px; }
  .btn{ width:280px; margin-inline:auto; padding:16px 22px; border-radius:14px; font-size:16px; }
  .badges{ margin-top:14px; }
  .badges img{ height:56px; }
  .hint{ margin-top:14px; font-size:12.5px; }
}
</style>
<script>document.addEventListener('DOMContentLoaded',()=>{ setTimeout(()=>{ location.href=${JSON.stringify(deepLink)} },700); });</script>
</head>
<body>
  <section class="main card">
    <h1 class="h1">A cherished recipe has arrived, carrying the spirit of family.</h1>
    <p class="sub">It was shared with you in mind, meant to be preserved.</p>
    <p class="url">${currentUrl.replace(/&/g,'&amp;')}</p>

    <div class="qrWrap"><img class="qr" src="${qr}" alt="QR code"></div>

    <div class="cta">
      <a class="btn" href="${deepLink}">Open in App</a>
      <div class="badges">
        <a href="${PLAY_STORE_URL}" target="_blank" rel="noopener"><img src="${BADGE_PLAY}"  alt="Get it on Google Play"></a>
        <a href="${APP_STORE_URL}" target="_blank" rel="noopener"><img src="${BADGE_APPLE}" alt="Download on the App Store"></a>
      </div>
      <p class="hint">If the app didn’t open automatically, click “Open in App” or install it from the store.</p>
    </div>
  </section>
</body></html>
`.trim();
}

/* ---------- простой интерстишл (используется в других местах, если понадобится) ---------- */
function simpleInterstitialHTML({ currentUrl, deepLink }) {
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`;
  return `
<!doctype html><html lang="en"><head>
<meta charset="utf-8"/><title>Open in App</title>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta http-equiv="refresh" content="5;url=${deepLink}">
<style>
  :root{--bg:#f7f7f8;--fg:#111}
  body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;margin:0;display:grid;place-items:center;min-height:100dvh;background:var(--bg);color:var(--fg)}
  .card{max-width:720px;width:92vw;padding:28px;background:#fff;border-radius:16px;box-shadow:0 6px 30px rgba(0,0,0,.08)}
  .row{display:flex;gap:20px;flex-wrap:wrap;align-items:center}
  .qr{width:200px;height:200px;border-radius:12px;border:1px solid #eee}
  .btn{display:inline-block;background:#111;color:#fff;padding:10px 16px;border-radius:10px;text-decoration:none}
  .badges{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:10px}
  .badges img{height:50px}
  .code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;color:#444}
</style>
<script>document.addEventListener('DOMContentLoaded',()=>{setTimeout(()=>{location.href=${JSON.stringify(deepLink)}},700)});</script>
</head><body>
  <div class="card">
    <h1>Open in the app</h1>
    <p class="code">${currentUrl.replace(/&/g,'&amp;')}</p>
    <div class="row">
      <img class="qr" src="${qr}" alt="QR"/>
      <div>
        <a class="btn" href="${deepLink}">Open in App</a>
        <div class="badges">
          <a href="${APP_STORE_URL}" target="_blank" rel="noopener"><img src="${BADGE_APPLE}" alt="App Store"></a>
          <a href="${PLAY_STORE_URL}" target="_blank" rel="noopener"><img src="${BADGE_PLAY}" alt="Google Play"></a>
        </div>
      </div>
    </div>
  </div>
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

    if (pathname === "/test") {
      return new Response('{"test":"details"}', {
        headers: { "Content-Type": "application/json; charset=utf-8" }
      });
    }

    if (isDeepLinkPath(pathname)) return new Response(null, { status: 204 });

    if (pathname.startsWith("/emailConfirm")) {
      const deepLink = `gatharound://emailConfirm${search || ""}`;
      return Response.redirect(deepLink, 302);
    }

    // ✅ RECIPES -> адаптивная посадочная
    if (pathname.startsWith("/recipes/")) {
      const deepLink = toDeepLink(pathname, search);
      const html = recipesLandingHTML({ currentUrl: url.href, deepLink });
      return new Response(html, { status: 200, headers: { "Content-Type":"text/html; charset=utf-8", "Cache-Control":"no-store" }});
    }

    // ✅ INVITES -> как было изначально: прямой редирект в диплинк
    if (pathname.startsWith("/invites/")) {
      const deepLink = toDeepLink(pathname, search);
      return Response.redirect(deepLink, 302);
    }

    // 404
    return new Response(`<!doctype html><html><head><meta charset="utf-8"/><title>Not Found</title>
      <meta name="viewport" content="width=device-width, initial-scale=1"/></head>
      <body style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;margin:0;display:grid;place-items:center;min-height:100dvh;background:#f7f7f8;color:#111">
      <div style="max-width:560px;padding:32px 28px;background:#fff;border-radius:16px;box-shadow:0 6px 30px rgba(0,0,0,.08)">
      <h1 style="margin:0 0 8px">404</h1><p style="margin:0 0 16px;color:#333">Page not found.</p>
      <a href="https://gatharound.com" style="display:inline-block;margin-top:8px;text-decoration:none;background:#111;color:#fff;padding:10px 16px;border-radius:10px">Back to Home</a>
      </div></body></html>`.trim(),
      { status: 404, headers: { "Content-Type":"text/html; charset=utf-8" } }
    );
  }
};