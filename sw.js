self.addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);

  // pega URL codificada
  let encoded = url.searchParams.get("url");

  if (!encoded) {
    return fetch(request);
  }

  const target = atob(encoded);

  const response = await fetch(target, {
    headers: {
      "User-Agent": navigator.userAgent
    }
  });

  let contentType = response.headers.get("content-type") || "";

  // 👉 se for HTML, reescreve
  if (contentType.includes("text/html")) {
    let text = await response.text();

    // 🔥 REESCREVE LINKS
    text = text.replace(/(href|src)=["']\/(.*?)["']/g, (match, attr, path) => {
      return `${attr}="?url=${btoa(new URL(path, target).href)}"`;
    });

    // 🔥 remove proteções
    return new Response(text, {
      headers: {
        "Content-Type": "text/html"
      }
    });
  }

  return response;
}