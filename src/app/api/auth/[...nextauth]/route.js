// src/app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
 import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
   


export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        
        if (
          credentials.email === "bereketgetayea@gmail.com" &&
          credentials.password === "6548Be@$"
        ) {
          return { id: 1, name: "Admin", email: credentials.email };
        }
       const q = query(
          collection(db, "users"),
          where("email", "==", credentials.email)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const userData = snapshot.docs[0].data();
          // Validate password (simple match for testing, can hash in real SaaS)
          if (userData.password === credentials.password) {
            return { id: snapshot.docs[0].id, name: userData.name, email: credentials.email, role: "client" };
          }
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/loginPage" },
  callbacks: {
    async jwt({ token, user }) {
      if (user)  token.role = user.role ;
      return token;
    },
    async session({ session, token }) {
      if (token) session.user.role = token.role;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
