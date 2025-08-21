const AASA_JSON = '{"applinks":{"details":[{"appID":"K4CWFUNVVK.com.appgatharound.app","paths":["/recipes/*","/invites/*","/emailConfirm*"]}]},"webcredentials":{"apps":["K4CWFUNVVK.com.appgatharound.app"]}}';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const { pathname, search } = url;

    // AASA файл
    if (pathname === "/.well-known/apple-app-site-association") {
      return new Response(AASA_JSON, {
        headers: { "Content-Type": "application/json" }
      });
    }

    if (pathname === "/test") {
      return new Response('{"test":"1"', {
        headers: { "Content-Type": "application/json" }
      });
    }
    // редирект для emailConfirm
    if (pathname.startsWith("/emailConfirm")) {
      const base = "gatharound://emailConfirm";
      const statusCode = 301; // или 301 если хочешь постоянный
      const destinationURL = `${base}${search}`;
      return Response.redirect(destinationURL, statusCode);
    }

    // кастомная 404
    return new Response(
      '
      <html>
        <head><title>Страница не найдена</title></head>
        <body style="font-family: sans-serif; text-align: center; margin-top: 50px;">
          <h1>404</h1>
          <p>Упс! Такой страницы нет.</p>
          <p><a href="https://gatharound.com">Вернуться на главную</a></p>
        </body>
      </html>
      '
      {
        status: 404,
        headers: { "Content-Type": "text/html; charset=utf-8" }
      }
    );
  }
};
