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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.permission = exports.list = exports.detail = exports.update = exports.remove = exports.create = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const helper_1 = require("../../utils/helper");
// Create a new role
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = req.app.locals.prisma;
        const { role } = prisma;
        // Insert to db
        const roleData = yield role.create({
            data: {
                name: req.body.name,
                description: req.body.description,
            }
        });
        if (roleData == null)
            return next((0, http_errors_1.default)(400, "Gagal membuat role baru"));
        return res.send({ status: '200', message: 'Berhasil membuat role baru', data: roleData });
    }
    catch (error) {
        return next((0, http_errors_1.default)(400, { level: 'error', error: error }));
    }
});
exports.create = create;
// Delete Role
const remove = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = req.app.locals.prisma;
        const { role } = prisma;
        const roleData = yield role.delete({
            where: {
                id: parseInt(req.params.id)
            }
        });
        if (roleData == null)
            return next((0, http_errors_1.default)(400, "Gagal menghapus role"));
        res.send({ status: 200, message: "Berhasil menghapus role" });
    }
    catch (error) {
        return next((0, http_errors_1.default)(400, { level: 'error', error: error }));
    }
});
exports.remove = remove;
// Update Role
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = req.app.locals.prisma;
        const { role } = prisma;
        const roleData = yield role.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });
        if (roleData == null)
            return next((0, http_errors_1.default)(404, "Role tidak ditemukan"));
        const updatedRoleData = yield role.update({
            where: {
                id: roleData.id
            },
            data: {
                name: req.body.name || roleData.name,
                description: req.body.description || roleData.description,
            }
        });
        if (updatedRoleData == null)
            return next((0, http_errors_1.default)(400, "Gagal update role"));
        res.send({
            status: 200,
            message: "Berhasil update role",
            data: {
                role: updatedRoleData
            }
        });
    }
    catch (error) {
        return next((0, http_errors_1.default)(400, { level: 'error', error: error }));
    }
});
exports.update = update;
// Get Role by id
const detail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const prisma = req.app.locals.prisma;
        const { role } = prisma;
        const roleData = yield role.findUnique({
            where: {
                id: parseInt(req.params.id)
            },
            include: {
                role_permission: {
                    include: {
                        permission: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
            }
        });
        if (roleData == null)
            return next((0, http_errors_1.default)(404, "Role tidak ditemukan"));
        // format data
        roleData.permission = (_a = roleData.role_permission) === null || _a === void 0 ? void 0 : _a.map((rp) => {
            return rp.permission;
        });
        delete roleData.role_permission;
        res.send({
            status: 200,
            data: {
                role: roleData
            }
        });
    }
    catch (error) {
        return next((0, http_errors_1.default)(400, { level: 'error', error: error }));
    }
});
exports.detail = detail;
// Get Role List
const list = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = req.app.locals.prisma;
        const { role } = prisma;
        const filter = (0, helper_1.removeNull)({ name: req.query.name });
        const page = Number(req.query.page) || 1;
        const perPage = Number(req.query.perPage) || 30;
        const roleData = yield role.findMany({
            skip: perPage * (page - 1),
            take: perPage,
            where: filter,
            orderBy: {
                createdAt: "desc"
            }
        });
        const totalData = yield role.count({
            where: filter,
            select: {
                id: true
            },
        });
        res.send({
            status: 200,
            data: roleData,
            meta: {
                page,
                perPage,
                totalData: totalData.id,
                totalPage: Math.ceil(totalData.id / perPage)
            }
        });
    }
    catch (error) {
        return next((0, http_errors_1.default)(400, { level: 'error', error: error }));
    }
});
exports.list = list;
// Add permission to role
const permission = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const prisma = req.app.locals.prisma;
        const { role, role_permission } = prisma;
        const roleData = yield role.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });
        if (roleData == null)
            return next((0, http_errors_1.default)(404, "Role tidak ditemukan"));
        yield role_permission.deleteMany({
            where: {
                role_id: roleData.id
            }
        });
        const rolePermData = yield role_permission.createMany({
            data: req.body.permission.map((perm) => {
                return { perm_id: perm, role_id: roleData.id };
            })
        });
        if (rolePermData == null)
            return next((0, http_errors_1.default)(400));
        const updatedRoleData = yield role.findUnique({
            where: {
                id: parseInt(req.params.id)
            },
            include: {
                role_permission: {
                    include: {
                        permission: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
            }
        });
        if (updatedRoleData == null)
            return next((0, http_errors_1.default)(404));
        // format data
        updatedRoleData.permission = (_b = updatedRoleData.role_permission) === null || _b === void 0 ? void 0 : _b.map((rp) => {
            return rp.permission;
        });
        delete updatedRoleData.role_permission;
        res.send({
            status: 200,
            message: "Berhasil menambahkan permission",
            data: updatedRoleData
        });
    }
    catch (error) {
        return next((0, http_errors_1.default)(400, { level: 'error', error: error }));
    }
});
exports.permission = permission;
//# sourceMappingURL=roles.controller.js.map