let urlToIntersept;
let fileToRespondWith;

self.addEventListener('fetch', event => {
  event.respondWith(customResponse(event.request));
});

async function customResponse(request) {
  if (request.url.includes(urlToIntersept)) {
    return fileToRespondWith;
  } else {
    return fetch(request);
  }
}

self.addEventListener('message', event => {
  urlToIntersept = event.data.data;
  fileToRespondWith = event.data.file;

  console.log(urlToIntersept);
  console.log(fileToRespondWith);

  event.source.postMessage(true);
});