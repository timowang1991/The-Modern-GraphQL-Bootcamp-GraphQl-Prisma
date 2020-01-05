import getUserId from '../utils/getUserId';

const Query = {
    users(parents, args, { prisma }, info) {
        // if (!args.query) {
        //     return db.users;
        // }
        // return db.users.filter((user) => {
        //     return user.name.toLowerCase().includes(args.query.toLowerCase());
        // });
        const opArgs = {};

        if (args.query) {
            opArgs.where = {
                OR: [{
                    name_contains: args.query
                }, {
                    email_contains: args.query
                }]
            }
        }

        return prisma.query.users(opArgs, info);
    },
    posts(parents, args, { prisma }, info) {
        // if (!args.query) {
        //     return db.posts;
        // }
        // return db.posts.filter((post) => {
        //     return post.title.toLowerCase().includes(args.query.toLowerCase())
        //         || post.body.toLowerCase().includes(args.query.toLowerCase());
        // });
        const opArgs = {};
        if (args.query) {
            opArgs.where = {
                OR: [{
                    title_contains: args.query
                }, {
                    body_contains: args.query
                }]
            }
        }

        return prisma.query.posts(opArgs, info);
    },
    comments(parents, args, { prisma }, info) {
        return prisma.query.comments(null, info);
    },
    me() {
        return {
            id: '123098',
            name: 'Mike',
            email: 'mike@example.com',
            age: 28
        };
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
