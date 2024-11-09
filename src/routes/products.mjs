import { Router } from "express";
const router = Router();

router.get("/api/products", (req, res) => {
  console.log(req.headers.cookie);
  console.log(req.cookies); //cookie
  if (req.cookies.hello && req.cookies.hello === "world")
    return res.send([
      { id: 123, name: "chicken", price: 200 },
      { id: 234, name: "rice", price: 100 },
      { id: 345, name: "egg", price: 50 },
    ]);

  return res.status(403).send({ msg: "cookies are not matching" });
});
export default router;
