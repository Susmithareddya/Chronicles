import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StoryCard, Story } from "@/components/StoryCard";
import { getStoriesForCategory, calculateStatusCounts } from "@/data/storiesData";

import { ConversationCompletedPopup } from "@/components/ConversationCompletedPopup";
import { useConversationCompleted } from "@/hooks/useConversationCompleted";
import {
  Search,
  Star,
  Package,
  ShieldCheck,
  Handshake,
  Crosshair,
  Zap,
  TriangleAlert,
  Sparkles,
  ChevronRight,
  ChevronDown,
  TrendingUp,
  FileText,
  Users,
  Mail,
  Phone,
  MapPin,
  X,
  GraduationCap,
  TestTube
} from "lucide-react";

import { cn } from "@/lib/utils";
const KnowledgeBaseDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showChristopherCard, setShowChristopherCard] = useState(false);
  
  // Conversation completed hook
  const conversationCompleted = useConversationCompleted();

  const knowledgeCategories = [
    {
      title: "Onboarding Essentials",
      description: "Critical knowledge for newcomers replacing Christopher — processes, workflows, and key relationships",
      icon: GraduationCap,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Project Histories", 
      description: "Major initiatives, launches, and transformation programs",
      icon: Package,
      iconColor: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Crisis Management",
      description: "Handling challenges, market downturns, and operational disruptions", 
      icon: ShieldCheck,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Strategic Partnerships",
      description: "Key partnerships, negotiations, and supply chain strategies",
      icon: Handshake, 
      iconColor: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Strategy Lessons",
      description: "Market analysis, competitive positioning, and long-term planning",
      icon: Crosshair,
      iconColor: "text-pink-600", 
      bgColor: "bg-pink-50",
    },
    {
      title: "Innovation & Technology",
      description: "R&D decisions, technology adoption, and future trends",
      icon: Zap,
      iconColor: "text-yellow-600",
      bgColor: "bg-yellow-50",
    }
  ].map(category => {

    const stories = getStoriesForCategory(category.title);
    const statusCounts = calculateStatusCounts(stories);
    return {
      ...category,
      totalStories: stories.length,
      completionRate: stories.length > 0 ? Math.round(statusCounts.complete / stories.length * 100) : 0,
      statusCounts,
      stories
    };
  });
  const StatusIndicators = ({
    counts
  }: {
    counts: {
      complete: number;
      progress: number;
      incomplete: number;
    };
  }) => (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="text-emerald-600 font-medium text-sm font-sf-pro">{counts.complete}</span>
        <div className="status-dot status-complete"></div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-amber-600 font-medium text-sm font-sf-pro">{counts.progress}</span>
        <div className="status-dot status-progress"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Liquid Glass Background Gradient Splash */}
      <div className="fixed top-0 right-0 w-96 h-96 opacity-30 pointer-events-none">
        <div className="liquid-glass-splash"></div>
      </div>
      {/* Glass Header */}
      <header className="glass-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="logo-icon">
                <img src="/logo-sign-2.svg" alt="Chronicles Logo" className="w-12 h-12 object-contain" />
              </div>
              <div className="logo-container">
                <div className="logo-main font-sf-pro font-bold text-slate-800">
                  Chronicles
                </div>
                <div className="logo-subtitle font-sf-pro font-medium text-slate-500 mx-[2px]">
                  Corporate Knowledge Base
                </div>
              </div>
            </div>
            
            {/* Glass Search Bar */}
            <div className="flex-1 max-w-lg">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-400 group-hover:text-slate-400 w-5 h-5" />
                <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search stories, topics, or insights..." className="glass-input pl-12 h-11 text-slate-800 placeholder:text-slate-500 text-base font-sf-pro font-normal" />
              </div>
            </div>

            {/* Apple Glass Quick Stats */}
            <div className="hidden lg:flex items-center gap-4 text-sm">
              <div className="flex items-center gap-3 glass-card px-6 py-3">
                <FileText className="w-4 h-4 text-slate-600" />
                <span className="font-medium text-slate-700 font-sf-pro">{knowledgeCategories.reduce((total, cat) => total + cat.totalStories, 0)} Stories</span>
              </div>
              <div className="flex items-center gap-3 glass-card px-6 py-3">
                <Users className="w-4 h-4 text-slate-600" />
                <span className="font-medium text-slate-700 font-sf-pro">12 Authors</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Apple Glass Page Header */}
        <div className="mb-12">
          <h2 className="text-4xl font-semibold text-slate-800 mb-2 font-sf-pro">
            Stories of <span className="text-blue-600 cursor-pointer hover:text-blue-700 transition-colors" onClick={() => setShowChristopherCard(!showChristopherCard)}>
              Christopher Becker
            </span>
          </h2>
          
          {/* Glass Christopher Becker Card */}
          {showChristopherCard && <Card className="glass-card absolute z-50 -mt-2 max-w-md animate-fade-in">
              <CardContent className="p-8 shadow-2xl shadow-black/10">
                  <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <img src="/christopher-becker-avatar.jpg" alt="Christopher Becker" className="w-16 h-16 rounded-full object-cover border-2 border-white/30" />
                    <div>
                      <h3 className="text-xl font-semibold text-slate-800 font-sf-pro">Christopher Becker</h3>
                      <p className="text-blue-600 font-medium font-sf-pro">Head of Product</p>
                    </div>
                  </div>
                  <button onClick={() => setShowChristopherCard(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-sf-pro">Product Development Department</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm font-sf-pro">christopher.becker@company.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm font-sf-pro">+1 (555) 123-4567</span>
                  </div>
                </div>
              </CardContent>
            </Card>}
          <p className="text-lg text-slate-600 max-w-3xl font-sf-pro font-light">
            Capturing and organizing critical knowledge from our Head of Product
          </p>
        </div>

        {/* Apple Glass Knowledge Categories */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-slate-800/70 mb-5 font-sf-pro">Knowledge Categories</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {knowledgeCategories.map((category, index) => <Link key={category.title} to={`/category/${encodeURIComponent(category.title)}`} className="block">
                <Card className="knowledge-card animate-slide-up cursor-pointer h-full hover:shadow-2xl hover:-translate-y-1 hover:scale-105 transition-all duration-300" style={{
              animationDelay: `${index * 100}ms`
            }}>
                 <CardContent className="p-8 flex flex-col h-full">
                    <div className="flex-1 space-y-6">
                      {/* Glass Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className={cn("p-3 rounded-2xl backdrop-blur-sm flex-shrink-0", category.bgColor)}>
                            <category.icon className={cn("w-6 h-6 card-icon transition-colors duration-300", category.iconColor)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-slate-800 text-lg leading-tight font-sf-pro truncate card-content transition-colors duration-300">
                              {category.title}
                            </h4>
                          </div>
                        </div>
                        <ChevronRight className="w-6 h-6 text-slate-400 flex-shrink-0 chevron-icon transition-colors duration-300" />
                      </div>

                      {/* Description */}
                      <p className="text-slate-600 text-base leading-relaxed font-sf-pro card-description transition-colors duration-300">
                        {category.description}
                      </p>
                    </div>

                    {/* Apple Glass Stats - Aligned to bottom */}
                    <div className="mt-auto pt-6">
                      <div className="flex items-end justify-between">
                        <div className="text-left">
                          <span className="text-sm font-medium text-slate-500 block mb-2 font-sf-pro card-stats transition-colors duration-300">Total Stories</span>
                          <span className="text-3xl font-semibold text-slate-800 font-sf-pro card-content transition-colors duration-300">{category.totalStories}</span>
                        </div>
                        <div className="flex-shrink-0">
                          <StatusIndicators counts={category.statusCounts} />
                        </div>
                      </div>
                    </div>
                 </CardContent>
               </Card>
              </Link>)}
          </div>
        </div>

        {/* Glass Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Knowledge Gaps */}
          <Link to="/knowledge-gaps">
            <Card className="alert-warning cursor-pointer">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <TriangleAlert className="w-7 h-7 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-amber-900 text-xl mb-3 font-sf-pro">
                    Knowledge Gaps Identified
                  </h4>
                  <p className="text-amber-800 text-base mb-4 font-sf-pro font-light">
                    We've identified areas where critical knowledge may be missing or incomplete.
                  </p>
                  <Badge className="bg-amber-50 text-amber-700 px-4 py-2 text-sm font-sf-pro font-medium rounded-full border-none">4 gaps found</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          </Link>

          {/* AI Suggestions */}
          <Link to="/ai-suggestions">
            <Card className="alert-info cursor-pointer">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Sparkles className="w-7 h-7 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 text-xl mb-3 font-sf-pro">
                    AI Suggestions
                  </h4>
                  <p className="text-blue-800 text-base mb-4 font-sf-pro font-light">
                    Our AI has analyzed your content and found opportunities for improvement.
                  </p>
                  <Badge className="bg-blue-50 text-blue-700 px-4 py-2 text-sm font-sf-pro font-medium rounded-full border-none">
                    5 suggestions
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          </Link>
        </div>

        {/* Apple Glass Quick Actions */}
        <div className="mt-12">
          <div className="flex flex-wrap gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 h-auto font-sf-pro font-medium rounded-full hover:scale-105 transition-transform border-none">
              <FileText className="w-5 h-5 mr-3" />
              Add New Story
            </Button>
            <Button className="glass-card text-slate-700 px-8 py-4 h-auto font-sf-pro font-medium rounded-full hover:scale-105 transition-transform bg-white/80 hover:bg-white/90">
              <TrendingUp className="w-5 h-5 mr-3" />
              View Analytics
            </Button>
            <Button className="glass-card text-slate-700 px-8 py-4 h-auto font-sf-pro font-medium rounded-full hover:scale-105 transition-transform bg-white/80 hover:bg-white/90">
              <Users className="w-5 h-5 mr-3" />
              Manage Contributors
            </Button>
            <Button
              onClick={conversationCompleted.triggerConversationCompleted}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 h-auto font-sf-pro font-medium rounded-full hover:scale-105 transition-transform border-none"
            >
              <TestTube className="w-5 h-5 mr-3" />
              Test Call End Popup
            </Button>
          </div>

        </div>
      </main>

      {/* Conversation Completed Popup */}
      <ConversationCompletedPopup
        isOpen={conversationCompleted.showPopup}
        onClose={conversationCompleted.closePopup}
      />
    </div>
  );
};
export default KnowledgeBaseDashboard;