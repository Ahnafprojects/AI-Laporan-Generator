import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token, // Return true jika token ada (sudah login)
  },
});

// Tentukan halaman mana saja yang HARUS login
export const config = {
  matcher: [
    "/create",
    "/preview/:path*", // Semua halaman preview butuh login
    "/dashboard/:path*"
  ]
};