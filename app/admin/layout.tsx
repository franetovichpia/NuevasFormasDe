import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel | Nuevas Formas De...",
  robots: {
    index: false,
    follow: false,
  },
};

type AdminLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-ink">
      {children}
    </div>
  );
}
