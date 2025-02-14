import { useState } from 'react';
import { Sparkles, SwitchCamera } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Type definition for the component props
type AIContentGeneratorProps = {
  onContentGenerated: (content: string) => void;
  className?: string;
};

// Type for AI Service selection
type AIService = 'deepseek' | 'gemini';

const AIContentGenerator = ({ onContentGenerated, className = '' }: AIContentGeneratorProps) => {
  // State management for the component
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [aiService, setAiService] = useState<AIService>('deepseek');

  // Handler for generating content using Deepseek API
  const generateWithDeepseek = async (promptText: string) => {
    const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;
    
    if (!apiKey) {
      throw new Error('Deepseek API key is not configured');
    }

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are a professional blog post writer. Write detailed, well-structured content in markdown format."
          },
          {
            role: "user",
            content: promptText
          }
        ],
        temperature: 0.7,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error?.message || `Failed to generate content: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from Deepseek API');
    }

    return data.choices[0].message.content.trim();
  };

  // Handler for generating content using Google Gemini API
  const generateWithGemini = async (promptText: string) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('Gemini API key is not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent({
      contents: [{ 
        role: "user",
        parts: [{ 
          text: `As a professional blog writer, write a detailed blog post about: ${promptText}
                 Requirements:
                 - Use markdown format
                 - Include clear headings
                 - Add relevant details and examples
                 - Maintain professional tone
                 - Make it engaging and informative
                 - Keep it between 500-1000 words`
        }],
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });

    const response = await result.response;
    return response.text();
  };

  // Main handler for generating content
  const handleGenerateContent = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description of what you want to write about');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const content = await (aiService === 'deepseek' 
        ? generateWithDeepseek(prompt)
        : generateWithGemini(prompt));
      
      setGeneratedContent(content);
    } catch (err) {
      console.error('Content generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handler for inserting the generated content
  const handleInsertContent = () => {
    if (generatedContent) {
      onContentGenerated(generatedContent);
      setGeneratedContent(null);
      setPrompt('');
    }
  };

  // Handler for switching AI service
  const handleServiceSwitch = () => {
    setAiService(current => current === 'deepseek' ? 'gemini' : 'deepseek');
    setGeneratedContent(null);
    setError(null);
  };

  return (
    <div className={`bg-gray-50 rounded-lg p-4 space-y-4 ${className}`}>
      <div className="flex items-center justify-between text-gray-700 mb-2">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5" />
          <h3 className="font-medium">AI Content Generator</h3>
        </div>
        <button
          onClick={handleServiceSwitch}
          className="flex items-center px-3 py-1 text-sm bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
        >
          <SwitchCamera className="h-4 w-4 mr-2" />
          {aiService === 'deepseek' ? 'Switch to Gemini' : 'Switch to Deepseek'}
        </button>
      </div>

      <div className="space-y-2">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you want to write about..."
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
        />

        <div className="flex space-x-2">
          <button
            onClick={handleGenerateContent}
            disabled={isGenerating || !prompt.trim()}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isGenerating ? 'Generating...' : `Generate with ${aiService === 'deepseek' ? 'Deepseek' : 'Gemini'}`}
          </button>
        </div>

        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}

        {generatedContent && (
          <div className="mt-4 space-y-2">
            <div className="bg-white p-4 rounded-lg border max-h-60 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm">{generatedContent}</pre>
            </div>
            <button
              onClick={handleInsertContent}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Insert Content
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIContentGenerator; 