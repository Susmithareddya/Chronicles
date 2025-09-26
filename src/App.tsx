import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CategoryDetail from "./pages/CategoryDetail";
import StoryDetail from "./pages/StoryDetail";
import KnowledgeGaps from "./pages/KnowledgeGaps";
import AISuggestions from "./pages/AISuggestions";
import NotFound from "./pages/NotFound";
import ConversationSync from "./pages/ConversationSync";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/category/:categoryName" element={<CategoryDetail />} />
          <Route path="/category/:categoryName/story/:storyId" element={<StoryDetail />} />
          <Route path="/knowledge-gaps" element={<KnowledgeGaps />} />
          <Route path="/ai-suggestions" element={<AISuggestions />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
