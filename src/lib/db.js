import { Surreal } from 'surrealdb';
const db = new Surreal();
if (typeof window !== "undefined") window.db = db;
export default db;
