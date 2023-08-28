import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import { faker } from '@faker-js/faker';
describe('PostsController', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    prisma = await moduleFixture.resolve(PrismaService);
  });
  beforeEach(async () => {
    await prisma.publications.deleteMany();
    await prisma.medias.deleteMany();
    await prisma.posts.deleteMany();
    await app.init();
  });

  it('POST /posts => Should be possible to create a post if body has title and text', async () => {
    const title = faker.lorem.words();
    const text = faker.lorem.words();
    return await request(app.getHttpServer())
      .post('/posts')
      .send({
        title,
        text,
      })
      .expect(HttpStatus.CREATED)
      .expect('Created');
  });
  it('POST /posts => Should be possible to create a post if body has title and text and image', async () => {
    const title = faker.lorem.words();
    const text = faker.lorem.words();
    const image = faker.internet.url();
    return await request(app.getHttpServer())
      .post('/posts')
      .send({
        title,
        text,
        image,
      })
      .expect(HttpStatus.CREATED)
      .expect('Created');
  });
  it('POST /posts => Should not be possible to create a post if missing title or text', async () => {
    const title = faker.lorem.words();
    const text = faker.lorem.words();
    await request(app.getHttpServer())
      .post('/posts')
      .send({
        title,
      })
      .expect(HttpStatus.BAD_REQUEST);
    await request(app.getHttpServer())
      .post('/posts')
      .send({
        text,
      })
      .expect(HttpStatus.BAD_REQUEST);
    await request(app.getHttpServer())
      .post('/posts')
      .send({})
      .expect(HttpStatus.BAD_REQUEST);
  });

  it("GET /posts => Should return an empty array if there's no post", async () => {
    const response = await request(app.getHttpServer())
      .get('/posts')
      .send()
      .expect(HttpStatus.OK);
    expect(response.body).toHaveLength(0);
  });
  it('GET /posts => Should return an array of posts', async () => {
    const posts = [];
    const randomLength = Math.floor(Math.random() * 11);
    for (let i = 0; i < randomLength; i++) {
      const title = faker.lorem.words();
      const text = faker.lorem.words();
      posts.push({ title, text });
    }
    for (let i = 0; i < randomLength; i++) {
      await request(app.getHttpServer()).post('/posts').send({
        title: posts[i].title,
        text: posts[i].text,
      });
    }

    const response = await request(app.getHttpServer())
      .get('/posts')
      .send()
      .expect(HttpStatus.OK);
    expect(response.body).toHaveLength(randomLength);
    expect(response.body).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(Number),
          title: expect.any(String),
          text: expect.any(String),
        },
      ]),
    );
  });

  it('GET /posts/:id => Should be possible get the post if exists', async () => {
    const title = faker.lorem.words();
    const text = faker.lorem.words();
    await request(app.getHttpServer()).post('/posts').send({
      title,
      text,
    });
    const allPostsResponse = await request(app.getHttpServer())
      .get('/posts')
      .send();
    const response = await request(app.getHttpServer())
      .get(`/posts/${allPostsResponse.body[0].id}`)
      .expect(200);
    expect(response.body).toEqual({
      id: allPostsResponse.body[0].id,
      text,
      title,
    });
  });
  it('GET /posts/:id => Should receive 404 if post does not exists', async () => {
    await request(app.getHttpServer()).get(`/posts/10000`).expect(404);
  });
  it('PUT /posts/:id => Should be possible to change a post', async () => {
    const title = faker.lorem.words();
    const text = faker.lorem.words();
    const newTitle = faker.lorem.words();
    const newText = faker.lorem.words();
    await request(app.getHttpServer()).post(`/posts`).send({ text, title });
    const createdPostResponse = await request(app.getHttpServer()).get(
      `/posts`,
    );
    const { id } = createdPostResponse.body[0];
    await request(app.getHttpServer())
      .put(`/posts/${id}`)
      .send({ text: newText, title: newTitle })
      .expect(200);
    const updatePostResponse = await request(app.getHttpServer()).get(
      `/posts/${id}`,
    );
    expect(updatePostResponse.body).toEqual({
      id,
      title: newTitle,
      text: newText,
    });
  });
  it('PUT /posts/:id => Should receive 404 if POST does not exists', async () => {
    const title = faker.lorem.words();
    const text = faker.lorem.words();
    await request(app.getHttpServer())
      .put(`/posts/10000`)
      .send({ title, text })
      .expect(404);
  });
  it('PUT /posts/:id => Should receive 400 if POST body is invalid', async () => {
    const title = faker.lorem.words();
    const text = faker.lorem.words();
    await request(app.getHttpServer())
      .put(`/posts/10000`)
      .send({ text })
      .expect(400);
    await request(app.getHttpServer())
      .put(`/posts/10000`)
      .send({ title })
      .expect(400);
    await request(app.getHttpServer()).put(`/posts/10000`).send({}).expect(400);
  });
  it('DELETE /posts/:id => Should be possible to delete a post', async () => {
    const title = faker.lorem.words();
    const text = faker.lorem.words();
    await request(app.getHttpServer()).post(`/posts`).send({ text, title });
    const createdPostResponse = await request(app.getHttpServer()).get(
      `/posts`,
    );
    const { id } = createdPostResponse.body[0];
    await request(app.getHttpServer())
      .delete(`/posts/${id}`)
      .send()
      .expect(200);
    const createdPostAfterDeletingResponse = await request(
      app.getHttpServer(),
    ).get(`/posts`);
    expect(createdPostAfterDeletingResponse.body).toHaveLength(0);
    expect(createdPostAfterDeletingResponse.body).toBeInstanceOf(Array);
  });
  it('DELETE /posts/:id => Should receive 404 if post does not exists', async () => {
    await request(app.getHttpServer()).delete(`/posts/10000`).expect(404);
  });
  it('DELETE /posts/:id => Should not be possible to delete a post if its used in some publication', async () => {
    const postTitle = faker.lorem.words();
    const postText = faker.lorem.words();
    const title = faker.company.name();
    const username = faker.person.middleName();
    const date = faker.date.future();
    await request(app.getHttpServer())
      .post(`/medias`)
      .send({ username, title });
    const createdMediaResponse = await request(app.getHttpServer()).get(
      `/medias`,
    );
    const { id: mediaId } = createdMediaResponse.body[0];
    await request(app.getHttpServer())
      .post('/posts')
      .send({ title: postTitle, text: postText });
    const createdPostResponse = await request(app.getHttpServer()).get(
      `/posts`,
    );
    const { id: postId } = createdPostResponse.body[0];
    await request(app.getHttpServer())
      .post('/publications')
      .send({ mediaId, postId, date });

    await request(app.getHttpServer())
      .delete(`/posts/${postId}`)
      .send()
      .expect(403);
  });
});
