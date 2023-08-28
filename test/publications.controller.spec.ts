import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';
import { faker } from '@faker-js/faker';
import { makeMedia } from './factories/medias.factories';
import { makePost } from './factories/posts.factories';

describe('PublicationsController', () => {
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
  //criei só o caso de sucesso na criação e falta update
  it('POST /publications => Should be possible to create publications', async () => {
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
      .send({ mediaId, postId, date })
      .expect(201);
  });
  it('POST /publications => Should return 404 if mediaId or postId not found in the database', async () => {
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
      .send({ mediaId: 99999999, postId, date })
      .expect(404);
    await request(app.getHttpServer())
      .post('/publications')
      .send({ mediaId, postId: 99999999, date })
      .expect(404);
  });

  it('POST /publications => Should return 400 when creating a publication without required fields', async () => {
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
      .send({ postId, date })
      .expect(400);
    await request(app.getHttpServer())
      .post('/publications')
      .send({ mediaId, date })
      .expect(400);
    await request(app.getHttpServer())
      .post('/publications')
      .send({ mediaId, postId })
      .expect(400);
  });
  it('GET /publications => Should return an empty array if there is no publications', async () => {
    const publicationsResponse = await request(app.getHttpServer()).get(
      '/publications',
    );
    expect(publicationsResponse.body).toHaveLength(0);
    expect(publicationsResponse.body).toBeInstanceOf(Array);
  });
  it('GET /publications => Should be possible get publications', async () => {
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
      .send({ mediaId, postId, date })
      .expect(201);
    const publicationsResponse = await request(app.getHttpServer()).get(
      '/publications',
    );
    expect(publicationsResponse.body).toHaveLength(1);
    expect(publicationsResponse.body).toBeInstanceOf(Array);
    expect(publicationsResponse.body).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(Number),
          mediaId: expect.any(Number),
          postId: expect.any(Number),
          date: expect.any(String),
        },
      ]),
    );
  });
  it('GET /publications/:id => Should be possible get the publication if exists', async () => {
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

    const publicationsResponse = await request(app.getHttpServer()).get(
      '/publications',
    );
    const { id } = publicationsResponse.body[0];
    const publicationResponse = await request(app.getHttpServer())
      .get(`/publications/${id}`)
      .expect(200);
    expect(publicationResponse.body).toEqual(
      expect.arrayContaining([
        {
          id: expect.any(Number),
          mediaId: expect.any(Number),
          postId: expect.any(Number),
          date: expect.any(String),
        },
      ]),
    );
  });
  it('GET /publications/:id => Should receive 404 if publication does not exists', async () => {
    await request(app.getHttpServer()).get(`/publications/10000`).expect(404);
  });
  it('DELETE /publications/:id => Should receive 404 if publication does not exists', async () => {
    await request(app.getHttpServer())
      .delete(`/publications/10000`)
      .expect(404);
  });
  it('DELETE /publications/:id => Should be possible to delete a publication', async () => {
    const { text: postText, title: postTitle } = makePost();
    const { title, username } = makeMedia();
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

    const publicationsResponse = await request(app.getHttpServer()).get(
      '/publications',
    );
    const { id } = publicationsResponse.body[0];
    await request(app.getHttpServer())
      .delete(`/publications/${id}`)
      .send({ mediaId, postId, date })
      .expect(200);
  });
  // -----------------------------------UPDATE PUBLICATIONS MISSING
  it('UPDATE /publications/:id => Should be possible to update a publication', async () => {
    const { text: postText, title: postTitle } = makePost();
    const { text: newPostText, title: newPostTitle } = makePost();
    const { title, username } = makeMedia();
    const { title: newMediaTitle, username: newMediaUsername } = makeMedia();
    const date = faker.date.future();
    const newDate = faker.date.future();

    await request(app.getHttpServer())
      .post(`/medias`)
      .send({ username, title });
    await request(app.getHttpServer())
      .post(`/medias`)
      .send({ username: newMediaUsername, title: newMediaTitle });
    const createdMediaResponse = await request(app.getHttpServer()).get(
      `/medias`,
    );

    const { id: mediaId } = createdMediaResponse.body[0];
    const { id: newMediaId } = createdMediaResponse.body[1];
    await request(app.getHttpServer())
      .post('/posts')
      .send({ title: postTitle, text: postText });
    await request(app.getHttpServer())
      .post('/posts')
      .send({ title: newPostTitle, text: newPostText });
    const createdPostResponse = await request(app.getHttpServer()).get(
      `/posts`,
    );
    const { id: postId } = createdPostResponse.body[0];
    const { id: newPostId } = createdPostResponse.body[1];
    await request(app.getHttpServer())
      .post('/publications')
      .send({ mediaId, postId, date });

    const publicationsResponse = await request(app.getHttpServer()).get(
      '/publications',
    );
    const { id } = publicationsResponse.body[0];

    await request(app.getHttpServer())
      .put(`/publications/${id}`)
      .send({ mediaId: newMediaId, postId: newPostId, date: newDate });

    const publicationResponse = await request(app.getHttpServer()).get(
      `/publications/${id}`,
    );
    expect(publicationResponse.body).toEqual([
      {
        id,
        mediaId: newMediaId,
        postId: newPostId,
        date: `${new Date(newDate).toISOString()}`,
      },
    ]);
  });
});
