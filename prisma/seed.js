/* eslint-disable @typescript-eslint/no-var-requires */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

function generatePasswordHash(plainTextPassword) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(plainTextPassword, 10, function (err, hash) {
            if (err) {
                return reject(err);
            }
            return resolve(hash);
        });
    });
}

async function main() {
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
        data: permData.map((d) => {
            return {role_id: role.id, perm_id: d.id};
        })
    });

    // Users
    // Generate password hash
    const password = await generatePasswordHash('admin');
    const user = await prisma.user.upsert({
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

    user.plaintextpassword = 'admin';

    console.log(user);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });