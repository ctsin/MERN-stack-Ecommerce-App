import { prisma } from "../prisma/index.js";



export const createPostController = async (req, res) => {
  const { id: authorID, title, content, categoryIDs } = req.body;

  if (!title) {
    return res.status(500).send({ error: "The post title is required" });
  }

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        author: {
          connect: { id: authorID },
        },
        categories: {
          connect: categoryIDs.map((id) => ({ id })),
        },
      },
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

export const updatePostController = async (req, res) => {
  const { postID, categoryID } = req.params;

  if (!postID || !categoryID) {
    return res
      .status(500)
      .send({ error: "The post and category ID are required" });
  }

  try {
    const post = await prisma.post.update({
      where: { id: postID },
      data: {
        categories: {
          disconnect: { id: categoryID },
        },
      },
    });

    res.status(200).send({
      success: true,
      message: "Post updated successfully",
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
      select: {
        id: true,
        title: true,
        content: true,
        author: true,
        categories: {
          select: {
            id: true,
            label: true,
          },
        },
      },
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
