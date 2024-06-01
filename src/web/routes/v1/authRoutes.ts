import { Router } from "express";
import { handleSignUp, handleLogin, handleRefresh } from "../../controllers/authController";

const authRouter = Router();

authRouter.post("/signup", handleSignUp);
authRouter.post("/login", handleLogin);
authRouter.post("/refresh", handleRefresh);

export default authRouter;
