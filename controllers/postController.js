import { prisma } from "../prisma/index.js";

export const createPostController = async (req, res) => {
  try {
    const { id: authorID, title, content } = req.body;

    if (!title) {
      return res.status(500).send({ error: "The post title is required" });
    }

    const post = await prisma.post.create({
      data: { title, content, authorID },
    });

    res.status(200).send({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};

export const queryLatestController = async (req, res) => {
  try {
    const post = await prisma.post.findFirst({
      orderBy: { updatedAt: "desc" },
      include: { author: { select: { username: true } } },
    });

    res.status(200).send({
      success: true,
      message: "Query latest post successfully",
      post,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};

export const queryPostsController = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      select: { id: true, title: true, content: true, author: true },
    });

    res.status(200).send({
      success: true,
      message: "Query Posts successfully",
      posts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};
