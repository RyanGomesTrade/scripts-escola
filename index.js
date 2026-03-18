export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Pega a URL de destino do parâmetro query (?url=https://google.com)
    let targetUrl = url.searchParams.get("url");

    if (!targetUrl) {
      return new Response("Erro: Envie uma URL via parâmetro. Exemplo: /?url=https://exemplo.com", {
        status: 400,
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    }

    try {
      // Faz a requisição ao site de destino
      const response = await fetch(targetUrl, {
        method: request.method,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
          "Accept": "*/*",
        },
        body: request.method !== "GET" && request.method !== "HEAD" ? await request.arrayBuffer() : null
      });

      // Cria uma nova resposta para podermos modificar os cabeçalhos (CORS)
      const newResponse = new Response(response.body, response);

      // LIBERA O CORS (Permite que seu site no GitHub Pages acesse os dados)
      newResponse.headers.set("Access-Control-Allow-Origin", "*");
      newResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      newResponse.headers.set("Access-Control-Allow-Headers", "*");
      
      // Remove cabeçalhos de segurança que podem quebrar o proxy
      newResponse.headers.delete("Content-Security-Policy");
      newResponse.headers.delete("X-Frame-Options");

      return newResponse;

    } catch (e) {
      return new Response("Erro ao acessar a URL: " + e.message, { status: 500 });
    }
  }
};