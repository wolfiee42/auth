import express from "express";
import { auth } from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_Role } from "./user.constants";
import { userControllers } from "./user.controller";
import { UserValidations } from "./user.validation";


const router = express.Router();

router.post(
  "/create-admin",
  validateRequest(UserValidations.createAdminValidations),
  auth(USER_Role.ADMIN, USER_Role.SUPER_ADMIN),
  userControllers.createAdmin

);

//update
router.put(
  "/:userId",
  auth(USER_Role.ADMIN, USER_Role.SUPER_ADMIN, USER_Role.USER),
  validateRequest(UserValidations.updateUserValidations),
  userControllers.updateUser
);

export const UserRoutes = router;

