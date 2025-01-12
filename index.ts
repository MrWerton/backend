import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cors from "cors";
import express, { Express } from "express";
import jwt from "jsonwebtoken";
import path from "path";

const app: Express = express();
const prisma = new PrismaClient();
const SECRET = "notrew";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true })); // Use urlencoded to parse form data
app.use(express.static(path.join(__dirname, "public")));

// Endpoint for registering a user
app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });
    res.render("registered", { user });
  } catch (error) {
    res.status(400).render("error", { message: "User already exists" });
  }
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/", (req, res) => {
  res.render("login");
});
// Endpoint for login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).render("error", { message: "Invalid credentials" });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).render("error", { message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, SECRET, {
    expiresIn: "1h",
  });

  res.render("loginSuccess", { message: "Login successful", token });
});

// Middleware to authenticate protected routes
const authenticate = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).render("error", { message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET, (err: any, decoded: any) => {
    if (err) {
      return res.status(401).render("error", { message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};

// Sample protected route
app.get("/protected", authenticate, (req, res) => {
  res.render("protected", { message: "Welcome to the protected route!" });
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
