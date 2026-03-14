const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, 'test_sample.db');

const db = new Database(dbPath);

console.log('Creating tables...');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    category TEXT,
    stock INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    status TEXT DEFAULT 'pending',
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (product_id) REFERENCES products (id)
  );
`);

console.log('Inserting dummy data...');

const insertUser = db.prepare('INSERT INTO users (name, email, role) VALUES (?, ?, ?)');
insertUser.run('John Doe', 'john@example.com', 'admin');
insertUser.run('Jane Smith', 'jane@example.com', 'user');
insertUser.run('Bob Wilson', 'bob@example.com', 'user');

const insertProduct = db.prepare('INSERT INTO products (name, price, category, stock) VALUES (?, ?, ?, ?)');
insertProduct.run('Laptop Pro', 1299.99, 'Electronics', 15);
insertProduct.run('Wireless Mouse', 25.50, 'Accessories', 50);
insertProduct.run('Mechanical Keyboard', 89.00, 'Accessories', 20);
insertProduct.run('4K Monitor', 349.99, 'Electronics', 10);

const insertOrder = db.prepare('INSERT INTO orders (user_id, product_id, quantity, status) VALUES (?, ?, ?, ?)');
insertOrder.run(1, 1, 1, 'shipped');
insertOrder.run(2, 2, 2, 'pending');
insertOrder.run(3, 3, 1, 'delivered');

console.log('Database created successfully at:', dbPath);
db.close();
