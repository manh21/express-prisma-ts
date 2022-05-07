import { Router } from "express";
import { authorization } from "../../middleware/authorization";
import { validation } from "../../middleware/validation";
import { create, deleteUser, update, detail, list } from "../../validation/users";
import * as controller from "../../controllers/admin/users.controller";

// Initialize
const router = Router();

// Create a new user
router.post('/', authorization('USER_ADD'), validation(create.body, 'body'), controller.create);

// Delete User
router.delete('/:id', authorization('USER_DELETE'), validation(deleteUser.params, 'params'), controller.remove);

// Update User
router.put('/:id', authorization('USER_UPDATE'), validation(update.params, 'params'), validation(update.body, 'body'), controller.update);

// Get User by id
router.get('/:id', authorization('USER_DETAIL'), validation(detail.params, 'params'), controller.detail);

// Get User List
router.get('/', authorization('USER_LIST'), validation(list.query, 'query'), controller.list);

export default router;
