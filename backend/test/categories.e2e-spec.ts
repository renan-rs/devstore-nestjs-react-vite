import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import * as bcrypt from 'bcrypt';
import { AppModule } from './../src/app.module';
import { configureApp } from '../src/app.setup';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Categories (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminToken: string;
  let userToken: string;
  const adminEmail = 'e2e-categories-admin@test.com';
  const userEmail = 'e2e-categories-user@test.com';
  const categoryName = 'Categoria E2E';
  const categorySlug = 'categoria-e2e';

  async function login(email: string) {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password: 'password123' });
    return res.body.access_token as string;
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
    await prisma.product.deleteMany({ where: { category: { slug: categorySlug } } });
    await prisma.category.deleteMany({ where: { slug: categorySlug } });
    await prisma.user.deleteMany({ where: { email: { in: [adminEmail, userEmail] } } });

    const password = await bcrypt.hash('password123', 10);
    await prisma.user.create({ data: { name: 'E2E Admin', email: adminEmail, password, role: 'ADMIN' } });
    await prisma.user.create({ data: { name: 'E2E User', email: userEmail, password, role: 'USER' } });

    adminToken = await login(adminEmail);
    userToken = await login(userEmail);
  });

  it('/categories (GET) - should list categories publicly', async () => {
    const response = await request(app.getHttpServer()).get('/categories').expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/categories (POST) - should return 401 without a token', () => {
    return request(app.getHttpServer()).post('/categories').send({ name: categoryName }).expect(401);
  });

  it('/categories (POST) - should return 403 for a regular USER', () => {
    return request(app.getHttpServer())
      .post('/categories')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: categoryName })
      .expect(403);
  });

  it('/categories (POST) - should return 400 when the name is empty', () => {
    return request(app.getHttpServer())
      .post('/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: '' })
      .expect(400);
  });

  it('/categories (POST) - should create a category as ADMIN and reject duplicates with 409', async () => {
    const created = await request(app.getHttpServer())
      .post('/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: categoryName })
      .expect(201);

    expect(created.body.slug).toBe(categorySlug);

    await request(app.getHttpServer())
      .post('/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: categoryName })
      .expect(409);
  });

  it('/categories/:id (DELETE) - should return 409 when the category has products, 200 once it is empty', async () => {
    const category = await prisma.category.findUniqueOrThrow({ where: { slug: categorySlug } });
    const product = await prisma.product.create({
      data: {
        name: 'Produto E2E Categories',
        description: 'Descrição de teste',
        price: 10,
        stock: 1,
        imageUrl: 'https://via.placeholder.com/150',
        categoryId: category.id,
      },
    });

    await request(app.getHttpServer())
      .delete(`/categories/${category.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(409);

    await request(app.getHttpServer())
      .delete(`/categories/${category.id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);

    await prisma.product.delete({ where: { id: product.id } });

    await request(app.getHttpServer())
      .delete(`/categories/${category.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });

  afterAll(async () => {
    // Remove apenas os dados criados por este teste
    await prisma.product.deleteMany({ where: { category: { slug: categorySlug } } });
    await prisma.category.deleteMany({ where: { slug: categorySlug } });
    await prisma.user.deleteMany({ where: { email: { in: [adminEmail, userEmail] } } });
    await app.close();
  });
});
