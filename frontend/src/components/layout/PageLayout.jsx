import Navbar from "./Navbar";

export default function PageLayout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-8">
        <Navbar />
        <main className="py-8">{children}</main>
      </div>
    </div>
  );
}
