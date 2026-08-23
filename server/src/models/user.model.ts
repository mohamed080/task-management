import { Schema, model, type HydratedDocument} from "mongoose";

export interface IUser {
    name: string;
    email: string;
    password: string;
}

export type UserDocument = HydratedDocument<IUser>;

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minLength: 2,
            maxLength: 100
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            select: false,

        },
    },{
        timestamps: true
    }
)

export const User = model<IUser>('User', userSchema);