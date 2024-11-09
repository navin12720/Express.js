import express from "express";
// const path = require("path");
import routers from "./routes/indexRoot.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { mockUsers } from "./utlis/constants.mjs";
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "Navin the Dev",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);
app.use(routers);

const port = parseInt(process.env.PORT) || process.argv[3] || 8080;

// app
//   .use(express.static(path.join(__dirname, "public")))
//   .set("views", path.join(__dirname, "views"))
//   .set("view engine", "ejs");

//get request
app.get(
  "/",
  (req, res, next) => {
    //middleware
    console.log("loading finished....");
    next();
  },
  (req, res) => {
    console.log(req.session);
    console.log(req.session.id);
    req.session.visited = true;
    res.cookie("hello", "world", { maxAge: 60000 }); //one min cookie live
    res.send("first page");
  }
);

app.get("/api", (req, res) => {
  res.status(201).send({ msg: "Hel2lo world" });
});

app.post("/api/auth", (req, res) => {
  const {
    body: { username, password },
  } = req;
  const findUser = mockUsers.find((user) => user.username === username);
  if (!findUser || findUser.password !== password)
    return res.status(401).send("Invalid Credentials");
  req.session.user = findUser;
  return res.status(200).send(findUser);
});

app.get("/api/auth/status", (req, res) => {
  req.sessionStore.get(req.sessionID, (err, session) => {
    console.log(session);
  });
  return req.session.user
    ? res.status(200).send(req.session.user)
    : res.status(401).send("Not Authenticated");
});

app.post("/api/cart", (req, res) => {
  if (!req.session.user) return res.status(401).send("No User");
  const { body: item } = req;
  const { cart } = req.session;
  if (cart) {
    cart.push(item);
  } else {
    req.session.cart = [item];
  }
  return res.status(201).send(item);
});

app.get("/api/cart", (req, res) => {
  if (!req.session.user) return res.status(401).send("No User");
  return res.send(req.session.cart ?? []);
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
