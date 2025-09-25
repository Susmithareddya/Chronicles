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
      <div className="min-h-screen relative overflow-hidden">
        {/* Liquid Glass Background Gradient Splash */}
        <div className="fixed top-0 right-0 w-96 h-96 opacity-20 pointer-events-none">
          <div className="liquid-glass-splash"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors mb-6 font-sf-pro"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          
          <h1 className="text-4xl font-bold text-slate-800 mb-3 font-sf-pro">
            {decodedCategoryName}
          </h1>
          <p className="text-lg text-slate-600 font-sf-pro font-light">
            {getCategoryDescription(decodedCategoryName)}
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.map((story) => (
            <Card 
              key={story.id}
              className="glass-card cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1"
              onClick={() => setSelectedStory(story.id)}
            >
              <CardContent className="p-8">
                {/* Story Header */}
                <div className="mb-6">
                  <h3 className="font-semibold text-slate-800 text-xl mb-3 font-sf-pro leading-tight">
                    {story.title}
                  </h3>
                  
                  <Badge 
                    className={cn(
                      "mb-4 text-sm px-4 py-2 rounded-full border font-sf-pro font-medium backdrop-blur-sm",
                      getStatusColor(story.status)
                    )}
                  >
                    {getStatusLabel(story.status)}
                  </Badge>
                </div>

                {/* Date */}
                <div className="flex items-center gap-3 text-slate-500 mb-6">
                  <div className="p-2 rounded-xl bg-slate-100/80 backdrop-blur-sm">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="text-base font-sf-pro font-medium">{story.date}</span>
                </div>

                {/* Description */}
                <p className="text-slate-600 text-base leading-relaxed font-sf-pro mb-6 line-clamp-3">
                  {story.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {story.tags.map((tag, index) => (
                    <Badge 
                      key={index}
                      className="glass-tag text-sm px-3 py-2 rounded-xl font-sf-pro font-medium hover:scale-105 transition-transform cursor-pointer"
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