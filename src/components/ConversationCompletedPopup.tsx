import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  TrendingUp,
  X,
  CheckCircle2,
  Package,
  Clock,
  MessageSquare,
  Users,
  Target
} from "lucide-react";

interface ConversationHighlight {
  type: 'key_topic' | 'action_item' | 'insight' | 'question';
  content: string;
  importance: 'high' | 'medium' | 'low';
}

interface ConversationCompletedPopupProps {
  isOpen: boolean;
  onClose: () => void;
  conversationData?: {
    conversation_id: string;
    duration: number;
    messageCount: number;
    summary: string;
    keyTopics: string[];
    transcript: any[];
    analysis?: {
      transcript_summary?: string;
      call_summary_title?: string;
    };
  } | null;
}

export const ConversationCompletedPopup = ({
  isOpen,
  onClose,
  conversationData,
}: ConversationCompletedPopupProps) => {
  // Extract highlights from conversation data
  const extractHighlights = (data: typeof conversationData): ConversationHighlight[] => {
    if (!data) return [];

    const highlights: ConversationHighlight[] = [];

    // Add key topics as highlights
    data.keyTopics.slice(0, 3).forEach(topic => {
      highlights.push({
        type: 'key_topic',
        content: `Discussed: ${topic}`,
        importance: 'high'
      });
    });

    // Add insights from transcript
    const transcript = data.transcript || [];
    const userMessages = transcript.filter(t => t.role === 'user' && t.message);
    const agentMessages = transcript.filter(t => t.role === 'agent' && t.message);

    if (userMessages.length > 0) {
      const firstUserMessage = userMessages[0].message;
      if (firstUserMessage && firstUserMessage.length > 20) {
        highlights.push({
          type: 'insight',
          content: `Main topic: ${firstUserMessage.substring(0, 100)}...`,
          importance: 'medium'
        });
      }
    }

    // Add conversation summary if available
    if (data.analysis?.transcript_summary) {
      highlights.push({
        type: 'insight',
        content: data.analysis.transcript_summary.substring(0, 150) + '...',
        importance: 'high'
      });
    }

    return highlights;
  };

  const highlights = extractHighlights(conversationData);

  // Determine category based on conversation content
  const getCategoryFromTopics = (topics: string[]): string => {
    const topicStr = topics.join(' ').toLowerCase();

    if (topicStr.includes('project') || topicStr.includes('development')) return 'Project Histories';
    if (topicStr.includes('crisis') || topicStr.includes('problem')) return 'Crisis Management';
    if (topicStr.includes('partner') || topicStr.includes('vendor')) return 'Strategic Partnerships';
    if (topicStr.includes('strategy') || topicStr.includes('plan')) return 'Strategy Lessons';
    if (topicStr.includes('technology') || topicStr.includes('ai') || topicStr.includes('data')) return 'Innovation & Technology';
    return 'Onboarding Essentials';
  };

  const selectedCategory = conversationData ? getCategoryFromTopics(conversationData.keyTopics) : 'Onboarding Essentials';
  const storyTitle = conversationData?.analysis?.call_summary_title || 'Knowledge Transfer Session';

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card max-w-lg border-none shadow-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-green-50 border border-green-200 flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-slate-800 font-sf-pro">
                  Story Added to {selectedCategory}!
                </DialogTitle>
                <p className="text-slate-600 font-sf-pro mt-1">
                  "{storyTitle}" was added to your {selectedCategory} tile
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          {/* Story Preview Card */}
          <Card className="border border-slate-200/50 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-xl bg-blue-50 flex-shrink-0">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-800 font-sf-pro mb-2">
                    {storyTitle}
                  </h3>
                  <p className="text-slate-600 text-sm font-sf-pro mb-3">
                    {conversationData
                      ? `Captured ${conversationData.messageCount} messages over ${formatDuration(conversationData.duration)} and organized key insights`
                      : 'Key insights and learnings from your recent conversation have been captured'
                    }
                  </p>

                  {/* Conversation Highlights */}
                  {highlights.length > 0 && (
                    <div className="mb-4 space-y-2">
                      <h4 className="text-sm font-semibold text-slate-700 mb-2">Key Highlights:</h4>
                      {highlights.slice(0, 3).map((highlight, index) => (
                        <div key={index} className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg">
                          <Target className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-xs text-slate-600">{highlight.content}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <Badge className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                      Added Successfully
                    </Badge>
                    {conversationData && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-slate-600 font-sf-pro">
                          {formatDuration(conversationData.duration)}
                        </span>
                      </div>
                    )}
                    {conversationData && (
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-slate-600 font-sf-pro">
                          {conversationData.messageCount} messages
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Button */}
          <div className="flex items-center justify-center">
            <Button
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 font-sf-pro rounded-full"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Perfect!
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};