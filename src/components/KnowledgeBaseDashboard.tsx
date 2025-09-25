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
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

const KnowledgeBaseDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data
  const stats = [
    { title: "Total Articles", value: "2,847", change: "+12%", icon: FileText, color: "text-primary" },
    { title: "Active Users", value: "1,432", change: "+8%", icon: Users, color: "text-accent" },
    { title: "Categories", value: "24", change: "+2", icon: BookOpen, color: "text-warning" },
    { title: "Monthly Views", value: "45.2K", change: "+24%", icon: TrendingUp, color: "text-success" }
  ];

  const recentArticles = [
    { title: "Employee Onboarding Process 2024", category: "HR", views: 245, updated: "2 hours ago", status: "updated" },
    { title: "Data Security Guidelines", category: "IT", views: 189, updated: "1 day ago", status: "new" },
    { title: "Budget Approval Workflow", category: "Finance", views: 156, updated: "3 days ago", status: "popular" },
    { title: "Remote Work Best Practices", category: "Operations", views: 298, updated: "1 week ago", status: "trending" }
  ];

  const categories = [
    { name: "Human Resources", count: 342, icon: "👥", color: "bg-blue-500/10 text-blue-400" },
    { name: "Information Technology", count: 289, icon: "💻", color: "bg-green-500/10 text-green-400" },
    { name: "Finance", count: 156, icon: "💼", color: "bg-yellow-500/10 text-yellow-400" },
    { name: "Operations", count: 198, icon: "⚙️", color: "bg-purple-500/10 text-purple-400" },
    { name: "Marketing", count: 134, icon: "📈", color: "bg-pink-500/10 text-pink-400" },
    { name: "Legal", count: 87, icon: "⚖️", color: "bg-red-500/10 text-red-400" }
  ];

  const StatusBadge = ({ status }: { status: string }) => {
    const variants = {
      new: "bg-accent/20 text-accent border-accent/30",
      updated: "bg-primary/20 text-primary border-primary/30", 
      popular: "bg-warning/20 text-warning border-warning/30",
      trending: "bg-success/20 text-success border-success/30"
    };
    
    return (
      <Badge variant="outline" className={cn("capitalize", variants[status as keyof typeof variants])}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-bg p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold gradient-text">Knowledge Base Dashboard</h1>
            <p className="text-muted-foreground text-lg">Manage and explore your corporate knowledge repository</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="glass">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button className="bg-gradient-primary hover:bg-primary-hover shadow-primary">
              <Plus className="w-4 h-4 mr-2" />
              New Article
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="glass border-white/10 shadow-card">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles, documents, FAQs..."
                  className="pl-12 h-12 bg-muted/50 border-white/10 text-lg"
                />
              </div>
              <Button variant="outline" className="glass px-6">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={stat.title} className="glass border-white/10 shadow-card hover:shadow-hover transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-sm">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className={cn("text-sm flex items-center", stat.color)}>
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {stat.change}
                    </p>
                  </div>
                  <div className={cn("p-3 rounded-xl bg-gradient-card", stat.color)}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Recent Articles */}
          <div className="xl:col-span-2">
            <Card className="glass border-white/10 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Recent Articles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentArticles.map((article, index) => (
                  <div key={index} className="p-4 rounded-lg bg-gradient-card hover:bg-muted/30 transition-all duration-300 border border-white/5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground hover:text-primary cursor-pointer transition-colors">
                            {article.title}
                          </h3>
                          <StatusBadge status={article.status} />
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="px-2 py-1 rounded-md bg-muted/50">{article.category}</span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {article.views} views
                          </span>
                          <span>{article.updated}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                          <Star className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Categories */}
          <div>
            <Card className="glass border-white/10 shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-accent" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {categories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gradient-card hover:bg-muted/30 transition-all duration-300 cursor-pointer border border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{category.icon}</span>
                      <div>
                        <p className="font-medium text-sm">{category.name}</p>
                        <p className="text-xs text-muted-foreground">{category.count} articles</p>
                      </div>
                    </div>
                    <div className={cn("px-2 py-1 rounded-md text-xs font-medium", category.color)}>
                      {category.count}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBaseDashboard;