const AASA_JSON =
  '{"applinks":{"details":[{"appID":"K4CWFUNVVK.com.appgatharound.app","paths":["/recipes/*","/invites/*","/emailConfirm*","/test*"]}]},"webcredentials":{"apps":["K4CWFUNVVK.com.appgatharound.app"]}}';

function isDeepLinkPath(pathname) {
  // стоп-кран для повторных заходов вида /gatharound://...
  return pathname.includes("gatharound://");
}

function toDeepLink(pathname, search = "") {
  // убираем все ведущие слеши, чтобы не получить gatharound:///...
  const clean = pathname.replace(/^\/+/, "");
  return `gatharound://${clean}${search || ""}`;
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
      // Можно вернуть 204, чтобы чекер «успокоился»
      return new Response(null, { status: 204 });
    }

    // 4) emailConfirm → deep link
    if (pathname.startsWith("/emailConfirm")) {
      const deepLink = `gatharound://emailConfirm${search || ""}`;
      return Response.redirect(deepLink, 302);
    }

    // 5) recipes → deep link
    if (pathname.startsWith("/recipes/")) {
      const deepLink = toDeepLink(pathname, search);
      return Response.redirect(deepLink, 302);
    }

    // 6) invites → deep link
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
