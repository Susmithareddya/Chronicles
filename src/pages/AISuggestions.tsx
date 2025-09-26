import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Calendar, MessageCircle, Plus, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

const AISuggestions = () => {
  const suggestions = [
    {
      id: 1,
      type: "Time-sensitive",
      icon: Calendar,
      iconColor: "text-red-600",
      impact: "high impact",
      impactColor: "bg-red-100/80 text-red-700",
      title: "Document regulatory compliance strategies",
      description: "With increasing global regulations on emissions and safety, capture knowledge about navigating regulatory landscapes.",
      category: "Strategy Lessons",
      categoryColor: "bg-blue-100/80 text-blue-700"
    },
    {
      id: 2,
      type: "Follow-up",
      icon: MessageCircle,
      iconColor: "text-blue-600",
      impact: "medium impact",
      impactColor: "bg-amber-100/80 text-amber-700",
      title: "Expand on digital transformation challenges",
      description: "The current draft story could be enhanced with specific examples of resistance management and change adoption metrics.",
      category: "Leadership Insights",
      categoryColor: "bg-purple-100/80 text-purple-700"
    },
    {
      id: 3,
      type: "New Topic",
      icon: Brain,
      iconColor: "text-purple-600",
      impact: "high impact",
      impactColor: "bg-red-100/80 text-red-700",
      title: "Knowledge management and organizational learning",
      description: "Create stories about how teams learn from failures, share best practices, and build institutional memory.",
      category: "Innovation Process",
      categoryColor: "bg-green-100/80 text-green-700"
    },
    {
      id: 4,
      type: "Time-sensitive",
      icon: Calendar,
      iconColor: "text-red-600",
      impact: "high impact",
      impactColor: "bg-red-100/80 text-red-700",
      title: "Remote work management insights",
      description: "Capture lessons learned about maintaining team culture, productivity, and innovation in distributed work environments.",
      category: "Leadership Insights",
      categoryColor: "bg-purple-100/80 text-purple-700"
    },
    {
      id: 5,
      type: "Follow-up",
      icon: MessageCircle,
      iconColor: "text-blue-600",
      impact: "medium impact",
      impactColor: "bg-amber-100/80 text-amber-700",
      title: "Supply chain resilience strategies",
      description: "Build on existing supplier stories with specific crisis response protocols and alternative sourcing strategies.",
      category: "Strategic Partnerships",
      categoryColor: "bg-orange-100/80 text-orange-700"
    }
  ];

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'Time-sensitive':
        return 'bg-red-50/80 text-red-700 border-red-100/50';
      case 'Follow-up':
        return 'bg-blue-50/80 text-blue-700 border-blue-100/50';
      case 'New Topic':
        return 'bg-purple-50/80 text-purple-700 border-purple-100/50';
      default:
        return 'bg-slate-50/80 text-slate-700 border-slate-100/50';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--gradient-bg)' }}>
      {/* Liquid Glass Background Splash */}
      <div className="absolute inset-0 liquid-glass-splash opacity-40"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-all duration-200 mb-6 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-blue-100/80 backdrop-blur-sm">
              <Sparkles className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
                AI Suggestions
              </h1>
              <Badge className="bg-blue-100/80 text-blue-700 px-3 py-1 text-sm font-medium rounded-full border-0 backdrop-blur-md mt-2">
                {suggestions.length} suggestions
              </Badge>
            </div>
          </div>
          
          <p className="text-lg text-slate-600 font-light leading-relaxed max-w-3xl">
            Topics and questions to explore with the manager
          </p>
        </div>

        {/* AI Suggestions Grid */}
        <div className="space-y-6">
          {suggestions.map((suggestion) => (
            <Card 
              key={suggestion.id}
              className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 glass-card"
            >
              <CardContent className="p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-white/60 backdrop-blur-sm border border-white/20">
                      <suggestion.icon className={cn("w-5 h-5", suggestion.iconColor)} />
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={cn("px-3 py-1 text-sm font-medium rounded-full border backdrop-blur-md", getTypeStyle(suggestion.type))}>
                        {suggestion.type}
                      </Badge>
                      <Badge className={cn("px-3 py-1 text-sm font-medium rounded-full border-0 backdrop-blur-md", suggestion.impactColor)}>
                        {suggestion.impact}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold text-slate-900 mb-3 leading-tight">
                    {suggestion.title}
                  </h3>
                  <p className="text-slate-700 text-base leading-relaxed">
                    {suggestion.description}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className={cn("px-3 py-1 text-sm font-medium rounded-full border-0 backdrop-blur-md", suggestion.categoryColor)}>
                      {suggestion.category}
                    </Badge>
                  </div>
                  <Button className="bg-white/80 hover:bg-white/90 text-slate-700 border border-white/20 backdrop-blur-sm rounded-full px-6 py-2 h-auto font-medium transition-all duration-200 hover:shadow-md">
                    Schedule Discussion
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-12 text-center">
          <div className="space-y-4">
            <p className="text-slate-600 text-lg">
              Ready to explore these suggestions?
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 h-auto font-medium rounded-full hover:scale-105 transition-transform border-none">
                <Calendar className="w-5 h-5 mr-3" />
                Schedule Discussion Session
              </Button>
              <Button className="glass-card text-slate-700 px-8 py-4 h-auto font-medium rounded-full hover:scale-105 transition-transform bg-white/80 hover:bg-white/90">
                <Sparkles className="w-5 h-5 mr-3" />
                Generate More Suggestions
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISuggestions;