import { getTokenCookies, setAuthCookies } from "@/utils/cookie";
import { generateAccessToken, verifyAccessToken, verifyRefreshToken } from "@/utils/tokens";
import { User } from "../../../../models/user.model.js";
import { NextResponse } from "next/server";
import { TryCatch } from "@/utils/TryCatch.js";


//! api route (/api/auth/profile) to get user profile information
export const GET = TryCatch(async (request) => {
        const { accessToken, refreshToken } = await getTokenCookies();
        if (!accessToken || !refreshToken) {
            return NextResponse.json({ message: "User not authenticated" }, { status: 401 });
        }
        let payload = await verifyAccessToken(accessToken);

        if(!payload && refreshToken){
            const refreshPayload = await verifyRefreshToken(refreshToken);
            if(!refreshPayload){
                return NextResponse.json({ message: "Invalid token" }, { status: 401 });
            }
            const newAccessToken = await generateAccessToken({id:refreshPayload.id});
            setAuthCookies(newAccessToken, refreshToken);
            payload = refreshPayload
            
        }
        if (!payload) {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        }
        const user = await User.findById(payload).select("-password");
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        return NextResponse.json({ user }, { status: 200 });
})