import { PrismaClient } from '@prisma/client';

/**
 * TRUTH SEEKER - Data Parity Script
 * Clones data from LOCAL database to PRODUCTION (Railway)
 */

async function sync() {
    const localUrl = "postgresql://postgres:postgres@localhost:5432/iamenu";
    const remoteUrl = "postgresql://postgres:jMHJNsoKMsXCjuuHNJTouoWqrvzgYyRn@gondola.proxy.rlwy.net:59722/railway";

    console.log('🔍 Truth Seeker: Starting data synchronization...');

    const localPrisma = new PrismaClient({
        datasources: { db: { url: localUrl } },
    });

    const remotePrisma = new PrismaClient({
        datasources: { db: { url: remoteUrl } },
    });

    try {
        // 1. Fetch data from Local
        console.log('📡 Reading data from Localhost...');
        const profiles = await localPrisma.profile.findMany();
        const groups = await localPrisma.group.findMany();
        const posts = await localPrisma.post.findMany();
        const comments = await localPrisma.comment.findMany();
        const reactions = await localPrisma.reaction.findMany();

        console.log(`✅ Found: ${profiles.length} profiles, ${groups.length} groups, ${posts.length} posts, ${reactions.length} reactions.`);

        // 2. Clear Remote Data (Order matters for constraints)
        console.log('🗑️ Clearing Railway production data...');
        await remotePrisma.reaction.deleteMany();
        await remotePrisma.comment.deleteMany();
        await remotePrisma.post.deleteMany();
        await remotePrisma.groupMembership.deleteMany();
        await remotePrisma.group.deleteMany();
        await remotePrisma.profile.deleteMany();

        // 3. Insert into Remote
        console.log('🚀 Pushing data to Railway...');

        // Profiles
        for (const p of profiles) {
            await remotePrisma.profile.create({ data: p });
        }
        console.log(`   - Profiles synced`);

        // Groups
        for (const g of groups) {
            await remotePrisma.group.create({ data: g });
        }
        console.log(`   - Groups synced`);

        // Posts
        for (const po of posts) {
            await remotePrisma.post.create({ data: po });
        }
        console.log(`   - Posts synced`);

        // Comments
        for (const c of comments) {
            await remotePrisma.comment.create({ data: c });
        }
        console.log(`   - Comments synced`);

        // Reactions
        for (const r of reactions) {
            await remotePrisma.reaction.create({ data: r });
        }
        console.log(`   - Reactions synced`);

        console.log('\n✨ TRUTH ACHIEVED: Production is now a mirror of Localhost.');

        // Final Verification check for identifying data
        const asdfghPost = await remotePrisma.post.findFirst({ where: { title: { contains: 'asdfgh' } } });
        if (asdfghPost) {
            console.log(`💎 CONFIRMED: Post "asdfgh" is now LIVE in production.`);
        }

    } catch (error) {
        console.error('❌ Truth Seeker Error:', error);
    } finally {
        await localPrisma.$disconnect();
        await remotePrisma.$disconnect();
    }
}

sync();
