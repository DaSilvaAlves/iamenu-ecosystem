import { PrismaClient } from '@prisma/client-marketplace';

const prisma = new PrismaClient();

const suppliersData = [
  {
    id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    userId: 'user-frescomar',
    companyName: 'FrescoMar Lda.',
    logoUrl: '/logos/frescomar.png',
    description: 'Especialistas em peixe e marisco fresco, entregue diariamente da nossa lota para o seu restaurante.',
    categories: ['Peixe e Marisco'],
    locationCity: 'Lisboa & Setúbal',
    locationRegion: 'Lisboa',
    nationalDelivery: true,
    contactEmail: 'comercial@frescomar.pt',
    minOrder: 20.0,
    certifications: ['HACCP', 'ISO 9001'],
    ratingAvg: 4.9,
    reviewCount: 88,
    verified: true,
  },
  {
    id: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1',
    userId: 'user-hortabio',
    companyName: 'Horta Bio Nacional',
    logoUrl: '/logos/hortabio.png',
    description: 'Agricultura biológica de produtores certificados. Frescos & vegetais da época, com sabor autêntico.',
    categories: ['Frescos & Vegetais'],
    locationCity: 'Todo o País',
    locationRegion: 'Nacional',
    nationalDelivery: true,
    contactEmail: 'encomendas@hortabio.pt',
    certifications: ['Certificação Bio PT-BIO-03'],
    ratingAvg: 4.7,
    reviewCount: 65,
    verified: true,
  },
  {
    id: 'c3d4e5f6-a7b8-9012-3456-7890abcdef2',
    userId: 'user-lusapack',
    companyName: 'LusaPack',
    logoUrl: '/logos/lusapack.png',
    description: 'Soluções de embalagens take-away e packaging para a restauração. Opções sustentáveis disponíveis.',
    categories: ['Embalagens'],
    locationCity: 'Todo o País',
    locationRegion: 'Nacional',
    nationalDelivery: true,
    contactEmail: 'vendas@lusapack.com',
    ratingAvg: 4.5,
    reviewCount: 43,
    verified: false,
  },
  {
    id: 'd4e5f6a7-b8c9-0123-4567-890abcdef3',
    userId: 'user-carnedomonte',
    companyName: 'Carne do Monte',
    logoUrl: '/logos/carnedomonte.png',
    description: 'Carnes maturadas e charcutaria de origem DOP. Qualidade e tradição para o seu menu.',
    categories: ['Carnes e Charcutaria'],
    locationCity: 'Norte e Centro',
    locationRegion: 'Norte',
    nationalDelivery: false,
    contactEmail: 'geral@carnedomonte.pt',
    certifications: ['Origem DOP'],
    ratingAvg: 4.8,
    reviewCount: 72,
    verified: true,
  },
];

const productsData = [
  {
    id: 'prod-001-carne',
    name: 'Bife da Vazia Maturado 30 dias',
    category: 'Carnes',
    subcategory: 'Vaca',
    unit: 'kg',
    description: 'Carne de vaca maturada por 30 dias, suculenta e saborosa, ideal para grelhados.',
    imageUrl: '/products/bife_vazia.png',
  },
  {
    id: 'prod-002-carne',
    name: 'Secretos de Porco Preto',
    category: 'Carnes',
    subcategory: 'Porco',
    unit: 'kg',
    description: 'Secretos de porco preto de qualidade superior, perfeitos para assar ou grelhar.',
    imageUrl: '/products/secretos_porco.png',
  },
  {
    id: 'prod-003-peixe',
    name: 'Robalo Fresco Selvagem',
    category: 'Peixe',
    subcategory: 'Peixe Fresco',
    unit: 'kg',
    description: 'Robalo selvagem apanhado no dia, ideal para pratos de peixe fresco.',
    imageUrl: '/products/robalo.png',
  },
  {
    id: 'prod-004-peixe',
    name: 'Camarão Tigre Gigante',
    category: 'Marisco',
    subcategory: 'Camarão',
    unit: 'kg',
    description: 'Camarão tigre gigante, perfeito para grelhados ou pratos de marisco.',
    imageUrl: '/products/camarao_tigre.png',
  },
  {
    id: 'prod-005-vegetal',
    name: 'Tomate Coração de Boi Biológico',
    category: 'Vegetais',
    subcategory: 'Tomate',
    unit: 'kg',
    description: 'Tomate biológico da variedade Coração de Boi, com sabor intenso e textura carnuda.',
    imageUrl: '/products/tomate_bio.png',
  },
  {
    id: 'prod-006-vegetal',
    name: 'Alface Frisada Biológica',
    category: 'Vegetais',
    subcategory: 'Folhas Verdes',
    unit: 'unidade',
    description: 'Alface frisada biológica, fresca e crocante, ideal para saladas.',
    imageUrl: '/products/alface_bio.png',
  },
  {
    id: 'prod-007-embalagem',
    name: 'Caixa Take-Away Compostável',
    category: 'Embalagens',
    subcategory: 'Take-away',
    unit: 'unidade',
    description: 'Caixa compostável para refeições take-away, amiga do ambiente.',
    imageUrl: '/products/caixa_compostavel.png',
  },
  {
    id: 'prod-008-embalagem',
    name: 'Saco de Papel Kraft Biodegradável',
    category: 'Embalagens',
    subcategory: 'Sacos',
    unit: 'unidade',
    description: 'Saco de papel kraft biodegradável, resistente e ideal para transporte.',
    imageUrl: '/products/saco_kraft.png',
  },
];

const supplierProductsData = [
  // Carne do Monte (id: 'd4e5f6a7-b8c9-0123-4567-890abcdef3')
  {
    supplierId: 'd4e5f6a7-b8c9-0123-4567-890abcdef3',
    productId: 'prod-001-carne',
    price: 35.50,
    unit: 'kg',
    minQuantity: 1,
  },
  {
    supplierId: 'd4e5f6a7-b8c9-0123-4567-890abcdef3',
    productId: 'prod-002-carne',
    price: 22.00,
    unit: 'kg',
    minQuantity: 1,
  },
  // FrescoMar Lda. (id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef')
  {
    supplierId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    productId: 'prod-003-peixe',
    price: 28.90,
    unit: 'kg',
    minQuantity: 0.5,
  },
  {
    supplierId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    productId: 'prod-004-peixe',
    price: 45.00,
    unit: 'kg',
    minQuantity: 0.2,
  },
  // Horta Bio Nacional (id: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1')
  {
    supplierId: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1',
    productId: 'prod-005-vegetal',
    price: 4.80,
    unit: 'kg',
    minQuantity: 2,
  },
  {
    supplierId: 'b2c3d4e5-f6a7-8901-2345-67890abcdef1',
    productId: 'prod-006-vegetal',
    price: 1.50,
    unit: 'unidade',
    minQuantity: 5,
  },
  // LusaPack (id: 'c3d4e5f6-a7b8-9012-3456-7890abcdef2')
  {
    supplierId: 'c3d4e5f6-a7b8-9012-3456-7890abcdef2',
    productId: 'prod-007-embalagem',
    price: 0.50,
    unit: 'unidade',
    minQuantity: 100,
  },
  {
    supplierId: 'c3d4e5f6-a7b8-9012-3456-7890abcdef2',
    productId: 'prod-008-embalagem',
    price: 0.20,
    unit: 'unidade',
    minQuantity: 200,
  },
];

async function main() {
  console.log('🌱 Seeding Marketplace data...');

  // Seed Suppliers
  console.log('🌱 Seeding Marketplace suppliers...');
  for (const supplier of suppliersData) {
    await prisma.supplier.upsert({
      where: { id: supplier.id },
      update: {},
      create: supplier,
    });
  }
  console.log(`✅ Seeded ${suppliersData.length} suppliers.`);

  // Seed Products
  console.log('🌱 Seeding Marketplace products...');
  for (const product of productsData) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {},
      create: product,
    });
  }
  console.log(`✅ Seeded ${productsData.length} products.`);

  // Seed SupplierProducts
  console.log('🌱 Seeding Marketplace supplier products...');
  for (const sp of supplierProductsData) {
    await prisma.supplierProduct.upsert({
      where: {
        id: `${sp.supplierId}-${sp.productId}` // Create a unique ID for upsert logic
      },
      update: {
        price: sp.price,
        unit: sp.unit,
        minQuantity: sp.minQuantity,
      },
      create: {
        id: `${sp.supplierId}-${sp.productId}`, // Custom ID for upsert
        supplierId: sp.supplierId,
        productId: sp.productId,
        price: sp.price,
        unit: sp.unit,
        minQuantity: sp.minQuantity,
      },
    });
  }
  console.log(`✅ Seeded ${supplierProductsData.length} supplier products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });