import Header from '../components/Header';
import Head from 'next/head';
import fs from 'fs/promises';
import Link from 'next/link';
import Image from 'next/image';

export default function Home({ latestComics }) {
  return (
    <div>
      <Head>
        <title>xkcd - Comiscs for developers</title>
        <meta name="description" content="Comics for developers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main>
        <h2 className="text-3xl font-bold text-center mb-10">Latest Comics</h2>
        <section
          className="grid grid-cols-1 gap-2 max-w-md m-auto sm:grid-cols-2 
        md:grid-cols-3"
        >
          {latestComics.map((comic) => {
            return (
              <Link key={comic.id} href={`/comic/${comic.id}`}>
                <a className="mb-4 pb-4 m-auto">
                  <h3 className="font-semibold text-sm text-center pd-2">
                    {comic.title}
                  </h3>

                  <Image
                    width={comic.width}
                    height={comic.height}
                    src={comic.img}
                    alt={comic.alt}
                  />
                </a>
              </Link>
            );
          })}
        </section>
      </main>
    </div>
  );
}

export async function getStaticProps(context) {
  const files = await fs.readdir('./comics');
  const promisesFiles = files.slice(-8).map(async (file) => {
    const content = await fs.readFile(`./comics/${file}`, 'utf-8');
    return JSON.parse(content);
  });
  const latestComics = await Promise.all(promisesFiles);
  return {
    props: {
      latestComics,
    },
  };
}
