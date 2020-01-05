import getUserId from '../utils/getUserId';

const User = {
    email: {
        fragment: 'fragment userId on User { id }',
        resolve(parent, args, { request }, info) {
            const userId = getUserId(request, false);

            if (userId && userId === parent.id) {
                return parent.email;
            }
            return null;
        }
    },
    posts: {
        fragment: 'fragment userId on User { id }',
        resolve(parent, args, { prisma }, info) {
            return prisma.query.posts({
                where: {
                    published: true,
                    author: {
                        id: parent.id
                    }
                }
            })
        }
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
