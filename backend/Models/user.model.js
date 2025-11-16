import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        fullName : {
            type : String,
            required : true,
            index : true,
        },
        email : {
            type : String,
            required : true,
            unique : true,
            lowerCase : true,
            index : true,
        },
        userName : {
            type : String,
            required : true,
            unique : true,
            lowerCase : true,
            index : true,
        },
        password : {
            type : String,
            required : true,
        },
        refreshToken : {
            type : String,
        }
    },
    {
        timestamps : true,
    }
);

export const User = mongoose.model("User",userSchema);