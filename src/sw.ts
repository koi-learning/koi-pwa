// Copyright (c) individual contributors.
// All rights reserved.
//
// This is free software; you can redistribute it and/or modify it
// under the terms of the GNU Lesser General Public License as
// published by the Free Software Foundation; either version 3 of
// the License, or any later version.
//
// This software is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
// Lesser General Public License for more details. A copy of the
// GNU Lesser General Public License is distributed along with this
// software and can be found at http://www.gnu.org/licenses/lgpl.html

const cacheName = "pwa-conf-v1";
const staticAssets = ["./index.html", "./bundle.js", "./bundle.css"];

self.addEventListener("install", async () => {
  const cache = await caches.open(cacheName);
  await cache.addAll(staticAssets);
});

self.addEventListener("fetch", (event: FetchEvent) => {
  const req = event.request;
  event.respondWith(noCache(req));
});

async function noCache(req: Request) {
  return fetch(req);
}

/*
async function cacheFirst(req: Request) {
  const path = new URL(req.url).pathname;
  console.log(path);
  if (path.startsWith("/api/")) {
    return fetch(req);
  } else if (
    path.startsWith("/home") ||
    path.startsWith("/model") ||
    path.startsWith("/instance") ||
    path.startsWith("/access") ||
    path.startsWith("/role") ||
    path.startsWith("/user")
  ) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(req);
    return cachedResponse || cache.match("index.html");
  }
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(req);
  return cachedResponse || fetch(req);
}
*/
