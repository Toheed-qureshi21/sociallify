import mongoose, { model, models } from "mongoose";

const verifyEmailSchema = new mongoose.Schema({
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        otp:{
            type:String,
            required:true
        },
        expiresAt:{
            type:Date,
            required:true,
            index: { expires: 0 }, // TTL index — Mongo will delete doc when this date is passed
        }
},{
    timestamps:true,
});

export const VerifyEmail = models.VerifyEmail || model("VerifyEmail", verifyEmailSchema);