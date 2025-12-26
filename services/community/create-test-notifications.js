const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestNotifications() {
  const userId = 'test-user-001';

  // Create 3 test notifications
  const notifications = [
    {
      userId,
      type: 'comment',
      title: 'Novo comentário no teu post',
      body: 'Alguém comentou no teu post "Dicas para reduzir desperdício"',
      link: '/posts/1',
      read: false,
    },
    {
      userId,
      type: 'reaction',
      title: 'Nova reação no teu post',
      body: 'Alguém reagiu 👍 no teu post "Menu de Natal"',
      link: '/posts/2',
      read: false,
    },
    {
      userId,
      type: 'group_join',
      title: 'Novo membro no teu grupo',
      body: 'Alguém juntou-se ao grupo "Restaurantes de Lisboa"',
      link: '/groups/3',
      read: false,
    },
  ];

  for (const notif of notifications) {
    await prisma.notification.create({
      data: notif,
    });
    console.log(`✅ Created: ${notif.title}`);
  }

  console.log('\n🎉 3 notificações de teste criadas para test-user-001!');

  const count = await prisma.notification.count({ where: { userId } });
  console.log(`📊 Total de notificações: ${count}`);
}

createTestNotifications()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
