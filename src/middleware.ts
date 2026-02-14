
import { auth } from "./auth";

export default auth((req: any) => {
    // Currently no specific middleware logic here, using default next-auth
});

export const config = {
    // Only run middleware on these protected routes
    matcher: [
        "/admin/:path*",
        "/dashboard/:path*",
        "/settings/:path*",
        "/sign-in",
        "/sign-up",
        "/login"
    ],
};
