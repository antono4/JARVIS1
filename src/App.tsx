import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Cpu, Zap, Brain, ChevronDown } from 'lucide-react';
import type { Message, Task, WorkflowProgress } from './types';
import { TaskWorkflow } from './components/TaskWorkflow';
import { ModelPanel } from './components/ModelPanel';

const AVAILABLE_MODELS = [
  { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', capability: 'text', status: 'available' as const },
  { id: 'claude-3', name: 'Claude 3', provider: 'Anthropic', capability: 'text', status: 'available' as const },
  { id: 'stable-diffusion', name: 'Stable Diffusion XL', provider: 'Stability AI', capability: 'image', status: 'available' as const },
  { id: 'whisper', name: 'Whisper', provider: 'OpenAI', capability: 'audio', status: 'available' as const },
  { id: 'dalle-3', name: 'DALL-E 3', provider: 'OpenAI', capability: 'image', status: 'busy' as const },
  { id: 'code-llama', name: 'Code Llama', provider: 'Meta', capability: 'code', status: 'available' as const },
];

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello, I am JARVIS. I am an AI system designed to connect various AI models to help you accomplish complex tasks. How may I assist you today?',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentWorkflow, setCurrentWorkflow] = useState<WorkflowProgress | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processUserMessage = async (userInput: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userInput,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    // Simulate JARVIS processing workflow
    const tasks: Task[] = [];

    // Stage 1: Task Planning
    setCurrentWorkflow({ stage: 'task_planning', progress: 0, description: 'Analyzing your request...' });
    await simulateProgress(100);
    
    const planningTask: Task = {
      id: Date.now().toString(),
      type: 'planning',
      description: `Analyzed request: "${userInput}" - Breaking down into subtasks`,
      status: 'completed',
      result: 'Task decomposed into 3 subtasks',
      timestamp: Date.now(),
    };
    tasks.push(planningTask);
    setCompletedTasks(prev => [...prev, planningTask]);

    // Stage 2: Model Selection
    setCurrentWorkflow({ stage: 'model_selection', progress: 33, description: 'Selecting optimal AI models...' });
    await simulateProgress(100);

    const relevantModels = AVAILABLE_MODELS.filter(m => 
      userInput.toLowerCase().includes(m.capability) || m.capability === 'text'
    ).slice(0, 2);

    const selectionTask: Task = {
      id: (Date.now() + 1).toString(),
      type: 'model_selection',
      description: `Selected ${relevantModels.length} models for task execution`,
      status: 'completed',
      models: relevantModels,
      timestamp: Date.now(),
    };
    tasks.push(selectionTask);
    setCompletedTasks(prev => [...prev, selectionTask]);

    // Stage 3: Task Execution
    setCurrentWorkflow({ stage: 'task_execution', progress: 66, description: 'Executing tasks with selected models...' });
    await simulateProgress(100);

    const executionTask: Task = {
      id: (Date.now() + 2).toString(),
      type: 'execution',
      description: 'Invoking AI models and processing results',
      status: 'completed',
      result: 'All models executed successfully',
      timestamp: Date.now(),
    };
    tasks.push(executionTask);
    setCompletedTasks(prev => [...prev, executionTask]);

    // Stage 4: Response Generation
    setCurrentWorkflow({ stage: 'response_generation', progress: 90, description: 'Generating response...' });
    await simulateProgress(100);

    const responseContent = generateJARVISResponse(userInput);
    
    const responseTask: Task = {
      id: (Date.now() + 3).toString(),
      type: 'response',
      description: 'Response generated successfully',
      status: 'completed',
      result: responseContent,
      timestamp: Date.now(),
    };
    tasks.push(responseTask);

    setCurrentWorkflow({ stage: 'response_generation', progress: 100, description: 'Complete!' });
    
    setTimeout(() => {
      setCurrentWorkflow(null);
      setCompletedTasks([]);
    }, 1000);

    const assistantMessage: Message = {
      id: (Date.now() + 4).toString(),
      role: 'assistant',
      content: responseContent,
      timestamp: Date.now(),
      tasks,
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsProcessing(false);
  };

  const simulateProgress = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const generateJARVISResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('image') || lowerInput.includes('generate') || lowerInput.includes('create')) {
      return "I understand you want to generate an image. I'm connecting to Stable Diffusion XL through HuggingFace. For the best results, please describe the visual elements you'd like: subject, style, lighting, composition, and any specific details.";
    }
    if (lowerInput.includes('code') || lowerInput.includes('program') || lowerInput.includes('script')) {
      return "I'll help you with code generation. Connecting to Code Llama for optimal code synthesis. Please specify: the programming language, the specific functionality you need, any constraints or requirements, and any reference implementations if available.";
    }
    if (lowerInput.includes('audio') || lowerInput.includes('speech') || lowerInput.includes('transcribe')) {
      return "For audio processing, I'm routing your request to Whisper for transcription or OpenAI's TTS models. Please provide the audio file or describe the speech synthesis requirements you'd like.";
    }
    if (lowerInput.includes('analyze') || lowerInput.includes('research')) {
      return "I'm initiating a comprehensive analysis workflow. GPT-4 will orchestrate the process, with specialized models handling specific aspects. Please provide more details about the subject matter you'd like analyzed.";
    }
    
    return "I'm processing your request through my neural network. Based on my analysis, I'll coordinate the appropriate AI models to assist you. Could you provide more specific details about what you'd like to accomplish?";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      processUserMessage(input.trim());
    }
  };

  return (
    <div className="min-h-screen bg-jarvis-dark grid-bg relative overflow-hidden">
      {/* Ambient glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-jarvis-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-jarvis-secondary/5 rounded-full blur-3xl" />
      
      {/* Scan line effect */}
      <div className="fixed inset-0 scan-lines pointer-events-none z-50" />

      {/* Header */}
      <header className="relative z-40 glass border-b border-jarvis-primary/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-jarvis-primary/20 to-jarvis-secondary/20 flex items-center justify-center glow-primary">
                  <Sparkles className="w-6 h-6 text-jarvis-primary" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-jarvis-primary glow-text tracking-wider">
                  JARVIS
                </h1>
                <p className="text-xs text-gray-400 font-mono uppercase tracking-widest">
                  AI Agent System
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
                <Brain className="w-4 h-4 text-jarvis-primary" />
                <span>LLM Controller Active</span>
              </div>
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
                <Cpu className="w-4 h-4 text-jarvis-secondary" />
                <span>{AVAILABLE_MODELS.filter(m => m.status === 'available').length} Models Ready</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-30 max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Workflow visualization */}
            {currentWorkflow && (
              <TaskWorkflow progress={currentWorkflow} tasks={completedTasks} />
            )}

            {/* Chat messages */}
            <div className="glass-strong rounded-2xl p-6 min-h-[500px] flex flex-col">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-jarvis-primary/20">
                <Zap className="w-5 h-5 text-jarvis-accent" />
                <h2 className="font-display text-lg uppercase tracking-wider text-gray-200">
                  Neural Interface
                </h2>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 mb-6 max-h-[400px]">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'flex-row-reverse' : ''
                    } animate-fade-in-up`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-jarvis-accent/20 to-jarvis-accent/10 border border-jarvis-accent/30'
                          : 'bg-gradient-to-br from-jarvis-primary/20 to-jarvis-secondary/20 border border-jarvis-primary/30'
                      }`}
                    >
                      {message.role === 'user' ? (
                        <User className="w-5 h-5 text-jarvis-accent" />
                      ) : (
                        <Bot className="w-5 h-5 text-jarvis-primary" />
                      )}
                    </div>

                    <div
                      className={`flex-1 max-w-[85%] ${
                        message.role === 'user' ? 'text-right' : ''
                      }`}
                    >
                      <div
                        className={`inline-block px-5 py-3 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-gradient-to-r from-jarvis-accent/20 to-jarvis-accent/10 border border-jarvis-accent/30'
                            : 'bg-jarvis-surface/50 border border-jarvis-primary/20'
                        }`}
                      >
                        <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 font-mono">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}

                {isProcessing && (
                  <div className="flex gap-3 animate-fade-in-up">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-jarvis-primary/20 to-jarvis-secondary/20 border border-jarvis-primary/30 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-jarvis-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-jarvis-surface/50 border border-jarvis-primary/20">
                        <Loader2 className="w-4 h-4 text-jarvis-primary animate-spin" />
                        <span className="text-gray-400 text-sm">Processing...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input form */}
              <form onSubmit={handleSubmit} className="relative">
                <div className="relative flex items-center gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter your request..."
                    disabled={isProcessing}
                    className="input-jarvis pr-12 rounded-xl"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isProcessing}
                    className="absolute right-2 p-2 rounded-lg bg-gradient-to-r from-jarvis-primary/20 to-jarvis-secondary/20 border border-jarvis-primary/30 text-jarvis-primary hover:from-jarvis-primary/30 hover:to-jarvis-secondary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Model Panel */}
            <ModelPanel models={AVAILABLE_MODELS} />

            {/* Quick actions */}
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-jarvis-accent" />
                <h3 className="font-display text-sm uppercase tracking-wider text-gray-200">
                  Quick Actions
                </h3>
              </div>
              <div className="space-y-2">
                {[
                  { icon: '🎨', label: 'Generate Image', prompt: 'Generate a futuristic cityscape with flying vehicles' },
                  { icon: '💻', label: 'Write Code', prompt: 'Write a Python function to sort a list' },
                  { icon: '🔍', label: 'Analyze Data', prompt: 'Analyze the trends in artificial intelligence research' },
                ].map((action, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(action.prompt)}
                    disabled={isProcessing}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-jarvis-surface/30 border border-jarvis-primary/10 hover:border-jarvis-primary/30 hover:bg-jarvis-surface/50 transition-all text-left group"
                  >
                    <span className="text-xl">{action.icon}</span>
                    <span className="text-sm text-gray-300 group-hover:text-jarvis-primary transition-colors">
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* System Status */}
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-green-500" />
                <h3 className="font-display text-sm uppercase tracking-wider text-gray-200">
                  System Status
                </h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'LLM Controller', status: 'Active', color: 'text-green-500' },
                  { label: 'HuggingFace Connection', status: 'Connected', color: 'text-green-500' },
                  { label: 'Model Pool', status: '6 Models', color: 'text-jarvis-primary' },
                  { label: 'Response Time', status: '~2.3s', color: 'text-jarvis-accent' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-jarvis-primary/10 last:border-0">
                    <span className="text-sm text-gray-400">{item.label}</span>
                    <span className={`text-sm font-mono ${item.color}`}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-30 border-t border-jarvis-primary/10 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-xs text-gray-500 font-mono">
          <span>J.A.R.V.I.S. v1.0 — Microsoft Research</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            All systems operational
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
