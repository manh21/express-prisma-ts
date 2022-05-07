import { Router } from "express";
import { account_authentication } from "../../middleware/authentication";
const router = Router();

import usersRoute from "./users.route";
import rolesRoute from "./roles.route";
import permissionsRoute from "./permissions.route";

// Authenticated Access to the API
router.use(account_authentication);

router.use('/users', usersRoute);
router.use('/roles', rolesRoute);
router.use('/permissions', permissionsRoute);

export default router;