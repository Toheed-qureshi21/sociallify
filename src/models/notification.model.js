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
        enum: ["LIKE", "COMMENT", "FOLLOW"],
        required: true
    },  
    isRead:{
        type: Boolean,
        default:false,
    },
    comment:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Comment",
        default: null
    },

},
{
    timestamps: true
});

export const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);