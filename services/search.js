const algoliasearch = require('algoliasearch/lite');

const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_API_KEY
);
const index = client.initIndex('prod_comics_next');

const CACHE = {};

export const search = async ({ query }) => {
  if (CACHE[query]) return { results: CACHE[query] };

  const { hits } = await index.search(query, {
    attributesToRetrieve: ['id', 'title', 'img', 'alt'],
    hitsPerPage: 10,
  });

  CACHE[query] = hits;

  return { results: hits };
};
