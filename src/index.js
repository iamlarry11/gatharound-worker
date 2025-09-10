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

/* ===================== RECIPES ===================== */
function recipesLandingHTML({ currentUrl, deepLink }) {
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=480x480&data=${encodeURIComponent(currentUrl)}`;
  return `
<!doctype html><html lang="en"><head>
<meta charset="utf-8" />
<title>Open in App</title>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta http-equiv="refresh" content="5;url=${deepLink}">
<style>
:root{
  --fg:#fff;
  --shadow:rgba(0,0,0,.45);
  --btn:#5f88b9;
  --btn-shadow:rgba(95,136,185,.35);
}

*{box-sizing:border-box}
html,body{height:100%}
body{
  margin:0; color:var(--fg);
  font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Ubuntu,Cantarell,"Noto Sans",sans-serif;
  background:#000 url('${BG_IMG}') center/cover no-repeat fixed;
}
body::before{
  content:""; position:fixed; inset:0;
  background:linear-gradient(180deg, rgba(0,0,0,.28) 0%, rgba(0,0,0,.42) 65%, rgba(0,0,0,.5) 100%);
}

.container{
  position:relative; z-index:1;
  min-height:100dvh;
  max-width:980px;
  margin:0 auto;
  padding: calc(22px + env(safe-area-inset-top)) 18px calc(22px + env(safe-area-inset-bottom));
  display:flex; flex-direction:column; align-items:center; text-align:center;
  justify-content:center;   /* центрируем вертикально */
  gap:14px;
}

/* Тайтл */
.h1{
  margin:0;
  font-weight:800; line-height:1.2; letter-spacing:-.01em;
  text-shadow:0 2px 12px var(--shadow);
  font-size:clamp(20px, 3.2vw, 34px);
}

/* Сабтайтл (на 25% меньше тайтла) */
.sub{
  margin:0;
  font-weight:700; line-height:1.25;
  text-shadow:0 2px 10px var(--shadow);
  font-size:clamp(15px, 2.4vw, 25px);
}

.url{
  margin:4px 0 8px;
  font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
  font-size:clamp(12px, 1.1vw, 15px);
  opacity:.95;
}

/* QR */
.qrWrap{
  background:#fff; padding:12px; border-radius:18px;
  box-shadow:0 16px 50px rgba(0,0,0,.45);
}
.qr{
  width:clamp(200px, 22vw, 300px);
  height:clamp(200px, 22vw, 300px);
  display:block; border-radius:12px;
}

/* Hint */
.hint{
  margin:10px 0 0;
  font-size:clamp(12px, 1.0vw, 13.5px);
  opacity:.9;
}

/* Кнопка */
.btn{
  display:block; text-decoration:none; color:#fff; font-weight:700;
  background:var(--btn); border-radius:12px;
  padding:14px 20px; margin-top:8px;
  width:clamp(220px, 26vw, 320px);
  box-shadow:0 10px 28px var(--btn-shadow);
}

/* Бейджи */
.badges{ display:flex; gap:10px; justify-content:center; align-items:center; margin-top:8px; flex-wrap:wrap; }
.badges img{ height:clamp(38px, 4.6vw, 50px); display:block }

/* Если экран низкий — «растягиваем» контент */
@media (max-height: 750px){
  .container{ justify-content:space-between; }
  .h1{ font-size:clamp(18px, 2.8vw, 28px); }
  .sub{ font-size:clamp(14px, 2.2vw, 21px); }
  .qr{ width:clamp(180px, 20vw, 260px); height:clamp(180px, 20vw, 260px); }
  .btn{ width:clamp(200px, 24vw, 280px); padding:12px 18px; }
  .badges img{ height:clamp(34px, 4vw, 44px); }
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

    if (pathname.startsWith("/recipes/")) {
      const deepLink = toDeepLink(pathname, search);
      const html = recipesLandingHTML({ currentUrl: url.href, deepLink });
      return new Response(html, {
        status: 200,
        headers: { "Content-Type":"text/html; charset=utf-8", "Cache-Control":"no-store" }
      });
    }

    if (pathname.startsWith("/invites/")) {
      const deepLink = toDeepLink(pathname, search);
      return Response.redirect(deepLink, 302);
    }

    return new Response("<h1>404</h1>", { status: 404 });
  }
};