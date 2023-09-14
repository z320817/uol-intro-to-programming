let urlToIntersept;
let fileToRespondWith;

self.addEventListener('fetch', (event) => {
  event.respondWith(customResponse(event.request));
});

async function customResponse(request) {
  const url = new URL(request.url);

  if (url.pathname.includes(urlToIntersept) || url.pathname.includes("/assets/music/record.wav")) {
    return new Response(fileToRespondWith, {
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-Disposition': 'attachment; filename="record.wav"',
      },
    });
  } else {
    return fetch(request);
  }
}

self.addEventListener('message', event => {
  urlToIntersept = event.data.data;
  fileToRespondWith = event.data.file;
  event.source.postMessage(urlToIntersept);
});

self.addEventListener('activate', () => {
  return self.clients.claim();
});