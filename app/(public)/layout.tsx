
// import { Navbar } from "./components/navbar";

// export default function PublicLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <>
//       <Navbar />
//       {children}
//     </>
//   );
// }














import { Navbar } from "./components/navbar";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}