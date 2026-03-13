const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'test.db');

// Delete existing db if any
if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

const db = new Database(dbPath);

console.log('Creating test database at:', dbPath);

// Create users table
db.exec(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Insert 100 users for pagination testing
const insertUser = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
for (let i = 1; i <= 100; i++) {
  insertUser.run(`User ${i}`, `user${i}@example.com`);
}

// Create products table
db.exec(`
  CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL,
    stock INTEGER
  )
`);

const insertProduct = db.prepare('INSERT INTO products (name, price, stock) VALUES (?, ?, ?)');
insertProduct.run('Laptop', 999.99, 50);
insertProduct.run('Mouse', 25.00, 200);
insertProduct.run('Keyboard', 75.50, 150);

db.close();
console.log('Test database created successfully!');
