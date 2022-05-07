import createError from "http-errors";
import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { removeNull } from "../../utils/helper";
import bcrypt from "bcryptjs";

export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prisma: PrismaClient = req.app.locals.prisma;
        const { user } = prisma;

        // Check duplicate email
        const emailExist = await user.findUnique({where: {email: req.body.email}});
        if(emailExist != null) return next(createError(400, "Email sudah digunakan"));

        // Generate password hash
        const password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));

        // Insert to db
        const userData = await user.create({
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

        if(userData == null) return next(createError(400, "Gagal membuat user"));
        return res.send({status: '200', message: 'Berhasil membuat user baru', data: userData});
    } catch (error) {
        return next(createError(400, { level: 'error', error: error }));
    }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prisma: PrismaClient = req.app.locals.prisma;
        const { user } = prisma;

        const id = Number(req.params.id);

        const userData = await user.delete({
            where: {
                id
            }
        });

        if(userData == null) return next(createError(400, "Gagal menghapus user"));
        res.send({status: 200, message: "Berhasil menghapus user"});
    } catch (error) {
        return next(createError(400, { level: 'error', error: error }));
    }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prisma: PrismaClient = req.app.locals.prisma;
        const { user } = prisma;

        const id = Number(req.params.id);

        const userData = await user.findUnique({
            where: {
                id
            }
        });
        if(userData == null) return next(createError(404, "User tidak ditemukan"));

        // Check duplicate email
        if(req.body.email) {
            const emailExist = await user.findUnique({where: {email: req.body.email}});
            if(emailExist != null) return next(createError(400, "Email sudah digunakan"));
        }

        const updatedUserData = await user.update({
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
        if(updatedUserData == null) return next(createError(400, "Gagal update user"));

        res.send({
            status: 200,
            message: "Berhasil update user",
            data: {
                user: updatedUserData
            }
        });
    } catch (error) {
        return next(createError(400, { level: 'error', error: error }));
    }
};

export const detail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prisma: PrismaClient = req.app.locals.prisma;
        const { user } = prisma;

        const id = Number(req.params.id);

        const userData: TUserData = await user.findUnique({
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

        if(userData == null) return next(createError(404, "User tidak ditemukan"));

        if(userData.role != null) {
            // format data
            userData.role.permission = userData.role?.role_permission?.map((rp) => {
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
    } catch (error) {
        return next(createError(400, { level: 'error', error: error }));
    }
};

export const list = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const prisma: PrismaClient = req.app.locals.prisma;
        const { user } = prisma;

        const filter = removeNull({fullName: req.query.name, email: req.query.email, roleId: req.query.role_id});
        const page = Number(req.query.page) || 1;
        const perPage = Number(req.query.perPage) || 30;

        const userData = await user.findMany({
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

        const totalData = await user.count({
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
    } catch (error) {
        return next(createError(400, { level: 'error', error: error }));
    }
};

type TUserData = {
    id: number;
    fullName: string;
    email: string;
    phone: string | null;
    createdAt: Date;
    updatedAt: Date;
    role: {
        id: number;
        name: string;
        permission?: {
            id: number;
            name: string;
        }[];
        role_permission?: {
            permission: {
                id: number;
                name: string;
            }
        }[];
    } | null
} | null;