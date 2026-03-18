self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  if (url.pathname.startsWith("/proxy")) {
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

  return fetch("https://SEU-WORKER.workers.dev/?url=" + encodeURIComponent(decoded));
}