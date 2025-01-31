import axios from 'axios';
import React from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Image from 'next/image';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export async function generateMetadata({ params }) {
  const { slug } = params; // Access slug from params
  const STRAPI_API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  // Fetch the blog details to get metadata
  const fetchBlogDetails = async () => {
    try {
      const response = await axios({
        method: 'GET',
        url: `https://blgts.luzo.app/api/blogs?filters[slug][$eq]=${slug}`,
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data.data[0]; // Assuming the first item is the correct blog
    } catch (error) {
      console.error('Failed to fetch blog details:', error);
      return null;
    }
  };

  const blog = await fetchBlogDetails();

  // Return dynamic metadata based on API response
  return {
    title: blog?.seo_meta_title || 'Default Title',
    description: blog?.seo_meta_description || 'Default Description',
  };
}

const BlogDetails = async ({ params }) => {
  const { slug } = params; // Access slug from params
  const STRAPI_API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

  // Fetch the blog details based on the slug
  const fetchBlogDetails = async () => {
    try {
      const response = await axios({
        method: 'GET',
        url: `https://blgts.luzo.app/api/blogs?filters[slug][$eq]=${slug}&populate=media_content`,
        headers: {
          Authorization: `Bearer ${STRAPI_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data.data[0]; // Assuming the first item is the correct blog
    } catch (error) {
      console.error('Failed to fetch blog details:', error);
      return null;
    }
  };

  const blog = await fetchBlogDetails();

  if (!blog) {
    return <p>Failed to load blog details.</p>;
  }

  const { title, content, media_content, published_date } = blog;

  return (
    <>
      <Navbar />
      <div className="mt-[100px] mb-[50px] px-[20px] sm:px-[120px]">
        {media_content?.formats?.thumbnail?.url && (
          <Image
            src={`https://blgts.luzo.app${media_content.formats.thumbnail.url}`}
            width={800}
            height={450}
            className="w-full sm:h-[60vh] aspect-video"
            alt={title}
          />
        )}
        <h1 className="font-bold sm:text-[40px] text-[28px] mt-4">{title}</h1>
        {content && (
          <div className="text-[16px] font-medium mt-4 markdown-body">
            <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
          </div>
        )}
        <p className="text-gray-400 mt-2">
          Published on:{' '}
          {new Date(published_date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </p>
      </div>
      <Footer />
    </>
  );
};

export default BlogDetails;







