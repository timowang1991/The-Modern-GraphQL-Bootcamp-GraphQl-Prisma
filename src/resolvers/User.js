import getUserId from '../utils/getUserId';

const User = {
    email(parent, args, { request }, info) {
        const userId = getUserId(request, false);

        if (userId && userId === parent.id) {
            return parent.email;
        }
        return null;
    },
    comments({ id: userId }, args, { prisma }, info) {
        return prisma.query.comments({
            where: {
                author: {
                    id: userId
                }
            }
        }, info);
    }
};

export { User as default };
