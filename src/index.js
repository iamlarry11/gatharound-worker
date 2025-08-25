const AASA_JSON =
  '{"applinks":{"details":[{"appID":"K4CWFUNVVK.com.appgatharound.app","paths":["/recipes/*","/invites/*","/emailConfirm*","/test*"]}]},"webcredentials":{"apps":["K4CWFUNVVK.com.appgatharound.app"]}}';

const APP_STORE_URL = "https://apps.apple.com/app/idXXXXXXXXX"; // TODO: put real App Store URL
const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.appgatharound.app"; // TODO: verify package

function isDeepLinkPath(pathname) {
  // стоп-кран для повторных заходов вида /gatharound://...
  return pathname.includes("gatharound://");
}

function toDeepLink(pathname, search = "") {
  // убираем все ведущие слеши, чтобы не получить gatharound:///...
  const clean = pathname.replace(/^\/+/, "");
  return `gatharound://${clean}${search || ""}`;
}

function interstitialHTML({ currentUrl, deepLink }) {
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`;
  return `
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <title>Откройте в приложении</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="refresh" content="5;url=${deepLink}">
    <style>
      :root { --bg:#f7f7f8; --fg:#111; --muted:#555; }
      * { box-sizing: border-box; }
      body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;
           margin:0;display:grid;min-height:100dvh;place-items:center;background:var(--bg);color:var(--fg)}
      .card{max-width:720px;width:92vw;padding:28px;background:#fff;border-radius:16px;box-shadow:0 6px 30px rgba(0,0,0,.08)}
      h1{margin:0 0 6px;font-size:24px}
      p{margin:0 0 14px;line-height:1.5;color:#333}
      .row{display:flex;gap:20px;flex-wrap:wrap;align-items:center}
      .qr{width:200px;height:200px;border-radius:12px;border:1px solid #eee}
      .btn{display:inline-block;background:#111;color:#fff;padding:10px 16px;border-radius:10px;text-decoration:none}
      .badges{display:flex;gap:10px;flex-wrap:wrap}
      .muted{color:var(--muted);font-size:12px;margin-top:6px}
      .stack{display:flex;flex-direction:column;gap:10px;min-width:260px}
      .link{color:#0b57d0;text-decoration:none}
      .code{font-family:ui-monospace, SFMono-Regular, Menlo, monospace; font-size:12px; color:#444}
    </style>
    <script>
      // попытка авто-редиректа в приложение через небольшой таймаут
      document.addEventListener('DOMContentLoaded', function() {
        const deepLink = ${JSON.stringify(deepLink)};
        // Небольшая задержка, чтобы пользователь успел увидеть страницу и QR
        setTimeout(function(){ window.location.href = deepLink; }, 700);
      });
    </script>
  </head>
  <body>
    <div class="card">
      <h1>Откройте рецепт в приложении</h1>
      <p class="code">${currentUrl.replace(/&/g,'&amp;')}</p>
      <div class="row" style="margin-top:12px">
        <img class="qr" src="${qr}" alt="QR code to this link" loading="eager" width="200" height="200" />
        <div class="stack">
          <a class="btn" href="${deepLink}">Открыть в приложении</a>
          <div class="badges">
            <a class="link" href="${APP_STORE_URL}" aria-label="App Store">Получить в App Store</a>
            <a class="link" href="${PLAY_STORE_URL}" aria-label="Google Play">Получить в Google Play</a>
          </div>
          <p class="muted">Если приложение не открылось автоматически, нажмите «Открыть в приложении» или установите его из магазина.</p>
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

    // 1) AASA
    if (pathname === "/.well-known/apple-app-site-association") {
      return new Response(AASA_JSON, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=86400"
        }
      });
    }

    // 2) Тестовый JSON
    if (pathname === "/test") {
      return new Response('{"test":"details"}', {
        headers: { "Content-Type": "application/json; charset=utf-8" }
      });
    }

    // 3) Защита от циклов: если в пути уже встретилась схема gatharound:// — НИКУДА не редиректим
    if (isDeepLinkPath(pathname)) {
      return new Response(null, { status: 204 });
    }

    // 4) emailConfirm → deep link (сразу 302/307, 301 лучше не кэшировать для схем)
    if (pathname.startsWith("/emailConfirm")) {
      const deepLink = `gatharound://emailConfirm${search || ""}`;
      return Response.redirect(deepLink, 302);
    }

    // 5) recipes → показываем interstitial + авто-редирект в приложение
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

    // 6) invites → deep link (оставляем как было)
    if (pathname.startsWith("/invites/")) {
      const deepLink = toDeepLink(pathname, search);
      return Response.redirect(deepLink, 302);
    }

    // 7) Кастомная 404
    return new Response(
      `
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <title>Страница не найдена</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;
           margin:0;display:grid;min-height:100dvh;place-items:center;background:#f7f7f8;color:#111}
      .card{max-width:560px;padding:32px 28px;background:#fff;border-radius:16px;box-shadow:0 6px 30px rgba(0,0,0,.08)}
      h1{margin:0 0 8px;font-size:28px}
      p{margin:0 0 16px;line-height:1.5;color:#333}
      a{display:inline-block;margin-top:8px;text-decoration:none}
      .btn{background:#111;color:#fff;padding:10px 16px;border-radius:10px}
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Упс! 404</h1>
      <p>Такой страницы не существует.</p>
      <a class="btn" href="https://gatharound.com">Вернуться на главную</a>
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
