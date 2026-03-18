self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

 if (url.searchParams.has("url")) {
    event.respondWith(handleProxy(event.request));
  }
});

async function handleProxy(request) {
  const url = new URL(request.url);
  const encoded = url.searchParams.get("url");

  let decoded;
  try {
    decoded = atob(encoded);
  } catch {
    decoded = encoded;
  }

  return fetch("quiet-river-77cb.ryangomesmelo123.workers.dev/?url=" + encodeURIComponent(decoded));
}