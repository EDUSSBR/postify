import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import { faker } from '@faker-js/faker';
describe('MediasController', () => {
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

  it('POST /medias => Should be possible to create a media if body has title and username', async () => {
    const title = faker.company.name();
    const username = faker.person.middleName();
    return await request(app.getHttpServer())
      .post('/medias')
      .send({
        title,
        username,
      })
      .expect(HttpStatus.CREATED)
      .expect('Created');
  });
  it('POST /medias => Should not be possible to create a media if it already exists (same username/title)', async () => {
    const title = faker.company.name();
    const username = faker.person.middleName();
    await request(app.getHttpServer()).post('/medias').send({
      title,
      username,
    });
    await request(app.getHttpServer())
      .post('/medias')
      .send({
        title,
        username,
      })
      .expect(HttpStatus.CONFLICT);
  });
  it('POST /medias => Should not be possible to create a media if missing title or username', async () => {
    const title = faker.company.name();
    const username = faker.person.middleName();
    await request(app.getHttpServer())
      .post('/medias')
      .send({
        title,
      })
      .expect(HttpStatus.BAD_REQUEST);
    await request(app.getHttpServer())
      .post('/medias')
      .send({
        username,
      })
      .expect(HttpStatus.BAD_REQUEST);
    await request(app.getHttpServer())
      .post('/medias')
      .send({})
      .expect(HttpStatus.BAD_REQUEST);
  });
  it("GET /medias => Should return an empty array if there's no media", async () => {
    const response = await request(app.getHttpServer())
      .get('/medias')
      .send()
      .expect(HttpStatus.OK);
    expect(response.body).toHaveLength(0);
  });
  it('GET /medias => Should return an array of medias', async () => {
    const medias = [];
    const randomLength = Math.floor(Math.random() * 11);
    for (let i = 0; i < randomLength; i++) {
      const title = faker.company.name();
      const username = faker.person.middleName();
      medias.push({ title, username });
    }
    for (let i = 0; i < randomLength; i++) {
      await request(app.getHttpServer()).post('/medias').send({
        title: medias[i].title,
        username: medias[i].username,
      });
    }

    const response = await request(app.getHttpServer())
      .get('/medias')
      .send()
      .expect(HttpStatus.OK);
    expect(response.body).toHaveLength(randomLength);
    expect(response.body).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(Number),
          title: expect.any(String),
          username: expect.any(String),
        },
      ]),
    );
  });

  it('GET /medias/:id => Should be possible get the media if exists', async () => {
    const title = faker.company.name();
    const username = faker.person.middleName();
    await request(app.getHttpServer()).post('/medias').send({
      title,
      username,
    });
    const allMediasResponse = await request(app.getHttpServer())
      .get('/medias')
      .send();
    const response = await request(app.getHttpServer())
      .get(`/medias/${allMediasResponse.body[0].id}`)
      .expect(200);
    expect(response.body).toEqual({
      id: allMediasResponse.body[0].id,
      username,
      title,
    });
  });
  it('GET /medias/:id => Should receive 404 if media does not exists', async () => {
    await request(app.getHttpServer()).get(`/medias/10000`).expect(404);
  });
  it('PUT /medias/:id => Should receive 404 if media does not exists', async () => {
    const title = faker.company.name();
    const username = faker.person.middleName();
    await request(app.getHttpServer())
      .put(`/medias/10000`)
      .send({ title, username })
      .expect(404);
  });
  it('PUT /medias/:id => Should receive 400 if missing body properties', async () => {
    const title = faker.company.name();
    const username = faker.person.middleName();
    await request(app.getHttpServer())
      .put(`/medias/10000`)
      .send({ username })
      .expect(400);
    await request(app.getHttpServer())
      .put(`/medias/10000`)
      .send({ title })
      .expect(400);
    await request(app.getHttpServer())
      .put(`/medias/10000`)
      .send({})
      .expect(400);
  });
  it('PUT /medias/:id => Should be possible to change a media', async () => {
    const title = faker.company.name();
    const username = faker.person.middleName();
    const newTitle = faker.company.name();
    const newUsername = faker.person.middleName();
    await request(app.getHttpServer())
      .post(`/medias`)
      .send({ username, title });
    const createdMediaResponse = await request(app.getHttpServer()).get(
      `/medias`,
    );
    const { id } = createdMediaResponse.body[0];
    await request(app.getHttpServer())
      .put(`/medias/${id}`)
      .send({ username: newUsername, title: newTitle })
      .expect(200);
    const updateMediaResponse = await request(app.getHttpServer()).get(
      `/medias/${id}`,
    );
    expect(updateMediaResponse.body).toEqual({
      id,
      title: newTitle,
      username: newUsername,
    });
  });
  it('PUT /medias/:id => Should not update a media if met title and username of another media', async () => {
    const title = faker.company.name();
    const username = faker.person.middleName();
    const newTitle = faker.company.name();
    const newUsername = faker.person.middleName();
    await request(app.getHttpServer())
      .post(`/medias`)
      .send({ username, title });
    await request(app.getHttpServer())
      .post(`/medias`)
      .send({ username: newUsername, title: newTitle });
    const createdMediaResponse = await request(app.getHttpServer()).get(
      `/medias`,
    );
    const { id } = createdMediaResponse.body[0];
    await request(app.getHttpServer())
      .put(`/medias/${id}`)
      .send({ username: newUsername, title: newTitle })
      .expect(409);
  });
  it('DELETE /medias/:id => Should be possible to delete a media', async () => {
    const title = faker.company.name();
    const username = faker.person.middleName();
    await request(app.getHttpServer())
      .post(`/medias`)
      .send({ username, title });
    const createdMediaResponse = await request(app.getHttpServer()).get(
      `/medias`,
    );
    const { id } = createdMediaResponse.body[0];
    await request(app.getHttpServer())
      .delete(`/medias/${id}`)
      .send()
      .expect(200);
    const createdMediaAfterDeletingResponse = await request(
      app.getHttpServer(),
    ).get(`/medias`);
    expect(createdMediaAfterDeletingResponse.body).toHaveLength(0);
    expect(createdMediaAfterDeletingResponse.body).toBeInstanceOf(Array);
  });
  it('DELETE /medias/:id => Should receive 404 if media does not exists', async () => {
    await request(app.getHttpServer()).delete(`/medias/10000`).expect(404);
  });
  it('DELETE /medias/:id => Should not be possible to delete a media if its used in some publication', async () => {
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
      .delete(`/medias/${mediaId}`)
      .send()
      .expect(403);
  });
});
