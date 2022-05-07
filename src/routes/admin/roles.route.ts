import { Router } from "express";
import { authorization } from "../../middleware/authorization";
import { validation } from "../../middleware/validation";
import { create, deleteRole, update, detail, list, addPerm } from "../../validation/roles";
import * as controller from "../../controllers/admin/roles.controller";

// Initialize
const router = Router();

// Create a new role
router.post('/', authorization('ROLE_ADD'), validation(create.body, 'body'), controller.create);

// Delete Role
router.delete('/:id', authorization('ROLE_DELETE'), validation(deleteRole.params, 'params'), controller.remove);

// Update Role
router.put('/:id', authorization('ROLE_UPDATE'), validation(update.params, 'params'), validation(update.body, 'body'), controller.update);

// Get Role by id
router.get('/:id', authorization('ROLE_DETAIL'), validation(detail.params, 'params'), controller.detail);

// Get Role List
router.get('/', authorization('ROLE_LIST'), validation(list.query, 'query'), controller.list);

// Add permission to role
router.post('/permission/:id', validation(addPerm.params, 'params'), validation(addPerm.body, 'body'), controller.permission);

export default router;
