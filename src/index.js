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

    // редирект для emailConfirm
    if (pathname.startsWith("/emailConfirm")) {
      const deepLink = `gatharound://emailConfirm${search}`;
      return Response.redirect(deepLink, 302);
    }

    return new Response("Not found", { status: 404 });
  }
};
