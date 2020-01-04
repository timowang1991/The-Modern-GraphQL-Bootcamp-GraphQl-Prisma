const Post = {
    comments({ id: postId }, args, { prisma }, info) {
        return prisma.query.comments({
            where: {
                post: {
                    id: postId
                }
            }
        }, info);
    }
};

export { Post as default };
