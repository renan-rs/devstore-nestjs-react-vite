import { PrismaClient } from "@prisma/client";
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando o seed do banco de dados...');

    // 1. Create default Admin user (password: 123456)
    const hashedPassword = await bcrypt.hash('123456', 10);

    const adminUser = await prisma.user.upsert({
        where: {email: 'admin@devstore.com'},
        update: {},
        create: {
            name: 'Admin DevStore',
            email: 'admin@devstore.com',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    console.log(`👤 Usuário Admin criado: ${adminUser.email}`)

    // 2. Register initial mockup products
    const products = [
        {
            name: 'Camiseta DevStore Tech',
            description: 'Camiseta 100% algodão com estampa exclusiva para desenvolvedores.',
            price: 89.90,
            category:'t-shirts',
            imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500',
            stock: 10,
        },
        {
            name: 'Caneca Minimalista Code',
            description: 'Caneca de cerâmica de alta qualidade para o seu café diário de código.',
            price: 49.90,
            category:'cups',
            imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500',
            stock: 10,
        },
        {
            name: 'Mousepad Ergonômico XL',
            description: 'Mousepad grande com base emborrachada e superfície speed.',
            price: 119.90,
            category:'Gamer',
            imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500',
            stock: 10,
        },
    ];

    for(const product of products){
        // Evita duplicar se já existirem produtos cadastrados
        const exists = await prisma.product.findFirst({ where: { name: product.name } });
        if (!exists) {
            await prisma.product.create({ data: product });
        }
    }

    console.log('📦 Produtos de exemplo cadastrados com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });