import Blog from "../models/Blog.js";

export async function createBlog({ title, content, author, image }) {
  const blog = new Blog({ title, content, image, author });
  return blog.save();
}

export async function getMyBlogs(authorId) {
  return Blog.find({ author: authorId })
    .populate("author", "username")
    .sort({ createdAt: -1 });
}

export async function getAllBlogs({ page = 1, limit = 20 } = {}) {
  const skip = (page - 1) * limit;
  const total = await Blog.countDocuments();
  const blogs = await Blog.find()
    .populate("author", "username")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  return { blogs, total };
}

export async function findBlogById(id) {
  return Blog.findById(id).populate("author", "username");
}

export async function updateBlog(id, authorId, updateData) {
  const blog = await Blog.findById(id);
  if (!blog) throw new Error("Blog not found");
  if (blog.author.toString() !== authorId) throw new Error("Not authorized");

  blog.title = updateData.title ?? blog.title;
  blog.content = updateData.content ?? blog.content;
  blog.image = updateData.image ?? blog.image;

  return blog.save();
}

export async function deleteBlog(id, authorId) {
  const blog = await Blog.findById(id);
  if (!blog) throw new Error("Blog not found");
  if (blog.author.toString() !== authorId) throw new Error("Not authorized");
  await blog.deleteOne();
  return;
}
