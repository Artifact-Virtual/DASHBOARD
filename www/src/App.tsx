
import React, { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FloatingSidebar from "./components/FloatingSidebar";
import TopRightConnect from './components/wallet/TopRightConnect';
// ...existing code...

// Lazy-load route pages to reduce initial bundle size (code-splitting)
const Index = lazy(() => import('./pages/Index'));
const Articles = lazy(() => import('./pages/Articles'));
const ArticlePost = lazy(() => import('./pages/ArticlePost'));
const Research = lazy(() => import('./pages/Research'));
const ResearchPost = lazy(() => import('./pages/ResearchPost'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));
const SystemMap = lazy(() => import('./pages/SystemMap'));
const EthClient = lazy(() => import('./pages/EthClient'));
const AsymmetricShowcase = lazy(() => import('./components/design/AsymmetricShowcase'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const Swap = lazy(() => import('./pages/Swap'));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
  {/* Removed OnchainKitProviderWrapper */}
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="relative w-full min-h-screen overflow-x-hidden">
            <TopRightConnect />
            <FloatingSidebar />
            <Suspense fallback={<div className="min-h-screen" /> }>
              <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/articles/:slug" element={<ArticlePost />} />
              <Route path="/research" element={<Research />} />
              <Route path="/research/:slug" element={<ResearchPost />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/systemmap" element={<SystemMap />} />
              <Route path="/swap" element={<Swap />} />
              {/* Removed OnchainKitPage route */}
              <Route path="/eth" element={<EthClient />} />
              <Route path="/design" element={<AsymmetricShowcase />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  {/* Removed OnchainKitProviderWrapper */}
  </QueryClientProvider>
);

export default App;
