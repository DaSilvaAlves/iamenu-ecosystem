import { PrismaClient } from '../../generated/prisma';

async function verify() {
    const remoteUrl = "postgresql://postgres:jMHJNsoKMsXCjuuHNJTouoWqrvzgYyRn@gondola.proxy.rlwy.net:59722/railway";
    const prisma = new PrismaClient({
        datasources: { db: { url: remoteUrl } },
    });

    try {
        const postCount = await prisma.post.count();
        const asdfgh = await prisma.post.findFirst({ where: { title: { contains: 'asdfgh' } } });
        const profileCount = await prisma.profile.count();

        console.log(`📊 Remote DB Scan:`);
        console.log(`- Total Posts: ${postCount}`);
        console.log(`- Total Profiles: ${profileCount}`);
        console.log(`- 'asdfgh' Post: ${asdfgh ? 'EXISTS (ID: ' + asdfgh.id + ')' : 'MISSING'}`);

        if (asdfgh) {
            console.log(`- 'asdfgh' Author: ${asdfgh.authorId}`);
        }

    } catch (error) {
        console.error('❌ Remote DB Check Failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

verify();
