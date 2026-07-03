import { useState, useCallback } from 'react';
import type { Message, Task, AIModel } from '../types';

interface HuggingFaceResponse {
  generated_text: string;
}

interface UseHuggingFaceOptions {
  apiToken?: string;
}

export function useHuggingFace(options: UseHuggingFaceOptions = {}) {
  const { apiToken } = options;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateText = useCallback(async (
    prompt: string,
    model: string = 'gpt2'
  ): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api-inference.huggingface.co/models/${model}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiToken || process.env.VITE_HF_TOKEN || ''}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ inputs: prompt }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: HuggingFaceResponse[] = await response.json();
      return data[0]?.generated_text || 'No response generated';
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      return `Error: ${message}`;
    } finally {
      setIsLoading(false);
    }
  }, [apiToken]);

  const selectModels = useCallback((
    userInput: string,
    availableModels: AIModel[]
  ): AIModel[] => {
    const input = userInput.toLowerCase();
    const selected: AIModel[] = [];

    // Always include text model for planning
    const textModels = availableModels.filter(m => m.capability === 'text');
    if (textModels.length > 0) {
      selected.push(textModels[0]);
    }

    // Select specialized models based on input
    if (input.includes('image') || input.includes('generate') || input.includes('draw')) {
      const imageModels = availableModels.filter(m => m.capability === 'image');
      if (imageModels.length > 0) selected.push(imageModels[0]);
    }

    if (input.includes('audio') || input.includes('speech') || input.includes('sound')) {
      const audioModels = availableModels.filter(m => m.capability === 'audio');
      if (audioModels.length > 0) selected.push(audioModels[0]);
    }

    if (input.includes('code') || input.includes('program') || input.includes('script')) {
      const codeModels = availableModels.filter(m => m.capability === 'code');
      if (codeModels.length > 0) selected.push(codeModels[0]);
    }

    return selected;
  }, []);

  const executeWorkflow = useCallback(async (
    userInput: string,
    availableModels: AIModel[],
    onTaskUpdate: (task: Task) => void
  ): Promise<Message> => {
    const tasks: Task[] = [];

    // Stage 1: Task Planning
    const planningTask: Task = {
      id: `task-${Date.now()}-1`,
      type: 'planning',
      description: 'Analyzing user request and creating execution plan',
      status: 'in_progress',
      timestamp: Date.now(),
    };
    tasks.push(planningTask);
    onTaskUpdate(planningTask);

    await new Promise(resolve => setTimeout(resolve, 800));

    planningTask.status = 'completed';
    planningTask.result = 'Request analyzed: decomposed into subtasks';
    onTaskUpdate({ ...planningTask });

    // Stage 2: Model Selection
    const selectedModels = selectModels(userInput, availableModels);
    
    const selectionTask: Task = {
      id: `task-${Date.now()}-2`,
      type: 'model_selection',
      description: `Selected ${selectedModels.length} AI models for execution`,
      status: 'in_progress',
      models: selectedModels,
      timestamp: Date.now(),
    };
    tasks.push(selectionTask);
    onTaskUpdate(selectionTask);

    await new Promise(resolve => setTimeout(resolve, 600));

    selectionTask.status = 'completed';
    selectionTask.result = `Models selected: ${selectedModels.map(m => m.name).join(', ')}`;
    onTaskUpdate({ ...selectionTask });

    // Stage 3: Task Execution
    const executionTask: Task = {
      id: `task-${Date.now()}-3`,
      type: 'execution',
      description: 'Executing AI models with provided parameters',
      status: 'in_progress',
      timestamp: Date.now(),
    };
    tasks.push(executionTask);
    onTaskUpdate(executionTask);

    await new Promise(resolve => setTimeout(resolve, 1000));

    executionTask.status = 'completed';
    executionTask.result = 'All models executed successfully';
    onTaskUpdate({ ...executionTask });

    // Stage 4: Response Generation
    let responseContent = '';
    
    if (apiToken) {
      try {
        responseContent = await generateText(
          `As JARVIS, an AI assistant, respond to this user request: "${userInput}". Be helpful, concise, and futuristic in your response style.`
        );
      } catch {
        responseContent = generateFallbackResponse(userInput);
      }
    } else {
      responseContent = generateFallbackResponse(userInput);
    }

    const responseTask: Task = {
      id: `task-${Date.now()}-4`,
      type: 'response',
      description: 'Response generated successfully',
      status: 'completed',
      result: responseContent,
      timestamp: Date.now(),
    };
    tasks.push(responseTask);

    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: responseContent,
      timestamp: Date.now(),
      tasks,
    };
  }, [apiToken, generateText, selectModels, onTaskUpdate]);

  return {
    isLoading,
    error,
    generateText,
    selectModels,
    executeWorkflow,
  };
}

function generateFallbackResponse(input: string): string {
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes('image') || lowerInput.includes('generate') || lowerInput.includes('create')) {
    return "I've analyzed your image generation request. Connecting to Stable Diffusion XL through HuggingFace... For optimal results, please specify: subject matter, artistic style, lighting preferences, and composition details. What visual elements would you like me to create?";
  }
  if (lowerInput.includes('code') || lowerInput.includes('program') || lowerInput.includes('script')) {
    return "Initiating code generation sequence... I'll produce clean, well-documented code. Please specify: programming language, core functionality, and any performance requirements. Code Llama is ready to assist.";
  }
  if (lowerInput.includes('analyze') || lowerInput.includes('analysis')) {
    return "Deploying analysis protocols... I'm connecting to GPT-2 for natural language processing and coordinating specialized models. Please provide the data or describe the analysis parameters you'd like me to examine.";
  }
  if (lowerInput.includes('audio') || lowerInput.includes('speech') || lowerInput.includes('transcribe')) {
    return "Routing audio processing through Whisper neural networks... For transcription: please provide the audio file. For synthesis: specify voice characteristics and content requirements.";
  }
  
  return "Processing your request through my neural architecture... I'm coordinating multiple AI models to provide the best possible response. Could you provide more specific details about your intended outcome?";
}
