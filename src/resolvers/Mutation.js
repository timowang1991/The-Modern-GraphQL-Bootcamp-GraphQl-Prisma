import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getUserId from '../utils/getUserId';


const Mutation = {
    async createUser(parent, { data }, { prisma }, info) {
        if (data.password.length < 8) {
            throw new Error('Password must be 8 characters or longer.');
        }
        const password = await bcrypt.hash(data.password, 10);

        const user = await prisma.mutation.createUser({
            data: {
                ...data,
                password
            }
        });

        return {
            user,
            token: jwt.sign({ userId: user.id }, 'thisisasecret')
        }
    },
    deleteUser(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);

        return prisma.mutation.deleteUser({
            where: {
                id: userId
            }
        }, info);
    },
    updateUser(parent, { data }, { prisma, request }, info) {
        const userId = getUserId(request);

        return prisma.mutation.updateUser({
            where: {
                id: userId
            },
            data
        }, info);
    },
    async login(parent, { data }, { prisma }, info) {
        const user = await prisma.query.user({
            where: {
                email: data.email
            }
        });

        if (!user) {
            throw new Error('unable to login');
        }

        const isMatched = await bcrypt.compare(data.password, user.password);
        if (!isMatched) {
            throw new Error('unable to login')
        }

        return {
            user,
            token: jwt.sign({ userId: user.id }, 'thisisasecret')
        }
    },
    createPost(parent, { data }, { prisma, request }, info) {
        const userId = getUserId(request);

        return prisma.mutation.createPost({
            data: {
                title: data.title,
                body: data.body,
                published: data.published,
                author: {
                    connect: {
                        id: userId
                    }
                }
            },
        }, info);
    },
    async deletePost(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);
        
        const postExists = await prisma.exists.Post({
            id: args.id,
            author: {
                id: userId
            }
        });

        if (!postExists) {
            throw new Error('unable to delete post');
        }

        return prisma.mutation.deletePost({
            where: {
                id: args.id
            }
        });
    },
    async updatePost(parent, { id, data }, { prisma, request }, info) {
        const userId = getUserId(request);

        const postExists = await prisma.exists.Post({
            id,
            author: {
                id: userId
            }
        });

        if (!postExists) {
            throw new Error('unable to update post');
        }

        return prisma.mutation.updatePost({
            where: {
                id
            },
            data
        }, info);
    },
    createComment(parent, { data }, { prisma, request }, info) {
        const userId = getUserId(request);

        return prisma.mutation.createComment({
            data: {
                text: data.text,
                author: {
                    connect: {
                        id: userId,
                    }
                },
                post: {
                    connect: {
                        id: data.post
                    }
                }
            }
        }, info);
    },
    deleteComment(parent, args, { prisma }, info) {
        return prisma.mutation.deleteComment({
            where: {
                id: args.id
            }
        }, info);
    },
    updateComment(parent, { id, data }, { prisma }, info) {
        return prisma.mutation.updateComment({
            where: {
                id
            },
            data
        }, info);
    }
};

export { Mutation as default };
