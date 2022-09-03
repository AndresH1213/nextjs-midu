const algoliasearch = require('algoliasearch/lite');

const client = algoliasearch('723XVRR562', 'b32f1ff7da0214842fae22ac2a22edde');
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
