import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import BottomNav from "@/components/BottomNav";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import TripForm from "@/pages/TripForm";
import TripList from "@/pages/TripList";
import Reports from "@/pages/Reports";
import Settings from "@/pages/Settings";
import { Toaster } from "sonner";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><p>Carregando...</p></div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  return (
    <>
      <Routes>
        <Route path="/login" element={user && !loading ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/nova" element={<PrivateRoute><TripForm /></PrivateRoute>} />
        <Route path="/viagens" element={<PrivateRoute><TripList /></PrivateRoute>} />
        <Route path="/relatorios" element={<PrivateRoute><Reports /></PrivateRoute>} />
        <Route path="/config" element={<PrivateRoute><Settings /></PrivateRoute>} />
      </Routes>
      {user && <BottomNav />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-center" />
      </AuthProvider>
    </BrowserRouter>
  );
}
