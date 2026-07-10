const jwt = require("jsonwebtoken");
const fs = require("fs");
const http = require("http");
const url = require("url");
const path = require("path");

const SECRET_KEY = "cashglow-super-secret-key-12345";

const DB_PATH = path.join(__dirname, "..", "src", "Data", "db.json");

const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({ users: [], transactions: [] }, null, 2));
}

function readDB() {
  try {
    const data = fs.readFileSync(DB_PATH, "utf8");
    const json = JSON.parse(data);
    if (!json.users) json.users = [];
    if (!json.transactions) json.transactions = [];
    return json;
  } catch {
    return { users: [], transactions: [] };
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch {
    
  }
}

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    SECRET_KEY,
    { expiresIn: "24h" }
  );
}

function authenticate(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1];
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch {
    return null;
  }
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  const db = readDB();

  if (pathname === "/register" && method === "POST") {
    let body = "";
    req.on("data", (chunk) => { body += chunk; });
    req.on("end", () => {
      try {
        const { email, password } = JSON.parse(body);
        const existingUser = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        
        if (existingUser) {
          res.writeHead(400);
          res.end(JSON.stringify({ message: "Пользователь с таким email уже существует" }));
          return;
        }

        const username = email.split("@")[0];
        const newUser = {
          id: String(Date.now()),
          email,
          password,
          username
        };

        db.users.push(newUser);
        writeDB(db);

        const token = generateToken(newUser);
        res.writeHead(200);
        res.end(JSON.stringify({ username: newUser.username, token }));
      } catch {
        res.writeHead(400);
        res.end(JSON.stringify({ message: "Ошибка регистрации" }));
      }
    });
    return;
  }

  if (pathname === "/login" && method === "POST") {
    let body = "";
    req.on("data", (chunk) => { body += chunk; });
    req.on("end", () => {
      try {
        const { email, password } = JSON.parse(body);
        const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

        if (!user) {
          res.writeHead(401);
          res.end(JSON.stringify({ message: "Неверный логин или пароль" }));
          return;
        }

        const token = generateToken(user);
        res.writeHead(200);
        res.end(JSON.stringify({ username: user.username, token }));
      } catch {
        res.writeHead(401);
        res.end(JSON.stringify({ message: "Неверный логин или пароль" }));
      }
    });
    return;
  }

  if (pathname === "/transactions") {
    const user = authenticate(req);
    if (!user) {
      res.writeHead(401);
      res.end(JSON.stringify({ message: "Unauthorized (Невалидный или просроченный токен)" }));
      return;
    }

    if (method === "GET") {
      const userTransactions = db.transactions.filter(t => t.userId === user.id);
      res.writeHead(200);
      res.end(JSON.stringify(userTransactions));
      return;
    }

    if (method === "POST") {
      let body = "";
      req.on("data", chunk => body += chunk);
      req.on("end", () => {
        try {
          const transactionData = JSON.parse(body);
          const newTransaction = {
            ...transactionData,
            id: String(Date.now()),
            userId: user.id // Строгая привязка операции к конкретному владельцу JWT-токена
          };
          db.transactions.push(newTransaction);
          writeDB(db);
          res.writeHead(201);
          res.end(JSON.stringify(newTransaction));
        } catch {
          res.writeHead(400);
          res.end(JSON.stringify({ message: "Ошибка парсинга данных транзакции" }));
        }
      });
      return;
    }
  }

if (pathname.replace(/\/$/, "") === "/profile" && method === "GET") {
    const user = authenticate(req);
    if (!user) {
    res.writeHead(401);
    res.end(JSON.stringify({ message: "Unauthorized" }));
    return;
    }

    const currentUser = db.users.find(u => u.id === user.id);
    if (!currentUser) {
    res.writeHead(404);
    res.end(JSON.stringify({ message: "Пользователь не найден в базе данных" }));
    return;
    }

    res.writeHead(200);
    res.end(JSON.stringify({ email: currentUser.email, username: currentUser.username }));
    return;
}

  res.writeHead(404);
  res.end(JSON.stringify({ message: "Not Found" }));
});

server.listen(3001, () => {
  console.log("[Бэкенд]: Нативный HTTP-сервер авторизации и данных запущен на порту 3001");
});