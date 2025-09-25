import { useState } from "react";
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
  Mail,
  Phone,
  MapPin,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

const KnowledgeBaseDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showChristopherCard, setShowChristopherCard] = useState(false);

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
    <div className="min-h-screen">
      {/* Header with glass effect */}
      <header className="glass-header sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <img 
                src="/src/assets/logo_chronicles_1.svg" 
                alt="CHRONICLES" 
                className="h-10 w-auto"
              />
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search stories, topics, or insights..."
                  className="pl-12 h-12 glass-card border-0 text-base placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="hidden lg:flex items-center gap-8 text-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-primary text-white">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">86</div>
                  <div className="text-xs text-muted-foreground">Stories</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-accent text-white">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">12</div>
                  <div className="text-xs text-muted-foreground">Authors</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-4 font-heading">
            Stories of <span 
              className="text-transparent bg-gradient-primary bg-clip-text cursor-pointer hover:scale-105 transition-transform inline-block"
              onClick={() => setShowChristopherCard(!showChristopherCard)}
            >
              Christopher Becker
            </span>
          </h1>
          
          {/* Christopher Becker Card */}
          {showChristopherCard && (
            <div className="absolute z-50 mt-4 animate-fade-in">
              <div className="glass-card p-8 max-w-md">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <img 
                      src="/src/assets/christopher-becker-avatar.jpg" 
                      alt="Christopher Becker" 
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-primary/20"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-foreground font-heading">Christopher Becker</h3>
                      <p className="text-primary font-medium">Head of Product</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowChristopherCard(false)}
                    className="p-2 rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Product Development Department</span>
                  </div>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">christopher.becker@company.com</span>
                  </div>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">+1 (555) 123-4567</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <p className="text-xl text-muted-foreground max-w-4xl leading-relaxed">
            Capturing and organizing critical knowledge from our Head of Product
          </p>
        </div>

        {/* Knowledge Categories */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-muted-foreground mb-8 font-heading">Knowledge Categories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {knowledgeCategories.map((category, index) => (
              <div 
                key={category.title}
                className="knowledge-card cursor-pointer h-full animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-8">
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn("p-3 rounded-2xl", category.bgColor, "backdrop-blur-sm")}>
                          <category.icon className={cn("w-6 h-6", category.iconColor)} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground text-xl leading-tight font-heading">
                            {category.title}
                          </h3>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground mt-1 opacity-60" />
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground leading-relaxed">
                      {category.description}
                    </p>

                    {/* Stats */}
                    <div className="space-y-5">
                      <div className="flex items-end justify-between">
                        <div className="text-left">
                          <span className="text-sm font-medium text-muted-foreground block mb-2">Total Stories</span>
                          <span className="text-3xl font-bold text-foreground font-heading">{category.totalStories}</span>
                        </div>
                        <div className="self-end">
                          <StatusIndicators counts={category.statusCounts} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Knowledge Gaps */}
          <div className="alert-warning glass-card">
            <div className="p-8">
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0">
                  <div className="p-3 rounded-2xl bg-warning/10">
                    <AlertTriangle className="w-6 h-6 text-warning" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-warning text-xl mb-3 font-heading">
                    Knowledge Gaps Identified
                  </h3>
                  <p className="text-warning/80 mb-4 leading-relaxed">
                    We've identified areas where critical knowledge may be missing or incomplete.
                  </p>
                  <Badge className="bg-warning/10 text-warning border-warning/30 hover:bg-warning/20 px-4 py-2 rounded-full">
                    4 gaps found
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* AI Suggestions */}
          <div className="alert-info glass-card">
            <div className="p-8">
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0">
                  <div className="p-3 rounded-2xl bg-primary/10">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-primary text-xl mb-3 font-heading">
                    AI Suggestions
                  </h3>
                  <p className="text-primary/80 mb-4 leading-relaxed">
                    Our AI has analyzed your content and found opportunities for improvement.
                  </p>
                  <Badge className="bg-primary/10 text-primary border-primary/30 hover:bg-primary/20 px-4 py-2 rounded-full">
                    5 suggestions
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4">
          <Button className="bg-gradient-primary hover:scale-105 transition-transform text-white px-6 py-3 rounded-2xl shadow-soft">
            <FileText className="w-5 h-5 mr-3" />
            Add New Story
          </Button>
          <Button variant="outline" className="glass-button px-6 py-3 rounded-2xl">
            <BarChart3 className="w-5 h-5 mr-3" />
            View Analytics
          </Button>
          <Button variant="outline" className="glass-button px-6 py-3 rounded-2xl">
            <Users className="w-5 h-5 mr-3" />
            Manage Contributors
          </Button>
        </div>
      </main>
    </div>
  );
};

export default KnowledgeBaseDashboard;