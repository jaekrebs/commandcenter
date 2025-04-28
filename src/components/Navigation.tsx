import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, Users, FileText, Cpu, FileEdit, Settings, LogIn } from "lucide-react";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/", icon: <Home size={18} /> },
    { name: "NPCs", path: "/npc-relationships", icon: <Users size={18} /> },
    { name: "Missions", path: "/missions", icon: <FileText size={18} /> },
    { name: "Cyberware", path: "/cyberware", icon: <Cpu size={18} /> },
    { name: "Notes", path: "/notes", icon: <FileEdit size={18} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={18} /> },
  ];

  return (
    <nav className="bg-cyber-darkgray border-b border-cyber-purple/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <span className="text-cyber-purple font-bold text-xl glow-text mr-2">V</span>
                <span className="text-white font-bold">Dashboard</span>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 transition-colors ${
                      location.pathname === item.path
                        ? "text-white bg-cyber-purple/20 border-b border-cyber-purple"
                        : "text-gray-300 hover:bg-cyber-purple/10 hover:text-white"
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <Link to="/auth" className="cyber-button text-sm flex items-center gap-2">
                <LogIn size={16} />
                Access Terminal
              </Link>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-cyber-purple/10 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-cyber-darkgray/90 backdrop-blur-sm">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 ${
                  location.pathname === item.path
                    ? "text-white bg-cyber-purple/20 border-b border-cyber-purple"
                    : "text-gray-300 hover:bg-cyber-purple/10 hover:text-white"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
            <Link
              to="/auth"
              className="cyber-button w-full mt-4 text-sm flex items-center justify-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <LogIn size={16} />
              Access Terminal
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
