const CHECKOUT_REAL_PATH = "/pages/checkout.html";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// The shared backend's Cashfree payment-return handler is hardcoded to
// redirect to "<redirectUrl>/checkout?orderId=...&status=..." — a fixed
// suffix meant for a different (SPA-shaped) storefront that shares this
// backend. Since <redirectUrl> is this site's real, existing
// pages/checkout.html *file*, that lands the browser on a path that was
// never going to exist here, and it
// arrives as a real top-level HTTP redirect the browser follows before
// this site's own JS ever gets a chance to run — so it can't be fixed
// from inside a page's own script. Intercepting the navigation here,
// before it ever reaches the network, is the only point left to recover
// the orderId/status query string and hand it to the real checkout page.
self.addEventListener("fetch", (event) => {

  const { request } = event;

  if (request.mode !== "navigate") return;

  const url = new URL(request.url);

  if (!url.pathname.startsWith(CHECKOUT_REAL_PATH + "/")) return;


  // Serve a tiny, dependency-free shim rather than the real checkout
  // page's own markup: that markup loads its CSS/JS via relative
  // ("../src/...") paths, which the browser would resolve against this
  // request's actual (fake, nested) URL and break. This shim has no
  // relative resources — it just forwards the query string it already
  // has onto a real navigation to the real page, which then resolves
  // everything correctly.
  event.respondWith(
    new Response(
      `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Redirecting…</title></head><body><script>
        window.location.replace(${JSON.stringify(CHECKOUT_REAL_PATH)} + location.search);
      </script></body></html>`,
      {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      }
    )
  );

});
