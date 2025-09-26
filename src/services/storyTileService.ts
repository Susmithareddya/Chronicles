import type { Story } from '../components/StoryCard';
import type { TileSuggestion } from '../components/ConversationTilePopup';
import { ConversationAnalysisService, type ConversationData } from './conversationAnalysisService';

export interface StoryAddedEvent {
  story: Story;
  category: string;
  timestamp: string;
  source: string;
}

export class StoryTileService {
  private analysisService: ConversationAnalysisService;
  private dynamicStories: Map<string, Story[]> = new Map();
  private eventListeners: Array<(event: StoryAddedEvent) => void> = [];

  constructor() {
    this.analysisService = new ConversationAnalysisService();
    this.loadFromStorage();
  }

  /**
   * Process a conversation and create a tile suggestion
   */
  async processConversationForStory(conversation: ConversationData): Promise<TileSuggestion | null> {
    try {
      console.log('🔍 Analyzing conversation for story suggestion...', conversation.id);

      const analysisResult = await this.analysisService.analyzeConversation(conversation);

      if (analysisResult.suggestions.length > 0) {
        const bestSuggestion = analysisResult.suggestions[0];
        console.log('💡 Story suggestion generated:', bestSuggestion.title, `for ${bestSuggestion.category} (${bestSuggestion.confidence}% confidence)`);

        return bestSuggestion;
      }

      return null;
    } catch (error) {
      console.error('❌ Failed to process conversation for story:', error);
      return null;
    }
  }

  /**
   * Add a new story to a category tile
   */
  addStoryToCategory(suggestion: TileSuggestion, sourceConversationId?: string): Story {
    const story: Story = {
      id: suggestion.id,
      title: suggestion.title,
      description: suggestion.description,
      status: 'progress' as const,
      date: new Date().toISOString().split('T')[0],
      tags: [
        'ai-generated',
        'conversation-insights',
        suggestion.relevantData.priority,
        ...suggestion.category.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(' ').filter(Boolean)
      ],
      author: "AI Assistant"
    };

    // Add to dynamic stories for the category
    const categoryStories = this.dynamicStories.get(suggestion.category) || [];
    categoryStories.unshift(story); // Add to beginning
    this.dynamicStories.set(suggestion.category, categoryStories);

    this.saveToStorage();

    // Emit event
    this.emitEvent({
      story,
      category: suggestion.category,
      timestamp: new Date().toISOString(),
      source: sourceConversationId ? `ElevenLabs Conversation ${sourceConversationId.slice(0, 8)}` : 'Manual Input'
    });

    console.log('✅ Story added to category:', story.title, '→', suggestion.category);
    return story;
  }

  /**
   * Get all stories for a category (including dynamic ones)
   */
  getStoriesForCategory(category: string, originalStories: Story[] = []): Story[] {
    const dynamicStories = this.dynamicStories.get(category) || [];
    return [...dynamicStories, ...originalStories];
  }

  /**
   * Get all dynamic stories across categories
   */
  getAllDynamicStories(): { category: string; stories: Story[] }[] {
    return Array.from(this.dynamicStories.entries()).map(([category, stories]) => ({
      category,
      stories
    }));
  }

  /**
   * Update a story
   */
  updateStory(storyId: string, updates: Partial<Story>): boolean {
    for (const [category, stories] of this.dynamicStories.entries()) {
      const storyIndex = stories.findIndex(s => s.id === storyId);
      if (storyIndex !== -1) {
        stories[storyIndex] = { ...stories[storyIndex], ...updates };
        this.dynamicStories.set(category, stories);
        this.saveToStorage();

        console.log('📝 Story updated:', stories[storyIndex].title);
        return true;
      }
    }
    return false;
  }

  /**
   * Remove a story
   */
  removeStory(storyId: string): boolean {
    for (const [category, stories] of this.dynamicStories.entries()) {
      const initialLength = stories.length;
      const filteredStories = stories.filter(s => s.id !== storyId);

      if (filteredStories.length < initialLength) {
        this.dynamicStories.set(category, filteredStories);
        this.saveToStorage();

        console.log('🗑️ Story removed:', storyId);
        return true;
      }
    }
    return false;
  }

  /**
   * Get statistics
   */
  getStats() {
    const allStories = Array.from(this.dynamicStories.values()).flat();
    const statusCounts = {
      complete: allStories.filter(s => s.status === 'complete').length,
      progress: allStories.filter(s => s.status === 'progress').length,
      incomplete: allStories.filter(s => s.status === 'incomplete').length,
    };

    const categoryStats: Record<string, number> = {};
    for (const [category, stories] of this.dynamicStories.entries()) {
      categoryStats[category] = stories.length;
    }

    return {
      totalStories: allStories.length,
      statusCounts,
      categoryStats,
      recentStories: allStories
        .filter(story => {
          const daysSinceCreated = (Date.now() - new Date(story.date).getTime()) / (1000 * 60 * 60 * 24);
          return daysSinceCreated <= 7;
        })
        .length
    };
  }

  /**
   * Listen to story events
   */
  addEventListener(listener: (event: StoryAddedEvent) => void): void {
    this.eventListeners.push(listener);
  }

  /**
   * Remove event listener
   */
  removeEventListener(listener: (event: StoryAddedEvent) => void): void {
    const index = this.eventListeners.indexOf(listener);
    if (index > -1) {
      this.eventListeners.splice(index, 1);
    }
  }

  /**
   * Emit an event to all listeners
   */
  private emitEvent(event: StoryAddedEvent): void {
    this.eventListeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in story event listener:', error);
      }
    });
  }

  /**
   * Save data to localStorage
   */
  private saveToStorage(): void {
    try {
      const data = Array.from(this.dynamicStories.entries());
      localStorage.setItem('chronicles_dynamic_stories', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save dynamic stories to storage:', error);
    }
  }

  /**
   * Load data from localStorage
   */
  private loadFromStorage(): void {
    try {
      const saved = localStorage.getItem('chronicles_dynamic_stories');
      if (saved) {
        const data = JSON.parse(saved);
        this.dynamicStories = new Map(data);
        console.log('📂 Loaded dynamic stories from storage:', this.dynamicStories.size, 'categories');
      }
    } catch (error) {
      console.error('Failed to load dynamic stories from storage:', error);
    }
  }

  /**
   * Clear all data (useful for testing)
   */
  clearAllData(): void {
    this.dynamicStories.clear();
    this.saveToStorage();
    console.log('🧹 All dynamic story data cleared');
  }
}