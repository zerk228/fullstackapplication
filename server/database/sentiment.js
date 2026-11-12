/**
 * Minimal, offline, keyword-based sentiment analyzer.
 *
 * This intentionally avoids any external API/key so the microservice
 * can run fully offline. It scores review text by counting positive vs.
 * negative keyword hits and classifies the result as
 * "positive" | "neutral" | "negative".
 */

const POSITIVE_WORDS = [
  'great', 'good', 'excellent', 'amazing', 'awesome', 'love', 'loved',
  'friendly', 'fantastic', 'happy', 'helpful', 'wonderful', 'best',
  'satisfied', 'recommend', 'smooth', 'easy', 'professional', 'quick',
  'honest', 'pleased', 'perfect', 'nice', 'fast', 'fair',
];

const NEGATIVE_WORDS = [
  'bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'hated',
  'rude', 'disappointed', 'disappointing', 'poor', 'slow', 'scam',
  'unhappy', 'overpriced', 'pushy', 'dishonest', 'broken', 'problem',
  'issue', 'never again', 'avoid', 'waste', 'annoyed', 'frustrated',
];

function analyzeSentiment(text) {
  if (!text || typeof text !== 'string') {
    return 'neutral';
  }

  const normalized = text.toLowerCase();
  let score = 0;

  for (const word of POSITIVE_WORDS) {
    if (normalized.includes(word)) score += 1;
  }

  for (const word of NEGATIVE_WORDS) {
    if (normalized.includes(word)) score -= 1;
  }

  if (score > 0) return 'positive';
  if (score < 0) return 'negative';
  return 'neutral';
}

module.exports = { analyzeSentiment };
