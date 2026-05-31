import { Link } from "react-router-dom";
import { AlertTriangle, Home } from "lucide-react";

import PageLayout from "../components/layout/PageLayout";

import "./NotFound.css";

function NotFound() {
  return (
    <PageLayout>
      <section className="not-found-page">
        <div className="not-found-card">
          <AlertTriangle size={64} className="not-found-icon" />

          <h1>404</h1>

          <h2>Page Not Found</h2>

          <p>The page you are looking for does not exist or has been moved.</p>

          <Link to="/" className="not-found-button">
            <Home size={18} />
            Back to Home
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}

export default NotFound;
