'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const BlogCard = ({ blog }) => {
  const router = useRouter();

  // Function to truncate text directly from blog.content
  const getTruncatedDescription = (content, wordLimit) => {
    if (content) {
      const words = content.split(' ');
      if (words.length > wordLimit) {
        return words.slice(0, wordLimit).join(' ') + '...';
      }
      return content;
    }
    return '';
  };

  const handleClick = () => {
    // Navigate using the slug in the URL
    router.push(`/blogs/${blog.slug}`);
  };

  return (
    <div
      className="border p-4 w-full sm:w-[32%]"
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      {blog?.media_content?.formats?.thumbnail?.url && (
        <Image
          src={"https://blgts.luzo.app" + blog.media_content.formats.thumbnail.url}
          width={150}
          height={100}
          className="w-full aspect-video"
          alt={blog.title}
        />
      )}
      <h2 className="font-bold sm:text-[30px] text-[20px]">{blog.title}</h2>
      {blog.content && (
        <div className="text-[14px] text-gray-600 mt-2">
          <Markdown remarkPlugins={[remarkGfm]}>
            {getTruncatedDescription(blog.content, 15)}
          </Markdown>
          <span className="text-blue-500 font-medium">read article</span>
        </div>
      )}
    </div>
  );
};

export default BlogCard;
