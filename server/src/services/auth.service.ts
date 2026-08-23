import bcrypt from "bcryptjs";

import { User } from "../models/user.model.js";
import { LoginInput, RegisterInput } from "../validators/auth.validator.js";
import { generateToken } from "../utils/jwt.js";
import { ConflictError, UnauthorizedError } from "../errors/app-error.js";

export const registerUser = async (input: RegisterInput) => {
    const existingUser = await User.findOne({ email: input.email });

    if(existingUser) {
        throw new ConflictError("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user = await User.create({
        name: input.name,
        email: input.email,
        password: hashedPassword
    });

    const token = generateToken(user._id.toString());

    return{
        user:{
            id: user._id.toString(),
            name: user.name,
            email: user.email
        },
        token,
    };
};

export const loginUser = async (input: LoginInput) => {
    const user = await User.findOne({ email: input.email }).select("+password");

    if(!user) {
        throw new UnauthorizedError("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);

    if(!isPasswordValid) {
        throw new UnauthorizedError("Invalid email or password");
    }

    const token = generateToken(user._id.toString());

    return{
        user:{
            id: user._id.toString(),
            name: user.name,
            email: user.email
        },
        token,
    };
}


export const getCurrentUser = async (userId: string) => {
    const user = await User.findById(userId).select("_id name email");

    if(!user) {
        throw new UnauthorizedError("User not found");
    };

    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email
    };
}