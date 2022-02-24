import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"


export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUT_SECRET!,
  callbacks: {
    //  session(session,user,token) siempre debe de retornar la session.Cada callback pre-built debe retornar un arg  
    async session({ session, user, token }) {
      session.user.tag = session.user.name?.split(" ")
      .join("-")
      .toLocaleLowerCase();
      session.user!.uid = token.sub;
      return session;
    },
  }

})