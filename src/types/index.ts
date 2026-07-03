export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  capability: 'text' | 'image' | 'audio' | 'video' | 'code';
  status: 'available' | 'busy' | 'unavailable';
}

export interface Task {
  id: string;
  type: 'planning' | 'model_selection' | 'execution' | 'response';
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  models?: AIModel[];
  result?: string;
  timestamp: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  tasks?: Task[];
}

export interface ChatSession {
  id: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface AgentState {
  isProcessing: boolean;
  currentTask: Task | null;
  models: AIModel[];
  session: ChatSession | null;
}

export type WorkflowStage = 'task_planning' | 'model_selection' | 'task_execution' | 'response_generation';

export interface WorkflowProgress {
  stage: WorkflowStage;
  progress: number;
  description: string;
}
