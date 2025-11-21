import React from "react";
import SafeImage from "./SafeImage";

const BlogCard = ({ blog }) => {
  return (
    <div className="border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition">
      <SafeImage
        src={blog.image}
        alt={blog.title}
        width={400}
        height={400}
        className="h-48 w-full object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg text-[#a3632d] mb-2">
          {blog.title}
        </h3>
        <p className="text-sm text-gray-600 mb-1">By {blog.author}</p>
        <p className="text-sm text-gray-500 mb-3">{blog.date}</p>
        <p className="text-gray-700 text-sm">{blog.summary}</p>
      </div>
    </div>
  );
};

export default BlogCard;
