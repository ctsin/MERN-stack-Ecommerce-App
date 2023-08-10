import { prisma } from "../prisma/index.js";

export const createProfileController = async (req, res) => {
  try {
    const { id, avatar } = req.body;

    if (!id || !avatar) {
      return res.status(500).send({ error: "ID and avatar are required" });
    }

    const profile = await prisma.profile.create({
      data: { avatar, userId: id },
    });

    res.status(200).send({
      success: true,
      message: "Profile created successfully",
      profile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};
