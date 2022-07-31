import * as prismic from "@prismicio/client";

export function getPrismicClient(req?: unknown) {
  const client = prismic.createClient(
    "https://ignewsforcms.prismic.io/api/v2",
    {
      accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    }
  );

  return client;
}
