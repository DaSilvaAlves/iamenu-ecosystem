/**
 * Script to create/promote admin user
 * Usage: node create-admin.js <userId>
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function promoteToAdmin(userId) {
  try {
    // Check if profile exists
    const profile = await prisma.profile.findUnique({
      where: { userId }
    });

    if (!profile) {
      console.log(`❌ Profile not found for userId: ${userId}`);
      console.log('Creating new profile with admin role...');

      const newProfile = await prisma.profile.create({
        data: {
          userId,
          role: 'admin'
        }
      });

      console.log('✅ Admin profile created:');
      console.log(JSON.stringify(newProfile, null, 2));
    } else {
      // Update existing profile to admin
      const updated = await prisma.profile.update({
        where: { userId },
        data: { role: 'admin' }
      });

      console.log('✅ User promoted to admin:');
      console.log(JSON.stringify(updated, null, 2));
    }

    console.log('\n📋 Admin user details:');
    console.log(`   User ID: ${userId}`);
    console.log(`   Role: admin`);
    console.log('\n🔑 To get admin token, use:');
    console.log(`   curl http://localhost:3001/api/v1/community/auth/test-token`);
    console.log('   (Make sure to update the test-token endpoint to use this userId and role)');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Get userId from command line
const userId = process.argv[2];

if (!userId) {
  console.log('Usage: node create-admin.js <userId>');
  console.log('Example: node create-admin.js test-user-001');
  process.exit(1);
}

promoteToAdmin(userId);
