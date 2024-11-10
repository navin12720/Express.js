import { Router } from "express";
import { query, validationResult, checkSchema } from "express-validator";
import { mockUsers } from "../utlis/constants.mjs";
import { createUserVAlidateScheme } from "../utlis/validatorsSchema.mjs";
import { resolveUserById, loggingMiddleware } from "../utlis/middleware.mjs";
import { User } from "../mongoose_Schema/User.mjs";

const router = Router();

// //----------
router.use(
  loggingMiddleware, //first this middleware works
  (req, res, next) => {
    //then this one works
    console.log("This is a middleware function");
    next();
  }
); //for all apis
// //------------

//get query request
//express-validator --> query()
router.get(
  "/api/users",
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("must not be empty")
    .isLength({ min: 3, max: 32 })
    .withMessage("Must be 3 to 32 char"),
  (req, res) => {
    //   res.send(req.query);
    const result = validationResult(req);
    // console.log(result);
    const {
      query: { filter, value },
    } = req;

    if (filter && value)
      return res.send(mockUsers.filter((user) => user[filter].includes(value)));
    //when the filter and value undefined
    return res.send(mockUsers);
  }
);

router.get("/api/users/:id", resolveUserById, (req, res) => {
  const { findUserIndex } = req;
  const findUser = mockUsers[findUserIndex];
  if (!findUser) return res.status(404).send("User not found");
  res.send(findUser);
});

//post request
//validators----
router.post(
  "/api/users",
  //------DB MONGO--------
  async (req, res) => {
    const { body } = req;
    const newUser = new User(body);
    try {
      const SavedUser = await newUser.save();
      return res.status(201).send(SavedUser);
    } catch (err) {
      console.log(err);
      return res.status(400).send({ msg: "User Not Saved!!!" });
    }
  }
);
//-------------------------
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

//-checkschema-------
// checkSchema(createUserVAlidateScheme),
// (req, res) => {
//   const result = validationResult(req);
//   // console.log(result);
//   console.log(req.body);
//   if (!result.isEmpty())
//     return res.status(400).send({ errors: result.array() });
//   const { body } = req;
//   const newusers = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };
//   mockUsers.push(newusers);
//   return res.status(201).send(newusers);
// }
//);
//---------------

//put request
//to update whole data
router.put("/api/users/:id", resolveUserById, (req, res) => {
  const { body, findUserIndex } = req;
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  return res.status(200).send("User! Updated");
});

//patch request
//partial updata of user data
router.patch("/api/users/:id", resolveUserById, (req, res) => {
  const { body, findUserIndex } = req;
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return res.status(200).send("User! Updated");
});

//delete request
router.delete("/api/users/:id", resolveUserById, (req, res) => {
  const { findUserIndex } = req;
  mockUsers.splice(findUserIndex, 1);
  return res.status(200).send("User deleted");
});

export default router;
