/**
 * Mock Data for Business Intelligence Dashboard
 * Used when backend API is unreachable (Demo Mode / Offline Fallback)
 */

export const mockData = {
    // 1. Stats Cards
    stats: {
        receita: {
            value: 12450.80,
            formatted: '€12.450,80',
            trend: '+15.2%',
            isUp: true,
            vs: 'vs semana passada'
        },
        clientes: {
            value: 432,
            trend: '+8.5%',
            isUp: true,
            vs: 'vs semana passada'
        },
        ticketMedio: {
            value: 28.82,
            formatted: '€28,82',
            trend: '+5.1%',
            isUp: true,
            vs: 'vs semana passada'
        },
        foodCost: {
            value: 28.5,
            formatted: '28.5%',
            trend: '-2.1%',
            isUp: true,
            vs: 'vs semana passada'
        }
    },

    // 2. Sales Trends Chart
    salesTrends: [
        { label: '09:00', revenue: 150 },
        { label: '10:00', revenue: 320 },
        { label: '11:00', revenue: 450 },
        { label: '12:00', revenue: 1200 },
        { label: '13:00', revenue: 2100 },
        { label: '14:00', revenue: 1800 },
        { label: '15:00', revenue: 950 },
        { label: '16:00', revenue: 600 },
        { label: '17:00', revenue: 850 },
        { label: '18:00', revenue: 1600 },
        { label: '19:00', revenue: 2800 },
        { label: '20:00', revenue: 3500 },
        { label: '21:00', revenue: 2900 },
        { label: '22:00', revenue: 1400 },
        { label: '23:00', revenue: 800 }
    ],

    // 3. Top Products
    topProducts: [
        { id: 1, name: 'Bacalhau à Brás', sales: 145, revenue: 2610, margin: 72 },
        { id: 2, name: 'Polvo à Lagareiro', sales: 112, revenue: 2464, margin: 68 },
        { id: 3, name: 'Bife à Portuguesa', sales: 98, revenue: 1764, margin: 65 },
        { id: 4, name: 'Francesinha Especial', sales: 87, revenue: 1305, margin: 60 },
        { id: 5, name: 'Arroz de Marisco', sales: 76, revenue: 2660, margin: 70 }
    ],

    // 4. Alerts
    alerts: [
        {
            id: 1,
            type: 'critical',
            title: 'Stock Crítico: Salmão',
            message: 'Apenas 2.5kg em stock. Previsão de esgotar hoje ao jantar.',
            timestamp: new Date().toISOString()
        },
        {
            id: 2,
            type: 'warning',
            title: 'Desvio de Food Cost',
            message: 'O custo do "Bife do Lombo" aumentou 12% esta semana.',
            timestamp: new Date().toISOString()
        },
        {
            id: 3,
            type: 'opportunity',
            title: 'Oportunidade de Venda',
            message: 'Previsão de chuva para amanhã. Ative a campanha de Delivery.',
            timestamp: new Date().toISOString()
        }
    ],

    // 5. Opportunities (Marketing/Actionable)
    opportunities: [
        {
            id: 1,
            title: 'Aumentar Ticket Médio',
            description: 'Sugerir sobremesas aumentaria a receita em 8%.',
            impact: 'high', // high, medium, low
            potentialRevenue: 450,
            type: 'revenue'
        },
        {
            id: 2,
            title: 'Otimizar Staff',
            description: 'Reduzir 1 turno de cozinha às Terças-feiras.',
            impact: 'medium',
            potentialSaved: 320,
            type: 'cost'
        }
    ],

    // 6. AI Prediction
    aiPrediction: {
        prediction: 'Alta procura prevista para Sábado jantar.',
        confidence: 89,
        dayOfWeek: 'Sábado',
        suggestion: 'Alta procura prevista para o turno da noite devido a eventos locais.',
        action: 'Reforço de equipe',
        estimatedCovers: 145,
        estimatedRevenue: 3400,
        suggestedActions: [
            'Reforçar equipa de sala (+2)',
            'Preparar mise-en-place de entradas'
        ]
    },

    // 7. Menu Engineering (Object Structure)
    menuEngineering: {
        stars: [
            { id: 1, name: 'Bacalhau à Brás', margin: 18.5, sales: 145, revenue: 2682.5, category: 'Star', type: 'Peixe' },
            { id: 2, name: 'Hambúrguer Gourmet', margin: 12.0, sales: 180, revenue: 2160, category: 'Star', type: 'Carne' }
        ],
        gems: [
            { id: 3, name: 'Risoto de Cogumelos', margin: 16.0, sales: 45, revenue: 720, category: 'Gem', type: 'Vegetariano' },
            { id: 4, name: 'Filetes de Polvo', margin: 22.0, sales: 30, revenue: 660, category: 'Gem', type: 'Peixe' }
        ],
        populars: [
            { id: 5, name: 'Sopa do Dia', margin: 2.5, sales: 220, revenue: 550, category: 'Popular', type: 'Entrada' },
            { id: 6, name: 'Refrigerantes', margin: 1.5, sales: 300, revenue: 450, category: 'Popular', type: 'Bebidas' }
        ],
        dogs: [
            { id: 7, name: 'Salada Simples', margin: 3.0, sales: 20, revenue: 60, category: 'Dog', type: 'Entrada' },
            { id: 8, name: 'Tosta Mista', margin: 2.0, sales: 15, revenue: 30, category: 'Dog', type: 'Snack' }
        ],
        opportunities: {
            gems: { count: 2, suggestion: 'Aumentar visibilidade no menu', potential: 150 },
            populars: { count: 2, suggestion: 'Reduzir custo de ingredientes', potential: 200 },
            dogs: { count: 2, suggestion: 'Remover do menu ou reformular', potential: 0 }
        }
    },

    // 8. Demand Forecast
    demandForecast: {
        labels: ['Hoje', 'Amanhã', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
        values: [85, 92, 78, 88, 120, 145, 110], // % occupancy
        weather: ['sun', 'sun', 'cloud', 'rain', 'cloud', 'sun', 'sun'],
        summary: {
            totalRevenue: 12500,
            totalOrders: 450,
            confidence: 92
        }
    },

    // 9. Peak Hours Heatmap
    peakHoursHeatmap: {
        // 0-6 (Dias da semana), 0-23 (Horas do dia) -> Intensidade 0-100
        data: [
            { day: 5, hour: 20, value: 100 }, // Sex 20h
            { day: 5, hour: 21, value: 95 },
            { day: 6, hour: 20, value: 98 }, // Sab 20h
            { day: 6, hour: 13, value: 85 }, // Sab 13h
            { day: 0, hour: 13, value: 90 }, // Dom 13h
        ]
    },

    // 10. Benchmark
    benchmark: {
        performance: {
            rating: 'good',
            label: 'Bom Desempenho',
            score: 78,
            color: 'green'
        },
        segmentLabel: 'Restaurantes Casuais (Algarve)',
        summary: {
            totalRevenue: 12450,
            totalOrders: 432,
            totalSeats: 85
        },
        comparisons: {
            foodCost: {
                label: 'Food Cost %',
                yours: 28.5,
                industry: 31.0,
                status: 'good',
                diff: -2.5
            },
            laborCost: {
                label: 'Labor Cost %',
                yours: 22.1,
                industry: 25.0,
                status: 'good',
                diff: -2.9
            },
            ticket: {
                label: 'Ticket Médio',
                yours: 28.82,
                industry: 24.50,
                status: 'good',
                diff: 4.32
            },
            revPASH: {
                label: 'RevPASH',
                yours: 4.8,
                industry: 4.2,
                status: 'good',
                diff: 0.6
            }
        },
        opportunities: [
            {
                id: 1,
                title: 'Otimizar Food Cost',
                description: 'Seu food cost está bom, mas pode melhorar em 0.5% renegociando com fornecedores de bebidas.',
                impact: 'medium',
                type: 'cost',
                potentialSavings: 150
            },
            {
                id: 2,
                title: 'Aumentar Rotação',
                description: 'Sua rotação de mesas aos sábados está 10% abaixo da média do setor.',
                impact: 'high',
                type: 'revenue',
                potentialRevenue: 680
            }
        ]
    },

    // 11. Onboarding Status
    onboardingStatus: {
        completed: true,
        step: 5,
        verificationStatus: 'verified'
    },

    // 12. Community Groups (Mock)
    groups: [
        { id: 1, name: 'Algarve', category: 'region', description: 'Comunidade de chefs no sul.', _count: { memberships: 124, posts: 45 } },
        { id: 2, name: 'Alentejo', category: 'region', description: 'Tradição e inovação no Alentejo.', _count: { memberships: 167, posts: 23 } },
        { id: 3, name: 'Lisboa', category: 'region', description: 'O pulso da capital.', _count: { memberships: 894, posts: 310 } },
        { id: 4, name: 'Norte', category: 'region', description: 'Comunidade da zona norte.', _count: { memberships: 521, posts: 145 } },
        { id: 5, name: 'Gestão de Restaurantes', category: 'theme', description: 'Dicas de gestão e rentabilidade.', _count: { memberships: 856, posts: 120 } },
        { id: 6, name: 'Sustentabilidade', category: 'theme', description: 'Práticas verdes na restauração.', _count: { memberships: 432, posts: 67 } },
        { id: 7, name: 'Marketing Digital Gastro', category: 'theme', description: 'Como vender mais online.', _count: { memberships: 312, posts: 89 } },
        { id: 8, name: 'Vinhos e Harmonizações', category: 'theme', description: 'Tudo sobre vinhos portugueses.', _count: { memberships: 189, posts: 34 } },
        { id: 9, name: 'Inovação e Tech', category: 'theme', description: 'IA e automação na cozinha.', _count: { memberships: 245, posts: 56 } },
        { id: 10, name: 'Recrutamento e Staff', category: 'theme', description: 'Dicas para reter talento.', _count: { memberships: 643, posts: 78 } },
        { id: 11, name: 'Food Design', category: 'theme', description: 'Plating e estética de pratos.', _count: { memberships: 128, posts: 42 } },
        { id: 12, name: 'Fiscalidade e Leis', category: 'theme', description: 'Manter as contas em dia.', _count: { memberships: 412, posts: 15 } },
        { id: 13, name: 'Madeira & Açores', category: 'region', description: 'Culinária insular.', _count: { memberships: 95, posts: 12 } },
        { id: 14, name: 'Padaria de Autor', category: 'theme', description: 'A arte do pão artesanal.', _count: { memberships: 224, posts: 67 } },
        { id: 15, name: 'Centro', category: 'region', description: 'Sabores da Beira.', _count: { memberships: 342, posts: 48 } },
        { id: 16, name: 'Cocktail & Mixologia', category: 'theme', description: 'Tendências de bar.', _count: { memberships: 156, posts: 39 } },
        { id: 17, name: 'Higiene e Segurança', category: 'theme', description: 'HACCP e normas.', _count: { memberships: 523, posts: 22 } },
        { id: 18, name: 'Franchising e Expansão', category: 'theme', description: 'Escalar o negócio.', _count: { memberships: 178, posts: 14 } }
    ],

    // 13. Mock Posts (Feed Rico & Realista)
    posts: [
        {
            id: 'post-1',
            title: 'Como otimizar o Food Cost?',
            body: 'Tenho conseguido reduzir o desperdício usando as fichas técnicas do iaMenu. Alguém tem mais dicas sobre gestão de inventário?',
            category: 'dica',
            createdAt: new Date().toISOString(),
            author: { displayName: 'Chef Carlos', profilePhoto: null },
            tags: '["FoodCost", "Gestão", "Eficiência"]',
            reactions: { like: 42, useful: 15 },
            _count: { comments: 5 },
            imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop'
        },
        {
            id: 'post-2',
            title: 'Workshop de Harmonização de Vinhos',
            body: 'Amanhã teremos um mini-workshop no hub do Algarve sobre vinhos regionais e marisco. Não faltem!',
            category: 'evento',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            author: { displayName: 'Maria Silva', profilePhoto: null },
            tags: '["Vinhos", "Algarve", "Eventos"]',
            reactions: { like: 89, useful: 12 },
            _count: { comments: 12 },
            imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop'
        },
        {
            id: 'post-3',
            title: 'Novo Prato de Assinatura: Robalo com Crosta de Ervas',
            body: 'Apresento o novo prato do "Sabor & Mar". A técnica de cocção lenta manteve toda a suculência.',
            category: 'showcase',
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            author: { displayName: 'Chef Ricardo', profilePhoto: null },
            tags: '["Showcase", "Gastronomia", "Peixe"]',
            reactions: { like: 156, useful: 8 },
            _count: { comments: 24 },
            imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop'
        },
        {
            id: 'post-4',
            title: 'Dúvida: Melhor POS para pequena esplanada?',
            body: 'Estou a abrir um quiosque e preciso de um sistema leve, preferencialmente em tablet. Alguma sugestão iaMenu?',
            category: 'duvida',
            createdAt: new Date(Date.now() - 14400000).toISOString(),
            author: { displayName: 'António Lopes', profilePhoto: null },
            tags: '["POS", "Tecnologia", "Gestão"]',
            reactions: { like: 12, useful: 24 },
            _count: { comments: 18 },
            imageUrl: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=800&auto=format&fit=crop'
        },
        {
            id: 'post-5',
            title: 'Tendências: Plant-Based na Restauração Portuguesa',
            body: 'Cada vez mais clientes pedem opções vegan. Como estão a adaptar os vossos menus tradicionais?',
            category: 'dica',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            author: { displayName: 'Sofia Mendes', profilePhoto: null },
            tags: '["Vegan", "Tendências", "Menu"]',
            reactions: { like: 67, useful: 31 },
            _count: { comments: 9 },
            imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop'
        },
        {
            id: 'post-6',
            title: 'A Arte da Emprestar: Design de Empratamento',
            body: 'A estética é o primeiro sabor que o cliente experimenta. Partilho algumas fotos da nossa última sessão de design.',
            category: 'showcase',
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            author: { displayName: 'Chef Pedro', profilePhoto: null },
            tags: '["Design", "Empratamento", "Arte"]',
            reactions: { like: 234, useful: 12 },
            _count: { comments: 45 },
            imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop'
        },
        {
            id: 'post-7',
            title: 'Segurança Alimentar: O que mudou com o HACCP?',
            body: 'Novas diretivas para 2024. Fiz um resumo dos pontos mais críticos para estarem atentos.',
            category: 'dica',
            createdAt: new Date(Date.now() - 259200000).toISOString(),
            author: { displayName: 'Dra. Inês', profilePhoto: null },
            tags: '["HACCP", "Segurança", "Legal"]',
            reactions: { like: 56, useful: 120 },
            _count: { comments: 7 },
            imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop'
        },
        {
            id: 'post-8',
            title: 'Mixologia de Autor: Cocktails com Medronho',
            body: 'Estamos a experimentar levar os sabores do Algarve para o bar. O resultado é surpreendente!',
            category: 'showcase',
            createdAt: new Date(Date.now() - 345600000).toISOString(),
            author: { displayName: 'Bartender Luís', profilePhoto: null },
            tags: '["Cocktails", "Algarve", "Inovação"]',
            reactions: { like: 112, useful: 5 },
            _count: { comments: 14 },
            imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&auto=format&fit=crop'
        },
        {
            id: 'post-9',
            title: 'Networking em Coimbra - Centro de Portugal',
            body: 'Excelente encontro de restauradores ontem. A união faz o sucesso do setor.',
            category: 'evento',
            createdAt: new Date(Date.now() - 432000000).toISOString(),
            author: { displayName: 'Eurico Alves', profilePhoto: null },
            tags: '["Networking", "Coimbra", "Sucesso"]',
            reactions: { like: 178, useful: 10 },
            _count: { comments: 21 },
            imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop'
        },
        {
            id: 'post-10',
            title: 'Recrutamento: Como manter os jovens talentos?',
            body: 'O turnover na restauração está altíssimo. Partilhem as vossas estratégias de retenção.',
            category: 'duvida',
            createdAt: new Date(Date.now() - 518400000).toISOString(),
            author: { displayName: 'Gestora Ana', profilePhoto: null },
            tags: '["Recrutamento", "RH", "Gestão"]',
            reactions: { like: 45, useful: 89 },
            _count: { comments: 34 },
            imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop'
        },
        {
            id: 'post-11',
            title: 'Padaria Artesanal: O regresso do Pão de Massa Velha',
            body: 'O segredo está no tempo e na temperatura. Menos fermento químico, mais sabor.',
            category: 'dica',
            createdAt: new Date(Date.now() - 604800000).toISOString(),
            author: { displayName: 'Padeiro João', profilePhoto: null },
            tags: '["Padaria", "Artesanal", "Tradição"]',
            reactions: { like: 92, useful: 45 },
            _count: { comments: 15 },
            imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop'
        },
        {
            id: 'post-12',
            title: 'Sustentabilidade: Reduzir Plásticos na Entrega',
            body: 'Testámos embalagens de cartão reciclado e os clientes adoraram. Pequenas mudanças, grande impacto.',
            category: 'dica',
            createdAt: new Date(Date.now() - 777600000).toISOString(),
            author: { displayName: 'Sofia Mendes', profilePhoto: null },
            tags: '["Sustentabilidade", "Takeaway", "Ambiente"]',
            reactions: { like: 145, useful: 67 },
            _count: { comments: 11 },
            imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop'
        },
        {
            id: 'post-13',
            title: 'O Meu Primeiro Restaurante: Erros que cometi',
            body: 'Se pudesse voltar atrás, teria investido mais em marketing digital desde o dia 1.',
            category: 'dica',
            createdAt: new Date(Date.now() - 950400000).toISOString(),
            author: { displayName: 'Eurico Alves', profilePhoto: null },
            tags: '["Empreendedorismo", "Experiência", "Fails"]',
            reactions: { like: 312, useful: 156 },
            _count: { comments: 88 },
            imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop'
        },
        {
            id: 'post-14',
            title: 'Fiscalidade: IVA na restauração em 2024',
            body: 'Alguém tem o resumo das novas taxas para takeaway vs consumo no local?',
            category: 'duvida',
            createdAt: new Date(Date.now() - 1123200000).toISOString(),
            author: { displayName: 'Contabilista Rui', profilePhoto: null },
            tags: '["Fiscalidade", "Contas", "IVA"]',
            reactions: { like: 8, useful: 42 },
            _count: { comments: 25 },
            imageUrl: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&auto=format&fit=crop'
        },
        {
            id: 'post-15',
            title: 'Food Design: Plating Minimalista',
            body: 'Menos é mais. O espaço em branco no prato valoriza o ingrediente principal.',
            category: 'showcase',
            createdAt: new Date(Date.now() - 1296000000).toISOString(),
            author: { displayName: 'Chef Elsa', profilePhoto: null },
            tags: '["FoodDesign", "Minimalismo", "Culinária"]',
            reactions: { like: 189, useful: 3 },
            _count: { comments: 19 },
            imageUrl: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&auto=format&fit=crop'
        },
        {
            id: 'post-16',
            title: 'IA na Cozinha: Inventários Preditivos',
            body: 'Alguém já usa software de IA para prever compras semanais? Gostava de saber opiniões.',
            category: 'duvida',
            createdAt: new Date(Date.now() - 1468800000).toISOString(),
            author: { displayName: 'António Lopes', profilePhoto: null },
            tags: '["IA", "Tech", "Inovação"]',
            reactions: { like: 34, useful: 76 },
            _count: { comments: 13 },
            imageUrl: 'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=800&auto=format&fit=crop'
        },
        {
            id: 'post-17',
            title: 'Sabores da Madeira: O Bolo do Caco Perfeito',
            body: 'Partilho a receita de família que passamos de geração em geração. O truque está na batata-doce.',
            category: 'dica',
            createdAt: new Date(Date.now() - 1641600000).toISOString(),
            author: { displayName: 'Mestre Gil', profilePhoto: null },
            tags: '["Madeira", "Receita", "Tradição"]',
            reactions: { like: 267, useful: 145 },
            _count: { comments: 56 },
            imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop'
        },
        {
            id: 'post-18',
            title: 'Marketing Digital: Reels ou Fotos?',
            body: 'Para o meu restaurante, o vídeo está a dar 3x mais alcance que fotos estáticas. Qual é a vossa experiência?',
            category: 'dica',
            createdAt: new Date(Date.now() - 1814400000).toISOString(),
            author: { displayName: 'Digital Marketer Marta', profilePhoto: null },
            tags: '["Marketing", "RedesSociais", "Vídeo"]',
            reactions: { like: 54, useful: 92 },
            _count: { comments: 41 },
            imageUrl: 'https://images.unsplash.com/photo-1611162617263-43c266b82197?w=800&auto=format&fit=crop'
        }
    ],

    // 14. Mock Comments
    comments: {
        'post-1': [
            { id: 'c1', body: 'Concordo! A ficha técnica é a base de tudo.', createdAt: new Date().toISOString(), author: { displayName: 'Joana Sousa' } },
            { id: 'c2', body: 'Eurico, as tuas fichas são excelentes, ajudaram-me muito.', createdAt: new Date().toISOString(), author: { displayName: 'Pedro Santos' } }
        ],
        'post-4': [
            { id: 'c3', body: 'Uso o Tiller e estou muito satisfeito.', createdAt: new Date().toISOString(), author: { displayName: 'Rui Costa' } },
            { id: 'c4', body: 'Já experimentaste o Vendus?', createdAt: new Date().toISOString(), author: { displayName: 'Marta Vale' } }
        ]
    },

    // 15. Mock Notifications
    notifications: [
        { id: 1, type: 'post_reaction', message: 'Joana Sousa reagiu ao teu post sobre Food Cost', createdAt: new Date().toISOString(), read: false },
        { id: 2, type: 'comment', message: 'Pedro Santos comentou no teu post', createdAt: new Date(Date.now() - 1800000).toISOString(), read: false },
        { id: 3, type: 'new_follower', message: 'Bartender Luís começou a seguir-te', createdAt: new Date(Date.now() - 86400000).toISOString(), read: true }
    ],

    // 16. Mock Profile
    profile: {
        id: 'user-eurico',
        displayName: 'Eurico Alves',
        role: 'Restaurador / Admin',
        bio: 'Focado em revolucionar a restauração com IA e tecnologia de ponta.',
        profilePhoto: null,
        stats: {
            posts: 12,
            followers: 145,
            following: 89,
            reputation: 98
        }
    }
};
