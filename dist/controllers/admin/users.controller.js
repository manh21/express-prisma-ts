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
exports.list = exports.detail = exports.update = exports.remove = exports.create = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const helper_1 = require("../../utils/helper");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = req.app.locals.prisma;
        const { user } = prisma;
        // Check duplicate email
        const emailExist = yield user.findUnique({ where: { email: req.body.email } });
        if (emailExist != null)
            return next((0, http_errors_1.default)(400, "Email sudah digunakan"));
        // Generate password hash
        const password = bcryptjs_1.default.hashSync(req.body.password, bcryptjs_1.default.genSaltSync(10));
        // Insert to db
        const userData = yield user.create({
            data: {
                email: req.body.email,
                password: password,
                fullName: req.body.fullName
            },
            select: {
                id: true,
                email: true,
                fullName: true
            }
        });
        if (userData == null)
            return next((0, http_errors_1.default)(400, "Gagal membuat user"));
        return res.send({ status: '200', message: 'Berhasil membuat user baru', data: userData });
    }
    catch (error) {
        return next((0, http_errors_1.default)(400, { level: 'error', error: error }));
    }
});
exports.create = create;
const remove = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = req.app.locals.prisma;
        const { user } = prisma;
        const id = Number(req.params.id);
        const userData = yield user.delete({
            where: {
                id
            }
        });
        if (userData == null)
            return next((0, http_errors_1.default)(400, "Gagal menghapus user"));
        res.send({ status: 200, message: "Berhasil menghapus user" });
    }
    catch (error) {
        return next((0, http_errors_1.default)(400, { level: 'error', error: error }));
    }
});
exports.remove = remove;
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = req.app.locals.prisma;
        const { user } = prisma;
        const id = Number(req.params.id);
        const userData = yield user.findUnique({
            where: {
                id
            }
        });
        if (userData == null)
            return next((0, http_errors_1.default)(404, "User tidak ditemukan"));
        // Check duplicate email
        if (req.body.email) {
            const emailExist = yield user.findUnique({ where: { email: req.body.email } });
            if (emailExist != null)
                return next((0, http_errors_1.default)(400, "Email sudah digunakan"));
        }
        const updatedUserData = yield user.update({
            where: {
                id
            },
            data: {
                email: req.body.email || userData.email,
                fullName: req.body.fullName || userData.fullName,
                phone: req.body.phone || userData.phone,
                role_id: parseInt(req.body.role_id) || userData.role_id
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                phone: true,
                role: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        if (updatedUserData == null)
            return next((0, http_errors_1.default)(400, "Gagal update user"));
        res.send({
            status: 200,
            message: "Berhasil update user",
            data: {
                user: updatedUserData
            }
        });
    }
    catch (error) {
        return next((0, http_errors_1.default)(400, { level: 'error', error: error }));
    }
});
exports.update = update;
const detail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const prisma = req.app.locals.prisma;
        const { user } = prisma;
        const id = Number(req.params.id);
        const userData = yield user.findUnique({
            where: {
                id
            },
            select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                createdAt: true,
                updatedAt: true,
                role: {
                    select: {
                        id: true,
                        name: true,
                        role_permission: {
                            select: {
                                permission: {
                                    select: {
                                        id: true,
                                        name: true
                                    }
                                }
                            }
                        }
                    },
                }
            }
        });
        if (userData == null)
            return next((0, http_errors_1.default)(404, "User tidak ditemukan"));
        if (userData.role != null) {
            // format data
            userData.role.permission = (_b = (_a = userData.role) === null || _a === void 0 ? void 0 : _a.role_permission) === null || _b === void 0 ? void 0 : _b.map((rp) => {
                return rp.permission;
            });
            delete userData.role.role_permission;
        }
        res.send({
            status: 200,
            data: {
                user: userData
            }
        });
    }
    catch (error) {
        return next((0, http_errors_1.default)(400, { level: 'error', error: error }));
    }
});
exports.detail = detail;
const list = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = req.app.locals.prisma;
        const { user } = prisma;
        const filter = (0, helper_1.removeNull)({ fullName: req.query.name, email: req.query.email, roleId: req.query.role_id });
        const page = Number(req.query.page) || 1;
        const perPage = Number(req.query.perPage) || 30;
        const userData = yield user.findMany({
            skip: perPage * (page - 1),
            take: perPage,
            where: filter,
            select: {
                id: true,
                email: true,
                fullName: true,
                phone: true,
                role: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        const totalData = yield user.count({
            where: filter,
            select: {
                id: true
            },
        });
        res.send({
            status: 200,
            data: userData,
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
//# sourceMappingURL=users.controller.js.map