import type { TileSuggestion } from '../components/ConversationTilePopup';
import type { Story } from '../components/StoryCard';

export interface ConversationData {
  id: string;
  text: string;
  metadata?: {
    agent_id?: string;
    session_id?: string;
    tags?: string[];
  };
  timestamp: string;
}

export interface AnalysisResult {
  suggestions: TileSuggestion[];
  confidence: number;
  processingTime: number;
}

export class ConversationAnalysisService {
  private knowledgeCategories = [
    "Onboarding Essentials",
    "Project Histories",
    "Crisis Management",
    "Strategic Partnerships",
    "Strategy Lessons",
    "Innovation & Technology"
  ];

  private categoryKeywords = {
    "Project Histories": [
      "launch", "project", "initiative", "rollout", "implementation", "development",
      "milestone", "deliverable", "timeline", "budget", "resource", "roadmap",
      "feature", "product", "release", "deployment", "sprint", "iteration"
    ],
    "Crisis Management": [
      "crisis", "emergency", "urgent", "critical", "risk", "threat", "incident",
      "downtime", "outage", "failure", "problem", "issue", "escalation",
      "damage control", "recovery", "contingency", "backup", "mitigation"
    ],
    "Strategic Partnerships": [
      "partnership", "alliance", "collaboration", "vendor", "supplier", "client",
      "stakeholder", "negotiation", "contract", "agreement", "deal", "relationship",
      "integration", "joint venture", "acquisition", "merger", "outsourcing"
    ],
    "Strategy Lessons": [
      "strategy", "market", "competition", "analysis", "positioning", "growth",
      "opportunity", "trend", "forecast", "planning", "vision", "goal",
      "objective", "KPI", "metrics", "performance", "optimization", "pivot"
    ],
    "Innovation & Technology": [
      "technology", "innovation", "R&D", "research", "development", "automation",
      "AI", "machine learning", "digital", "transformation", "upgrade", "modernization",
      "tool", "platform", "system", "architecture", "infrastructure", "cloud"
    ],
    "Onboarding Essentials": [
      "onboarding", "training", "process", "workflow", "procedure", "guideline",
      "documentation", "knowledge", "team", "role", "responsibility", "introduction",
      "orientation", "culture", "values", "standard", "best practice", "framework"
    ]
  };

  private priorityKeywords = {
    high: ["critical", "urgent", "immediate", "emergency", "priority", "important", "key", "essential"],
    medium: ["should", "recommended", "suggested", "consider", "review", "evaluate"],
    low: ["minor", "optional", "later", "future", "nice to have", "when time permits"]
  };

  /**
   * Analyze a conversation and generate tile suggestions
   */
  async analyzeConversation(conversation: ConversationData): Promise<AnalysisResult> {
    const startTime = Date.now();

    try {
      const suggestions = await this.generateSuggestions(conversation);
      const processingTime = Date.now() - startTime;

      return {
        suggestions,
        confidence: suggestions.length > 0 ? Math.max(...suggestions.map(s => s.confidence)) : 0,
        processingTime
      };
    } catch (error) {
      console.error('Conversation analysis failed:', error);
      return {
        suggestions: [],
        confidence: 0,
        processingTime: Date.now() - startTime
      };
    }
  }

  /**
   * Generate tile suggestions based on conversation content
   */
  private async generateSuggestions(conversation: ConversationData): Promise<TileSuggestion[]> {
    const suggestions: TileSuggestion[] = [];
    const text = conversation.text.toLowerCase();

    // Analyze for each category
    for (const category of this.knowledgeCategories) {
      const categoryScore = this.calculateCategoryRelevance(text, category);

      if (categoryScore > 0.1) { // Lower threshold for suggestion
        const suggestion = await this.createTileSuggestion(conversation, category, categoryScore);
        if (suggestion) {
          suggestions.push(suggestion);
        }
      }
    }

    // Sort by confidence and return top suggestions
    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3); // Limit to top 3 suggestions
  }

  /**
   * Calculate how relevant a conversation is to a specific category
   */
  private calculateCategoryRelevance(text: string, category: string): number {
    const keywords = this.categoryKeywords[category as keyof typeof this.categoryKeywords] || [];
    let matches = 0;
    let totalWeight = 0;

    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const keywordMatches = (text.match(regex) || []).length;

      if (keywordMatches > 0) {
        matches++;
        totalWeight += keywordMatches;
      }
    }

    // Calculate relevance score (0-1) - more permissive scoring
    const keywordScore = matches / keywords.length;
    const weightScore = totalWeight / 50; // Lower denominator for higher scores
    const relevanceScore = Math.min(keywordScore + weightScore, 1);

    console.log(`📊 Category "${category}" score: ${relevanceScore.toFixed(2)} (${matches}/${keywords.length} keywords, weight: ${totalWeight})`);

    return relevanceScore;
  }

  /**
   * Create a tile suggestion for a specific category
   */
  private async createTileSuggestion(
    conversation: ConversationData,
    category: string,
    relevanceScore: number
  ): Promise<TileSuggestion | null> {
    const text = conversation.text;

    // Extract key insights using simple pattern matching
    const keyInsights = this.extractKeyInsights(text, category);
    if (keyInsights.length === 0) return null;

    // Extract action items
    const actionItems = this.extractActionItems(text);

    // Extract stakeholders
    const stakeholders = this.extractStakeholders(text);

    // Determine priority
    const priority = this.determinePriority(text);

    // Generate title and description
    const title = this.generateTitle(keyInsights[0], category);
    const description = this.generateDescription(keyInsights, category);

    const confidence = Math.round(relevanceScore * 100);

    return {
      id: `suggestion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      category,
      description,
      relevantData: {
        keyInsights: keyInsights.slice(0, 5),
        actionItems: actionItems.slice(0, 3),
        stakeholders: stakeholders.slice(0, 5),
        priority
      },
      confidence,
      source: `ElevenLabs Conversation ${conversation.id.slice(0, 8)}`
    };
  }

  /**
   * Extract key insights from conversation text
   */
  private extractKeyInsights(text: string, category: string): string[] {
    const insights: string[] = [];

    // Simple pattern matching for insights
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const keywords = this.categoryKeywords[category as keyof typeof this.categoryKeywords] || [];

    for (const sentence of sentences) {
      const hasKeyword = keywords.some(keyword =>
        sentence.toLowerCase().includes(keyword.toLowerCase())
      );

      if (hasKeyword && sentence.trim().length > 30) {
        insights.push(sentence.trim());
      }
    }

    return insights.slice(0, 5);
  }

  /**
   * Extract action items from conversation
   */
  private extractActionItems(text: string): string[] {
    const actionPatterns = [
      /(?:need to|should|must|have to|going to|will|plan to|decide to)\s+([^.!?]*)/gi,
      /(?:action item|todo|task|follow up):\s*([^.!?]*)/gi,
      /(?:next steps?|action plan):\s*([^.!?]*)/gi
    ];

    const actionItems: string[] = [];

    for (const pattern of actionPatterns) {
      const matches = text.match(pattern);
      if (matches) {
        actionItems.push(...matches.map(match => match.trim()).slice(0, 2));
      }
    }

    return [...new Set(actionItems)].slice(0, 3);
  }

  /**
   * Extract stakeholder mentions
   */
  private extractStakeholders(text: string): string[] {
    const stakeholderPatterns = [
      /(?:team|department|group|committee|board)s?\s+([A-Z][a-z]+)/g,
      /(?:manager|director|lead|head|VP|CEO|CTO|CFO)\s+([A-Z][a-z]+)/g,
      /([A-Z][a-z]+\s+[A-Z][a-z]+)(?:\s+from|\s+in|\s+at)/g
    ];

    const stakeholders: string[] = [];

    for (const pattern of stakeholderPatterns) {
      const matches = text.match(pattern);
      if (matches) {
        stakeholders.push(...matches.slice(0, 2));
      }
    }

    return [...new Set(stakeholders)].slice(0, 5);
  }

  /**
   * Determine priority based on conversation content
   */
  private determinePriority(text: string): 'high' | 'medium' | 'low' {
    const lowerText = text.toLowerCase();

    const highCount = this.priorityKeywords.high.filter(keyword =>
      lowerText.includes(keyword)
    ).length;

    const mediumCount = this.priorityKeywords.medium.filter(keyword =>
      lowerText.includes(keyword)
    ).length;

    const lowCount = this.priorityKeywords.low.filter(keyword =>
      lowerText.includes(keyword)
    ).length;

    if (highCount >= 2) return 'high';
    if (mediumCount >= 2 || highCount >= 1) return 'medium';
    return 'low';
  }

  /**
   * Generate a title for the tile
   */
  private generateTitle(primaryInsight: string, category: string): string {
    const categoryTitles = {
      "Project Histories": ["Implementation Guide", "Project Insights", "Development Chronicles", "Launch Story"],
      "Crisis Management": ["Crisis Response", "Risk Management", "Emergency Protocol", "Recovery Strategy"],
      "Strategic Partnerships": ["Partnership Strategy", "Collaboration Framework", "Stakeholder Alignment", "Alliance Management"],
      "Strategy Lessons": ["Strategic Insights", "Market Analysis", "Growth Strategy", "Competitive Intelligence"],
      "Innovation & Technology": ["Tech Innovation", "Digital Transformation", "Technology Adoption", "Innovation Framework"],
      "Onboarding Essentials": ["Process Documentation", "Team Guidelines", "Workflow Standards", "Best Practices"]
    };

    const titles = categoryTitles[category as keyof typeof categoryTitles] || ["Knowledge Insight"];
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];

    return `${randomTitle} Update`;
  }

  /**
   * Generate a description for the tile
   */
  private generateDescription(insights: string[], category: string): string {
    const baseDescriptions = {
      "Project Histories": "Key learnings and insights from recent project developments and implementation strategies.",
      "Crisis Management": "Critical response strategies and lessons learned from handling challenging situations.",
      "Strategic Partnerships": "Important updates on partnership developments and stakeholder relationship management.",
      "Strategy Lessons": "Strategic insights and market intelligence gathered from recent analysis and planning sessions.",
      "Innovation & Technology": "Latest technological developments and innovation strategies discussed in recent conversations.",
      "Onboarding Essentials": "Updated processes and guidelines based on recent team discussions and workflow improvements."
    };

    return baseDescriptions[category as keyof typeof baseDescriptions] ||
           "Important knowledge and insights captured from recent conversations.";
  }

  /**
   * Convert conversation suggestion to Story format
   */
  convertSuggestionToStory(suggestion: TileSuggestion): Story {
    return {
      id: suggestion.id,
      title: suggestion.title,
      description: suggestion.description,
      status: 'progress' as const,
      date: new Date().toISOString().split('T')[0],
      tags: [
        'ai-generated',
        'conversation-insights',
        suggestion.relevantData.priority,
        ...suggestion.category.toLowerCase().split(' ')
      ],
      author: "AI Assistant"
    };
  }
}