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

/* ===================== RECIPES — вертикальная верстка ===================== */
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
  --shadow:rgba(0,0,0,.45);
  --btn:#6a8ec4;          /* ближе к референсу */
  --btn-shadow:rgba(106,142,196,.35);
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
/* мягкая виньетка без «бокса» */
body::before{
  content:""; position:fixed; inset:0;
  background:
    radial-gradient(1200px 600px at 50% 15%, rgba(0,0,0,.15), transparent 60%),
    linear-gradient(180deg, rgba(0,0,0,.30) 0%, rgba(0,0,0,.40) 60%, rgba(0,0,0,.52) 100%);
}

.container{
  position:relative; z-index:1;
  min-height:100dvh;
  max-width:980px;
  margin:0 auto;
  padding: calc(22px + env(safe-area-inset-top)) 18px calc(22px + env(safe-area-inset-bottom));
  display:flex; flex-direction:column; align-items:center; text-align:center;
  gap:12px;
}

/* Типографика — уменьшено */
.h1{
  margin:0;
  font-weight:800; letter-spacing:-.01em; line-height:1.22;
  text-shadow:0 2px 12px var(--shadow);
  font-size:clamp(22px, 3.6vw, 44px);  /* было до 56px */
}
.sub{
  margin:0 0 4px; color:var(--muted);
  font-size:clamp(13px, 1.4vw, 18px);  /* чуть меньше тайтла */
}
.url{
  margin:4px 0 6px;
  font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
  font-size:clamp(12px, 1.1vw, 15px);
  opacity:.95;
}

/* QR уменьшен */
.qrWrap{
  background:#fff; padding:12px; border-radius:18px;
  box-shadow:0 20px 60px rgba(0,0,0,.45);
}
.qr{
  width:clamp(220px, 24vw, 340px);   /* было до 420px */
  height:clamp(220px, 24vw, 340px);
  display:block; border-radius:12px;
}

.hint{
  margin:10px 0 0; color:var(--muted);
  font-size:clamp(12px, 1.0vw, 13.5px);
}

/* Кнопка — цвет и габариты под референс */
.btn{
  display:block; text-decoration:none; color:#fff; font-weight:700;
  background:var(--btn); border-radius:12px;
  padding:14px 20px; margin-top:8px;
  width:clamp(220px, 26vw, 340px);
  box-shadow:0 12px 36px var(--btn-shadow);
}

/* Бейджи немного компактнее */
.badges{ display:flex; gap:10px; justify-content:center; align-items:center; margin-top:8px; flex-wrap:wrap; }
.badges img{ height:clamp(38px, 4.6vw, 52px); display:block }

/* Адаптация «по высоте», чтобы всё влезало */
@media (max-height: 780px){
  .h1{ font-size:clamp(20px, 3.2vw, 36px); }
  .sub{ font-size:clamp(12px, 1.2vw, 16px); }
  .qr{ width:clamp(200px, 22vw, 300px); height:clamp(200px, 22vw, 300px); }
  .btn{ width:clamp(210px, 24vw, 300px); padding:12px 18px; }
  .badges img{ height:clamp(34px, 4vw, 46px); }
}
@media (max-height: 680px){
  .qr{ width:clamp(180px, 20vw, 260px); height:clamp(180px, 20vw, 260px); }
  .container{ gap:10px; }
}
</style>
<script>
document.addEventListener('DOMContentLoaded',()=>{ setTimeout(()=>{ location.href=${JSON.stringify(deepLink)} },700); });
</script>
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

    // INVITES -> прямой редирект, как было
    if (pathname.startsWith("/invites/")) {
      const deepLink = toDeepLink(pathname, search);
      return Response.redirect(deepLink, 302);
    }

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