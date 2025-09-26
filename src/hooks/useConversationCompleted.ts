import { useState, useCallback, useEffect } from 'react';

interface ConversationCompletedState {
  showPopup: boolean;
  conversationCount: number;
}

export function useConversationCompleted() {
  const [state, setState] = useState<ConversationCompletedState>({
    showPopup: false,
    conversationCount: 0
  });

  /**
   * Trigger the popup when a conversation is completed
   */
  const triggerConversationCompleted = useCallback(() => {
    console.log('🎉 Conversation completed - showing popup!');

    setState(prev => ({
      ...prev,
      showPopup: true,
      conversationCount: prev.conversationCount + 1
    }));
  }, []);

  /**
   * Close the popup
   */
  const closePopup = useCallback(() => {
    setState(prev => ({
      ...prev,
      showPopup: false
    }));
  }, []);

  /**
   * Listen for ElevenLabs conversation completion events
   */
  useEffect(() => {
    const handleConversationEnd = (event: any) => {
      console.log('📞 ElevenLabs conversation ended:', event);
      triggerConversationCompleted();
    };

    const handleWidgetMessage = (event: MessageEvent) => {
      // Listen for ElevenLabs widget messages
      if (event.origin !== 'https://elevenlabs.io' && event.origin !== 'https://unpkg.com') return;

      if (event.data && event.data.type) {
        console.log('🎙️ ElevenLabs widget message:', event.data);

        // Handle different event types from the widget
        if (event.data.type === 'conversation_ended' ||
            event.data.type === 'call_ended' ||
            event.data.type === 'session_ended') {
          console.log('📞 Widget conversation ended via postMessage');
          triggerConversationCompleted();
        }
      }
    };

    if (typeof window !== 'undefined') {
      // Listen for ElevenLabs widget events via postMessage
      window.addEventListener('message', handleWidgetMessage);

      // Listen for ElevenLabs custom events on the window object
      window.addEventListener('elevenlabs:conversation:ended', handleConversationEnd);
      window.addEventListener('elevenlabs:call:ended', handleConversationEnd);
      window.addEventListener('elevenlabs:session:completed', handleConversationEnd);

      // Also listen for custom events from the conversation sync
      window.addEventListener('chronicles:conversation:completed', handleConversationEnd);

      // Listen for the widget element directly if available
      const checkForWidget = () => {
        const widget = document.querySelector('elevenlabs-convai');
        if (widget) {
          console.log('🎙️ ElevenLabs widget found, attaching listeners');

          // Try to attach direct event listeners to the widget
          widget.addEventListener('conversationEnded', handleConversationEnd);
          widget.addEventListener('callEnded', handleConversationEnd);
          widget.addEventListener('sessionCompleted', handleConversationEnd);
        }
      };

      // Check immediately and also after DOM is loaded
      checkForWidget();
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkForWidget);
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('message', handleWidgetMessage);
        window.removeEventListener('elevenlabs:conversation:ended', handleConversationEnd);
        window.removeEventListener('elevenlabs:call:ended', handleConversationEnd);
        window.removeEventListener('elevenlabs:session:completed', handleConversationEnd);
        window.removeEventListener('chronicles:conversation:completed', handleConversationEnd);

        const widget = document.querySelector('elevenlabs-convai');
        if (widget) {
          widget.removeEventListener('conversationEnded', handleConversationEnd);
          widget.removeEventListener('callEnded', handleConversationEnd);
          widget.removeEventListener('sessionCompleted', handleConversationEnd);
        }
      }
    };
  }, [triggerConversationCompleted]);

  return {
    showPopup: state.showPopup,
    conversationCount: state.conversationCount,
    triggerConversationCompleted,
    closePopup
  };
}