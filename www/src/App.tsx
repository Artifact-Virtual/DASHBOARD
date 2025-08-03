
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FloatingSidebar from "./components/FloatingSidebar";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Research from "./pages/Research";
import ResearchPost from "./pages/ResearchPost";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import SystemMap from "./pages/SystemMap";
import ARCxToken from "./pages/ARCxToken";

const queryClient = new QueryClient();




const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="relative w-full min-h-screen overflow-x-hidden">
          <FloatingSidebar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/research" element={<Research />} />
            <Route path="/research/:slug" element={<ResearchPost />} />
            <Route path="/arcx" element={<ARCxToken />} />
            {/* <Route path="/api" element={<API />} /> */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/systemmap" element={<SystemMap />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
