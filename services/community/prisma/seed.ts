import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample profiles first
  const profile1 = await prisma.profile.create({
    data: {
      userId: 'user-001',
      username: 'joaosilva',
      restaurantName: 'Restaurante Silva',
      locationCity: 'Porto',
      locationRegion: 'Norte',
      restaurantType: 'Tradicional',
      bio: 'Especializado em gastronomia portuguesa',
    },
  });

  const profile2 = await prisma.profile.create({
    data: {
      userId: 'user-002',
      username: 'mariasantos',
      restaurantName: 'Tascaria Santos',
      locationCity: 'Algarve',
      locationRegion: 'Algarve',
      restaurantType: 'Casual',
      bio: 'Atendimento rápido e qualidade',
    },
  });

  const profile3 = await prisma.profile.create({
    data: {
      userId: 'user-003',
      username: 'pedrooliveira',
      restaurantName: 'O Peixe Fresco',
      locationCity: 'Lisboa',
      locationRegion: 'Lisboa & Vale do Tejo',
      restaurantType: 'Especializado',
      bio: 'Frutos do mar frescos diariamente',
    },
  });

  console.log('✅ Created 3 sample profiles');

  // Create admin profile for groups
  const adminProfile = await prisma.profile.create({
    data: {
      userId: 'admin-001',
      username: 'admin',
      restaurantName: 'iamenu Admin',
      role: 'admin',
    },
  }).catch(() => null);

  // Create sample posts
  const post1 = await prisma.post.create({
    data: {
      authorId: 'user-001', // Sample user ID
      title: 'Como reduzi €400/mês em fornecedores de cerveja',
      body: `Há 3 meses descobri que estava a pagar €80/barril de Sagres quando a média de mercado era €76.

Mudei para um fornecedor recomendado aqui na comunidade e agora pago €72/barril (negociação coletiva com 10 restaurantes).

**Savings:** €8/barril × 15 barris/mês = **€120/mês só em cerveja!**

Apliquei a mesma táctica a outros fornecimentos e agora poupo **€400/mês total**.

Dica: Sempre pedir 3 orçamentos antes de decidir!`,
      category: 'Gestão',
      tags: JSON.stringify(['fornecedores', 'poupança', 'negociação']),
      views: 234,
      likes: 45,
      useful: 32,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      authorId: 'user-002',
      title: '3 truques para servir turistas 2x mais rápido',
      body: `Depois de 5 anos no Algarve, descobri estas técnicas:

**1. Menu com fotos grandes** - Turistas decidem 50% mais rápido
**2. QR Code em 3 línguas** - Reduz perguntas "what is bacalhau?" em 80%
**3. Sugestões do Chef destacadas** - 70% escolhem sugestões (menos indecisão)

Resultado: Servimos mesmas 5 mesas mas com 30% menos stress!

Alguém tem outras dicas?`,
      category: 'Operações',
      tags: JSON.stringify(['turismo', 'eficiência', 'algarve']),
      views: 189,
      likes: 28,
      useful: 41,
    },
  });

  const post3 = await prisma.post.create({
    data: {
      authorId: 'user-003',
      title: 'Instagram cresceu 200 seguidores/mês (zero budget)',
      body: `Sem gastar €1 em ads, cresci Instagram de 200 para 800 seguidores em 3 meses.

**O que fiz:**
- Postei 3x/semana (terça, quinta, sábado às 19h)
- Fotos dos pratos + stories bastidores
- Respondi TODOS os comentários em <1h
- Colaborei com 2 influencers locais (troca: refeição grátis por post)

**Resultado:** Reservas via Instagram: 0 → 15/mês (€600 faturação extra!)

Próximo: TikTok? Alguém já testou?`,
      category: 'Marketing',
      tags: JSON.stringify(['instagram', 'social-media', 'crescimento']),
      views: 156,
      likes: 22,
      useful: 18,
    },
  });

  console.log('✅ Created 3 sample posts');
  console.log(`   - Post 1: ${post1.id}`);
  console.log(`   - Post 2: ${post2.id}`);
  console.log(`   - Post 3: ${post3.id}`);

  // Create 15 groups (5 regional + 10 thematic)
  console.log('\n🌱 Seeding groups...');

  // Regional Groups (5) - Focused on Continental Portugal
  const regionalGroups = [
    {
      name: 'Algarve',
      description: 'Restauradores do Algarve - Turismo, praias e gastronomia regional',
      category: 'region',
      type: 'public',
      createdBy: 'admin-001'
    },
    {
      name: 'Lisboa & Vale do Tejo',
      description: 'Restauração em Lisboa e Vale do Tejo - Capital, turismo urbano, diversidade e tradição ribatejana',
      category: 'region',
      type: 'public',
      createdBy: 'admin-001'
    },
    {
      name: 'Norte',
      description: 'Restauradores do Norte - Porto, Minho, Trás-os-Montes, Douro - Tradição, inovação, vinhos e gastronomia nortenha',
      category: 'region',
      type: 'public',
      createdBy: 'admin-001'
    },
    {
      name: 'Centro',
      description: 'Restauração no Centro - Coimbra, Beira Interior, Beira Litoral - Tradições académicas, produtos da serra',
      category: 'region',
      type: 'public',
      createdBy: 'admin-001'
    },
    {
      name: 'Alentejo',
      description: 'Restauradores do Alentejo - Turismo rural, produtos locais, vinhos e gastronomia alentejana',
      category: 'region',
      type: 'public',
      createdBy: 'admin-001'
    }
  ];

  // Thematic Groups (10)
  const thematicGroups = [
    {
      name: 'Turismo & Hotelaria',
      description: 'Restaurantes em hotéis, resorts e zonas turísticas - Desafios sazonalidade, múltiplas línguas',
      category: 'theme',
      type: 'public',
      createdBy: 'admin-001'
    },
    {
      name: 'Restauração Rápida',
      description: 'Fast food, take-away, delivery - Velocidade, eficiência operacional',
      category: 'theme',
      type: 'public',
      createdBy: 'admin-001'
    },
    {
      name: 'Fine Dining',
      description: 'Alta gastronomia, estrelas Michelin, experiências exclusivas',
      category: 'theme',
      type: 'public',
      createdBy: 'admin-001'
    },
    {
      name: 'Cafés & Pastelarias',
      description: 'Pastelaria portuguesa, cafés tradicionais, brunch - Pastéis, bolos, tradição',
      category: 'theme',
      type: 'public',
      createdBy: 'admin-001'
    },
    {
      name: 'Vegetariano & Vegano',
      description: 'Restauração plant-based, alternativas sustentáveis, tendências verdes',
      category: 'theme',
      type: 'public',
      createdBy: 'admin-001'
    },
    {
      name: 'Gestão & Finanças',
      description: 'Controlo custos, margens, pricing, gestão stock - Dores financeiras restauração',
      category: 'theme',
      type: 'public',
      createdBy: 'admin-001'
    },
    {
      name: 'Marketing Digital',
      description: 'Instagram, TikTok, Google, reservas online - Atrair clientes era digital',
      category: 'theme',
      type: 'public',
      createdBy: 'admin-001'
    },
    {
      name: 'Recursos Humanos',
      description: 'Recrutamento, retenção staff, formação, turnover - Gerir equipas restauração',
      category: 'theme',
      type: 'public',
      createdBy: 'admin-001'
    },
    {
      name: 'Sustentabilidade',
      description: 'Zero desperdício, compostagem, embalagens eco, produtos locais',
      category: 'theme',
      type: 'public',
      createdBy: 'admin-001'
    },
    {
      name: 'Tecnologia & IA',
      description: 'Automação, IA para menus/reservas, POS modernos, inovação tech',
      category: 'theme',
      type: 'public',
      createdBy: 'admin-001'
    }
  ];

  // Insert all groups
  const allGroups = [...regionalGroups, ...thematicGroups];

  for (const groupData of allGroups) {
    await prisma.group.create({ data: groupData });
  }

  console.log(`✅ Created 15 groups`);
  console.log(`   - Regional: 5 (Algarve, Lisboa & Vale do Tejo, Norte, Centro, Alentejo)`);
  console.log(`   - Thematic: 10 (Turismo, Fast Food, Fine Dining, Cafés, Vegano, Gestão, Marketing, RH, Sustentabilidade, Tech)`);

  console.log('\n🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
