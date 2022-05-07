"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const password_service_1 = require("../services/auth/password.service");
exports.default = (prisma) => __awaiter(void 0, void 0, void 0, function* () {
    // Permissions
    const permissions = [
        'AUTH_SELF_CHANGE_PASSWORD',
        'PERMISSION_ADD',
        'PERMISSION_DELETE',
        'PERMISSION_UPDATE',
        'PERMISSION_DETAIL',
        'PERMISSION_LIST',
        'USER_ADD',
        'USER_DELETE',
        'USER_UPDATE',
        'USER_DETAIL',
        'USER_LIST',
        'ROLE_ADD',
        'ROLE_DELETE',
        'ROLE_UPDATE',
        'ROLE_DETAIL',
        'ROLE_LIST',
        'FILE_ADD',
        'FILE_DELETE',
        'FILE_LIST',
        'NEWS_ADD',
        'NEWS_DELETE',
        'NEWS_UPDATE',
        'NEWS_LIST',
        'NEWS_DETAIL',
        'MENU_ADD',
        'MENU_DELETE',
        'MENU_UPDATE',
        'MENU_DETAIL',
        'MENU_LIST',
        'PEOPLE_ADD',
        'PEOPLE_DELETE',
        'PEOPLE_UPDATE',
        'PEOPLE_DETAIL',
        'PEOPLE_LIST',
        'PAGE_ADD',
        'PAGE_DELETE',
        'PAGE_UPDATE',
        'PAGE_DETAIL',
        'PAGE_LIST',
        'CATEGORY_ADD',
        'CATEGORY_DELETE',
        'CATEGORY_UPDATE',
        'CATEGORY_DETAIL',
        'CATEGORY_LIST',
        'REACTION_ADD',
        'REACTION_DELETE',
        'REACTION_UPDATE',
        'REACTION_DETAIL',
        'REACTION_LIST',
    ];
    permissions.forEach((el) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield prisma.permission.upsert({
                where: { name: el },
                update: {},
                create: { name: el, description: '' }
            });
        }
        catch (error) {
            console.error(error);
        }
    }));
    // Roles
    const permData = yield prisma.permission.findMany();
    const role = yield prisma.role.upsert({
        where: {},
        update: {},
        create: { name: 'Admin', description: '' }
    });
    yield prisma.role_permission.createMany({
        data: permData.map((d) => {
            return { role_id: role.id, perm_id: d.id };
        })
    });
    // Users
    // Generate password hash
    const password = yield (0, password_service_1.generatePasswordHash)('admin');
    yield prisma.user.upsert({
        where: { email: 'admin@admin.com' },
        update: {},
        create: {
            id: 1,
            email: 'admin@admin.com',
            password: password,
            fullName: 'Admin',
            role_id: role.id,
        }
    });
});
//# sourceMappingURL=seed.service.js.map