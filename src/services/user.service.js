import { Notification } from "@/models/notification.model";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const toggleFollowAndUnfollow = async (
  currentUser,
  userToFollowOrUnfollow
) => {
  const session = await mongoose.startSession();

  try {
    const isFollowing = currentUser.following.includes(userToFollowOrUnfollow._id);

    if (isFollowing) {
      // Unfollow without transaction
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== userToFollowOrUnfollow._id.toString()
      );
      userToFollowOrUnfollow.followers = userToFollowOrUnfollow.followers.filter(
        (id) => id.toString() !== currentUser._id.toString()
      );

      await currentUser.save();
      await userToFollowOrUnfollow.save();

      return NextResponse.json(
        {
          message: `You have unfollowed ${userToFollowOrUnfollow.name}`,
          currentUser,
          followed: false,
        },
        { status: 200 }
      );
    } else {
      // Follow with transaction
      await session.withTransaction(async () => {
        // Re-fetch documents within the session to ensure correct behavior
        const current = await mongoose
          .model("User")
          .findById(currentUser._id)
          .session(session);
        const target = await mongoose
          .model("User")
          .findById(userToFollowOrUnfollow._id)
          .session(session);

        if (!current || !target) throw new Error("User(s) not found");

        current.following.push(target._id);
        target.followers.push(current._id);

        await current.save({ session });
        await target.save({ session });

        await Notification.create(
          [
            {
              senderUser: current._id,
              receiverUser: target._id,
              type: "FOLLOW",
            },
          ],
          { session }
        );
      });

      return NextResponse.json(
        {
          message: `You have followed ${userToFollowOrUnfollow.name}`,
          followed: true,
          currentUser,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Transaction failed:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  } finally {
    await session.endSession();
  }
};
