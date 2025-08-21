const AASA_JSON = '{"applinks":{"details":[{"appID":"K4CWFUNVVK.com.appgatharound.app","paths":["/recipes/*","/invites/*","/emailConfirm*","/test*"]}]},"webcredentials":{"apps":["K4CWFUNVVK.com.appgatharound.app"]}}';

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
    
    // AASA файл
    if (pathname === "/test") {
      return new Response('{"test":"details"}', {
        headers: { "Content-Type": "application/json" }
      });
    }

    // редирект для emailConfirm
    if (pathname.startsWith("/emailConfirm")) {
      const deepLink = `gatharound://emailConfirm${search}`;
      return Response.redirect(deepLink, 301);
    }

    // кастомная 404
    return new Response(
      `
      <html>
        <head><title>Страница не найдена</title></head>
        <body style="font-family: sans-serif; text-align: center; margin-top: 50px;">
          <h1>Упс!</h1>
          <p>Такой страницы не существует.</p>
          <p><a href="https://gatharound.com">Вернуться на главную</a></p>
        </body>
      </html>
      `,
      {
        status: 404,
        headers: { "Content-Type": "text/html; charset=utf-8" }
      }
    );
  }
};
