import { Router } from "express";
import { authorization } from "../../middleware/authorization";
import { validation } from "../../middleware/validation";
import { create, deletePerm, update, detail, list } from "../../validation/permissions";
import * as controller from "../../controllers/admin/permissions.controller";

// Initialize
const router = Router();

// Create a new permission
router.post('/', authorization('PERMISSION_ADD'), validation(create.body, 'body'), controller.create);

// Delete Permission
router.delete('/:id', authorization('PERMISSION_DELETE'), validation(deletePerm.params, 'params'), controller.remove);

// Update Permission
router.put('/:id', authorization('PERMISSION_UPDATE'), validation(update.params, 'params'), validation(update.body, 'body'), controller.update);

// Get Permission by id
router.get('/:id', authorization('PERMISSION_DETAIL'), validation(detail.params, 'params'), controller.detail);

// Get Permission List
router.get('/', authorization('PERMISSION_LIST'), validation(list.query, 'query'), controller.list);

export default router;
