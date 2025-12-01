// TODO: Integrate with a real AI service like OpenAI or Claude.
// This is a placeholder service that simulates responses from Dr. Kwuk.

const drKwukResponses = [
  "Quack! That's an interesting perspective. Have you considered...?",
  "Hmm, a classic duck dilemma. Let's paddle through this together.",
  "Quack quack! Remember, even a lone duckling is part of a flock.",
  "Feathers and fluff! It sounds like you're feeling...",
  "Let's not get our feathers in a ruffle. What's the root of the issue?",
];

export const aiService = {
  async getDrKwukResponse(message: string): Promise<string> {
    console.log('User message to Dr. Kwuk:', message);
    // Simulate a delay to mimic a real API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const randomIndex = Math.floor(Math.random() * drKwukResponses.length);
    return drKwukResponses[randomIndex];
  },
};
