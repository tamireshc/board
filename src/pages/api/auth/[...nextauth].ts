import NextAuth from 'next-auth'
import GitHubProvider from "next-auth/providers/github";

export default NextAuth({
  secret: process.env.NEXT_PUBLIC_SECRET,
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      // scope:'read:user' as any
    })

  ]
})