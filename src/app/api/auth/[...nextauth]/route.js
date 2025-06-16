import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import { cookies } from "next/headers"
import { User } from "@/models/user.model"
import { generateAccessToken, generateRefreshToken } from "@/utils/tokens"
import { connectDb } from "@/lib/mongodb/connectDb.js"


export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,

  callbacks: {
    async signIn({ user }) {
  try {
    await connectDb()

    let dbUser = await User.findOne({ email: user.email })

    if (!dbUser) {
      dbUser = await User.create({
        name: user.name,
        email: user.email,
        profilePic: user.image,
        oauth: true,
      })
    }

    const accessToken = await generateAccessToken({ id: dbUser._id })
    const refreshToken = await generateRefreshToken({ id: dbUser._id })

    const cookieStore = cookies()
    cookieStore.set("access_token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    })
    cookieStore.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    })

    return true
  } catch (error) {
    console.error("❌ signIn error:", error)
    return false // ⚠️ Return false if any issue happens
  }
},

    async jwt({ token }) {
      return token
    },
    // async session() {
    //   return null
    // },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
