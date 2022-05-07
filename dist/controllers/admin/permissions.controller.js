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
// Create a new permission
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = req.app.locals.prisma;
        const { permission } = prisma;
        // Check duplicate name
        const nameExist = yield permission.findUnique({ where: { name: req.body.name } });
        if (nameExist != null)
            return next((0, http_errors_1.default)(400, "Nama sudah digunakan"));
        // Insert to db
        const permData = yield permission.create({
            data: {
                name: req.body.name,
                description: req.body.description
            },
            select: {
                id: true,
                name: true,
                description: true
            }
        });
        if (permData == null)
            return next((0, http_errors_1.default)(400, "Gagal membuat permission"));
        return res.send({ status: '200', message: 'Berhasil membuat permission baru', data: permData });
    }
    catch (error) {
        return next((0, http_errors_1.default)(400, { level: 'error', error: error }));
    }
});
exports.create = create;
// Delete Permission
const remove = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = req.app.locals.prisma;
        const { permission } = prisma;
        const permData = yield permission.delete({
            where: {
                id: parseInt(req.params.id)
            }
        });
        if (permData == null)
            return next((0, http_errors_1.default)(400, "Gagal menghapus permission"));
        res.send({ status: 200, message: "Berhasil menghapus permission" });
    }
    catch (error) {
        return next((0, http_errors_1.default)(400, { level: 'error', error: error }));
    }
});
exports.remove = remove;
// Update Permission
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = req.app.locals.prisma;
        const { permission } = prisma;
        const permData = yield permission.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });
        if (permData == null)
            return next((0, http_errors_1.default)(404, "Permission tidak ditemukan"));
        // Check duplicate name
        if (req.body.name) {
            const nameExist = yield permission.findUnique({ where: { name: req.body.name } });
            if (nameExist != null)
                return next((0, http_errors_1.default)(400, "Nama sudah digunakan"));
        }
        const updatedPermData = yield permission.update({
            where: {
                id: permData.id
            },
            data: {
                name: req.body.name || permData.name,
                description: req.body.description || permData.description,
            }
        });
        if (updatedPermData == null)
            return next((0, http_errors_1.default)(400, "Gagal update permission"));
        res.send({
            status: 200,
            message: "Berhasil update permission",
            data: {
                permission: updatedPermData
            }
        });
    }
    catch (error) {
        return next((0, http_errors_1.default)(400, { level: 'error', error: error }));
    }
});
exports.update = update;
// Get Permission by id
const detail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = req.app.locals.prisma;
        const { permission } = prisma;
        const permData = yield permission.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });
        if (permData == null)
            return next((0, http_errors_1.default)(404, "Permission tidak ditemukan"));
        res.send({
            status: 200,
            data: {
                permission: permData
            }
        });
    }
    catch (error) {
        return next((0, http_errors_1.default)(400, { level: 'error', error: error }));
    }
});
exports.detail = detail;
// Get Permission List
const list = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prisma = req.app.locals.prisma;
        const { permission: permission } = prisma;
        const filter = (0, helper_1.removeNull)({ name: req.query.name });
        const page = Number(req.query.page) || 1;
        const perPage = Number(req.query.perPage) || 30;
        const permData = yield permission.findMany({
            skip: perPage * (page - 1),
            take: perPage,
            where: filter,
            orderBy: {
                createdAt: "desc"
            }
        });
        const totalData = yield permission.count({
            where: filter,
            select: {
                id: true
            },
        });
        res.send({
            status: 200,
            data: permData,
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
//# sourceMappingURL=permissions.controller.js.map