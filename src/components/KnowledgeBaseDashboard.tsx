import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  FileText, 
  Users, 
  BookOpen, 
  TrendingUp, 
  Clock, 
  Star,
  Filter,
  Plus,
  Download,
  Eye,
  MessageSquare,
  Menu,
  Bell,
  Settings,
  ChevronRight,
  BarChart3,
  Shield,
  Zap,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

const KnowledgeBaseDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Mock data with more professional content
  const stats = [
    { 
      title: "Knowledge Articles", 
      value: "3,247", 
      change: "+12%", 
      icon: FileText, 
      trend: "up",
      description: "Total published articles"
    },
    { 
      title: "Active Contributors", 
      value: "1,432", 
      change: "+8%", 
      icon: Users, 
      trend: "up",
      description: "Monthly active users"
    },
    { 
      title: "Knowledge Categories", 
      value: "28", 
      change: "+3", 
      icon: BookOpen, 
      trend: "up",
      description: "Organized topics"
    },
    { 
      title: "Monthly Insights", 
      value: "89.2K", 
      change: "+24%", 
      icon: BarChart3, 
      trend: "up",
      description: "Knowledge interactions"
    }
  ];

  const recentArticles = [
    { 
      title: "Enterprise Security Framework 2024", 
      category: "Security", 
      views: 1245, 
      updated: "2 hours ago", 
      status: "critical",
      author: "Security Team",
      readTime: "8 min"
    },
    { 
      title: "Digital Transformation Guidelines", 
      category: "Strategy", 
      views: 987, 
      updated: "1 day ago", 
      status: "trending",
      author: "Leadership",
      readTime: "12 min"
    },
    { 
      title: "Remote Collaboration Best Practices", 
      category: "Operations", 
      views: 756, 
      updated: "2 days ago", 
      status: "popular",
      author: "HR Department",
      readTime: "6 min"
    },
    { 
      title: "Data Governance Standards", 
      category: "Compliance", 
      views: 654, 
      updated: "3 days ago", 
      status: "updated",
      author: "Legal Team",
      readTime: "15 min"
    },
    { 
      title: "Innovation Management Process", 
      category: "Innovation", 
      views: 432, 
      updated: "1 week ago", 
      status: "new",
      author: "R&D Team",
      readTime: "10 min"
    }
  ];

  const categories = [
    { name: "Security & Compliance", count: 428, icon: Shield, color: "text-red-600", bgColor: "bg-red-50", growth: "+15%" },
    { name: "Digital Strategy", count: 312, icon: Zap, color: "text-blue-600", bgColor: "bg-blue-50", growth: "+22%" },
    { name: "Operations", count: 298, icon: Settings, color: "text-green-600", bgColor: "bg-green-50", growth: "+8%" },
    { name: "Human Resources", count: 245, icon: Users, color: "text-purple-600", bgColor: "bg-purple-50", growth: "+12%" },
    { name: "Technology", count: 189, icon: Globe, color: "text-indigo-600", bgColor: "bg-indigo-50", growth: "+18%" },
    { name: "Innovation", count: 156, icon: TrendingUp, color: "text-orange-600", bgColor: "bg-orange-50", growth: "+25%" }
  ];

  const quickActions = [
    { name: "Create Article", icon: Plus, description: "Add new knowledge" },
    { name: "Upload Document", icon: FileText, description: "Import existing files" },
    { name: "Generate Report", icon: BarChart3, description: "Analytics insights" },
    { name: "Manage Users", icon: Users, description: "Access control" }
  ];

  const StatusBadge = ({ status }: { status: string }) => {
    const variants = {
      critical: "bg-red-100 text-red-800 border-red-200",
      trending: "bg-blue-100 text-blue-800 border-blue-200", 
      popular: "bg-green-100 text-green-800 border-green-200",
      updated: "bg-yellow-100 text-yellow-800 border-yellow-200",
      new: "bg-purple-100 text-purple-800 border-purple-200"
    };
    
    return (
      <Badge variant="outline" className={cn("text-xs font-medium border", variants[status as keyof typeof variants])}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Professional Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container-responsive py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="logo-text text-2xl sm:text-3xl tracking-wider">CHRONICLES</h1>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Knowledge Management</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="hidden md:flex">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">New Article</span>
                <span className="sm:hidden">New</span>
              </Button>
              <Button variant="ghost" size="sm" className="sm:hidden">
                <Menu className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container-responsive py-8 space-y-8">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground">
            Knowledge Dashboard
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Centralize, organize, and share your organization's collective wisdom with enterprise-grade knowledge management.
          </p>
        </div>

        {/* Professional Search */}
        <Card className="premium-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search knowledge base, articles, documents..."
                  className="pl-12 h-12 text-base border-border focus:ring-primary"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="px-6">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card 
              key={stat.title} 
              className="premium-card animate-fade-in-up" 
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <stat.icon className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium text-muted-foreground">{stat.title}</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-bold font-heading">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.description}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3 text-success" />
                      <span className="text-sm font-medium text-success">{stat.change}</span>
                      <span className="text-xs text-muted-foreground">vs last month</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Recent Articles */}
          <div className="xl:col-span-2 space-y-6">
            <Card className="premium-card">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 font-heading">
                    <Clock className="w-5 h-5 text-accent" />
                    Recent Knowledge Updates
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-xs">
                    View All
                    <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentArticles.map((article, index) => (
                  <div 
                    key={index} 
                    className="group p-4 rounded-lg border border-border hover:border-primary/20 hover:shadow-md transition-all duration-300 cursor-pointer"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                              {article.title}
                            </h3>
                            <StatusBadge status={article.status} />
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                            <span className="px-2 py-1 bg-muted rounded-md text-xs font-medium">
                              {article.category}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {article.views.toLocaleString()}
                            </span>
                            <span>by {article.author}</span>
                            <span>{article.readTime} read</span>
                            <span>{article.updated}</span>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MessageSquare className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Star className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="font-heading">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-center gap-2 hover:border-primary/20 hover:bg-primary/5 transition-all duration-300"
                    >
                      <action.icon className="w-6 h-6 text-primary" />
                      <div className="text-center">
                        <p className="font-medium text-sm">{action.name}</p>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Categories */}
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-heading">
                  <BookOpen className="w-5 h-5 text-accent" />
                  Knowledge Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {categories.map((category, index) => (
                  <div 
                    key={index} 
                    className="group flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/20 hover:shadow-sm transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={cn("p-2 rounded-lg", category.bgColor)}>
                        <category.icon className={cn("w-4 h-4", category.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{category.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{category.count} articles</span>
                          <span className="text-success">{category.growth}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Performance Insights */}
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-heading">
                  <BarChart3 className="w-5 h-5 text-accent" />
                  Performance Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Search Success Rate</span>
                    <span className="font-semibold">94.2%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-success h-2 rounded-full" style={{ width: '94.2%' }}></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Content Freshness</span>
                    <span className="font-semibold">87.5%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-accent h-2 rounded-full" style={{ width: '87.5%' }}></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">User Engagement</span>
                    <span className="font-semibold">91.8%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-warning h-2 rounded-full" style={{ width: '91.8%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default KnowledgeBaseDashboard;