import { useContent } from '@/contexts/ContentContext';
import { generateText } from '@rork-ai/toolkit-sdk';
import { useMutation } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

export function usePersonalization() {
  const { userPreferences, updatePreferences } = useContent();
  const [personalizedTopics, setPersonalizedTopics] = useState<string[]>([]);

  useEffect(() => {
    if (userPreferences.topicsOfInterest.length > 0) {
      setPersonalizedTopics(userPreferences.topicsOfInterest);
    }
  }, [userPreferences]);

  const generatePersonalizedTopicsMutation = useMutation({
    mutationFn: async (userInput: string) => {
      const prompt = `Based on this user's spiritual interest: "${userInput}", suggest 3-5 relevant Christian topics or themes they might be interested in. Topics should be specific spiritual concepts like "peace", "anxiety", "strength", "relationships", "guidance", "faith", "forgiveness", "gratitude", etc. Return only the topics as a comma-separated list, nothing else.`;
      
      const response = await generateText({ messages: [{ role: 'user', content: prompt }] });
      const topics = response.split(',').map(t => t.trim().toLowerCase()).filter(t => t.length > 0);
      
      await updatePreferences({ topicsOfInterest: [...new Set([...userPreferences.topicsOfInterest, ...topics])] });
      setPersonalizedTopics(topics);
      
      return topics;
    },
  });

  const analyzeContentInteractionMutation = useMutation({
    mutationFn: async (params: { type: 'devotional' | 'prayer' | 'study' | 'therapy'; content: string }) => {
      const { type, content } = params;
      const prompt = `Analyze this Christian ${type} content and extract 1-2 key spiritual themes or topics (like "peace", "strength", "faith", etc.): "${content}". Return only the topics as a comma-separated list, nothing else.`;
      
      const response = await generateText({ messages: [{ role: 'user', content: prompt }] });
      const topics = response.split(',').map(t => t.trim().toLowerCase()).filter(t => t.length > 0);
      
      await updatePreferences({ topicsOfInterest: [...new Set([...userPreferences.topicsOfInterest, ...topics])] });
      
      return topics;
    },
  });

  return {
    personalizedTopics,
    generatePersonalizedTopics: generatePersonalizedTopicsMutation.mutate,
    analyzeContentInteraction: analyzeContentInteractionMutation.mutate,
    isGenerating: generatePersonalizedTopicsMutation.isPending || analyzeContentInteractionMutation.isPending,
  };
}
