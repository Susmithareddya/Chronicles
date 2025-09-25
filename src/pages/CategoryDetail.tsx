import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar } from "lucide-react";
import { getStoriesForCategory } from "@/data/storiesData";
import { cn } from "@/lib/utils";

const CategoryDetail = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [selectedStory, setSelectedStory] = useState<string | null>(null);

  if (!categoryName) {
    return <div>Category not found</div>;
  }

  const decodedCategoryName = decodeURIComponent(categoryName);
  const stories = getStoriesForCategory(decodedCategoryName);

  const getCategoryDescription = (title: string) => {
    const descriptions: { [key: string]: string } = {
      "Onboarding Essentials": "Critical knowledge for newcomers replacing Christopher — processes, workflows, and key relationships",
      "Project Histories": "Major initiatives, launches, and transformation programs",
      "Crisis Management": "Handling challenges, market downturns, and operational disruptions",
      "Strategic Partnerships": "Key partnerships, negotiations, and supply chain strategies",
      "Strategy Lessons": "Market analysis, competitive positioning, and long-term planning",
      "Innovation & Technology": "R&D decisions, technology adoption, and future trends"
    };
    return descriptions[title] || "";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'progress':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'incomplete':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'complete':
        return 'Completed';
      case 'progress':
        return 'In Progress';
      case 'incomplete':
        return 'Draft';
      default:
        return 'Unknown';
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
          
          <h1 className="text-4xl font-bold text-slate-900 mb-3 tracking-tight">
            {decodedCategoryName}
          </h1>
          <p className="text-lg text-slate-600 font-light leading-relaxed">
            {getCategoryDescription(decodedCategoryName)}
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <Card 
              key={story.id}
              className="cursor-pointer group relative overflow-hidden bg-white border border-slate-200 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => setSelectedStory(story.id)}
            >
              <CardContent className="p-6 relative z-10">
                {/* Story Header */}
                <div className="mb-5">
                  <h3 className="font-semibold text-slate-900 text-xl mb-3 leading-tight tracking-tight group-hover:text-slate-800 transition-colors">
                    {story.title}
                  </h3>
                  
                  <Badge 
                    className={cn(
                      "glass-status-badge px-2 py-1 text-xs font-medium rounded-full border-0 backdrop-blur-md transition-all duration-200 hover:bg-emerald-100/90 hover:text-emerald-800",
                      story.status === 'complete' && "bg-emerald-100/80 text-emerald-700 shadow-emerald-200/50",
                      story.status === 'progress' && "bg-amber-100/80 text-amber-700 shadow-amber-200/50"
                    )}
                  >
                    {getStatusLabel(story.status)}
                  </Badge>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 mb-5">
                  <div className="p-1">
                    <Calendar className="w-4 h-4 text-slate-600" />
                  </div>
                  <span className="text-sm text-slate-600 font-medium">{story.date}</span>
                </div>

                {/* Description */}
                <p className="text-slate-700 text-sm leading-relaxed mb-5 line-clamp-3 group-hover:text-slate-600 transition-colors">
                  {story.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {story.tags.map((tag, index) => (
                    <Badge 
                      key={index}
                      className="glass-tag px-3 py-1 text-xs font-medium rounded-full bg-blue-50/70 text-blue-800 border border-blue-100/50 backdrop-blur-sm hover:bg-blue-100/70 transition-all duration-200 shadow-sm"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {stories.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-500 text-lg font-sf-pro">
              No stories found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetail;