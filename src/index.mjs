import express from "express";
// const path = require("path");

const app = express();

app.use(express.json());

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
app.get("/", (req, res) => {
  res.send("first page");
});

app.get("/api", (req, res) => {
  res.status(201).send({ msg: "Hel2lo world" });
});

//get query request
app.get("/api/users", (req, res) => {
  //   res.send(req.query);
  const {
    query: { filter, value },
  } = req;

  if (filter && value)
    return res.send(mockUsers.filter((user) => user[filter].includes(value)));
  //when the filter and value undefined
  return res.send(mockUsers);
});
app.get("/api/users/:id", (req, res) => {
  const parseId = parseInt(req.params.id);
  if (isNaN(parseId)) return res.status(400).send("Invalid id");
  const findUser = mockUsers.find((users) => users.id === parseId);
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
app.post("/api/users", (req, res) => {
  console.log(req.body);
  const { body } = req;
  const newusers = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };
  mockUsers.push(newusers);
  return res.status(201).send(newusers);
});

//put request
//to update whole data
app.put("/api/users/:id", (req, res) => {
  const {
    body,
    params: { id },
  } = req;
  const parseId = parseInt(id);
  if (isNaN(parseId)) return res.status(400).send("Enter correct Id!");
  const findUserIndex = mockUsers.findIndex((user) => user.id === parseId);
  if (findUserIndex === -1) return res.status(404).send("User not found");
  mockUsers[findUserIndex] = { id: parseId, ...body };
  return res.status(200).send("User! Updated");
});

//patch request
//partial updata of user data
app.patch("/api/users/:id", (req, res) => {
  const {
    body,
    params: { id },
  } = req;
  const parseId = parseInt(id);
  if (isNaN(parseId)) return res.status(400).send("Enter correct Id!");
  const findUserIndex = mockUsers.findIndex((user) => user.id === parseId);
  if (findUserIndex === -1) return res.status(404).send("User not found");
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return res.status(200).send("User! Updated");
});

//delete request
app.delete("/api/users/:id", (req, res) => {
  const {
    params: { id },
  } = req;
  const parseId = parseInt(id);
  if (isNaN(parseId)) return res.status(400).send("Enter correct Id!");
  const findUserIndex = mockUsers.findIndex((user) => user.id === parseId);
  if (findUserIndex === -1) return res.status(404).send("User not found");
  mockUsers.splice(findUserIndex, 1);
  return res.status(200).send("User deleted");
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
