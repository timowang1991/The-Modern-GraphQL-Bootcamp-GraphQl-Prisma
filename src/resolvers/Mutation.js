import uuidv4 from 'uuid/v4';

const Mutation = {
    async createUser(parent, args, { prisma }, info) {
        return prisma.mutation.createUser({ data: args.data }, info);
    },
    async deleteUser(parent, args, { prisma }, info) {
        return prisma.mutation.deleteUser({
            where: {
                id: args.id
            }
        });
    },
    async updateUser(parent, { id, data }, { prisma }, info) {
        return prisma.mutation.updateUser({
            where: {
                id
            },
            data
        }, info);
    },
    createPost(parent, { data }, { prisma }, info) {
        return prisma.mutation.createPost({
            data: {
                title: data.title,
                body: data.body,
                published: data.published,
                author: {
                    connect: {
                        id: data.author
                    }
                }
            },
        }, info);
    },
    deletePost(parent, args, { db, pubsub }, info) {
        const postIndex = db.posts.findIndex(post => post.id === args.id);
        if (postIndex === -1) {
            throw new Error('Post not found');
        }

        const [deletePost] = db.posts.splice(postIndex, 1);

        db.comments = db.comments.filter(comment => comment.post !== args.id);

        if (deletePost.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'DELETED',
                    data: deletePost
                }
            });
        }

        return deletePost;
    },
    updatePost(parent, { id, data }, { db, pubsub }, info) {
        const post = db.posts.find(post => post.id === id);
        const originalPost = { ...post };
        if (!post) {
            throw new Error('Post not found');
        }

        if (typeof data.title === 'string') {
            post.title = data.title;
        }

        if (typeof data.body === 'string') {
            post.body = data.body;
        }

        if (typeof data.published === 'boolean') {
            post.published = data.published;
            if (originalPost.published && !post.published) {
                // deleted
                pubsub.publish('post', {
                    post: {
                        mutation: 'DELETED',
                        data: originalPost
                    }
                });
            } else if (!originalPost.published && post.published) {
                // created
                pubsub.publish('post', {
                    post: {
                        mutation: 'CREATED',
                        data: post
                    }
                });
            }
        } else if (post.published) {
            // updated
            pubsub.publish('post', {
                post: {
                    mutation: 'UPDATED',
                    data: post
                }
            });
        }

        return post;
    },
    createComment(parent, args, { db, pubsub }, info) {
        const userExists = db.users.some(user => user.id === args.data.author);
        if (!userExists) {
            throw new Error('User not found');
        }

        const postExists = db.posts.some(post => post.id === args.data.post && post.published);
        if (!postExists) {
            throw new Error('Post not found');
        }

        const comment = {
            id: uuidv4(),
            ...args.data
        };

        db.comments.push(comment);
        pubsub.publish(`comment ${args.data.post}`, {
            comment: {
                mutation: 'CREATED',
                data: comment
            }
        });

        return comment;
    },
    deleteComment(parent, args, { db, pubsub }, info) {
        const commentIndex = db.comments.findIndex(comment => comment.id === args.id);
        if (commentIndex === -1) {
            throw new Error('Comment not found');
        }

        const [deleteComment] = db.comments.splice(commentIndex, 1);
        pubsub.publish(`comment ${deleteComment.post}`, {
            comment: {
                mutation: 'DELETED',
                data: deleteComment
            }
        });
        return deleteComment;
    },
    updateComment(parent, { id, data }, { db, pubsub }, info) {
        const comment = db.comments.find(comment => comment.id === id);
        if (!comment) {
            throw new Error('Comment not found');
        }

        if (typeof data.text === 'string') {
            comment.text = data.text;
        }

        pubsub.publish(`comment ${comment.post}`, {
            comment: {
                mutation: 'UPDATED',
                data: comment
            }
        });

        return comment;
    }
};

export { Mutation as default };
