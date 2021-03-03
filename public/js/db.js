// create variable to hold db connection (global variable)
let database;

const ask = indexedDB.open('PWA', 1);

// this event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc.)
ask.onupgradeneeded = function(event) {
    
    const database = event.target.result;
    
    database.createObjectStore('new_charge', { autoIncrement: true });
};

ask.onsuccess = function(event) {
    db = event.target.result; 
    if (navigator.onLine) {
      }
};

ask.onerror = function(event) {
    console.log(event.target.errorCode);
};

// This function will be executed if we attempt to submit a new transaction and there's no internet connection
function saveTransaction(record) {

    const transaction = database.transaction(['new_charge'], 'readwrite');
  
 
    const bankObjectStore = transaction.objectStore('new_charge');
  
  
    bankObjectStore.add(record);
}


function loadTransaction() {
    // open a transaction on your db
    const transaction = database.transaction(['new_charge'], 'readwrite');
  
   
    const bankObjectStore = transaction.objectStore('new_charge');
  
    
    const getMoney = bankObjectStore.getAll();
  
    getMoney.onsuccess = function() {
        
        if (getMoney.result.length > 0) {
        fetch('/api/transaction', {
            method: 'POST',
            body: JSON.stringify(getMoney.result),
            headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(serverResponse => {
            if (serverResponse.message) {
                throw new Error(serverResponse);
            }
           
            const transaction = database.transaction(['new_charge'], 'readwrite');
            
            const newObjectStore = transaction.objectStore('new_charge');
            
           newObjectStore.clear();

            alert('All charges submitted!');
            })
            .catch(err => {
            console.log(err);
            });
        }
    };
}

// listen for the app to come back online
window.addEventListener('online', loadTransaction);
