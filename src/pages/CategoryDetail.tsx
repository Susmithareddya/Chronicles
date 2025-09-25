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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              className="story-detail-card cursor-pointer transition-all duration-200 hover:shadow-lg border border-slate-200 hover:border-slate-300 bg-white"
              onClick={() => setSelectedStory(story.id)}
            >
              <CardContent className="p-6">
                {/* Story Header */}
                <div className="mb-4">
                  <h3 className="font-semibold text-slate-800 text-lg mb-2 font-sf-pro leading-tight">
                    {story.title}
                  </h3>
                  
                  <Badge 
                    className={cn(
                      "mb-3 text-sm px-3 py-1 rounded-full border font-sf-pro font-medium",
                      getStatusColor(story.status)
                    )}
                  >
                    {getStatusLabel(story.status)}
                  </Badge>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-slate-500 mb-4">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-sf-pro">{story.date}</span>
                </div>

                {/* Description */}
                <p className="text-slate-600 text-sm leading-relaxed font-sf-pro mb-4 line-clamp-3">
                  {story.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {story.tags.map((tag, index) => (
                    <Badge 
                      key={index}
                      className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-md border border-blue-200 font-sf-pro font-normal hover:bg-blue-100 transition-colors"
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