import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

type SiteLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function SiteLayout({
  children,
}: SiteLayoutProps) {
  return (
    <>
      <SiteHeader />

      {children}

      <SiteFooter />
    </>
  );
}
