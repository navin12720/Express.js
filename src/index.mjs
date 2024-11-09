import express from "express";
// const path = require("path");
import routers from "./routes/indexRoot.mjs";
import cookieParser from "cookie-parser";
const app = express();

app.use(express.json());
app.use(cookieParser());
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
    res.cookie("hello", "world", { maxAge: 6000 }); //one min cookie live
    res.send("first page");
  }
);

app.get("/api", (req, res) => {
  res.status(201).send({ msg: "Hel2lo world" });
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
