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

/* ===================== RECIPES — вертикальная верстка как в макете ===================== */
function recipesLandingHTML({ currentUrl, deepLink }) {
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=560x560&data=${encodeURIComponent(currentUrl)}`;
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
  --shadow:rgba(0,0,0,.45);
  --btn:#6f93d5;             /* мягкий сине-голубой как на референсе */
  --btn-shadow:rgba(111,147,213,.35);
}

/* Base */
*{box-sizing:border-box}
html,body{height:100%}
body{
  margin:0; color:var(--fg);
  font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Ubuntu,Cantarell,"Noto Sans",sans-serif;
  background:#000 url('${BG_IMG}') center/cover no-repeat fixed;
  position:relative;
}
/* лёгкая виньетка, без затемнённого «бокса» */
body::before{
  content:""; position:fixed; inset:0;
  background:
    radial-gradient(1200px 600px at 50% 15%, rgba(0,0,0,.15), transparent 60%) ,
    linear-gradient(180deg, rgba(0,0,0,.35) 0%, rgba(0,0,0,.45) 65%, rgba(0,0,0,.55) 100%);
}

/* Вертикальная колонка */
.container{
  position:relative; z-index:1;
  min-height:100dvh;
  max-width:1040px;
  margin:0 auto;
  padding: calc(24px + env(safe-area-inset-top)) 20px calc(24px + env(safe-area-inset-bottom));
  display:flex; flex-direction:column; align-items:center; text-align:center;
  gap:16px;
}

/* Типографика как в примере */
.h1{
  margin:0;
  font-weight:800; letter-spacing:-.01em; line-height:1.2;
  text-shadow:0 2px 12px var(--shadow);
  font-size:clamp(24px, 4.2vw, 56px);
}
.sub{
  margin:0 0 6px; color:var(--muted);
  font-size:clamp(14px, 1.6vw, 22px);
}
.url{
  margin:6px 0 8px;
  font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
  font-size:clamp(12px, 1.2vw, 16px);
  opacity:.95;
}

/* QR строго по центру */
.qrWrap{
  background:#fff; padding:14px; border-radius:18px;
  box-shadow:0 20px 60px rgba(0,0,0,.45);
}
.qr{
  width:clamp(260px, 28vw, 420px);
  height:clamp(260px, 28vw, 420px);
  display:block; border-radius:12px;
}

/* Подпись */
.hint{
  margin:14px 0 0; color:var(--muted);
  font-size:clamp(12px, 1.1vw, 14px);
}

/* Кнопка */
.btn{
  display:block; text-decoration:none; color:#fff; font-weight:700;
  background:var(--btn); border-radius:14px;
  padding:16px 22px; margin-top:8px;
  width:clamp(240px, 28vw, 420px);
  box-shadow:0 12px 40px var(--btn-shadow);
}

/* Бейджи */
.badges{ display:flex; gap:12px; justify-content:center; align-items:center; margin-top:10px; flex-wrap:wrap; }
.badges img{ height:clamp(40px, 5vw, 58px); display:block }

/* Тонкая настройка на узких экранах */
@media (max-width: 480px){
  .container{ gap:14px; }
  .btn{ width:100%; }
}
</style>
<script>document.addEventListener('DOMContentLoaded',()=>{ setTimeout(()=>{ location.href=${JSON.stringify(deepLink)} },700); });</script>
</head>
<body>
  <main class="container">
    <h1 class="h1">A cherished recipe has arrived, carrying the spirit of family.</h1>
    <p class="sub">It was shared with you in mind, meant to be preserved.</p>
    <p class="url">${currentUrl.replace(/&/g,'&amp;')}</p>

    <div class="qrWrap"><img class="qr" src="${qr}" alt="QR code"></div>

    <p class="hint">If the app didn’t open automatically, click “Open in App” or install it from the store.</p>
    <a class="btn" href="${deepLink}">Open in App</a>

    <div class="badges">
      <a href="${PLAY_STORE_URL}" target="_blank" rel="noopener"><img src="${BADGE_PLAY}"  alt="Get it on Google Play"></a>
      <a href="${APP_STORE_URL}" target="_blank" rel="noopener"><img src="${BADGE_APPLE}" alt="Download on the App Store"></a>
    </div>
  </main>
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

    // RECIPES -> вертикальная страница
    if (pathname.startsWith("/recipes/")) {
      const deepLink = toDeepLink(pathname, search);
      const html = recipesLandingHTML({ currentUrl: url.href, deepLink });
      return new Response(html, {
        status: 200,
        headers: { "Content-Type":"text/html; charset=utf-8", "Cache-Control":"no-store" }
      });
    }

    // INVITES -> как изначально (прямой редирект)
    if (pathname.startsWith("/invites/")) {
      const deepLink = toDeepLink(pathname, search);
      return Response.redirect(deepLink, 302);
    }

    // 404
    return new Response(
      `<!doctype html><html><head><meta charset="utf-8"/><title>Not Found</title>
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