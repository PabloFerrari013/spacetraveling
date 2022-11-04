import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

import { BsCalendar4, BsFillPersonFill, BsClock } from 'react-icons/bs';
import { RichText } from 'prismic-dom';

interface Content {
  heading: string;
  body: string;
}

interface Post {
  first_publication_date: string | null;
  readingTime: number;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: Content[];
  };
}

interface PostProps {
  post: Post;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div className={styles.loading}>Loading...</div>;
  } else {
    return (
      <>
        <Head>
          <title>Home | Spacetraveling</title>
        </Head>

        <main className={commonStyles.layout}>
          <article className={styles.container}>
            <img src={post.data.banner.url} alt={post.data.title} />

            <h1>{post.data.title}</h1>

            <div>
              <time>
                <BsCalendar4 />
                {post.first_publication_date}
              </time>

              <span>
                <BsFillPersonFill /> {post.data.author}
              </span>

              <span>
                <BsClock /> {post.readingTime} min
              </span>
            </div>

            {post.data.content.map(content => (
              <div key={content.heading}>
                <h2>{content.heading}</h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: content.body,
                  }}
                />
              </div>
            ))}
          </article>
        </main>
      </>
    );
  }
};

export default Post;

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      {
        params: {
          slug: 'criando-e-configurando-projeto-node.js-com-typescript1',
        },
      },
    ],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient();
  const res = await prismic.getByUID('posts', String(params.slug), {});

  function handleReadingTime(): number {
    const content = res.data.content;

    var total = content.reduce((acumulador, elements) => {
      const headingLength = elements.heading.split(' ').length;
      const bodyLength = RichText.asText(elements.body).split(' ').length;

      return (acumulador += headingLength + bodyLength);
    }, 0);

    return Math.round(total / 200);
  }

  const response = {
    first_publication_date: format(
      new Date(res.first_publication_date),
      "dd 'de' MMM 'de' yyyy",
      {
        locale: ptBR,
      }
    ),
    readingTime: handleReadingTime(),
    data: {
      title: res.data.title,
      banner: {
        url: res.data.banner.url,
      },
      author: res.data.author,
      content: res.data.content.map((content: Content) => {
        return {
          heading: content.heading,
          body: RichText.asHtml(content.body),
        };
      }),
    },
  };

  return { props: { post: response } };
};
