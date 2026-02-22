import Header from "@/app/_components/header/header";

export default function ProfileGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="pt-[62px] lg:pt-[175px]">{children}</main>
    </>
  );
}
