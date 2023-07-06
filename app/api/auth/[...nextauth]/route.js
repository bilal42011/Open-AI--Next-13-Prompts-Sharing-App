import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@/utils/database";
import User from "@/models/user";

console.log({
    clientId: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
})
const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })],
    callbacks: {
        async jwt({ token, account, profile }) {
            console.log("inside jwt");
            return token;
        },

        async session({ session }) {
            console.log("inside session");
            const sessionUser = await User.findOne({
                email: session.user.email
            });

            session.user.id = sessionUser._id.toString();

            return session;
        },
        async signIn({ profile }) {
            console.log("inide signin");
            try {
                await connectToDB();

                const userExists = await User.findOne({
                    email: profile.email
                })

                if (!userExists) {
                    await User.create({
                        email: profile.email,
                        username: profile.name.replace(/\s/g, "").toLowerCase(),
                        image: profile.picture
                    })
                }
                return true
            }
            catch (err) {
                console.log(err);
                return false;
            }
        }
    }
})

export { handler as GET, handler as POST };