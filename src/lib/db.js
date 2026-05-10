import { Surreal } from 'surrealdb';

const db = new Surreal();

// Optional: For debugging in console
if (typeof window !== "undefined") {
  window.db = db;
}

export default db;
