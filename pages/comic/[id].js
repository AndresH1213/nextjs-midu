import Head from 'next/head';
import Image from 'next/image';
import fs from 'fs/promises';
import Link from 'next/link';
import { basename } from 'path';
import { Layout } from 'components/Layout';

export default function Comic({
  id,
  img,
  alt,
  title,
  width,
  height,
  prevId,
  nextId,
  hasPrevious,
  hasNext,
}) {
  return (
    <>
      <Head>
        <title>xkcd - Comiscs for developers</title>
        <meta name="description" content="Comics for developers" />
      </Head>
      <Layout>
        <section className="max-w-lg m-auto">
          <h1 className="font-bold text-xl text-center mb-4">{title}</h1>
          <div className="max-w-xs m-auto mb-4">
            <Image
              layout="responsive"
              width={width}
              height={height}
              src={img}
              alt={alt}
            />
          </div>
          <p>{alt}</p>
          <div className="flex justify-between mt-4 font-bold">
            {hasPrevious && (
              <Link href={`/comic/${prevId}`}>
                <a className="text-gray-600">⬅️ Previous</a>
              </Link>
            )}
            {hasNext && (
              <Link href={`/comic/${nextId}`}>
                <a className="text-gray-600">Next ➡️</a>
              </Link>
            )}
          </div>
        </section>
      </Layout>
    </>
  );
}

export async function getStaticPaths({ locales }) {
  const files = await fs.readdir('./comics');
  let paths = [];

  //locales -> ['es', 'en']
  locales.forEach((locale) => {
    paths = paths.concat([
      ...files.map((file) => {
        const id = basename(file, '.json');
        return { params: { id }, locale };
      }),
    ]);
  });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { id } = params;
  const content = await fs.readFile(`./comics/${id}.json`, 'utf-8');
  const comic = JSON.parse(content);

  const idNumber = +id;
  const prevId = idNumber - 1;
  const nextId = idNumber + 1;

  const [prevResult, nextResult] = await Promise.allSettled([
    fs.stat(`./comics/${prevId}.json`),
    fs.stat(`./comics/${nextId}.json`),
  ]);

  const hasPrevious = prevResult.status === 'fulfilled';
  const hasNext = nextResult.status === 'fulfilled';

  return {
    props: {
      ...comic,
      prevId,
      nextId,
      hasPrevious,
      hasNext,
    },
  };
}
