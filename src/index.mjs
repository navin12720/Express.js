import express from "express";
// const path = require("path");
import { body, query, validationResult } from "express-validator";

const app = express();

app.use(express.json());

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

const mockUsers = [
  { id: 1, username: "navin", email: "william.on@example-pet-store.com" },
  { id: 2, username: "amer", email: "william2.@example-pet-store.com" },
  { id: 3, username: "reethu", email: "william2.@example-pet-store.com" },
  { id: 4, username: "dillibai", email: "jessica.smith@example-pet-store.com" },
  { id: 5, username: "anan", email: "michael.jones@example-pet-store.com" },
  { id: 6, username: "anandh", email: "sarah.brown@example-pet-store.com" },
  { id: 7, username: "mano", email: "david.wilson@example-pet-store.com" },
  { id: 8, username: "deena", email: "emma.johnson@example-pet-store.com" },
  { id: 9, username: "raja", email: "james.miller@example-pet-store.com" },
  { id: 10, username: "ravi", email: "olivia.davis@example-pet-store.com" },
];
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
app.get("/api/users", query("filter").isString().notEmpty(), (req, res) => {
  //   res.send(req.query);
  const {
    query: { filter, value },
  } = req;

  if (filter && value)
    return res.send(mockUsers.filter((user) => user[filter].includes(value)));
  //when the filter and value undefined
  return res.send(mockUsers);
});

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
  [
    body("username")
      .notEmpty()
      .withMessage("User name cant be empty")
      .isLength({ min: 5, max: 32 })
      .withMessage("username must be atleast 5 to 32 characters")
      .isString()
      .withMessage("Username must be String"),
    body("email").notEmpty().withMessage("Email cant be Empty"),
  ],
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
