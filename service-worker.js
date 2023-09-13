let urlToIntersept;
let fileToRespondWith;

self.addEventListener('fetch', (event) => {
  console.log(event.request.url);
  event.respondWith(customResponse(event.request));
});

async function customResponse(request) {
  const url = new URL(request.url);

  if (url.pathname.includes(urlToIntersept)) {
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