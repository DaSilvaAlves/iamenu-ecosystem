import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding production database for iaMenu Ecosystem...');

    const userId = 'test-user-001'; // ID usado pelo frontend por defeito

    // 1. Criar ou Atualizar Perfil do Utilizador
    const profile = await prisma.profile.upsert({
        where: { userId },
        update: {
            username: 'ResTest',
            restaurantName: 'ResTest Gourmet',
            bio: 'Focado em revolucionar a restauração com IA. Especialista em gestão e eficiência operacional.',
            locationCity: 'Albufeira',
            locationRegion: 'Algarve',
            restaurantType: 'Restaurante Tradicional',
            role: 'admin',
            badges: JSON.stringify(['first-post', 'first-comment', 'reactions-10', 'active-member'])
        },
        create: {
            userId,
            username: 'ResTest',
            restaurantName: 'ResTest Gourmet',
            bio: 'Focado em revolucionar a restauração com IA. Especialista em gestão e eficiência operacional.',
            locationCity: 'Albufeira',
            locationRegion: 'Algarve',
            restaurantType: 'Restaurante Tradicional',
            role: 'admin',
            badges: JSON.stringify(['first-post', 'first-comment', 'reactions-10', 'active-member'])
        },
    });

    console.log(`✅ Perfil configurado para: ${profile.username}`);

    // 2. Criar Grupos (se não existirem)
    console.log('🌱 Configurando grupos...');
    const groups = [
        { name: 'Algarve', description: 'Restauradores do Algarve', category: 'region' },
        { name: 'Gestão & Finanças', description: 'Controlo de custos e margens', category: 'theme' },
        { name: 'Marketing Digital', description: 'Atrair clientes na era digital', category: 'theme' }
    ];

    const createdGroups = [];
    for (const g of groups) {
        const group = await prisma.group.upsert({
            where: { name: g.name },
            update: {},
            create: { ...g, createdBy: userId, type: 'public' }
        });
        createdGroups.push(group);
    }

    // 3. Criar Posts para o utilizador
    console.log('🌱 Criando posts de demonstração...');

    // Limpar posts antigos do utilizador de teste para evitar duplicados na demo
    await prisma.post.deleteMany({ where: { authorId: userId } });

    const post1 = await prisma.post.create({
        data: {
            authorId: userId,
            groupId: createdGroups[1].id,
            title: 'Como reduzi €400/mês em fornecedores de cerveja',
            body: 'Há 3 meses descobri que estava a pagar €80/barril quando a média era €76. Mudei para negociação coletiva e agora poupo imenso!',
            category: 'Gestão',
            tags: JSON.stringify(['fornecedores', 'poupança']),
            views: 234,
            likes: 45,
            useful: 32,
        },
    });

    const post2 = await prisma.post.create({
        data: {
            authorId: userId,
            groupId: createdGroups[0].id,
            title: '3 truques para servir turistas 2x mais rápido',
            body: 'Técnicas que usei no Algarve: Menu com fotos, QR Code em 3 línguas e sugestões destacadas.',
            category: 'Operações',
            tags: JSON.stringify(['turismo', 'eficiência']),
            views: 189,
            likes: 28,
            useful: 41,
        },
    });

    console.log('✅ Posts criados com sucesso.');

    // 4. Criar Reações (para gerar XP)
    console.log('🌱 Gerando reações e interações...');
    // Simular algumas reações de outros utilizadores
    const otherUsers = ['user-002', 'user-003', 'user-004'];
    for (const otherId of otherUsers) {
        await prisma.reaction.createMany({
            data: [
                { userId: otherId, targetType: 'post', targetId: post1.id, reactionType: 'like' },
                { userId: otherId, targetType: 'post', targetId: post2.id, reactionType: 'useful' }
            ],
            skipDuplicates: true
        });
    }

    console.log('\n🎉 Sincronização de produção concluída!');
    console.log('🚀 O teu perfil "ResTest" está pronto para a imersão.');
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
