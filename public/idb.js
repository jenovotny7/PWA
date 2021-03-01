let database;
const req = indexedDB.open("budget", 1);

req.onupgradeneeded = function (event) {
  const database = event.target.result;
  database.createObjectStore("loading", { autoIncrement: true });
};

req.onsuccess = function (event) {
  database = event.target.result;

  // check if app online
  if (navigator.onLine) {
    uploadDatabase();
  }
};

req.onerror = function (event) {
  console.log("Error! " + event.target.errorCode);
};

function storeTranasction(offline) {
  const transaction = database.transaction(["loading"], "readwrite");
  const safe = transaction.objectStore("loading");

  safe.add(offline);
}

function uploadDatabase() {
  const transaction = database.transaction(["loading"], "readwrite");
  const safe = transaction.objectStore("loading");
  const combineAll = safe.getAll();

  combineAll.onsuccess = function () {
    if (combineAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(combineAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(() => {
          // delete records if successful
          const transaction = database.transaction(["loading"], "readwrite");
          const safe = transaction.objectStore("loading");
          safe.clear();
        });
    }
  };
}
function deleteObjectpending() {
  const transaction = database.transaction(["deleting"], "readwrite");
  const safe = transaction.objectStore("deleting");
  safe.clear();
}


window.addEventListener("loaded", uploadDatabase);