import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import ChatAnalysis from "./pages/dashboard/ChatAnalysis";
import Dashboard from "./pages/dashboard/Dashboard";
import UploadChat from "./pages/dashboard/UploadChat";
import History from "./pages/dashboard/History";
import Contacts from "./pages/dashboard/Contacts";
import Settings from "./pages/dashboard/Settings";
import NotFound from "./pages/NotFound";
import { SafeStudentChatBot } from "./components/SafeStudentChatBot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/dashboard" element={<ProtectedRoute><ChatAnalysis /></ProtectedRoute>} />
              <Route path="/dashboard/stats" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard/upload" element={<ProtectedRoute><UploadChat /></ProtectedRoute>} />
              <Route path="/dashboard/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
              <Route path="/dashboard/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
              <Route path="/dashboard/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <SafeStudentChatBot />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
