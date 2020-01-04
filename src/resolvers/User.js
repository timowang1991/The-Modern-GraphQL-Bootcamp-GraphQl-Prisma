const User = {
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
