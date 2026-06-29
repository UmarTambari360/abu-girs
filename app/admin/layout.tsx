import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { MapPin, LayoutDashboard, LogOut } from "lucide-react";
import { auth, signOut } from "@/lib/auth";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const userEmail = session.user?.email ?? "Administrator";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand + breadcrumb */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-2 text-green-700 hover:text-green-800 transition-colors"
              >
                <div className="bg-green-700 p-1.5 rounded-md">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-lg tracking-tight">GIRS</span>
              </Link>

              <span className="text-gray-300 select-none">/</span>

              <div className="flex items-center gap-1.5 text-gray-600">
                <LayoutDashboard className="h-4 w-4" />
                <span className="text-sm font-medium">Admin</span>
              </div>
            </div>

            {/* Right: Logged-in email + sign-out */}
            <div className="flex items-center gap-4">
              <span className="hidden sm:block text-sm text-gray-500 truncate max-w-[200px]">
                {userEmail}
              </span>

              {/* Sign-out as a Server Action inside a form */}
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/login" });
                }}
              >
                <button
                  type="submit"
                  className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-red-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded px-2 py-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
