-- CreateTable
CREATE TABLE "medias" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "username" VARCHAR(100) NOT NULL,

    CONSTRAINT "medias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR NOT NULL,
    "text" VARCHAR NOT NULL,
    "image" VARCHAR,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publications" (
    "id" SERIAL NOT NULL,
    "mediaId" INTEGER,
    "postId" INTEGER,
    "date" TIMESTAMP(6),

    CONSTRAINT "publications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "publications" ADD CONSTRAINT "publications_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "medias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "publications" ADD CONSTRAINT "publications_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
