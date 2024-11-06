import { Router } from "express";
import { query, validationResult } from "express-validator";
import { mockUsers } from "../utlis/constants.mjs";
const router = Router();

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
    console.log(result);
    const {
      query: { filter, value },
    } = req;

    if (filter && value)
      return res.send(mockUsers.filter((user) => user[filter].includes(value)));
    //when the filter and value undefined
    return res.send(mockUsers);
  }
);

export default router;
