import { Router } from "express";
import { handleGetUserByUsername, handleGetUserRepos, handleDeleteUser } from "../../controllers/userController";

const userRouter = Router();

userRouter.get("/:username", handleGetUserByUsername);
userRouter.get("/:username/repos", handleGetUserRepos);
userRouter.delete("/:username", handleDeleteUser);

export default userRouter;
