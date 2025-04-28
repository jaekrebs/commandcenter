import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Dashboard from "./pages/Dashboard";
import NPCRelationships from "./pages/NPCRelationships";
import Missions from "./pages/Missions";
import Gear from "./pages/Cyberware";
import Notes from "./pages/Notes";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Uploads from "./pages/Uploads";
import { Navigation } from "./components/Navigation";
import { LoadingState } from "@/components/LoadingState";
import { ThemeProvider } from "./components/ui/use-theme";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
  if (isAuthenticated === null) {
    return <LoadingState message="Authenticating..." />;
  }
  
  if (!isAuthenticated && location.pathname !== '/auth') {
    return <Navigate to="/auth" replace />;
  }
  
  if (isAuthenticated && location.pathname === '/auth') {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-cyber-black text-white">
            <Routes>
              <Route path="/auth" element={<ProtectedRoute><Auth /></ProtectedRoute>} />
              <Route 
                path="/"
                element={
                  <>
                    <Navigation />
                    <div className="pt-16">
                      <ProtectedRoute><Dashboard /></ProtectedRoute>
                    </div>
                  </>
                } 
              />
              <Route 
                path="/npc-relationships" 
                element={
                  <>
                    <Navigation />
                    <div className="pt-16">
                      <ProtectedRoute><NPCRelationships /></ProtectedRoute>
                    </div>
                  </>
                } 
              />
              <Route 
                path="/missions" 
                element={
                  <>
                    <Navigation />
                    <div className="pt-16">
                      <ProtectedRoute><Missions /></ProtectedRoute>
                    </div>
                  </>
                } 
              />
              <Route 
                path="/gear" 
                element={
                  <>
                    <Navigation />
                    <div className="pt-16">
                      <ProtectedRoute><Gear /></ProtectedRoute>
                    </div>
                  </>
                } 
              />
              <Route 
                path="/notes" 
                element={
                  <>
                    <Navigation />
                    <div className="pt-16">
                      <ProtectedRoute><Notes /></ProtectedRoute>
                    </div>
                  </>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <>
                    <Navigation />
                    <div className="pt-16">
                      <ProtectedRoute><Settings /></ProtectedRoute>
                    </div>
                  </>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <>
                    <Navigation />
                    <div className="pt-16">
                      <ProtectedRoute><Admin /></ProtectedRoute>
                    </div>
                  </>
                } 
              />
              <Route 
                path="/uploads" 
                element={
                  <>
                    <Navigation />
                    <div className="pt-16">
                      <ProtectedRoute><Uploads /></ProtectedRoute>
                    </div>
                  </>
                } 
              />
              <Route 
                path="*" 
                element={
                  <>
                    <Navigation />
                    <div className="pt-16">
                      <ProtectedRoute><NotFound /></ProtectedRoute>
                    </div>
                  </>
                } 
              />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
