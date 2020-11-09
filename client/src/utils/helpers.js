import moment from "moment";

export function formatTimeSpan(timeSpan) {
    if (timeSpan >= 0) {
        let minutes = timeSpan % 60;
        return Math.floor(timeSpan / 60) + ":" + ((minutes < 10) ? "0" : "") + minutes;
    } else {
        return "N/A";
    }
}

export function getCurrentWeekInfo() {
    const weekNumber=moment().week();
    const weekStartDate=moment().startOf("week").format("Do MMMM YYYY")

    return {weekStartDate, weekNumber}
}

export function idbPromise(storeName, method, object) {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open('Projectivity', 1);
      let db, tx, store;
      request.onupgradeneeded = function(e) {
        const db = request.result;
        db.createObjectStore('dashboard'/*, { keyPath: '_id' }*/);
      };
  
      request.onerror = function(e) {
        console.log('There was an error');
      };
  
      request.onsuccess = function(e) {
        db = request.result;
        tx = db.transaction(storeName, 'readwrite');
        store = tx.objectStore(storeName);
  
        db.onerror = function(e) {
          console.log('error', e);
        };
  
        switch (method) {
          case 'put':
            store.put(object);
            resolve(object);
            break;
          case 'get':
            const all = store.getAll();
            all.onsuccess = function() {
              resolve(all.result);
            };
            break;
          case 'delete':
            store.delete(object._id);
            break;
          default:
            console.log('No valid method');
            break;
        }
  
        tx.oncomplete = function() {
          db.close();
        };
      };
    });
  }