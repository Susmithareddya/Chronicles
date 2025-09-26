import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import CategoryDetail from "./pages/CategoryDetail";
import StoryDetail from "./pages/StoryDetail";
import KnowledgeGaps from "./pages/KnowledgeGaps";
import AISuggestions from "./pages/AISuggestions";
import NotFound from "./pages/NotFound";
import ConversationSync from "./pages/ConversationSync";
import { ConversationCompletedPopup } from "./components/ConversationCompletedPopup";
import { ConversationDetectionService, ConversationEventData } from "./services/conversationDetectionService";
import { ElevenLabsService } from "./services/elevenlabsService";

const queryClient = new QueryClient();

const App = () => {
  const [showConversationPopup, setShowConversationPopup] = useState(false);
  const [conversationData, setConversationData] = useState<any>(null);

  useEffect(() => {
    // Initialize conversation detection service
    const detectionService = new ConversationDetectionService();
    const elevenLabsService = new ElevenLabsService();

    // Listen for conversation end events
    const unsubscribe = detectionService.addEventListener(async (eventData: ConversationEventData) => {
      if (eventData.status === 'ended') {
        console.log('🎉 Conversation completed, fetching details:', eventData.conversationId);

        try {
          // Fetch the full conversation data
          const fullConversation = await elevenLabsService.getConversation(eventData.conversationId);

          if (fullConversation) {
            // Extract conversation summary data
            const summary = elevenLabsService.extractConversationSummary(fullConversation);

            const processedData = {
              conversation_id: fullConversation.conversation_id,
              duration: fullConversation.metadata?.call_duration_secs || 0,
              messageCount: fullConversation.transcript?.length || 0,
              summary: summary.summary,
              keyTopics: summary.keyTopics,
              transcript: fullConversation.transcript,
              analysis: fullConversation.analysis
            };

            setConversationData(processedData);
            setShowConversationPopup(true);
          }
        } catch (error) {
          console.error('Error fetching conversation details:', error);

          // Show popup even if we can't fetch details
          setConversationData({
            conversation_id: eventData.conversationId,
            duration: 0,
            messageCount: 0,
            summary: 'Conversation completed successfully',
            keyTopics: [],
            transcript: [],
            analysis: { call_summary_title: 'Knowledge Transfer Session' }
          });
          setShowConversationPopup(true);
        }
      }
    });

    // Add a test button in development
    if (import.meta.env.DEV) {
      // @ts-ignore - Add global test function for development
      window.testConversationPopup = () => {
        detectionService.triggerTestConversationEnd('conv_7901k62rfnykepqss5vnws61e1gy');
      };
      console.log('🧪 Development mode: Use window.testConversationPopup() to test the popup');
    }

    // Cleanup on unmount
    return () => {
      unsubscribe();
      detectionService.destroy();
    };
  }, []);

  return (
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
          <Route path="/conversation-sync" element={<ConversationSync />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>

      {/* Conversation Completed Popup */}
      <ConversationCompletedPopup
        isOpen={showConversationPopup}
        onClose={() => {
          setShowConversationPopup(false);
          setConversationData(null);
        }}
        conversationData={conversationData}
      />
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
