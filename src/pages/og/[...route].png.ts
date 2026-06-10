import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { generateOgImage } from '../../utils/generateOgImage';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);

  const staticPages = [
    { params: { route: 'og' }, props: { title: 'actualfuckingwebsite.com', subtitle: undefined } },
    { params: { route: 'about' }, props: { title: 'About', subtitle: undefined } },
    { params: { route: 'now' }, props: { title: 'Now', subtitle: undefined } },
    { params: { route: 'uses' }, props: { title: 'Uses', subtitle: undefined } },
    { params: { route: 'contact' }, props: { title: 'Contact', subtitle: undefined } },
    { params: { route: 'blog' }, props: { title: 'Blog', subtitle: undefined } },
  ];

  const blogPages = posts.map((post) => ({
    params: { route: `blog/${post.id}` },
    props: { title: post.data.title, subtitle: post.data.description },
  }));

  return [...staticPages, ...blogPages];
}

export const GET: APIRoute = async ({ props }) => {
  const png = await generateOgImage(props.title as string, props.subtitle as string | undefined);
  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
