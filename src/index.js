const AASA_JSON = '{"applinks":{"details":[{"appID":"K4CWFUNVVK.com.gatharound","paths":["/recipes/*/*","/invites/*","/emailConfirm"]}]},"webcredentials":{"apps":["K4CWFUNVVK.com.gatharound"]}}';

export default {
  async fetch(request) {
    const { pathname } = new URL(request.url);
    if (pathname === "/.well-known/apple-app-site-association") {
      return new Response(AASA_JSON, {
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response("Not found", { status: 404 });
  }
};
