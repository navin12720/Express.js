import express from "express";
// const path = require("path");
import { body, query, validationResult, checkSchema } from "express-validator";
import { createUserVAlidateScheme } from "./utlis/validatorsSchema.mjs";
import UserRouter from "./routes/users.mjs";
import { mockUsers } from "./utlis/constants.mjs";
const app = express();

app.use(express.json());
app.use(UserRouter);

const loggingMiddleware = (req, res, next) => {
  console.log(`${req.method}--${req.url}`);
  next();
};

const resolveUserById = (req, res, next) => {
  const {
    params: { id },
  } = req;
  const parseId = parseInt(id);
  if (isNaN(parseId)) return res.status(400).send("Enter correct Id!");
  const findUserIndex = mockUsers.findIndex((user) => user.id === parseId);
  if (findUserIndex === -1) return res.status(404).send("User not found");
  req.findUserIndex = findUserIndex;
  next();
};
//----------
app.use(
  loggingMiddleware, //first this middleware works
  (req, res, next) => {
    //then this one works
    console.log("This is a middleware function");
    next();
  }
); //for all apis
//------------
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
    res.send("first page");
  }
);

app.get("/api", (req, res) => {
  res.status(201).send({ msg: "Hel2lo world" });
});

//get query request
//express-validator --> query()

app.get("/api/users/:id", resolveUserById, (req, res) => {
  const { findUserIndex } = req;
  const findUser = mockUsers[findUserIndex];
  if (!findUser) return res.status(404).send("User not found");
  res.send(findUser);
});
app.get("/api/products", (req, res) => {
  res.send([
    { id: 123, name: "chicken", price: 200 },
    { id: 234, name: "rice", price: 100 },
    { id: 345, name: "egg", price: 50 },
  ]);
});

//post request
//validators----
app.post(
  "/api/users",
  // [
  //   body("username")
  //     .notEmpty()
  //     .withMessage("Username cant be empty")
  //     .isLength({ min: 5, max: 32 })
  //     .withMessage("username must be atleast 5 to 32 characters")
  //     .isString()
  //     .withMessage("Username must be String"),
  //   body("email").notEmpty().withMessage("Email cant be Empty"),
  // ],

  //-checkschema
  checkSchema(createUserVAlidateScheme),
  (req, res) => {
    const result = validationResult(req);
    console.log(result);
    console.log(req.body);
    if (!result.isEmpty())
      return res.status(400).send({ errors: result.array() });
    const { body } = req;
    const newusers = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };
    mockUsers.push(newusers);
    return res.status(201).send(newusers);
  }
);

//put request
//to update whole data
app.put("/api/users/:id", resolveUserById, (req, res) => {
  const { body, findUserIndex } = req;
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  return res.status(200).send("User! Updated");
});

//patch request
//partial updata of user data
app.patch("/api/users/:id", resolveUserById, (req, res) => {
  const { body, findUserIndex } = req;
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return res.status(200).send("User! Updated");
});

//delete request
app.delete("/api/users/:id", resolveUserById, (req, res) => {
  const { findUserIndex } = req;
  mockUsers.splice(findUserIndex, 1);
  return res.status(200).send("User deleted");
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
