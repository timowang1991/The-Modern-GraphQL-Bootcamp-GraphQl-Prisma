import getUserId from '../utils/getUserId';

const Query = {
    users(parents, args, { prisma }, info) {
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
        };

        if (args.query) {
            opArgs.where = {
                OR: [{
                    name_contains: args.query
                }]
            }
        }

        return prisma.query.users(opArgs, info);
    },
    posts(parents, args, { prisma }, info) {
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            where: {
                published: true
            }
        };
        if (args.query) {
            opArgs.where.OR = [{
                title_contains: args.query
            }, {
                body_contains: args.query
            }]
        }

        return prisma.query.posts(opArgs, info);
    },
    myPosts(parents, args, { prisma, request }, info) {
        const userId = getUserId(request);

        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            where: {
                author: {
                    id: userId
                }
            }
        }

        if (args.query) {
            opArgs.where.OR = [{
                title_contains: args.query
            }, {
                body_contains: args.query
            }]
        }

        return prisma.query.posts(opArgs, info);
    },
    comments(parent, args, { prisma }, info) {
        return prisma.query.comments({
            first: args.first,
            skip: args.skip,
            after: args.after,
        }, info);
    },
    async me(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);

        return prisma.query.user({
            where: {
                id: userId
            }
        }, info)
    },
    async post(parent, args, { prisma, request }, info) {
        const userId = getUserId(request, false);
        
        const posts = await prisma.query.posts({
            where: {
                id: args.id,
                OR: [
                    {
                        published: true
                    },
                    {
                        author: {
                            id: userId
                        }
                    }
                ]
            }
        }, info);

        if (posts.length === 0) {
            throw new Error('post not found');
        }

        return posts[0];
    }
};

export { Query as default };
