import { PrismaClient } from './generated/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // User ID de teste (mesmo do Community)
  const TEST_USER_ID = 'test-user-001';

  // Clear existing data
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.restaurantSettings.deleteMany({});
  await prisma.restaurant.deleteMany({});

  console.log('✅ Cleared existing data');

  // Create Restaurant
  const restaurant = await prisma.restaurant.create({
    data: {
      userId: TEST_USER_ID,
      name: 'Restaurante O Pátio',
      address: 'Rua das Flores, 123, Lisboa',
      cuisine: 'portuguesa',
      tables: 20,
      openHour: '12:00',
      closeHour: '23:00',
      monthlyCosts: 5000,
      staffCount: 8,
      averageTicket: 25.50,
      suppliers: 'Fornecedor A, Fornecedor B',
      onboardingCompleted: true
    }
  });

  console.log(`✅ Created restaurant: ${restaurant.name}`);

  // Create Settings
  const settings = await prisma.restaurantSettings.create({
    data: {
      restaurantId: restaurant.id,
      revenueGoal: 50000,
      foodCostTarget: 30,
      tableRotation: 3,
      segment: 'casual'
    }
  });

  console.log('✅ Created restaurant settings');

  // Create Products
  const productsData = [
    { name: 'Bacalhau à Brás', category: 'Main Course', price: 18.50, cost: 6.20, description: 'Bacalhau desfiado com batata palha', popularity: 5, sales: 156, totalRevenue: 2886 },
    { name: 'Polvo à Lagareiro', category: 'Main Course', price: 22.00, cost: 9.50, description: 'Polvo grelhado com batatas', popularity: 5, sales: 142, totalRevenue: 3124 },
    { name: 'Pizza Margherita', category: 'Main Course', price: 12.50, cost: 4.20, description: 'Pizza clássica italiana', popularity: 4, sales: 128, totalRevenue: 1600 },
    { name: 'Hambúrguer Gourmet', category: 'Main Course', price: 12.99, cost: 4.50, description: 'Hambúrguer artesanal com queijo', popularity: 5, sales: 98, totalRevenue: 1273 },
    { name: 'Salada Caesar', category: 'Salads', price: 9.99, cost: 2.80, description: 'Salada com alface e croutons', popularity: 4, sales: 87, totalRevenue: 869 },
    { name: 'Salmão Grelhado', category: 'Main Course', price: 18.00, cost: 7.50, description: 'Salmão fresco com legumes', popularity: 3, sales: 76, totalRevenue: 1368 },
    { name: 'Risotto de Cogumelos', category: 'Main Course', price: 15.00, cost: 5.00, description: 'Risotto cremoso', popularity: 3, sales: 71, totalRevenue: 1065 },
    { name: 'Bife Angus', category: 'Main Course', price: 24.00, cost: 10.00, description: 'Bife premium 300g', popularity: 5, sales: 65, totalRevenue: 1560 },
    { name: 'Pasta Carbonara', category: 'Pasta', price: 13.00, cost: 4.00, description: 'Pasta com molho carbonara', popularity: 4, sales: 54, totalRevenue: 702 },
    { name: 'Brownie com Gelado', category: 'Desserts', price: 6.00, cost: 1.80, description: 'Brownie de chocolate', popularity: 4, sales: 48, totalRevenue: 288 },
    { name: 'Sopa do Dia', category: 'Soups', price: 6.00, cost: 1.50, description: 'Sopa caseira', popularity: 3, sales: 35, totalRevenue: 210 },
    { name: 'Café Expresso', category: 'Drinks', price: 1.50, cost: 0.30, description: 'Café italiano', popularity: 5, sales: 200, totalRevenue: 300 }
  ];

  const products = [];
  for (const data of productsData) {
    const product = await prisma.product.create({ data: { ...data, restaurantId: restaurant.id } });
    products.push(product);
  }

  console.log(`✅ Created ${products.length} products`);

  // Create Orders (últimos 30 dias)
  const today = new Date();
  const orders = [];

  for (let i = 0; i < 50; i++) {
    const orderDate = new Date(today);
    orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 30));

    // Random products
    const numItems = Math.floor(Math.random() * 3) + 1; // 1-3 items per order
    const orderItems = [];
    let total = 0;

    for (let j = 0; j < numItems; j++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 2) + 1; // 1-2 quantity

      orderItems.push({
        productId: product.id,
        quantity,
        priceAtTime: product.price,
        costAtTime: product.cost
      });

      total += product.price * quantity;
    }

    const order = await prisma.order.create({
      data: {
        restaurantId: restaurant.id,
        total,
        status: 'completed',
        orderDate,
        items: {
          create: orderItems
        }
      }
    });

    orders.push(order);
  }

  console.log(`✅ Created ${orders.length} orders`);

  console.log('\n🎉 Seed completed successfully!');
  console.log(`\n📊 Summary:`);
  console.log(`   Restaurant: ${restaurant.name}`);
  console.log(`   Products: ${products.length}`);
  console.log(`   Orders: ${orders.length}`);
  console.log(`   Test User ID: ${TEST_USER_ID}`);
  console.log(`\n🔑 Use this token for testing (Community test-token endpoint)`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
