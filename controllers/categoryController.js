import { prisma } from "../prisma/index.js";

export const createCategoryController = async (req, res) => {
  const { label } = req.body;

  if (!label) {
    return res.status(500).send({ error: "The label is required" });
  }

  try {
    const category = await prisma.category.create({
      data: {
        label,
      },
    });

    res.status(200).send({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};

export const queryCategoriesController = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();

    res.status(200).send({
      success: true,
      message: "Query Categories successfully",
      categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};

export const deleteCategoryController = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(500).send({ error: "The category ID is required" });
  }

  try {
    await prisma.category.delete({ where: { id } });

    res.status(200).send({
      success: true,
      message: "Delete Category successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};
