const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_BASE_URL = 'https://api.openai.com/v1';

if (!OPENAI_API_KEY) {
  console.warn('OpenAI API key not found. Vector embeddings will not be generated.');
}

export interface EmbeddingResponse {
  embedding: number[];
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

export class EmbeddingService {
  private apiKey: string | undefined;
  private baseUrl: string;

  constructor() {
    this.apiKey = OPENAI_API_KEY;
    this.baseUrl = OPENAI_API_BASE_URL;
  }

  /**
   * Generate vector embedding for text using OpenAI's text-embedding-3-small model
   */
  async generateEmbedding(text: string): Promise<number[] | null> {
    if (!this.apiKey) {
      console.warn('OpenAI API key not available. Skipping embedding generation.');
      return null;
    }

    try {
      // Clean and truncate text if necessary (OpenAI has token limits)
      const cleanText = text.replace(/\s+/g, ' ').trim();
      const truncatedText = cleanText.length > 8000 ? cleanText.substring(0, 8000) + '...' : cleanText;

      const response = await fetch(`${this.baseUrl}/embeddings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: truncatedText,
          encoding_format: 'float',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return data.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }

  /**
   * Generate embeddings for multiple texts in batch
   */
  async generateBatchEmbeddings(texts: string[]): Promise<(number[] | null)[]> {
    if (!this.apiKey) {
      console.warn('OpenAI API key not available. Skipping embedding generation.');
      return texts.map(() => null);
    }

    // Process in smaller batches to avoid API limits
    const batchSize = 10;
    const results: (number[] | null)[] = [];

    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      const batchPromises = batch.map(text => this.generateEmbedding(text));

      try {
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
      } catch (error) {
        console.error(`Error processing batch ${i / batchSize + 1}:`, error);
        // Add nulls for failed batch
        results.push(...batch.map(() => null));
      }

      // Add small delay between batches to respect rate limits
      if (i + batchSize < texts.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  /**
   * Calculate cosine similarity between two embeddings
   */
  calculateCosineSimilarity(embedding1: number[], embedding2: number[]): number {
    if (embedding1.length !== embedding2.length) {
      throw new Error('Embeddings must have the same length');
    }

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      norm1 += embedding1[i] * embedding1[i];
      norm2 += embedding2[i] * embedding2[i];
    }

    return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  }

  /**
   * Prepare text for embedding generation by cleaning and structuring it
   */
  prepareTextForEmbedding(conversationText: string, metadata?: any): string {
    const lines = conversationText.split('\n').filter(line => line.trim());

    // Extract key information for better embedding context
    const context = [];

    if (metadata?.session_id) {
      context.push(`Session: ${metadata.session_id}`);
    }

    if (metadata?.tags && Array.isArray(metadata.tags)) {
      context.push(`Topics: ${metadata.tags.join(', ')}`);
    }

    if (metadata?.duration_seconds) {
      const minutes = Math.round(metadata.duration_seconds / 60);
      context.push(`Duration: ${minutes} minutes`);
    }

    // Combine context and conversation
    const preparedText = [
      ...context,
      '',
      'Conversation:',
      ...lines.slice(0, 50), // Limit to first 50 lines to stay within token limits
    ].join('\n');

    return preparedText;
  }
}