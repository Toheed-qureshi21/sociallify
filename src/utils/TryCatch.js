import { connectDb } from "@/lib/mongodb/connectDb.js";
import { NextResponse } from "next/server";

export const TryCatch=(handlerFunction) => {
   return async(request)=>{
    try {
        await connectDb();
        return await handlerFunction(request);
    } catch (error) {
        console.log(error);
        return NextResponse.json({message:error ||"Something went wrong"},{status:500});
    }
   }
}
