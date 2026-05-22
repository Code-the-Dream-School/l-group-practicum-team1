import Header from "./Header";
import "./PageLayout.css";

export default function PageLayout({ children }) {
  return (
    <div className="page-layout">
      <div className="page-container">
        <Header />
        <main className="page-main">{children}</main>
      </div>
    </div>
  );
}
