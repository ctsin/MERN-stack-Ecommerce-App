import profileModel from "../models/profileModel.js";

export const createProfileController = async (req, res) => {
  try {
    const { name, avatar } = req.body;

    if (!name || !avatar) {
      return res.status(500).send({ error: "Name and avatar are required" });
    }

    const product = await profileModel.create({ ...req.body });

    res.status(200).send({
      success: true,
      message: "Profile created successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};
