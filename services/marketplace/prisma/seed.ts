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
  // Products for Collective Bargains
  {
    id: 'prod-009-azeite',
    name: 'Azeite Virgem Extra 5L',
    category: 'Óleos e Gorduras',
    subcategory: 'Azeite',
    unit: 'litros',
    description: 'Azeite virgem extra de alta qualidade, ideal para uso profissional.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOa2ANFTnZDwoAbOvLPqhryEIw6p4Q35uEshghBFrEgHX65YvBfdXMc_bRYIEIxCVUNMhLwDMzAlMW3HtBhf1RGqaBxqt7SXbG1UzEc73bVqnwFyIjLdvsVKohn5yN8enLo_lvYqkhNha-nFEndTu-WB2fPr4M_rChJiXC-jy7X8FL8bgKuI6vYbFpQTzg5leNVXVTXTvi_kXlo3hrc10abyyjxPTDT92ewxWTd181hwSWlkd23czFrfnP1Uj5l_jNkF0ZTIsZTnBA',
  },
  {
    id: 'prod-010-leite',
    name: 'Leite UHT Meio Gordo 6x1L',
    category: 'Laticínios',
    subcategory: 'Leite',
    unit: 'pacote',
    description: 'Pack de 6 litros de leite UHT meio gordo, ideal para uso diário em restauração.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqRfwPwMr0T-3857Yz0bgn4a14bpnuZTPcKK7sxfdXJPbpVe3KH0q_Mydh0vjhtWAqaOxTsD6J5KZD2AQBW3bCNQ7az3uKOYzRM-00oZUnfiVRTxsXb0UA5XBl-4gfoghdqNWV7SAH836qZcw-ILAecRlISGiSfNINw4MukLWdBsyrfAS7lyEGwCcyo8ss548a9OWAAHKk-vUpC5c6MJyV-lriNNMrU5rs7ykwmYjhyaXK1XgMXw',
  },
  {
    id: 'prod-011-arroz',
    name: 'Arroz Agulha Extra 5kg',
    category: 'Mercearia',
    subcategory: 'Arroz',
    unit: 'kg',
    description: 'Saco de arroz agulha extra de 5kg, perfeito para acompanhamentos.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbwc3ZfJvOEigFEsv1b9MySK8bXANXGTOXSmGDE16eTNbEAEujdur_eV8LhIM2WaQEHMZdRFDD3OcLzxNEDfLisOfpQBYbcE7juPoQz8_qkBnT1aj8bF79dglSg_e1RIGte43Me9vA0h7YSttvNAcJfhoQxc4WmaAWQBsf6kHmAkh74mMdur_85fEF0T5eHEsv1b9MySK8bXANXGTOXSmGDE16eTNbEAEujdur_eV8LhIM2WaQEHMZdRFDD3OcLzxNEDfLisOfpQBYbcE7juPoQz8_qkBnT1aj8bF79dglSg_e1RIGte43Me9vA0h7YSttvNAcJfhoQxc4WmaAWQBsf6kHmAkh74mMdur_85fEF0T5eHEJtqJ6yveymCGDLX6na4oKtMsCcvuq4YTb7gmRHkXhG-yrGe-r8TnUjHxpFsM_ewWQ5URWo0lj6HSw',
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

const collectiveBargainsData = [
  {
    id: 'cb-001-azeite',
    creatorId: 'user-restaurante-a', // Dummy user
    productName: 'Azeite Virgem Extra 5L',
    category: 'Óleos e Gorduras',
    targetParticipants: 10,
    // currentParticipants: 3, // Calculated from BargainAdhesions
    participants: ['user-restaurante-a', 'user-restaurante-b', 'user-restaurante-c'],
    targetDiscount: '-5% no preço',
    targetPrice: 7.50, // Example: target price per liter
    deadline: new Date(new Date().setDate(new Date().getDate() + 3)), // 3 days from now
    status: 'open',
    // supplierId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', // FrescoMar (can supply)
    supplierOffer: { unitPrice: 8.00, discount5: 7.50, discount10: 7.00 },
  },
  {
    id: 'cb-002-leite',
    creatorId: 'user-restaurante-b',
    productName: 'Leite UHT Meio Gordo 6x1L',
    category: 'Laticínios',
    targetParticipants: 5,
    // currentParticipants: 1, // Calculated from BargainAdhesions
    participants: ['user-restaurante-b'],
    targetDiscount: '-3% no preço',
    targetPrice: 5.00,
    deadline: new Date(new Date().setDate(new Date().getDate() + 16)), // 16 days from now
    status: 'open',
    // supplierId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', // FrescoMar (can supply)
    supplierOffer: { unitPrice: 5.20, discount3: 5.00, discount5: 4.80 },
  },
  {
    id: 'cb-003-arroz',
    creatorId: 'user-restaurante-c',
    productName: 'Arroz Agulha Extra 5kg',
    category: 'Mercearia',
    targetParticipants: 20,
    // currentParticipants: 58, // Calculated from BargainAdhesions
    participants: ['user-restaurante-c', 'user-restaurante-d', 'user-restaurante-e'],
    targetDiscount: '-10% no preço',
    targetPrice: 2.00,
    deadline: new Date(new Date().setDate(new Date().getDate() - 1)), // Ended yesterday
    status: 'closed-achieved',
    // supplierId: 'c3d4e5f6-a7b8-9012-3456-7890abcdef2', // LusaPack (not ideal, but using existing)
    supplierOffer: { unitPrice: 2.20, discount10: 2.00 },
  },
];

const bargainAdhesionsData = [
  { collectiveBargainId: 'cb-001-azeite', userId: 'user-restaurante-a', committedQuantity: 500 },
  { collectiveBargainId: 'cb-001-azeite', userId: 'user-restaurante-b', committedQuantity: 200 },
  { collectiveBargainId: 'cb-001-azeite', userId: 'user-restaurante-c', committedQuantity: 700 },
  { collectiveBargainId: 'cb-002-leite', userId: 'user-restaurante-b', committedQuantity: 100 },
  { collectiveBargainId: 'cb-003-arroz', userId: 'user-restaurante-c', committedQuantity: 5000 },
  { collectiveBargainId: 'cb-003-arroz', userId: 'user-restaurante-d', committedQuantity: 10000 },
  { collectiveBargainId: 'cb-003-arroz', userId: 'user-restaurante-e', committedQuantity: 7000 },
];

const priceHistoryData = [
  // Price history for Bife da Vazia Maturado 30 dias (prod-001-carne) from Carne do Monte
  { productId: 'prod-001-carne', supplierId: 'd4e5f6a7-b8c9-0123-4567-890abcdef3', price: 34.00, date: new Date('2025-09-01') },
  { productId: 'prod-001-carne', supplierId: 'd4e5f6a7-b8c9-0123-4567-890abcdef3', price: 34.50, date: new Date('2025-09-15') },
  { productId: 'prod-001-carne', supplierId: 'd4e5f6a7-b8c9-0123-4567-890abcdef3', price: 35.00, date: new Date('2025-10-01') },
  { productId: 'prod-001-carne', supplierId: 'd4e5f6a7-b8c9-0123-4567-890abcdef3', price: 35.50, date: new Date('2025-10-15') },
  { productId: 'prod-001-carne', supplierId: 'd4e5f6a7-b8c9-0123-4567-890abcdef3', price: 35.20, date: new Date('2025-11-01') },
  { productId: 'prod-001-carne', supplierId: 'd4e5f6a7-b8c9-0123-4567-890abcdef3', price: 35.70, date: new Date('2025-11-15') },
  { productId: 'prod-001-carne', supplierId: 'd4e5f6a7-b8c9-0123-4567-890abcdef3', price: 36.00, date: new Date('2025-12-01') },
  { productId: 'prod-001-carne', supplierId: 'd4e5f6a7-b8c9-0123-4567-890abcdef3', price: 35.50, date: new Date('2025-12-15') }, // Current price

  // Price history for Robalo Fresco Selvagem (prod-003-peixe) from FrescoMar Lda.
  { productId: 'prod-003-peixe', supplierId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', price: 27.50, date: new Date('2025-09-05') },
  { productId: 'prod-003-peixe', supplierId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', price: 28.00, date: new Date('2025-09-20') },
  { productId: 'prod-003-peixe', supplierId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', price: 28.50, date: new Date('2025-10-05') },
  { productId: 'prod-003-peixe', supplierId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', price: 29.00, date: new Date('2025-10-20') },
  { productId: 'prod-003-peixe', supplierId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', price: 28.80, date: new Date('2025-11-05') },
  { productId: 'prod-003-peixe', supplierId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', price: 29.10, date: new Date('2025-11-20') },
  { productId: 'prod-003-peixe', supplierId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', price: 29.50, date: new Date('2025-12-05') },
  { productId: 'prod-003-peixe', supplierId: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', price: 28.90, date: new Date('2025-12-20') }, // Current price
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

  // Seed CollectiveBargains
  console.log('🌱 Seeding Collective Bargains...');
  for (const cb of collectiveBargainsData) {
    await prisma.collectiveBargain.upsert({
      where: { id: cb.id },
      update: {
        currentParticipants: cb.participants.length, // Update currentParticipants
      },
      create: {
        ...cb,
        currentParticipants: cb.participants.length, // Set currentParticipants based on participants array
      },
    });
  }
  console.log(`✅ Seeded ${collectiveBargainsData.length} collective bargains.`);

  // Seed BargainAdhesions
  console.log('🌱 Seeding Bargain Adhesions...');
  for (const ba of bargainAdhesionsData) {
    await prisma.bargainAdhesion.upsert({
      where: { id: `${ba.collectiveBargainId}-${ba.userId}` }, // Unique ID for upsert
      update: {
        committedQuantity: ba.committedQuantity,
      },
      create: {
        id: `${ba.collectiveBargainId}-${ba.userId}`, // Custom ID for upsert
        collectiveBargainId: ba.collectiveBargainId,
        userId: ba.userId,
        committedQuantity: ba.committedQuantity,
      },
    });
  }
  console.log(`✅ Seeded ${bargainAdhesionsData.length} bargain adhesions.`);

  // Seed PriceHistory
  console.log('🌱 Seeding Price History...');
  for (const ph of priceHistoryData) {
    await prisma.priceHistory.create({
      data: {
        productId: ph.productId,
        supplierId: ph.supplierId,
        price: ph.price,
        date: ph.date,
      },
    });
  }
  console.log(`✅ Seeded ${priceHistoryData.length} price history entries.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
