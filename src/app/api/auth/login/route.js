import { TryCatch } from "@/utils/TryCatch.js";
import {AuthSchema} from "@/lib/validator/zod.js";
import { NextResponse } from "next/server";
import { User } from "@/models/user.model";
import { toComparePassword } from "@/services/auth.service";
import { generateAccessToken, generateRefreshToken } from "@/utils/tokens";
import { setAuthCookies } from "@/utils/cookie";

export const POST = TryCatch(async (request) => {
    const body = await request.json();
    const result = AuthSchema.safeParse(body);
    if (!result.success) {
            return NextResponse.json({ message: result.error.flatten() }, { status: 400 });
        }
        const {email,password} = result.data;
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        const isPasswordValid = await toComparePassword(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        } 
        user.password = undefined; 
        const accessToken = await generateAccessToken({ id: user._id });
        const refreshToken = await generateRefreshToken({ id: user._id });
          return setAuthCookies(
    accessToken,
    refreshToken,
    { user, message: "User logged in successfully" },
    200
  );
}) 