import { Router } from "express";
import UserRouter from "./users.mjs";
import productsRouters from "./products.mjs";
const router = Router();
router.use(UserRouter);
router.use(productsRouters);

export default router;
