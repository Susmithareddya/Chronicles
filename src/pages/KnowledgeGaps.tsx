import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TriangleAlert, Calendar, Phone, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const KnowledgeGaps = () => {
  const knowledgeGaps = [
    {
      id: 1,
      title: "Supplier negotiations in China (2018-2020)",
      category: "Supplier Relations",
      priority: "high priority",
      priorityColor: "bg-red-100/80 text-red-700",
      description: "Critical period for establishing Chinese supplier relationships, but no recorded stories about negotiation strategies or cultural considerations.",
      questions: [
        "What were the key challenges in negotiating with Chinese suppliers?",
        "How did cultural differences impact negotiation strategies?",
        "What lessons were learned about IP protection in supplier agreements?"
      ]
    },
    {
      id: 2,
      title: "Leadership succession planning insights",
      category: "Leadership Insights",
      priority: "medium priority",
      priorityColor: "bg-amber-100/80 text-amber-700",
      description: "No stories captured about developing next-generation leaders or succession planning methodologies.",
      questions: [
        "How do you identify high-potential leaders?",
        "What's your approach to preparing successors?",
        "How do you ensure knowledge transfer to new leaders?"
      ]
    },
    {
      id: 3,
      title: "Crisis communication strategies",
      category: "Crisis Management",
      priority: "high priority", 
      priorityColor: "bg-red-100/80 text-red-700",
      description: "Missing insights on internal and external communication during major operational disruptions and market downturns.",
      questions: [
        "What communication frameworks worked best during crises?",
        "How did you manage stakeholder expectations during uncertainty?",
        "What role did transparency play in crisis communications?"
      ]
    },
    {
      id: 4,
      title: "Product innovation methodology",
      category: "Innovation Process",
      priority: "medium priority",
      priorityColor: "bg-amber-100/80 text-amber-700",
      description: "Lack of documented processes for idea validation, market testing, and innovation pipeline management.",
      questions: [
        "How do you validate new product concepts?",
        "What's your approach to managing innovation risks?",
        "How do you balance innovation with operational stability?"
      ]
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--gradient-bg)' }}>
      {/* Liquid Glass Background Splash */}
      <div className="absolute inset-0 liquid-glass-splash opacity-40"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-amber-50/30">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-all duration-200 mb-6 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-amber-100/80 backdrop-blur-sm">
              <TriangleAlert className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
                Knowledge Gaps Identified
              </h1>
              <Badge className="bg-amber-100/80 text-amber-700 px-3 py-1 text-sm font-medium rounded-full border-0 backdrop-blur-md mt-2">
                {knowledgeGaps.length} gaps found
              </Badge>
            </div>
          </div>
          
          <p className="text-lg text-slate-600 font-light leading-relaxed max-w-3xl">
            We've identified areas where critical knowledge may be missing or incomplete. These gaps represent opportunities to capture valuable insights from Christopher's experience.
          </p>
        </div>

        {/* Knowledge Gaps Grid */}
        <div className="space-y-6">
          {knowledgeGaps.map((gap) => (
            <Card 
              key={gap.id}
              className="bg-white backdrop-blur-xl border border-white/20 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 glass-card"
            >
              <CardContent className="p-8">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className="bg-slate-100/80 text-slate-700 px-3 py-1 text-sm font-medium rounded-full border-0 backdrop-blur-md">
                        {gap.category}
                      </Badge>
                      <Badge className={cn("px-3 py-1 text-sm font-medium rounded-full border-0 backdrop-blur-md", gap.priorityColor)}>
                        {gap.priority}
                      </Badge>
                    </div>
                    <h3 className="text-2xl font-semibold text-slate-900 mb-3 leading-tight">
                      {gap.title}
                    </h3>
                  </div>
                  <Button className="bg-white/80 hover:bg-white/90 text-slate-700 border border-white/20 backdrop-blur-sm rounded-full px-6 py-2 h-auto font-medium transition-all duration-200 hover:shadow-md">
                    <Phone className="w-4 h-4 mr-2" />
                    Add story
                  </Button>
                </div>

                {/* Description */}
                <p className="text-slate-700 text-base leading-relaxed mb-6">
                  {gap.description}
                </p>

                {/* Suggested Questions */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-blue-600">
                    <HelpCircle className="w-5 h-5" />
                    <span className="font-medium text-sm">Suggested Questions:</span>
                  </div>
                  <ul className="space-y-2 ml-7">
                    {gap.questions.map((question, index) => (
                      <li key={index} className="text-slate-600 text-sm leading-relaxed">
                        • {question}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State Actions */}
        <div className="mt-12 text-center">
          <div className="space-y-4">
            <p className="text-slate-600 text-lg">
              Ready to capture this knowledge?
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 h-auto font-medium rounded-full hover:scale-105 transition-transform border-none">
                <Calendar className="w-5 h-5 mr-3" />
                Schedule Knowledge Session
              </Button>
              <Button className="glass-card text-slate-700 px-8 py-4 h-auto font-medium rounded-full hover:scale-105 transition-transform bg-white/80 hover:bg-white/90">
                <TriangleAlert className="w-5 h-5 mr-3" />
                Report New Gap
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeGaps;