import { useState, useCallback, useEffect } from 'react';
import type { TileSuggestion } from '../components/ConversationTilePopup';
import type { ConversationData } from '../services/conversationAnalysisService';
import { storyTileService } from '../data/storiesData';

export interface ConversationTileFlowState {
  currentSuggestion: TileSuggestion | null;
  isPopupOpen: boolean;
  isProcessing: boolean;
  recentlyAdded: Array<{
    storyTitle: string;
    category: string;
    timestamp: string;
  }>;
}

export function useConversationTileFlow() {
  const [state, setState] = useState<ConversationTileFlowState>({
    currentSuggestion: null,
    isPopupOpen: false,
    isProcessing: false,
    recentlyAdded: []
  });

  /**
   * Process a completed conversation and show tile suggestion if relevant
   */
  const processConversationCompletion = useCallback(async (conversation: ConversationData) => {
    setState(prev => ({ ...prev, isProcessing: true }));

    try {
      console.log('🎯 Processing conversation completion for tile suggestion...');

      const suggestion = await storyTileService.processConversationForStory(conversation);

      if (suggestion) {
        setState(prev => ({
          ...prev,
          currentSuggestion: suggestion,
          isPopupOpen: true,
          isProcessing: false
        }));

        console.log('📋 Showing tile suggestion popup:', suggestion.title);
      } else {
        setState(prev => ({ ...prev, isProcessing: false }));
        console.log('ℹ️ No tile suggestion generated for this conversation');
      }
    } catch (error) {
      console.error('❌ Failed to process conversation completion:', error);
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  }, []);

  /**
   * Create a tile from the current suggestion
   */
  const createTile = useCallback(async (suggestion: TileSuggestion) => {
    try {
      console.log('✨ Creating tile from suggestion:', suggestion.title);

      const story = storyTileService.addStoryToCategory(suggestion);

      // Add to recently added list
      setState(prev => ({
        ...prev,
        recentlyAdded: [
          {
            storyTitle: story.title,
            category: suggestion.category,
            timestamp: new Date().toISOString()
          },
          ...prev.recentlyAdded.slice(0, 4) // Keep last 5 items
        ]
      }));

      console.log('✅ Tile created successfully:', story.title, '→', suggestion.category);

      // Show success notification (you could emit an event here if needed)
      setTimeout(() => {
        console.log(`🎉 "${story.title}" has been added to ${suggestion.category}!`);
      }, 100);

      return story;
    } catch (error) {
      console.error('❌ Failed to create tile:', error);
      throw error;
    }
  }, []);

  /**
   * Dismiss the current suggestion
   */
  const dismissSuggestion = useCallback((suggestionId: string) => {
    console.log('👎 User dismissed suggestion:', suggestionId);
    // Note: We're not adding to dismissed list since user wants to see suggestions
    // but we could add this functionality if needed later
  }, []);

  /**
   * Close the popup
   */
  const closePopup = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPopupOpen: false,
      currentSuggestion: null
    }));
  }, []);

  /**
   * Simulate a conversation completion (for testing)
   */
  const simulateConversationCompletion = useCallback(async (conversationText: string) => {
    const mockConversation: ConversationData = {
      id: `mock_${Date.now()}`,
      text: conversationText,
      timestamp: new Date().toISOString(),
      metadata: {
        agent_id: 'test_agent',
        session_id: 'test_session',
        tags: ['simulation']
      }
    };

    await processConversationCompletion(mockConversation);
  }, [processConversationCompletion]);


  /**
   * Get recent activity for display
   */
  const getRecentActivity = useCallback(() => {
    return state.recentlyAdded.slice(0, 5);
  }, [state.recentlyAdded]);

  /**
   * Clear recent activity
   */
  const clearRecentActivity = useCallback(() => {
    setState(prev => ({ ...prev, recentlyAdded: [] }));
  }, []);

  // Listen to story tile service events
  useEffect(() => {
    const handleStoryAdded = (event: any) => {
      console.log('📊 Story added event received:', event.story.title, '→', event.category);
    };

    storyTileService.addEventListener(handleStoryAdded);

    return () => {
      storyTileService.removeEventListener(handleStoryAdded);
    };
  }, []);

  return {
    state,
    processConversationCompletion,
    createTile,
    dismissSuggestion,
    closePopup,
    simulateConversationCompletion,
    getRecentActivity,
    clearRecentActivity
  };
}

// Example conversation texts for testing different categories
export const EXAMPLE_CONVERSATIONS = {
  projectHistories: `We just completed the mobile app redesign project launch initiative. The project had multiple
    milestones and deliverables including development phases, implementation roadmap, and feature rollout.
    The key challenges were integrating the new design system with legacy components during the development cycle.
    We had to coordinate with three different teams and manage dependencies carefully throughout the sprint iterations.
    The product launch resulted in a 25% improvement in user engagement. Key project lessons: always involve QA early
    in the development timeline and maintain clear communication channels between design and engineering teams during implementation.`,

  crisisManagement: `During the critical database outage emergency last week, we had to activate our crisis response plan.
    The urgent incident lasted 3 hours and was a critical failure affecting 40% of our users. Our immediate emergency actions
    included switching to backup systems, risk mitigation, communicating with customers via status page, and coordinating
    with the infrastructure team for incident recovery. The root cause was a misconfigured backup script that created this crisis.
    We've now implemented additional monitoring and created a more robust failover process for future risk management.`,

  strategicPartnerships: `The strategic partnership alliance with TechCorp is showing great collaboration results. We've successfully integrated
    their API through our vendor relationship, which has expanded our stakeholder engagement significantly. The contract negotiation process
    taught us the importance of defining clear SLAs and revenue sharing models for this supplier agreement. Our partnership management
    approach included joint venture discussions and integration planning. Next steps include expanding the alliance collaboration
    to include their European operations and exploring joint marketing opportunities with this key stakeholder relationship.`,

  strategyLessons: `Our comprehensive market analysis and competitive positioning revealed that competitors are focusing heavily on strategic growth.
    We need to accelerate our own strategy roadmap to maintain competitive advantage and market positioning. The key strategic insight is that
    customers are willing to pay premium for optimized features, but only if they provide clear performance value.
    Our market strategy should focus on practical applications that solve real user problems rather than strategy for the sake of planning.
    This competitive analysis will inform our long-term vision and strategic goals for market optimization.`,

  innovationTechnology: `The new AI machine learning technology deployment and innovation has exceeded R&D expectations. We're seeing
    30% better prediction accuracy compared to the previous system architecture. The key technology innovation was using transfer
    learning techniques and incorporating real-time data streams into our digital platform. This has opened up new possibilities for
    predictive analytics across multiple product lines through our technology infrastructure. We should consider building a dedicated ML platform
    team to scale this innovation capability and advance our digital transformation roadmap.`,

  onboardingEssentials: `Updated our team onboarding process and workflow documentation based on feedback from new team members. The main
    improvement is a structured 30-60-90 day training plan with clear process milestones and regular check-ins. We've also
    created a buddy system pairing new hires with experienced team members following our best practices framework. The workflow documentation has been
    centralized and made more accessible through our process guidelines. These onboarding changes should reduce time-to-productivity for new team
    members from 6 weeks to 4 weeks using our improved training procedures and team integration standards.`
};