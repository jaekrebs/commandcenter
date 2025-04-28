
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Home, Users, FileText, Cpu, FileEdit, Settings, Shield, LogIn, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
      navigate("/auth");
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "There was a problem signing you out.",
        variant: "destructive",
      });
    }
  };

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
              <Link to={user ? "/" : "/auth"} className="flex items-center">
                <Shield className="text-cyber-purple h-5 w-5 mr-2" />
                <span className="text-white font-bold">Access Terminal</span>
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
          <div className="hidden md:flex md:items-center md:ml-6">
            {user ? (
              <button 
                onClick={handleSignOut}
                className="bg-cyber-darkgray text-white border border-cyber-purple/50 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-cyber-purple/20 transition-all hover:border-cyber-purple hover:shadow-[0_0_10px_rgba(155,135,245,0.5)]"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            ) : (
              <Link 
                to="/auth" 
                className="bg-cyber-darkgray text-white border border-cyber-purple/50 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-cyber-purple/20 transition-all hover:border-cyber-purple hover:shadow-[0_0_10px_rgba(155,135,245,0.5)]"
              >
                <LogIn size={16} />
                Access Terminal
              </Link>
            )}
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
            {user ? (
              <button
                onClick={() => {
                  handleSignOut();
                  setIsOpen(false);
                }}
                className="w-full mt-4 px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 text-gray-300 hover:bg-cyber-purple/10 hover:text-white"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            ) : (
              <Link
                to="/auth"
                className="block w-full mt-4 px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2 text-gray-300 hover:bg-cyber-purple/10 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                <LogIn size={16} />
                <span>Access Terminal</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
