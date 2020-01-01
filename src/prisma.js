import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466'
});

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