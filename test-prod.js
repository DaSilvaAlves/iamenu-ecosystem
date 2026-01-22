import fetch from 'node-fetch';

const API_URL = 'https://iamenucommunity-api-production.up.railway.app/api/v1/community';

async function testAPI() {
    console.log('🔍 A testar API de Produção:', API_URL);

    try {
        // 1. Testar Health
        console.log('\n1️⃣ Testando Health Check...');
        const health = await fetch('https://iamenucommunity-api-production.up.railway.app/health');
        console.log('Status:', health.status);
        console.log('Response:', await health.text());

        // 2. Tentar buscar o perfil do utilizador de teste
        console.log('\n2️⃣ Buscando Perfil ResTest...');
        const profileRes = await fetch(`${API_URL}/profiles/test-user-001`);

        if (profileRes.ok) {
            const data = await profileRes.json();
            console.log('✅ SUCESSO! Perfil encontrado:');
            console.log('Username:', data.data.username);
            console.log('Nome:', data.data.restaurantName);
            console.log('Posts:', data.data._count?.posts || 'N/A');
        } else {
            console.log('❌ FALHA ao buscar perfil:', profileRes.status);
            console.log(await profileRes.text());
        }

        // 3. Tentar buscar posts
        console.log('\n3️⃣ Buscando Posts...');
        const postsRes = await fetch(`${API_URL}/posts?limit=5`);
        if (postsRes.ok) {
            const data = await postsRes.json();
            console.log(`✅ SUCESSO! Encontrados ${data.data.length} posts.`);
            data.data.forEach(p => console.log(`- [${p.title}] por ${p.author?.username}`));
        } else {
            console.log('❌ FALHA ao buscar posts:', postsRes.status);
        }

    } catch (error) {
        console.error('❌ ERRO FATAL:', error.message);
    }
}

testAPI();
