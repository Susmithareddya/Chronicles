import { useParams, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Edit, Paperclip, Phone } from "lucide-react";
import { getStoriesForCategory } from "@/data/storiesData";
import { detailedStoryContent } from "@/data/storyContent";
import { cn } from "@/lib/utils";

const StoryDetail = () => {
  const { categoryName, storyId } = useParams<{ categoryName: string; storyId: string }>();

  if (!categoryName || !storyId) {
    return <div>Story not found</div>;
  }

  const decodedCategoryName = decodeURIComponent(categoryName);
  const stories = getStoriesForCategory(decodedCategoryName);
  const story = stories.find(s => s.id === storyId);

  if (!story) {
    return <div>Story not found</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'bg-emerald-100/80 text-emerald-700 shadow-emerald-200/50';
      case 'progress':
      case 'incomplete':
        return 'bg-amber-100/80 text-amber-700 shadow-amber-200/50';
      default:
        return 'bg-slate-100/80 text-slate-700 shadow-slate-200/50';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'complete':
        return 'Complete';
      case 'progress':
      case 'incomplete':
        return 'In Progress';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden animate-fade-in" style={{ background: 'var(--gradient-bg)' }}>
      {/* Liquid Glass Background Splash */}
      <div className="absolute inset-0 liquid-glass-splash opacity-40"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-slide-up">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to={`/category/${encodeURIComponent(decodedCategoryName)}`}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-all duration-200 mb-6 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {decodedCategoryName}
          </Link>
        </div>

        {/* Story Card */}
        <Card className="bg-white border border-slate-200 rounded-3xl shadow-lg overflow-hidden animate-scale-in">
          <CardContent className="p-8">
            {/* Story Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-slate-900 mb-4 leading-tight tracking-tight">
                  {story.title}
                </h1>
                
                <div className="flex items-center gap-4 mb-4">
                  <Badge 
                    className={cn(
                      "px-3 py-1 text-sm font-medium rounded-full border-0 backdrop-blur-md pointer-events-none",
                      getStatusColor(story.status)
                    )}
                  >
                    {getStatusLabel(story.status)}
                  </Badge>
                  
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">{story.date}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Author */}
            {story.author && (
              <div className="mb-6">
                <span className="text-sm text-slate-600">
                  <strong>Author:</strong> {story.author}
                </span>
              </div>
            )}

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Story Details</h2>
              <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed">
                <div dangerouslySetInnerHTML={{ 
                  __html: detailedStoryContent[story.id]?.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') || story.description 
                }} />
              </div>
            </div>

            {/* Tags */}
            {story.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {story.tags.map((tag, index) => (
                    <Badge 
                      key={index}
                      className="px-3 py-1 text-sm font-medium rounded-full bg-blue-50/70 text-blue-800 border border-blue-100/50 backdrop-blur-sm"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-6 border-t border-slate-200">
              <Button 
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-full transition-all duration-200"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
              
              <Button 
                variant="outline"
                className="flex items-center gap-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-2 rounded-full transition-all duration-200"
              >
                <Paperclip className="w-4 h-4" />
                Add Attachment
              </Button>
              
              <Button 
                variant="outline"
                className="flex items-center gap-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-2 rounded-full transition-all duration-200"
              >
                <Phone className="w-4 h-4" />
                Rewrite
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StoryDetail;