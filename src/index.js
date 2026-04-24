const AASA_JSON =
  '{"applinks":{"details":[{"appID":"K4CWFUNVVK.com.appgatharound.app","paths":["/recipes/*","/invites/*","/emailConfirm*","/test*"]}]},"webcredentials":{"apps":["K4CWFUNVVK.com.appgatharound.app"]}}';

const APP_STORE_URL = "https://apps.apple.com/app/idXXXXXXXXX";
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.appgatharound.app";

const BG_IMG = "https://github.com/iamlarry11/gatharound-worker/blob/main/bg_invite.png?raw=true";
const BADGE_APPLE = "https://github.com/iamlarry11/gatharound-worker/blob/main/button_apple.png?raw=true";
const BADGE_PLAY  = "https://github.com/iamlarry11/gatharound-worker/blob/main/button_play.png?raw=true";

function toDeepLink(pathname, search = "") {
  return `gatharound://${pathname.replace(/^\/+/,"")}${search || ""}`;
}

function baseLandingHTML({ title, subtitle, currentUrl, deepLink }) {
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=640x640&data=${encodeURIComponent(currentUrl)}`;
  return `
<!doctype html><html lang="en"><head>
<meta charset="utf-8" />
<title>${title} — Gatharound</title>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta http-equiv="refresh" content="5;url=${deepLink}">
<style>
:root{ --fg:#fff; --shadow:rgba(0,0,0,.45); --btn:#5f88b9; --btn-shadow:rgba(95,136,185,.35); }
*{box-sizing:border-box}
html,body{height:100%}
body{
  margin:0; color:var(--fg);
  font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Ubuntu,Cantarell,"Noto Sans",sans-serif;
  background:#000 url('${BG_IMG}') center/cover no-repeat fixed;
}
body::before{
  content:""; position:fixed; inset:0;
  background:linear-gradient(180deg, rgba(0,0,0,.26) 0%, rgba(0,0,0,.40) 60%, rgba(0,0,0,.50) 100%);
}
.container{
  position:relative; z-index:1; min-height:100dvh; max-width:1200px; margin:0 auto;
  padding: calc(22px + env(safe-area-inset-top)) 18px calc(22px + env(safe-area-inset-bottom));
  display:flex; flex-direction:column; align-items:center; text-align:center; justify-content:center; gap:14px;
}
.h1{ margin:0; font-weight:800; line-height:1.2; letter-spacing:-.01em; text-shadow:0 2px 12px var(--shadow); font-size:34px; max-width:1100px; text-wrap:pretty; }
.sub{ margin:0; font-weight:700; line-height:1.25; text-shadow:0 2px 10px var(--shadow); font-size:25px; max-width:1100px; text-wrap:pretty; opacity:0.9; }
.qrWrap{ background:#fff; padding:12px; border-radius:18px; box-shadow:0 16px 50px rgba(0,0,0,.45); margin-top:10px; }
.qr{ width:300px; height:300px; display:block; border-radius:12px; }
.btn{
  display:block; text-decoration:none; color:#fff; font-weight:700;
  background:var(--btn); border-radius:12px; padding:14px 20px; margin-top:12px; width:300px;
  box-shadow:0 10px 28px var(--btn-shadow);
}
.badges{ display:flex; gap:10px; justify-content:center; align-items:center; margin-top:8px; flex-wrap:wrap; }
.badges img{ height:48px; display:block }
@media (max-width: 480px){
  .h1{ font-size:28px; } .sub{ font-size:21px; }
  .qr, .btn{ width:280px; } .qr{ height:280px; }
}
</style>
<script>
  document.addEventListener('DOMContentLoaded',()=>{ setTimeout(()=>{ location.href=${JSON.stringify(deepLink)} },700); });
</script>
</head>
<body>
  <main class="container">
    <h1 class="h1">${title}</h1>
    <p class="sub">${subtitle}</p>
    <div class="qrWrap"><img class="qr" src="${qr}" alt="QR code"></div>
    <a class="btn" href="${deepLink}">Open Gatharound</a>
    <div class="badges">
      <a href="${PLAY_STORE_URL}" target="_blank"><img src="${BADGE_PLAY}" alt="Play Store"></a>
      <a href="${APP_STORE_URL}" target="_blank"><img src="${BADGE_APPLE}" alt="App Store"></a>
    </div>
  </main>
</body></html>`.trim();
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const { pathname, search } = url;

    // 1. AASA & Test
    if (pathname === "/.well-known/apple-app-site-association") {
      return new Response(AASA_JSON, { headers: { "Content-Type": "application/json" } });
    }
    if (pathname === "/test") {
      return new Response('{"status":"ok"}', { headers: { "Content-Type": "application/json" } });
    }

    // 2. Email Confirmation Landing
    if (pathname.startsWith("/emailConfirm")) {
      const deepLink = toDeepLink(pathname, search);
      const html = baseLandingHTML({
        title: "Confirm your email address",
        subtitle: "You're almost there! Tap below to verify your account and start gathering.",
        currentUrl: url.href,
        deepLink: deepLink
      });
      return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
    }

    // 3. Invites Landing
    if (pathname.startsWith("/invites/")) {
      const deepLink = toDeepLink(pathname, search);
      const html = baseLandingHTML({
        title: "A seat is waiting for you.",
        subtitle: "You've been invited to a family table. Join to share recipes and memories.",
        currentUrl: url.href,
        deepLink: deepLink
      });
      return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
    }

    // 4. Recipes Landing
    if (pathname.startsWith("/recipes/")) {
      const deepLink = toDeepLink(pathname, search);
      const html = baseLandingHTML({
        title: "A cherished recipe has arrived.",
        subtitle: "Carrying the spirit of family, meant to be preserved.",
        currentUrl: url.href,
        deepLink: deepLink
      });
      return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
    }

    return new Response("Not Found", { status: 404 });
  }
};