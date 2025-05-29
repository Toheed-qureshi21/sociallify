import { TryCatch } from "@/utils/TryCatch";

export const GET = TryCatch(async (req, res) => {
   return NextResponse.json({text:"You are admin now"})
})