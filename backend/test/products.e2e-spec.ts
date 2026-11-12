import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AppModule } from './../src/app.module';
import { configureApp } from '../src/app.setup';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Products update (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminToken: string;
  let userToken: string;
  let categoryId: string;
  let otherCategoryId: string;
  let productId: string;
  const adminEmail = 'e2e-products-admin@test.com';
  const userEmail = 'e2e-products-user@test.com';
  const categorySlugs = ['e2e-products-a', 'e2e-products-b'];

  async function login(email: string) {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: 'password123' });
    return res.body.access_token as string;
  }

  async function cleanup() {
    await prisma.product.deleteMany({ where: { category: { slug: { in: categorySlugs } } } });
    await prisma.category.deleteMany({ where: { slug: { in: categorySlugs } } });
    await prisma.user.deleteMany({ where: { email: { in: [adminEmail, userEmail] } } });
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    prisma = app.get(PrismaService);
    await app.init();

    // Limpa resquícios de execuções anteriores interrompidas
    await cleanup();

    const password = await bcrypt.hash('password123', 10);
    await prisma.user.create({ data: { name: 'E2E Admin', email: adminEmail, password, role: 'ADMIN' } });
    await prisma.user.create({ data: { name: 'E2E User', email: userEmail, password, role: 'USER' } });
    adminToken = await login(adminEmail);
    userToken = await login(userEmail);

    const category = await prisma.category.create({ data: { name: 'E2E Products A', slug: categorySlugs[0] } });
    const other = await prisma.category.create({ data: { name: 'E2E Products B', slug: categorySlugs[1] } });
    categoryId = category.id;
    otherCategoryId = other.id;

    const product = await prisma.product.create({
      data: {
        name: 'Produto E2E Update',
        description: 'Descrição original',
        price: 100,
        stock: 5,
        imageUrl: 'https://via.placeholder.com/150',
        categoryId,
      },
    });
    productId = product.id;
  });

  it('/products/:id (PATCH) - should return 401 without a token', () => {
    return request(app.getHttpServer()).patch(`/products/${productId}`).send({ price: 1 }).expect(401);
  });

  it('/products/:id (PATCH) - should return 403 for a regular USER', () => {
    return request(app.getHttpServer())
      .patch(`/products/${productId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ price: 1 })
      .expect(403);
  });

  it('/products/:id (PATCH) - should return 404 for a non-existent product', () => {
    return request(app.getHttpServer())
      .patch('/products/00000000-0000-4000-8000-000000000000')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 1 })
      .expect(404);
  });

  it('/products/:id (PATCH) - should return 400 when the category does not exist', () => {
    return request(app.getHttpServer())
      .patch(`/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ categoryId: '00000000-0000-4000-8000-000000000000' })
      .expect(400);
  });

  it('/products/:id (PATCH) - should return 400 for a non-integer stock', () => {
    return request(app.getHttpServer())
      .patch(`/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ stock: 2.5 })
      .expect(400);
  });

  it('/products/:id (PATCH) - should return 400 for a negative price', () => {
    return request(app.getHttpServer())
      .patch(`/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: -10 })
      .expect(400);
  });

  it('/products/:id (PATCH) - should update only the provided fields as ADMIN', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ price: 59.9, stock: 12, categoryId: otherCategoryId })
      .expect(200);

    expect(response.body.price).toBe(59.9);
    expect(response.body.stock).toBe(12);
    expect(response.body.category.id).toBe(otherCategoryId);
    // Campos não enviados permanecem inalterados
    expect(response.body.name).toBe('Produto E2E Update');
    expect(response.body.description).toBe('Descrição original');
  });

  afterAll(async () => {
    // Remove apenas os dados criados por este teste
    await cleanup();
    await app.close();
  });
});
