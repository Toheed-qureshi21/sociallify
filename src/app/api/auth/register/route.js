import { SignupSchema } from "@/lib/validator/zod.js";
import { TryCatch } from "@/utils/TryCatch.js";
import { User } from "@/models/user.model.js";
import { NextResponse } from "next/server";
import { toHashPassword } from "@/services/auth.service.js";
import { generateAccessToken, generateRefreshToken } from "@/utils/tokens.js";
import { setAuthCookies } from "@/utils/cookie.js";

export const POST = TryCatch(async (request) => {
    const body = await request.json();
    if (!body.email || !body.password || !body.name) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    const result = SignupSchema.safeParse(body);
    if (!result.success) {
        return NextResponse.json({ message: result.error }, { status: 400 });
    }
    const {name,email,password} = result.data;
    let user = await User.findOne({email});
    if (user) {
        return NextResponse.json({ message: "User already exists with this email" }, { status: 400 });
    }
    const hashedPassword = await toHashPassword(password,12);
    user = await User.create({name,email,password:hashedPassword});
    user.password = undefined;
    const accessToken = await generateAccessToken({id:user._id});
    const refreshToken = await generateRefreshToken({id:user._id});
    await setAuthCookies(accessToken,refreshToken);
    return NextResponse.json({ user,message:"User registered successfully" }, { status: 201 });
});