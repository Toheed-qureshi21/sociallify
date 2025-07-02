import { connectDb } from "@/lib/mongodb/connectDb.js";
import { NextResponse } from "next/server";

export const TryCatch=(handlerFunction) => {
   return async(request,context)=>{
    try {
        await connectDb();
        return await handlerFunction(request,context);
    } catch (error) {
        console.log("error",error);
        return NextResponse.json({message:error.message ||"Something went wrong"},{status:500});
    }
   }
}
