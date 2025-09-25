import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const KnowledgeBaseDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const knowledgeCategories = [
    {
      title: "Leadership Insights",
      description: "Management philosophy, team building, and decision-making frameworks",
      icon: Crown,
      iconColor: "text-orange-500",
      totalStories: 15,
      completionRate: 80,
      statusCounts: { complete: 12, progress: 2, incomplete: 1 }
    },
    {
      title: "Project Histories", 
      description: "Major initiatives, launches, and transformation programs",
      icon: Truck,
      iconColor: "text-red-500",
      totalStories: 23,
      completionRate: 78,
      statusCounts: { complete: 18, progress: 3, incomplete: 2 }
    },
    {
      title: "Crisis Management",
      description: "Handling challenges, market downturns, and operational disruptions", 
      icon: Shield,
      iconColor: "text-blue-500",
      totalStories: 8,
      completionRate: 75,
      statusCounts: { complete: 6, progress: 1, incomplete: 1 }
    },
    {
      title: "Supplier Relations",
      description: "Key partnerships, negotiations, and supply chain strategies",
      icon: Handshake, 
      iconColor: "text-yellow-600",
      totalStories: 18,
      completionRate: 78,
      statusCounts: { complete: 14, progress: 2, incomplete: 2 }
    },
    {
      title: "Strategy Lessons",
      description: "Market analysis, competitive positioning, and long-term planning",
      icon: Target,
      iconColor: "text-pink-500", 
      totalStories: 12,
      completionRate: 75,
      statusCounts: { complete: 9, progress: 2, incomplete: 1 }
    },
    {
      title: "Innovation & Technology",
      description: "R&D decisions, technology adoption, and future trends",
      icon: Lightbulb,
      iconColor: "text-yellow-500",
      totalStories: 10, 
      completionRate: 70,
      statusCounts: { complete: 7, progress: 1, incomplete: 2 }
    }
  ];

  const StatusIndicators = ({ counts }: { counts: { complete: number, progress: number, incomplete: number } }) => (
    <div className="flex items-center gap-1">
      <span className="text-success font-medium text-sm">{counts.complete}</span>
      <div className="status-dot status-complete"></div>
      <span className="text-warning font-medium text-sm">{counts.progress}</span>
      <div className="status-dot status-progress"></div>
      <span className="text-error font-medium text-sm">{counts.incomplete}</span>
      <div className="status-dot status-incomplete"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Clean Header */}
      <header className="border-b border-border bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <div>
                <h1 className="logo-text text-lg font-medium">CHRONICLES</h1>
                <p className="text-muted-foreground text-sm">Corporate Knowledge Base</p>
              </div>
            </div>
            
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search stories, topics, or insights..."
                  className="pl-10 h-10 bg-input border-border focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-foreground mb-2">Knowledge Dashboard</h2>
          <p className="text-muted-foreground text-lg">
            Capturing and organizing critical knowledge from senior leadership team
          </p>
        </div>

        {/* Knowledge Categories Section */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-foreground mb-6">Knowledge Categories</h3>
          
          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {knowledgeCategories.map((category, index) => (
              <Card 
                key={category.title}
                className="knowledge-card bg-white border border-border shadow-sm cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <category.icon className={cn("w-5 h-5", category.iconColor)} />
                        <div>
                          <h4 className="font-semibold text-foreground text-base">{category.title}</h4>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {category.description}
                    </p>

                    {/* Stats */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">Total Stories</span>
                        <span className="text-lg font-semibold text-foreground">{category.totalStories}</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full progress-bar" 
                            style={{ width: `${category.completionRate}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{category.completionRate}% Complete</span>
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

        {/* Bottom Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Knowledge Gaps */}
          <Card className="bg-orange-50 border border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <div>
                  <h4 className="font-semibold text-orange-800">Knowledge Gaps Identified</h4>
                  <Badge variant="secondary" className="mt-1 bg-orange-100 text-orange-700 border-orange-200">
                    4 gaps found
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          <Card className="bg-purple-50 border border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <div>
                  <h4 className="font-semibold text-purple-800">AI Suggestions</h4>
                  <Badge variant="secondary" className="mt-1 bg-purple-100 text-purple-700 border-purple-200">
                    5 suggestions
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default KnowledgeBaseDashboard;