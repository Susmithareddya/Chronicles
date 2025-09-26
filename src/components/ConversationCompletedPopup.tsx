import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  TrendingUp,
  X,
  CheckCircle2,
  Package
} from "lucide-react";

interface ConversationCompletedPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConversationCompletedPopup = ({
  isOpen,
  onClose,
}: ConversationCompletedPopupProps) => {
  // Randomly select a category for the popup
  const categories = [
    "Project Histories",
    "Crisis Management",
    "Strategic Partnerships",
    "Strategy Lessons",
    "Innovation & Technology",
    "Onboarding Essentials"
  ];

  const selectedCategory = categories[Math.floor(Math.random() * categories.length)];

  // Generate a random story title based on category
  const storyTitles = {
    "Project Histories": "Mobile App Development Update",
    "Crisis Management": "System Recovery Strategy",
    "Strategic Partnerships": "Vendor Integration Framework",
    "Strategy Lessons": "Market Analysis Insights",
    "Innovation & Technology": "AI Implementation Progress",
    "Onboarding Essentials": "Team Process Documentation"
  };

  const storyTitle = storyTitles[selectedCategory as keyof typeof storyTitles];

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
                    Key insights and learnings from your recent conversation have been captured
                    and organized for the {selectedCategory} knowledge base.
                  </p>

                  <div className="flex items-center gap-3">
                    <Badge className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                      Added Successfully
                    </Badge>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-slate-600 font-sf-pro">
                        From ElevenLabs Conversation
                      </span>
                    </div>
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