import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export interface Story {
  id: string;
  title: string;
  description: string;
  status: 'complete' | 'progress' | 'incomplete';
  date: string;
  tags: string[];
  author?: string;
}

interface StoryCardProps {
  story: Story;
  categoryName: string;
  onClick?: () => void;
}

export const StoryCard = ({ story, categoryName, onClick }: StoryCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/category/${encodeURIComponent(categoryName)}/story/${story.id}`);
    }
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
        return 'Complete';
      case 'progress':
        return 'In Progress';
      case 'incomplete':
        return 'In Progress';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card 
      className="story-card cursor-pointer transition-all duration-200 hover:shadow-md border border-slate-200 hover:border-slate-300"
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-slate-800 text-sm mb-1 font-sf-pro truncate">
              {story.title}
            </h4>
            <p className="text-slate-600 text-xs leading-relaxed font-sf-pro line-clamp-2">
              {story.description}
            </p>
          </div>
          <Badge 
            className={cn(
              "ml-3 text-xs px-2 py-1 rounded-full border font-sf-pro font-medium flex-shrink-0 pointer-events-none",
              getStatusColor(story.status)
            )}
          >
            {getStatusLabel(story.status)}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-500">
            <Calendar className="w-3 h-3" />
            <span className="text-xs font-sf-pro">{story.date}</span>
          </div>
          
          {story.author && (
            <div className="flex items-center gap-1 text-slate-500">
              <FileText className="w-3 h-3" />
              <span className="text-xs font-sf-pro">{story.author}</span>
            </div>
          )}
        </div>

        {story.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {story.tags.slice(0, 3).map((tag, index) => (
              <Badge 
                key={index}
                className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-md border-none font-sf-pro font-normal"
              >
                {tag}
              </Badge>
            ))}
            {story.tags.length > 3 && (
              <Badge className="bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded-md border-none font-sf-pro font-normal">
                +{story.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};