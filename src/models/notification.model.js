import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    senderUser:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverUser:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default: null
    },
    type:{
        type: String,
        enum: ["like", "comment", "follow"],
        required: true
    }
},
{
    timestamps: true
});

export const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);