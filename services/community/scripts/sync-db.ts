import { PrismaClient } from '../generated/prisma';
import dotenv from 'dotenv';
import readline from 'readline';

// Carregar variáveis de ambiente
dotenv.config();

// Configurar clientes Prisma
// Cliente Local (Source)
const localPrisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});

// Cliente Produção (Target)
// NOTA: Vamos instanciar este apenas se tivermos o URL
const prodDbUrl = process.env.PROD_DATABASE_URL;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query: string): Promise<string> => {
    return new Promise((resolve) => {
        rl.question(query, resolve);
    });
};

async function main() {
    console.log('🔄 \x1b[36mSincronização de Dados: Local -> Produção\x1b[0m');
    console.log('Este script irá copiar os dados do teu ambiente LOCAL para a PRODUÇÃO.');
    console.log('⚠️  \x1b[31mATENÇÃO: Isto pode substituir dados existentes em produção!\x1b[0m\n');

    if (!process.env.DATABASE_URL) {
        console.error('❌ Erro: DATABASE_URL (Local) não está definida no .env');
        process.exit(1);
    }

    let targetUrl = prodDbUrl;

    if (!targetUrl) {
        console.log('⚠️  PROD_DATABASE_URL não encontrada no .env');
        targetUrl = await question('📝 Cola aqui a Connection URL da Railway (Postgres): ');
    }

    if (!targetUrl || !targetUrl.startsWith('postgresql://')) {
        console.error('❌ URL inválido. Deve começar por postgresql://');
        process.exit(1);
    }

    // Instanciar cliente de produção
    const prodPrisma = new PrismaClient({
        datasources: {
            db: {
                url: targetUrl,
            },
        },
    });

    try {
        console.log('\n📡 Conectando às bases de dados...');
        await localPrisma.$connect();
        await prodPrisma.$connect();
        console.log('✅ Conectado!');

        // 1. Grupos
        console.log('\n📦 Sincronizando Grupos...');
        const localGroups = await localPrisma.group.findMany();
        console.log(`   Encontrados ${localGroups.length} grupos localmente.`);

        for (const group of localGroups) {
            process.stdout.write(`   ↳ Processando grupo: ${group.name}... `);
            await prodPrisma.group.upsert({
                where: { id: group.id },
                update: {
                    name: group.name,
                    description: group.description,
                    type: group.type,
                    category: group.category,
                    createdBy: group.createdBy,
                    coverImage: group.coverImage
                },
                create: group
            });
            console.log('OK');
        }

        // 2. Perfis (Profiles)
        console.log('\n👤 Sincronizando Perfis...');
        const localProfiles = await localPrisma.profile.findMany();
        console.log(`   Encontrados ${localProfiles.length} perfis localmente.`);

        for (const profile of localProfiles) {
            process.stdout.write(`   ↳ Sincronizando perfil: ${profile.username || profile.userId}... `);
            await prodPrisma.profile.upsert({
                where: { userId: profile.userId },
                update: {
                    username: profile.username,
                    restaurantName: profile.restaurantName,
                    locationCity: profile.locationCity,
                    locationRegion: profile.locationRegion,
                    restaurantType: profile.restaurantType,
                    bio: profile.bio,
                    profilePhoto: profile.profilePhoto,
                    coverPhoto: profile.coverPhoto,
                    badges: profile.badges,
                    role: profile.role
                },
                create: profile
            });
            console.log('OK');
        }

        // 3. Posts
        console.log('\n📝 Sincronizando Posts...');
        const localPosts = await localPrisma.post.findMany();
        console.log(`   Encontrados ${localPosts.length} posts localmente.`);

        for (const post of localPosts) {
            // Verificar se o autor existe em prod (já devia, mas por segurança)
            const authorExists = await prodPrisma.profile.findUnique({ where: { userId: post.authorId } });
            if (!authorExists) {
                console.log(`   ⚠️  Saltando post ${post.id} pois o autor ${post.authorId} não existe em prod.`);
                continue;
            }

            await prodPrisma.post.upsert({
                where: { id: post.id },
                update: {
                    title: post.title,
                    body: post.body,
                    category: post.category,
                    tags: post.tags,
                    imageUrl: post.imageUrl, // AQUI ESTÁ A CHAVE: Preservar a imagem local!
                    status: post.status,
                    views: post.views,
                    likes: post.likes,
                    useful: post.useful,
                    thanks: post.thanks,
                    updatedAt: post.updatedAt
                },
                create: post
            });
            // Não logar cada post para não poluir
        }
        console.log(`   ✅ ${localPosts.length} posts sincronizados.`);

        // 4. Comentários (Opcional, mas bom para completar)
        console.log('\n💬 Sincronizando Comentários...');
        const localComments = await localPrisma.comment.findMany();
        for (const comment of localComments) {
            // Verificar dependências
            const postExists = await prodPrisma.post.findUnique({ where: { id: comment.postId } });
            if (!postExists) continue;

            await prodPrisma.comment.upsert({
                where: { id: comment.id },
                update: {
                    body: comment.body,
                    likes: comment.likes,
                    status: comment.status,
                    updatedAt: comment.updatedAt
                },
                create: comment
            });
        }
        console.log(`   ✅ ${localComments.length} comentários sincronizados.`);

        console.log('\n✨ \x1b[32mSincronização Concluída com Sucesso!\x1b[0m');
        console.log('Agora a tua base de dados de produção é um espelho da local.');

    } catch (error) {
        console.error('\n❌ \x1b[31mErro Fatal:\x1b[0m', error);
    } finally {
        await localPrisma.$disconnect();
        await prodPrisma.$disconnect();
        rl.close();
    }
}

main();
