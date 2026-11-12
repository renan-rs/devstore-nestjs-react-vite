import { PrismaClient } from "@prisma/client";
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const img = (id) => `https://images.unsplash.com/photo-${id}?w=500`;

// Mesma regra de slug do CategoriesService (sem acentos, minúsculas, separado por hífens)
const slugify = (name) =>
    name
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

const categories = ['Vestuário', 'Canecas e Garrafas', 'Periféricos', 'Acessórios', 'Livros e Cadernos', 'Setup Gamer'];

const products = [
    // Vestuário
    {
        name: 'Camiseta DevStore Tech',
        description: 'Camiseta 100% algodão com estampa exclusiva para desenvolvedores.',
        price: 89.90, stock: 10, category: 'Vestuário',
        imageUrl: img('1521572267360-ee0c2909d518'),
    },
    {
        name: 'Moletom DevStore Hoodie',
        description: 'Moletom com capuz e bolso canguru, ideal para as madrugadas de deploy.',
        price: 189.90, stock: 15, category: 'Vestuário',
        imageUrl: img('1556821840-3a63f95609a7'),
    },
    {
        name: 'Boné Dev Mode',
        description: 'Boné ajustável de sarja com bordado discreto da DevStore.',
        price: 69.90, stock: 20, category: 'Vestuário',
        imageUrl: img('1588850561407-ed78c282e89b'),
    },
    // Canecas e Garrafas
    {
        name: 'Caneca Minimalista Code',
        description: 'Caneca de cerâmica de alta qualidade para o seu café diário de código.',
        price: 49.90, stock: 10, category: 'Canecas e Garrafas',
        imageUrl: img('1514432324607-a09d9b4aefdd'),
    },
    {
        name: 'Garrafa Térmica Debug 500ml',
        description: 'Garrafa térmica de aço inox que mantém a bebida quente por 12 horas.',
        price: 79.90, stock: 25, category: 'Canecas e Garrafas',
        imageUrl: img('1602143407151-7111542de6e8'),
    },
    // Periféricos
    {
        name: 'Teclado Mecânico Compacto',
        description: 'Teclado mecânico 75% com switches táteis e iluminação RGB.',
        price: 349.90, stock: 12, category: 'Periféricos',
        imageUrl: img('1587829741301-dc798b83add3'),
    },
    {
        name: 'Mouse Sem Fio Ergonômico',
        description: 'Mouse sem fio com sensor de alta precisão e bateria de longa duração.',
        price: 129.90, stock: 30, category: 'Periféricos',
        imageUrl: img('1527864550417-7fd91fc51a46'),
    },
    {
        name: 'Monitor 27" Full HD',
        description: 'Monitor IPS de 27 polegadas com bordas finas e ajuste de altura.',
        price: 1199.90, stock: 6, category: 'Periféricos',
        imageUrl: img('1527443224154-c4a3942d3acf'),
    },
    {
        name: 'Webcam Full HD 1080p',
        description: 'Webcam com microfone embutido e foco automático para reuniões e streams.',
        price: 219.90, stock: 14, category: 'Periféricos',
        imageUrl: img('1629429407756-446d66f5b24e'),
    },
    // Acessórios
    {
        name: 'Mochila Dev Anti-furto',
        description: 'Mochila resistente à água com compartimento acolchoado para notebook de até 15,6".',
        price: 199.90, stock: 18, category: 'Acessórios',
        imageUrl: img('1553062407-98eeb64c6a62'),
    },
    {
        name: 'Suporte para Notebook',
        description: 'Suporte de alumínio com ajuste de ângulo para melhorar a postura e a ventilação.',
        price: 109.90, stock: 22, category: 'Acessórios',
        imageUrl: img('1593642632823-8f785ba67e45'),
    },
    {
        name: 'Hub USB-C 7 em 1',
        description: 'Hub com HDMI, leitor de cartão, portas USB 3.0 e entrada de energia.',
        price: 159.90, stock: 16, category: 'Acessórios',
        imageUrl: img('1760376789487-994070337c76'),
    },
    {
        name: 'Kit de Adesivos Dev',
        description: 'Kit com 30 adesivos de vinil resistentes à água para notebook e garrafa.',
        price: 24.90, stock: 50, category: 'Acessórios',
        imageUrl: img('1572375992501-4b0892d50c69'),
    },
    // Livros e Cadernos
    {
        name: 'Caderno Pontilhado para Devs',
        description: 'Caderno de capa dura com folhas pontilhadas, perfeito para diagramas e anotações.',
        price: 44.90, stock: 40, category: 'Livros e Cadernos',
        imageUrl: img('1531346878377-a5be20888e57'),
    },
    {
        name: 'Livro Código Limpo na Prática',
        description: 'Guia prático de boas práticas para escrever código legível e fácil de manter.',
        price: 99.90, stock: 20, category: 'Livros e Cadernos',
        imageUrl: img('1544947950-fa07a98d237f'),
    },
    {
        name: 'Livro Arquitetura de Software Moderna',
        description: 'Padrões, decisões e trade-offs para projetar sistemas escaláveis.',
        price: 129.90, stock: 15, category: 'Livros e Cadernos',
        imageUrl: img('1512820790803-83ca734da794'),
    },
    // Setup Gamer
    {
        name: 'Mousepad Ergonômico XL',
        description: 'Mousepad grande com base emborrachada e superfície speed.',
        price: 119.90, stock: 10, category: 'Setup Gamer',
        imageUrl: img('1615663245857-ac93bb7c39e7'),
    },
    {
        name: 'Headset Gamer 7.1',
        description: 'Headset com som surround virtual 7.1, microfone removível e almofadas macias.',
        price: 279.90, stock: 12, category: 'Setup Gamer',
        imageUrl: img('1505740420928-5e560c06d30e'),
    },
    {
        name: 'Controle Sem Fio Pro',
        description: 'Controle sem fio compatível com PC e consoles, com gatilhos responsivos.',
        price: 299.90, stock: 9, category: 'Setup Gamer',
        imageUrl: img('1592840496694-26d035b52b48'),
    },
    {
        name: 'Cadeira Gamer Ergonômica',
        description: 'Cadeira reclinável com apoio lombar, apoio de braços ajustável e revestimento respirável.',
        price: 1299.90, stock: 4, category: 'Setup Gamer',
        imageUrl: img('1598550476439-6847785fcea6'),
    },
    {
        name: 'Luminária de Mesa LED',
        description: 'Luminária articulada com três temperaturas de cor e controle de intensidade.',
        price: 139.90, stock: 17, category: 'Setup Gamer',
        imageUrl: img('1507473885765-e6ed057f782c'),
    },
];

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

    // 2. Categories (upsert por slug: seguro rodar várias vezes)
    const categoryIds = {};
    for(const name of categories){
        const category = await prisma.category.upsert({
            where: { slug: slugify(name) },
            update: {},
            create: { name, slug: slugify(name) },
        });
        categoryIds[name] = category.id;
    }

    console.log(`🏷️  ${categories.length} categorias garantidas`);

    // 3. Register initial mockup products
    for(const { category, ...product } of products){
        const categoryId = categoryIds[category];

        // Evita duplicar se já existirem produtos cadastrados
        const exists = await prisma.product.findFirst({ where: { name: product.name } });
        if (!exists) {
            await prisma.product.create({ data: { ...product, categoryId } });
        } else if (exists.categoryId !== categoryId || exists.imageUrl !== product.imageUrl) {
            // Produtos de seeds anteriores são sincronizados com a categoria e a imagem definidas aqui
            await prisma.product.update({ where: { id: exists.id }, data: { categoryId, imageUrl: product.imageUrl } });
        }
    }

    console.log(`📦 ${products.length} produtos de exemplo garantidos!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
