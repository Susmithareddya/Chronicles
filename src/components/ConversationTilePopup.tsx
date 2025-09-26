import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Package,
  ShieldCheck,
  Handshake,
  Crosshair,
  Zap,
  GraduationCap,
  Plus,
  X,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface TileSuggestion {
  id: string;
  title: string;
  category: string;
  description: string;
  relevantData: {
    keyInsights: string[];
    actionItems: string[];
    stakeholders: string[];
    priority: 'high' | 'medium' | 'low';
  };
  confidence: number;
  source: string;
}

interface ConversationTilePopupProps {
  isOpen: boolean;
  onClose: () => void;
  suggestion: TileSuggestion | null;
  onCreateTile: (suggestion: TileSuggestion) => void;
  onDismiss: (suggestionId: string) => void;
}

const categoryIcons = {
  "Project Histories": Package,
  "Crisis Management": ShieldCheck,
  "Strategic Partnerships": Handshake,
  "Strategy Lessons": Crosshair,
  "Innovation & Technology": Zap,
  "Onboarding Essentials": GraduationCap,
};

const categoryColors = {
  "Project Histories": { icon: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
  "Crisis Management": { icon: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  "Strategic Partnerships": { icon: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
  "Strategy Lessons": { icon: "text-pink-600", bg: "bg-pink-50", border: "border-pink-200" },
  "Innovation & Technology": { icon: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" },
  "Onboarding Essentials": { icon: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
};

export const ConversationTilePopup = ({
  isOpen,
  onClose,
  suggestion,
  onCreateTile,
  onDismiss,
}: ConversationTilePopupProps) => {
  const [isCreating, setIsCreating] = useState(false);

  if (!suggestion) return null;

  const handleCreateTile = async () => {
    setIsCreating(true);
    try {
      await onCreateTile(suggestion);
      onClose();
    } catch (error) {
      console.error('Failed to create tile:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDismiss = () => {
    onDismiss(suggestion.id);
    onClose();
  };

  const IconComponent = categoryIcons[suggestion.category as keyof typeof categoryIcons] || Package;
  const colors = categoryColors[suggestion.category as keyof typeof categoryColors] || categoryColors["Project Histories"];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card max-w-2xl border-none shadow-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl backdrop-blur-sm flex-shrink-0 border" style={{
                backgroundColor: colors.bg.replace('bg-', ''),
                borderColor: colors.border.replace('border-', '')
              }}>
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-semibold text-slate-800 font-sf-pro">
                  Story Added to {suggestion.category}!
                </DialogTitle>
                <p className="text-slate-600 font-sf-pro mt-1">
                  "{suggestion.title}" was added to your {suggestion.category} tile
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

        <div className="space-y-6 mt-6">
          {/* Suggested Tile Preview */}
          <Card className="border border-slate-200/50 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={cn("p-3 rounded-2xl backdrop-blur-sm flex-shrink-0", colors.bg)}>
                  <IconComponent className={cn("w-6 h-6", colors.icon)} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-slate-800 font-sf-pro">
                      {suggestion.title}
                    </h3>
                    <Badge className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                      {suggestion.category}
                    </Badge>
                  </div>
                  <p className="text-slate-600 mb-4 font-sf-pro leading-relaxed">
                    {suggestion.description}
                  </p>

                  {/* Confidence Score */}
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-700 font-sf-pro">
                      {suggestion.confidence}% AI Confidence
                    </span>
                  </div>

                  {/* Key Insights */}
                  {suggestion.relevantData.keyInsights.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-slate-700 mb-2 font-sf-pro">Key Insights:</h4>
                      <div className="space-y-2">
                        {suggestion.relevantData.keyInsights.slice(0, 3).map((insight, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm text-slate-600 font-sf-pro">{insight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Priority Badge */}
                  <div className="flex items-center gap-2">
                    <Badge
                      className={cn(
                        "px-3 py-1 rounded-full font-sf-pro",
                        suggestion.relevantData.priority === 'high'
                          ? "bg-red-100 text-red-700"
                          : suggestion.relevantData.priority === 'medium'
                          ? "bg-amber-100 text-amber-700"
                          : "bg-slate-100 text-slate-700"
                      )}
                    >
                      {suggestion.relevantData.priority.toUpperCase()} Priority
                    </Badge>
                    <span className="text-xs text-slate-500 font-sf-pro">
                      Source: {suggestion.source}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="ghost"
              onClick={handleDismiss}
              className="text-slate-600 hover:text-slate-800 font-sf-pro"
            >
              Maybe Later
            </Button>
            <Button
              onClick={handleCreateTile}
              disabled={isCreating}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 font-sf-pro"
            >
              <Plus className="w-4 h-4 mr-2" />
              {isCreating ? 'Adding...' : 'Great! Add This Story'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};