import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Home, Users, FileText, Cpu, FileEdit, Settings, Shield, LogIn, LogOut, Sun, Moon, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/ui/use-theme";

const navLinkClasses = "text-sm font-medium text-gray-300 hover:text-white transition-colors";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: userRole } = useUserRole();
  const isAdmin = userRole === 'super_admin' || userRole === 'admin';
  const { theme, setTheme } = useTheme();

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
    { name: "Gear", path: "/gear", icon: <Cpu size={18} /> },
    { name: "Notes", path: "/notes", icon: <FileEdit size={18} /> },
    { name: "Uploads", path: "/uploads", icon: <Upload size={18} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={18} /> },
    ...(isAdmin ? [
      { name: "Admin", path: "/admin", icon: <Shield size={18} /> }
    ] : [])
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cyber-black border-b border-cyber-purple/20">
      <div className="container mx-auto px-4">
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
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-md hover:bg-cyber-purple/10 transition-colors"
            >
              {theme === "dark" ? <Sun className="h-4 w-4 text-gray-400" /> : <Moon className="h-4 w-4 text-gray-400" />}
            </button>

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="outline-none focus:outline-none">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user?.user_metadata?.avatar_url} />
                      <AvatarFallback>
                        {user?.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mr-2">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-400 hover:text-white focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-cyber-black border-t border-cyber-purple/20 px-4 py-2">
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
            {user && (
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
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
