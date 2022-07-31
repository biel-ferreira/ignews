import { GetServerSideProps } from "next";
import Head from "next/head";
import { getSession } from "next-auth/react";

import { RichText } from "prismic-dom";
import { getPrismicClient } from "../../services/prismic";
import { ISession } from "../api/auth/[...nextauth]";

// import { IPostProps } from "../../@interfaces/pages/posts";
import styles from "./post.module.scss";

export interface IPostProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  };
}

export default function Post({ post }: IPostProps) {
  console.log("--- post no slug ---");

  console.log(post);

  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const session = (await getSession({ req })) as ISession;
  const { slug } = params;

  console.log("---- slug -----");
  console.log(slug);

  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const prismic = getPrismicClient(req);
  console.log("--------- SLUG ANTES DO RESPONSE ------");

  console.log(slug);
  const response = await prismic.getByUID("publication", String(slug), {});

  console.log("response ");
  console.log(response);

  const post = {
    slug,
    title: response.data.Title,
    content: RichText.asHtml(response.data.Content),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      "pt-BR",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ),
  };

  console.log("-------- POST CRIADO ---------");

  return {
    props: {
      post,
    },
  };
};
