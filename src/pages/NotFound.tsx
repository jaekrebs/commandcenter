
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="cyber-panel max-w-md mx-auto p-8">
        <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-cyber-yellow" />
        <h1 className="text-4xl font-bold mb-4 text-cyber-purple">404</h1>
        <p className="text-xl text-gray-300 mb-6">Access Denied: Route not found</p>
        <p className="text-gray-400 mb-6">
          The neural pathway to <span className="text-cyber-pink">{location.pathname}</span> is unavailable or restricted
        </p>
        <Link to="/" className="cyber-button inline-block">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
