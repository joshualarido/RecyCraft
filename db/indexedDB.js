let dbInstance = null;

export const initDB = () => {
  return new Promise((resolve, reject) => {
    if (dbInstance) return resolve(dbInstance); // Already opened

    const request = indexedDB.open("RecycraftDB", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains("camera")) {
        db.createObjectStore("camera", { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains("collections")) {
        const store = db.createObjectStore("collections", { keyPath: "id", autoIncrement: true });
        store.createIndex("name", "name");
        store.createIndex("image", "image");
        store.createIndex("description", "description");
        store.createIndex("used", "used");
      }

      if (!db.objectStoreNames.contains("crafts")) {
        const store = db.createObjectStore("crafts", { keyPath: "id", autoIncrement: true });
        store.createIndex("title", "title");
        store.createIndex("materials", "materials");
        store.createIndex("steps", "steps");
      }
    };

    request.onsuccess = (event) => {
      dbInstance = event.target.result;
      resolve(dbInstance);
    };

    request.onerror = (e) => {
      reject(e);
    };
  });
};