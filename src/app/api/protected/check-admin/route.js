import { User } from "@/models/user.model";
import { getTokenCookies, setAuthCookies } from "@/utils/cookie";
import { generateAccessToken, verifyAccessToken, verifyRefreshToken } from "@/utils/tokens";
import { TryCatch } from "@/utils/TryCatch";
import { NextResponse } from "next/server";

export const GET = TryCatch(async (request) => {
    const { accessToken, refreshToken } = await getTokenCookies();

    let id;

    // Case 1: No tokens
    if (!accessToken && !refreshToken) {
        return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
    }

    // Case 2: Has accessToken
    if (accessToken) {
        try {
            const payload = await verifyAccessToken(accessToken);
        
            id = payload.id.toString(); 
            console.log("Access token payload:", id);

        } catch (err) {
            // accessToken invalid, fallback to refreshToken
            if (!refreshToken) {
                return NextResponse.json({ message: "Unauthenticated" }, { status: 401 });
            }

            id = await verifyRefreshToken(refreshToken);
            console.log("Refresh token id:", id);
            const newAccessToken = await generateAccessToken({ id:id.toString() });
            setAuthCookies(newAccessToken, refreshToken);
        }
    }

    // Case 3: No accessToken, only refreshToken
    if (!id && refreshToken) {
        id = await verifyRefreshToken(refreshToken);
        const newAccessToken = await generateAccessToken({ id:id.toString() });
        setAuthCookies(newAccessToken, refreshToken);
    }

    // Fetch user and check role
    id = id.toString();
    const user = await User.findById(id).select("-password");
    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.role !== "admin") {
        return NextResponse.json({ message: "Forbidden access" }, { status: 403 });
    }

    return NextResponse.json({ message: "You are admin now" }, { status: 200 });
});
