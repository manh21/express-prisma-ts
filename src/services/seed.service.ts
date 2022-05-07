import { PrismaClient } from '@prisma/client';
import { generatePasswordHash } from '../services/auth/password.service';

export default async (prisma: PrismaClient) => {
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
    ];

    permissions.forEach(async (el) => {
        try {
            await prisma.permission.upsert({
                where: { name: el },
                update: {},
                create: { name: el, description: '' }
            });
        } catch (error) {
            console.error(error);
        }
    });

    // Roles
    const permData = await prisma.permission.findMany();
    const role = await prisma.role.upsert({
        where: {},
        update: {},
        create: { name: 'Admin', description: '' }
    });

    await prisma.role_permission.createMany({
        data: permData.map((d: any) => {
            return {role_id: role.id, perm_id: d.id};
        })
    });

    // Users
    // Generate password hash
    const password = await generatePasswordHash('admin');

    await prisma.user.upsert({
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
};