import JWT from "jsonwebtoken";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import { prisma } from "../prisma/index.js";

export const registerController = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username) {
      return res.send({
        message: "Name is required",
      });
    }
    if (!password) {
      return res.send({
        message: "Password is required",
      });
    }

    const existingUser = await prisma.user.findFirst({ where: { username } });
    if (existingUser)
      return res
        .status(200)
        .send({ success: true, message: "User already exists. Pls sign in" });

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    res
      .status(200)
      .send({ success: true, message: "User registered successfully", user });
  } catch (error) {
    console.error(error);

    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(404).send({
        success: false,
        message: "Username and Password are required",
      });
    }

    const user = await prisma.user.findFirst({ where: { username } });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.status(400).send({
        success: false,
        message: "Invalid Password",
      });
    }

    const userPayload = { username: user.username, id: user.id };

    const token = JWT.sign(userPayload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "User logged in successfully",
      user: { ...userPayload, token },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};

export const resetController = async (req, res) => {
  try {
    const { id, password, newPassword, confirmPassword } = req.body;

    if (!newPassword || !confirmPassword) {
      return res.status(400).send({
        success: false,
        message: "New password and confirm password are required",
      });
    }

    if (!id) {
      return res.status(400).send({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await prisma.user.findFirst({ where: { id } });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.status(400).send({
        success: false,
        message: "User password DO NOT match",
      });
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return res.status(200).send({
      success: true,
      message: "Reset password successfully",
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: "Reset password failed",
    });
  }
};

export const testController = async (req, res) => {
  try {
    res.status(200).send("Protected Routes");
  } catch (error) {
    console.error(error);
    res.status(500).send({ error });
  }
};
