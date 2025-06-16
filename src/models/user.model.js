import mongoose, { model, models } from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function () {
            // Required only if not using OAuth
            return !this.oauth
        },
        minLength: 6,
    },
    oauth: {
        type: Boolean,
        default: false,
    },

    bio: {
        type: String,
        default: ""
    },
    profilePic: {
        type: String,
    },

    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
    }],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default: [],
    }],

}, { timestamps: true });

userSchema.pre('findOneAndDelete', async function (next) {
    const user = await this.model.findOne(this.getFilter());
    if (user) {
        // Remove all posts associated with the user
        await mongoose.model("Post").deleteMany({ userId: user._id });
        // Remove all comments associated with the user
        await mongoose.model("Comment").deleteMany({ userId: user._id });
        await mongoose.model("Like").deleteMany({ userId: user._id });
        await mongoose.model("Notification").deleteMany({ receiverUser: user._id || senderUser._id });
    }
    next();
})

export const User = models?.User || model("User", userSchema);