// ─── CONFIGURAÇÃO ─────────────────────────────────────────────
const RELAY = "https://fine-boa-80.ryangomesmelo123.deno.net/";
// ──────────────────────────────────────────────────────────────

function safeB64(str) {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch {
    return btoa(str);
  }
}

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "*",
        },
      });
    }

    let encoded = url.searchParams.get("url");
    if (!encoded) return new Response("Use ?url=<base64 da URL>", { status: 400 });

    let targetUrl;
    try {
      targetUrl = atob(encoded);
    } catch {
      return new Response("URL inválida", { status: 400 });
    }

    const targetOrigin   = new URL(targetUrl).origin;
    const targetHostname = new URL(targetUrl).hostname;
    const workerOrigin   = new URL(request.url).origin;

    try {
      const relayHeaders = {
        "Origin": targetOrigin,
        "Referer": targetOrigin + "/",
      };

      const skipHeaders = new Set(["host", "connection", "origin", "referer", "upgrade-insecure-requests"]);
      for (const [key, value] of request.headers.entries()) {
        if (!skipHeaders.has(key.toLowerCase())) {
          relayHeaders[key] = value;
        }
      }

      const cookie = request.headers.get("cookie");
      if (cookie) relayHeaders["x-relay-cookie"] = cookie;

      const response = await fetch(`${RELAY}?url=${safeB64(targetUrl)}`, {
        method: request.method,
        headers: relayHeaders,
        body: ["GET", "HEAD"].includes(request.method) ? null : await request.arrayBuffer(),
        redirect: "follow",
      });

      const contentType = response.headers.get("content-type") || "";
      const resHeaders  = new Headers();
      resHeaders.set("Content-Type", contentType);
      resHeaders.set("Access-Control-Allow-Origin", "*");
      resHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      resHeaders.set("Access-Control-Allow-Headers", "*");
      resHeaders.set("X-Proxy", "RyanProxy");
      resHeaders.delete("content-security-policy");
      resHeaders.delete("content-security-policy-report-only");

      const setCookie = response.headers.get("x-relay-set-cookie");
      if (setCookie) resHeaders.set("Set-Cookie", setCookie);

      if (contentType.includes("application/json")) {
        const data = await response.json();
        return new Response(JSON.stringify(data), { status: response.status, headers: resHeaders });
      }

      if (contentType.includes("text/html")) {
        let body = await response.text();

        const spoofScript = `<script>
(function() {
  const _loc = {
    hostname: '${targetHostname}',
    host: '${targetHostname}',
    origin: '${targetOrigin}',
    href: '${targetUrl}',
    protocol: 'https:',
    pathname: '${new URL(targetUrl).pathname}',
  };
  try {
    Object.defineProperty(window, 'location', {
      get: () => new Proxy(window.location, {
        get(t, prop) { return _loc[prop] !== undefined ? _loc[prop] : t[prop]; },
        set(t, prop, val) {
          if (prop === 'href') {
            const abs = val.startsWith('http') ? val : '${targetOrigin}' + val;
            window.location.replace('${workerOrigin}/?url=' + window._safeB64(abs));
          }
          return true;
        }
      })
    });
  } catch(e) {}
  try { Object.defineProperty(document, 'domain', { get: () => '${targetHostname}' }); } catch(e) {}

  window._safeB64 = function(str) {
    try { return btoa(unescape(encodeURIComponent(str))); } catch { return btoa(str); }
  };
})();
<\/script>`;

        const interceptScript = `<script>
(function() {
  const WORKER = '${workerOrigin}/?url=';
  const b64 = window._safeB64 || (s => { try { return btoa(unescape(encodeURIComponent(s))); } catch { return btoa(s); } });

  const _fetch = window.fetch;
  window.fetch = async function(input, opts) {
    let u = typeof input === 'string' ? input : (input?.url || '');
    if (u && !u.startsWith('http')) {
      try { u = new URL(u, '${targetOrigin}').href; } catch {}
    }
    if (u.startsWith('http') && !u.startsWith('${workerOrigin}')) {
      return _fetch(WORKER + b64(u), opts);
    }
    return _fetch(typeof input === 'string' ? u : input, opts);
  };

  const _open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, u, ...rest) {
    if (typeof u === 'string') {
      if (!u.startsWith('http')) {
        try { u = new URL(u, '${targetOrigin}').href; } catch {}
      }
      if (u.startsWith('http') && !u.startsWith('${workerOrigin}')) {
        u = WORKER + b64(u);
      }
    }
    return _open.call(this, method, u, ...rest);
  };

  function tryAutoSolve() {
    const widget = document.querySelector('altcha-widget');
    if (!widget) return;
    widget.dispatchEvent(new Event('focus', { bubbles: true }));
    console.log('[proxy] Altcha: disparando auto-solve...');
    const observer = new MutationObserver(() => {
      const state = widget.getAttribute('data-state');
      if (state === 'verified') {
        observer.disconnect();
        console.log('[proxy] Altcha resolvido ✅');
      }
    });
    observer.observe(widget, { attributes: true, subtree: true, childList: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryAutoSolve);
  } else {
    setTimeout(tryAutoSolve, 300);
  }
})();
<\/script>`;

        body = body.replace("<head>", "<head>" + spoofScript);
        body = body.replace("</head>", interceptScript + "</head>");

        // 🔥 só captura scripts INLINE (sem src) — deixa <script src="..."> livre pra ser reescrito
        const scriptBlocks = [];
        body = body.replace(/<script(?![^>]*\bsrc\b)[^>]*>[\s\S]*?<\/script>/gi, match => {
          scriptBlocks.push(match);
          return `%%SCRIPT_BLOCK_${scriptBlocks.length - 1}%%`;
        });

        // reescreve src/href em todo o HTML restante
        body = body.replace(/(src|href)=["'](.*?)["']/gi, (match, attr, link) => {
          try {
            if (["data:", "javascript:", "#", "mailto:"].some(p => link.startsWith(p))) return match;
            const abs = link.startsWith("http") ? link : new URL(link, targetUrl).href;
            return `${attr}="${workerOrigin}/?url=${safeB64(abs)}"`;
          } catch {
            return match;
          }
        });

        // reescreve action de forms
        body = body.replace(/<form([^>]*?)action=["']([^"']+)["']/gi, (match, attrs, action) => {
          try {
            return `<form${attrs}action="${workerOrigin}/?url=${safeB64(new URL(action, targetUrl).href)}"`;
          } catch { return match; }
        });

        // restaura scripts inline
        scriptBlocks.forEach((block, i) => {
          body = body.replace(`%%SCRIPT_BLOCK_${i}%%`, block);
        });

        return new Response(body, { status: response.status, headers: resHeaders });
      }

      return new Response(response.body, { status: response.status, headers: resHeaders });

    } catch (err) {
      return new Response("Erro: " + err.message, { status: 500 });
    }
  }
};