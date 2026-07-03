import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Available AI models
const AVAILABLE_MODELS = [
  { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', capability: 'text', status: 'available' },
  { id: 'claude-3', name: 'Claude 3', provider: 'Anthropic', capability: 'text', status: 'available' },
  { id: 'stable-diffusion-xl', name: 'Stable Diffusion XL', provider: 'Stability AI', capability: 'image', status: 'available' },
  { id: 'whisper', name: 'Whisper', provider: 'OpenAI', capability: 'audio', status: 'available' },
  { id: 'dalle-3', name: 'DALL-E 3', provider: 'OpenAI', capability: 'image', status: 'busy' },
  { id: 'code-llama', name: 'Code Llama', provider: 'Meta', capability: 'code', status: 'available' },
  { id: 'speech-05', name: 'Speech-05', provider: 'OpenAI', capability: 'audio', status: 'available' },
  { id: 'sam-2', name: 'SAM 2', provider: 'Meta', capability: 'image', status: 'available' },
];

// Mock task execution
async function executeTask(task, models) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        output: `Executed ${task.type} using models: ${models.map(m => m.name).join(', ')}`,
        timestamp: Date.now(),
      });
    }, 1500);
  });
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: Date.now() });
});

app.get('/api/models', (req, res) => {
  res.json({ models: AVAILABLE_MODELS });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request: messages array required' });
    }

    const lastMessage = messages[messages.length - 1];
    const userInput = lastMessage?.content || '';

    // Simulate JARVIS workflow
    const tasks = [];

    // Task Planning
    tasks.push({
      id: `task-${Date.now()}-1`,
      type: 'planning',
      description: 'Analyzing request and creating execution plan',
      status: 'completed',
      result: 'Request analyzed successfully',
      timestamp: Date.now(),
    });

    // Model Selection based on input
    const relevantModels = AVAILABLE_MODELS.filter(m => 
      userInput.toLowerCase().includes(m.capability) || 
      m.capability === 'text'
    ).slice(0, 2);

    tasks.push({
      id: `task-${Date.now()}-2`,
      type: 'model_selection',
      description: `Selected ${relevantModels.length} AI models`,
      status: 'completed',
      models: relevantModels,
      timestamp: Date.now(),
    });

    // Task Execution
    const executionResult = await executeTask({ type: 'execution' }, relevantModels);
    tasks.push({
      id: `task-${Date.now()}-3`,
      type: 'execution',
      description: 'AI models executed successfully',
      status: 'completed',
      result: executionResult.output,
      timestamp: Date.now(),
    });

    // Generate response
    const responseContent = generateResponse(userInput);

    res.json({
      response: {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: responseContent,
        timestamp: Date.now(),
        tasks,
      },
      workflow: {
        stages: ['task_planning', 'model_selection', 'task_execution', 'response_generation'],
        completed: true,
      },
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

function generateResponse(input) {
  const lowerInput = input.toLowerCase();
  
  if (lowerInput.includes('image') || lowerInput.includes('generate') || lowerInput.includes('create')) {
    return "I've analyzed your image generation request. Connecting to Stable Diffusion XL... For optimal results, please provide: subject matter, artistic style, lighting preferences, and composition details. What specific visual elements would you like me to create?";
  }
  if (lowerInput.includes('code') || lowerInput.includes('program') || lowerInput.includes('script')) {
    return "Initiating code generation sequence with Code Llama... I'll produce clean, well-documented code based on your requirements. Please specify: programming language, core functionality, any dependencies or constraints, and performance requirements.";
  }
  if (lowerInput.includes('analyze') || lowerInput.includes('analysis')) {
    return "Deploying analysis protocols through GPT-4 orchestration... I'm connecting specialized models for comprehensive data processing. Please provide the dataset or describe the analysis parameters you'd like me to examine.";
  }
  if (lowerInput.includes('audio') || lowerInput.includes('speech') || lowerInput.includes('transcribe')) {
    return "Routing audio processing through Whisper neural networks... For transcription: please provide the audio file. For synthesis: specify voice characteristics, tone, and content requirements.";
  }
  
  return "Processing your request through my neural architecture... I'm coordinating multiple AI models to provide the best possible response. Could you add more specific details about your intended outcome?";
}

app.listen(PORT, () => {
  console.log(`🤖 JARVIS API Server running on port ${PORT}`);
  console.log(`📡 Endpoints:`);
  console.log(`   GET  /api/health - Health check`);
  console.log(`   GET  /api/models - List available AI models`);
  console.log(`   POST /api/chat - Send message to JARVIS`);
});
