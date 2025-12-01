self.addEventListener("install", () => {
  // Service worker minimale: pronto per futuri usi offline.
});

self.addEventListener("fetch", () => {
  // Per ora non intercetta nulla; lascia passare tutte le richieste.
});
