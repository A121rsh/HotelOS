
import { auth } from "./auth";

export default auth((req: any) => {
    // Currently no specific middleware logic here, using default next-auth
});

// Matcher for protected routes
export const config = {
    matcher: [
        "/admin/:path*",
        "/dashboard/:path*",
        "/settings/:path*",
        "/checkout/:path*",
    ],
};
