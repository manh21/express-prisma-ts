import createError from "http-errors";
import { NextFunction, Request, Response } from "express";
import { PrismaClient, Role, Role_permission } from "@prisma/client";
import { removeNull } from "../../utils/helper";

// Create a new role
export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prisma: PrismaClient = req.app.locals.prisma;
        const { role } = prisma;

        // Insert to db
        const roleData = await role.create({
            data: {
                name: req.body.name,
                description: req.body.description,
            }
        });

        if(roleData == null) return next(createError(400, "Gagal membuat role baru"));
        return res.send({status: '200', message: 'Berhasil membuat role baru', data: roleData});
    } catch (error) {
        return next(createError(400, { level: 'error', error: error }));
    }
};

// Delete Role
export const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prisma: PrismaClient = req.app.locals.prisma;
        const { role } = prisma;

        const roleData = await role.delete({
            where: {
                id: parseInt(req.params.id)
            }
        });

        if(roleData == null) return next(createError(400, "Gagal menghapus role"));
        res.send({status: 200, message: "Berhasil menghapus role"});
    } catch (error) {
        return next(createError(400, { level: 'error', error: error }));
    }
};

// Update Role
export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prisma: PrismaClient = req.app.locals.prisma;
        const { role } = prisma;

        const roleData = await role.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });
        if(roleData == null) return next(createError(404, "Role tidak ditemukan"));

        const updatedRoleData = await role.update({
            where: {
                id: roleData.id
            },
            data: {
                name: req.body.name || roleData.name,
                description: req.body.description || roleData.description,
            }
        });
        if(updatedRoleData == null) return next(createError(400, "Gagal update role"));

        res.send({
            status: 200,
            message: "Berhasil update role",
            data: {
                role: updatedRoleData
            }
        });
    } catch (error) {
        return next(createError(400, { level: 'error', error: error }));
    }
};

// Get Role by id
export const detail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prisma: PrismaClient = req.app.locals.prisma;
        const { role } = prisma;

        const roleData: TRoleData = await role.findUnique({
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
        if(roleData == null) return next(createError(404, "Role tidak ditemukan"));

        // format data
        roleData.permission = roleData.role_permission?.map((rp) => {
            return rp.permission;
        });

        delete roleData.role_permission;

        res.send({
            status: 200,
            data: {
                role: roleData
            }
        });
    } catch (error) {
        return next(createError(400, { level: 'error', error: error }));
    }
};

// Get Role List
export const list = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prisma: PrismaClient = req.app.locals.prisma;
        const { role } = prisma;

        const filter = removeNull({name: req.query.name});
        const page = Number(req.query.page) || 1;
        const perPage = Number(req.query.perPage) || 30;

        const roleData = await role.findMany({
            skip: perPage * (page - 1),
            take: perPage,
            where: filter,
            orderBy: {
                createdAt: "desc"
            }
        });

        const totalData = await role.count({
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
    } catch (error) {
        return next(createError(400, { level: 'error', error: error }));
    }
};

// Add permission to role
export const permission = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prisma: PrismaClient = req.app.locals.prisma;
        const { role, role_permission } = prisma;

        const roleData = await role.findUnique({
            where: {
                id: parseInt(req.params.id)
            }
        });
        if(roleData == null) return next(createError(404, "Role tidak ditemukan"));

        await role_permission.deleteMany({
            where: {
                role_id: roleData.id
            }
        });

        const rolePermData = await role_permission.createMany({
            data: req.body.permission.map((perm: number) => {
                return {perm_id: perm, role_id: roleData.id};
            })
        });
        if(rolePermData == null) return next(createError(400));

        const updatedRoleData: TRoleData = await role.findUnique({
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
        if(updatedRoleData == null) return next(createError(404));

        // format data
        updatedRoleData.permission = updatedRoleData.role_permission?.map((rp) => {
            return rp.permission;
        });

        delete updatedRoleData.role_permission;

        res.send({
            status: 200,
            message: "Berhasil menambahkan permission",
            data: updatedRoleData
        });
    } catch (error) {
        return next(createError(400, { level: 'error', error: error }));
    }
};

type TRoleData = (Role & {
    permission?: {
        id: number,
        name: string
    }[];
    role_permission?: (Role_permission & {
        permission: {
            id: number,
            name: string
        }
    })[];
}) | null;
