import jwt, { type SignOptions } from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
}

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  return secret;
};

const getJwtExpiresIn = (): NonNullable<SignOptions["expiresIn"]> => {
  const expiresIn = process.env.JWT_EXPIRES_IN;

  if (!expiresIn) {
    throw new Error("JWT_EXPIRES_IN is not defined");
  }

  return expiresIn as NonNullable<SignOptions["expiresIn"]>;
};

export const generateToken = (userId: string): string => {
  const options: SignOptions = {
    expiresIn: getJwtExpiresIn(),
  };

  return jwt.sign(
    { userId } satisfies JwtPayload,
    getJwtSecret(),
    options,
  );
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, getJwtSecret()) as JwtPayload;
};