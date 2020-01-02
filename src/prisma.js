import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466'
});

export { prisma as default };

// prisma.query.users(null, '{ id name posts { id title } }').then((data) => {
//     console.log('========= data', JSON.stringify(data[0], null, 4));
// });

// prisma.query.comments(null, '{ id text author { id name } }').then((data) => {
//     console.log('======== comments', JSON.stringify(data, null, 4));
// });

// prisma.mutation.createPost({
//     data: {
//         title: 'My new GraphQl post is live!',
//         body: 'you can find the new course here',
//         published: true,
//         author: {
//             connect: {
//                 id: 'ck4sh9qqk00kn0795xr6e2s2k'
//             }
//         }
//     }
// }, '{ id title body published }').then((data) => {
//     console.log(data)
//     return prisma.query.users(null, '{ id name posts { id title } }');
// }).then((data) => {
//     console.log(JSON.stringify(data, undefined, 2));
// });

// prisma.mutation
//     .updatePost(
//         {
//             data: {
//                 body: 'the very new body'
//             },
//             where: {
//                 id: 'ck4v3qztr017e0795b781obsn'
//             }
//         },
//         '{ id title body }'
//     )
//     .then((data) => {
//         console.log(data);
//         return prisma.query.posts(null, '{ id title body published }');
//     })
//     .then((data) => {
//         console.log(data);
//     })

// const createPostForUser = async (authorId, data) => {
//     const userExists = await prisma.exists.User({ id: authorId });

//     if (!userExists) {
//         throw new Error('User not found');
//     }

//     const post = await prisma.mutation.createPost({
//         data: {
//             ...data,
//             author: {
//                 connect: {
//                     id: authorId
//                 }
//             }
//         }
//     }, '{ author { id name email posts { id title published }} }')

//     return post.author;
// }

// createPostForUser('ck4sh9qqk00kn0795xr6e2s2k', {
//     title: 'Great books to read',
//     body: 'The war of art',
//     published: true
// }).then((user) => {
//     console.log(JSON.stringify(user, undefined, 2));
// }).catch((error) => {
//     console.error('createPostForUser error', error.message);
// });

// const updatePostForUser = async (postId, data) => {
//     const postExists = await prisma.exists.Post({ id: postId });

//     if (!postExists) {
//         throw new Error('Post not found');
//     }

//     const post = await prisma.mutation.updatePost({
//         data,
//         where: {
//             id: postId
//         }
//     }, '{ author { id name email posts { id title published} } }');

//     return post.author;
// }

// updatePostForUser('ck4v3qztr017e0795b781obsn', {
//     published: false
// }).then((data) => {
//     console.log('updatePostForUser', data);
// }).catch((error) => {
//     console.error('updatePostForUser error', error.message);
// });


// prisma.exists.User({
//     id: 'ck4sh9qqk00kn0795xr6e2s2k',
//     name: 'Vikra'
// }).then((exists) => {
//     console.log(exists);
// });