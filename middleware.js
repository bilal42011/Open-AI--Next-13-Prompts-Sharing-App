import { getToken } from "next-auth/jwt";
import { NextResponse } from 'next/server';


// This function can be marked `async` if using `await` inside
export async function middleware(request) {
    const path = request.nextUrl.pathname;
    const isPublicPath = path == "/login" || path == "/signup";

    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
    });

    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/', request.nextUrl));
    }

    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/', request.nextUrl));
    }

}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ["/signup", "/login", "/profile", "/create-prompt", "/update-prompt"]
}