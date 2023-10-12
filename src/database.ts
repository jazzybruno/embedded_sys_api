// src/database.ts
import sqlite3 from 'sqlite3';

// Import the User type defined in types.ts
import { UserType } from './types/user.type';

const db = new sqlite3.Database('mydb.sqlite3');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT, username TEXT, password TEXT)");

  const stmt = db.prepare("INSERT INTO users (email, username, password, phone) VALUES (?, ?, ?, ?)");
  stmt.run("user@example.com", "john_doe", "password123", "1234567890");
  stmt.finalize();

  db.each("SELECT id, email, username, phone FROM users", (err, row: UserType) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log(`ID: ${row.id}, Email: ${row.email}, Username: ${row.username}`);
    }
  });
});

db.close();
