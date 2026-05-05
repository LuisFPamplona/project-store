import { Request, Response } from "express";
import { createUserSchema, loginUserSchema } from "../schemas/auth.schemas";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

export const createUser = async (req: Request, res: Response) => {
  const parsedBody = createUserSchema.safeParse(req.body);

  if (!parsedBody.success) {
    return res
      .status(400)
      .json({ success: false, message: parsedBody.error.issues[0].message });
  }

  const { name, email, password } = parsedBody.data;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const SALT = bcrypt.genSaltSync(10);

    const hashedPassword = await bcrypt.hash(password, SALT);

    const data = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: { id: true, name: true, email: true },
    });

    if (!data) {
      return res
        .status(400)
        .json({ success: false, message: "User creation failed" });
    }

    res
      .status(201)
      .json({ success: true, data, message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const parsedBody = loginUserSchema.safeParse(req.body);

  if (!parsedBody.success) {
    return res
      .status(400)
      .json({ success: false, message: parsedBody.error.issues[0].message });
  }

  const { email, password } = parsedBody.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      success: true,
      data: {
        token,
        user: { id: user.id, name: user.name, email: user.email },
      },
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
