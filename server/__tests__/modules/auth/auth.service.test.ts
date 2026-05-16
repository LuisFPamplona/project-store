/// <reference types="jest" />

// These tests mock prisma, bcrypt and jsonwebtoken to exercise error branches

describe("auth.service - environment and error branches", () => {
  const ORIGINAL_ENV = process.env;

  afterEach(() => {
    jest.resetModules();
    process.env = { ...ORIGINAL_ENV };
    jest.clearAllMocks();
  });

  it("throws if JWT_SECRET is not set when generating login token", async () => {
    process.env = {} as any; // remove JWT_SECRET

    jest.resetModules();
    jest.mock("../../../src/lib/prisma", () => ({
      prisma: {
        user: {
          findUnique: jest.fn().mockResolvedValue({
            id: "u1",
            name: "n",
            email: "e",
            password: "hashed",
            role: "USER",
            cart: { id: "c1" },
          }),
        },
      },
    }));

    jest.mock("bcrypt", () => ({
      compare: jest.fn().mockResolvedValue(true),
    }));

    const svc = require("../../../src/modules/auth/auth.service");

    await expect(svc.loginService("e", "pwd")).rejects.toThrow(
      "JWT_SECRET environment variable is not set",
    );
  });

  it("register throws when user already exists", async () => {
    process.env.JWT_SECRET = "test_secret";

    jest.mock("../../../src/lib/prisma", () => ({
      prisma: {
        user: {
          findUnique: jest.fn().mockResolvedValue({ id: "u1" }),
        },
      },
    }));

    const svc = require("../../../src/modules/auth/auth.service");

    await expect(
      svc.register("name", "email@test.com", "pwd"),
    ).rejects.toThrow("User already exists");
  });

  it("register throws when prisma.create returns falsy", async () => {
    process.env.JWT_SECRET = "test_secret";

    jest.mock("../../../src/lib/prisma", () => ({
      prisma: {
        user: {
          findUnique: jest.fn().mockResolvedValue(null),
          create: jest.fn().mockResolvedValue(null),
        },
      },
    }));

    jest.mock("bcrypt", () => ({
      genSaltSync: jest.fn().mockReturnValue("salt"),
      hash: jest.fn().mockResolvedValue("hashed"),
    }));

    const svc = require("../../../src/modules/auth/auth.service");

    await expect(
      svc.register("name", "email@test.com", "pwd"),
    ).rejects.toThrow("User creation failed");
  });

  it("loginService throws when user not found or cart null", async () => {
    process.env.JWT_SECRET = "test_secret";

    jest.mock("../../../src/lib/prisma", () => ({
      prisma: {
        user: {
          findUnique: jest.fn().mockResolvedValue(null),
        },
      },
    }));

    const svc = require("../../../src/modules/auth/auth.service");

    await expect(svc.loginService("a", "b")).rejects.toThrow(
      "Invalid credentials",
    );
  });

  it("loginService throws when password invalid", async () => {
    process.env.JWT_SECRET = "test_secret";

    jest.mock("../../../src/lib/prisma", () => ({
      prisma: {
        user: {
          findUnique: jest.fn().mockResolvedValue({
            id: "u1",
            name: "n",
            email: "e",
            password: "hashed",
            role: "USER",
            cart: { id: "c1" },
          }),
        },
      },
    }));

    jest.mock("bcrypt", () => ({
      compare: jest.fn().mockResolvedValue(false),
    }));

    const svc = require("../../../src/modules/auth/auth.service");

    await expect(svc.loginService("e", "wrongpwd")).rejects.toThrow(
      "Invalid credentials",
    );
  });
});
