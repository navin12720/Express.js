import { mockUsers } from "./constants.mjs";
export const resolveUserById = (req, res, next) => {
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
export const loggingMiddleware = (req, res, next) => {
  console.log(`${req.method}--${req.url}`);
  next();
};
