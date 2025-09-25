import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  Crown,
  Truck,
  Shield,
  Handshake,
  Target,
  Lightbulb,
  AlertTriangle,
  Sparkles,
  ChevronRight,
  BarChart3,
  FileText,
  Users,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

const KnowledgeBaseDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const knowledgeCategories = [
    {
      title: "Leadership Insights",
      description: "Management philosophy, team building, and decision-making frameworks",
      icon: Crown,
      iconColor: "text-orange-600",
      bgColor: "bg-orange-50",
      totalStories: 15,
      completionRate: 80,
      statusCounts: { complete: 12, progress: 2, incomplete: 1 }
    },
    {
      title: "Project Histories", 
      description: "Major initiatives, launches, and transformation programs",
      icon: Truck,
      iconColor: "text-red-600",
      bgColor: "bg-red-50",
      totalStories: 23,
      completionRate: 78,
      statusCounts: { complete: 18, progress: 3, incomplete: 2 }
    },
    {
      title: "Crisis Management",
      description: "Handling challenges, market downturns, and operational disruptions", 
      icon: Shield,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-50",
      totalStories: 8,
      completionRate: 75,
      statusCounts: { complete: 6, progress: 1, incomplete: 1 }
    },
    {
      title: "Supplier Relations",
      description: "Key partnerships, negotiations, and supply chain strategies",
      icon: Handshake, 
      iconColor: "text-amber-600",
      bgColor: "bg-amber-50",
      totalStories: 18,
      completionRate: 78,
      statusCounts: { complete: 14, progress: 2, incomplete: 2 }
    },
    {
      title: "Strategy Lessons",
      description: "Market analysis, competitive positioning, and long-term planning",
      icon: Target,
      iconColor: "text-pink-600", 
      bgColor: "bg-pink-50",
      totalStories: 12,
      completionRate: 75,
      statusCounts: { complete: 9, progress: 2, incomplete: 1 }
    },
    {
      title: "Innovation & Technology",
      description: "R&D decisions, technology adoption, and future trends",
      icon: Lightbulb,
      iconColor: "text-yellow-600",
      bgColor: "bg-yellow-50",
      totalStories: 10, 
      completionRate: 70,
      statusCounts: { complete: 7, progress: 1, incomplete: 2 }
    }
  ];

  const StatusIndicators = ({ counts }: { counts: { complete: number, progress: number, incomplete: number } }) => (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <span className="text-green-700 font-semibold text-sm">{counts.complete}</span>
        <div className="status-dot status-complete"></div>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-yellow-700 font-semibold text-sm">{counts.progress}</span>
        <div className="status-dot status-progress"></div>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-red-700 font-semibold text-sm">{counts.incomplete}</span>
        <div className="status-dot status-incomplete"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with high visibility */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div>
                <h1 className="logo-text text-xl">CHRONICLES</h1>
                <p className="text-gray-600 text-sm">Corporate Knowledge Base</p>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <Input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search stories, topics, or insights..."
                  className="pl-10 h-11 bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base"
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="hidden lg:flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-gray-900">86 Stories</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-gray-900">12 Authors</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Knowledge Dashboard</h2>
          <p className="text-lg text-gray-700 max-w-3xl">
            Capturing and organizing critical knowledge from our senior leadership team
          </p>
        </div>

        {/* Knowledge Categories */}
        <div className="mb-10">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Knowledge Categories</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {knowledgeCategories.map((category, index) => (
              <Card 
                key={category.title}
                className="knowledge-card animate-slide-up cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="space-y-5">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg", category.bgColor)}>
                          <category.icon className={cn("w-5 h-5", category.iconColor)} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 text-base leading-tight">
                            {category.title}
                          </h4>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 mt-1" />
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {category.description}
                    </p>

                    {/* Stats */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Total Stories</span>
                        <span className="text-2xl font-bold text-gray-900">{category.totalStories}</span>
                      </div>

                      {/* Progress Section */}
                      <div className="space-y-3">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="progress-bar h-2.5 rounded-full" 
                            style={{ width: `${category.completionRate}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            {category.completionRate}% Complete
                          </span>
                          <StatusIndicators counts={category.statusCounts} />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Knowledge Gaps */}
          <Card className="alert-warning border-amber-300">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-amber-900 text-lg mb-2">
                    Knowledge Gaps Identified
                  </h4>
                  <p className="text-amber-800 text-sm mb-3">
                    We've identified areas where critical knowledge may be missing or incomplete.
                  </p>
                  <Badge className="bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200">
                    4 gaps found
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          <Card className="alert-info border-blue-300">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 text-lg mb-2">
                    AI Suggestions
                  </h4>
                  <p className="text-blue-800 text-sm mb-3">
                    Our AI has analyzed your content and found opportunities for improvement.
                  </p>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200">
                    5 suggestions
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="flex flex-wrap gap-3">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <FileText className="w-4 h-4 mr-2" />
              Add New Story
            </Button>
            <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
            <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
              <Users className="w-4 h-4 mr-2" />
              Manage Contributors
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default KnowledgeBaseDashboard;