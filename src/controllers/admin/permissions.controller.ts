import createError from "http-errors";
import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { removeNull } from "../../utils/helper";

// Create a new permission
export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prisma: PrismaClient = req.app.locals.prisma;
        const { permission } = prisma;

        // Check duplicate name
        const nameExist = await permission.findUnique({where: {name: req.body.name}});
        if(nameExist != null) return next(createError(400, "Nama sudah digunakan"));

        // Insert to db
        const permData = await permission.create({
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

        if(permData == null) return next(createError(400, "Gagal membuat permission"));
        return res.send({status: '200', message: 'Berhasil membuat permission baru', data: permData});
    } catch (error) {
        return next(createError(400, { level: 'error', error: error }));
    }
};

// Delete Permission
export const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prisma: PrismaClient = req.app.locals.prisma;
        const { permission } = prisma;

        const permData = await permission.delete({
            where: {
                id: parseInt(req.params.id)
            }
        });

        if(permData == null) return next(createError(400, "Gagal menghapus permission"));
        res.send({status: 200, message: "Berhasil menghapus permission"});
    } catch (error) {
        return next(createError(400, { level: 'error', error: error }));
    }
};

// Update Permission
export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prisma: PrismaClient = req.app.locals.prisma;
        const { permission } = prisma;

        const permData = await permission.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });
        if(permData == null) return next(createError(404, "Permission tidak ditemukan"));

        // Check duplicate name
        if(req.body.name) {
            const nameExist = await permission.findUnique({where: {name: req.body.name}});
            if(nameExist != null) return next(createError(400, "Nama sudah digunakan"));
        }

        const updatedPermData = await permission.update({
            where: {
                id: permData.id
            },
            data: {
                name: req.body.name || permData.name,
                description: req.body.description || permData.description,
            }
        });
        if(updatedPermData == null) return next(createError(400, "Gagal update permission"));

        res.send({
            status: 200,
            message: "Berhasil update permission",
            data: {
                permission: updatedPermData
            }
        });
    } catch (error) {
        return next(createError(400, { level: 'error', error: error }));
    }
};

// Get Permission by id
export const detail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prisma: PrismaClient = req.app.locals.prisma;
        const { permission } = prisma;

        const permData = await permission.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });
        if(permData == null) return next(createError(404, "Permission tidak ditemukan"));

        res.send({
            status: 200,
            data: {
                permission: permData
            }
        });
    } catch (error) {
        return next(createError(400, { level: 'error', error: error }));
    }
};

// Get Permission List
export const list= async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prisma: PrismaClient = req.app.locals.prisma;
        const { permission: permission } = prisma;

        const filter = removeNull({name: req.query.name});
        const page = Number(req.query.page) || 1;
        const perPage = Number(req.query.perPage) || 30;

        const permData = await permission.findMany({
            skip: perPage * (page - 1),
            take: perPage,
            where: filter,
            orderBy: {
                createdAt: "desc"
            }
        });

        const totalData = await permission.count({
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
    } catch (error) {
        return next(createError(400, { level: 'error', error: error }));
    }
};
