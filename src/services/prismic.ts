import * as prismic from '@prismicio/client';

import * as prismicNext from '@prismicio/next';

export function getPrismicClient(req?: unknown) {
  const client = prismic.createClient(process.env.PRISMIC_ENDPOINT);

  prismicNext.enableAutoPreviews({ client, req: req });

  return client;
}
