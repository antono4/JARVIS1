import { Brain, Cpu, Zap, MessageSquare, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import type { WorkflowProgress, Task } from '../types';

interface TaskWorkflowProps {
  progress: WorkflowProgress;
  tasks: Task[];
}

const STAGES = [
  { key: 'task_planning', label: 'Task Planning', icon: Brain, description: 'Analyzing request' },
  { key: 'model_selection', label: 'Model Selection', icon: Cpu, description: 'Selecting AI models' },
  { key: 'task_execution', label: 'Task Execution', icon: Zap, description: 'Running models' },
  { key: 'response_generation', label: 'Response', icon: MessageSquare, description: 'Generating output' },
];

export function TaskWorkflow({ progress, tasks }: TaskWorkflowProps) {
  const currentIndex = STAGES.findIndex(s => s.key === progress.stage);
  
  const getStageStatus = (index: number) => {
    if (index < currentIndex) return 'completed';
    if (index === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="glass-strong rounded-2xl p-6 animate-fade-in-up">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-sm uppercase tracking-wider text-gray-200 flex items-center gap-2">
          <Zap className="w-4 h-4 text-jarvis-accent" />
          JARVIS Processing Workflow
        </h3>
        <span className="text-xs font-mono text-jarvis-primary">
          {progress.progress}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-jarvis-surface rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-jarvis-primary to-jarvis-secondary transition-all duration-500 ease-out"
          style={{ width: `${progress.progress}%` }}
        />
      </div>

      {/* Stage indicators */}
      <div className="grid grid-cols-4 gap-4">
        {STAGES.map((stage, index) => {
          const status = getStageStatus(index);
          const Icon = stage.icon;
          const isCompleted = status === 'completed';
          const isActive = status === 'active';

          return (
            <div
              key={stage.key}
              className={`relative p-4 rounded-xl border transition-all duration-300 ${
                isCompleted
                  ? 'bg-jarvis-primary/10 border-jarvis-primary/40'
                  : isActive
                  ? 'bg-jarvis-secondary/10 border-jarvis-secondary/40 animate-glow-pulse'
                  : 'bg-jarvis-surface/30 border-jarvis-primary/10 opacity-50'
              }`}
            >
              {/* Connector line */}
              {index < STAGES.length - 1 && (
                <div
                  className={`absolute top-1/2 -right-4 w-4 h-0.5 ${
                    isCompleted ? 'bg-jarvis-primary' : 'bg-jarvis-primary/20'
                  }`}
                />
              )}

              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${
                    isCompleted
                      ? 'bg-jarvis-primary/20'
                      : isActive
                      ? 'bg-jarvis-secondary/20'
                      : 'bg-jarvis-surface'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-jarvis-primary" />
                  ) : isActive ? (
                    <Loader2 className="w-5 h-5 text-jarvis-secondary animate-spin" />
                  ) : (
                    <Icon className="w-5 h-5 text-gray-500" />
                  )}
                </div>

                <h4 className={`text-xs font-display uppercase tracking-wider mb-1 ${
                  isActive ? 'text-jarvis-secondary' : isCompleted ? 'text-jarvis-primary' : 'text-gray-500'
                }`}>
                  {stage.label}
                </h4>

                <p className="text-[10px] text-gray-500 font-mono">
                  {isActive ? progress.description : stage.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completed tasks */}
      {tasks.length > 0 && (
        <div className="mt-6 pt-6 border-t border-jarvis-primary/20">
          <h4 className="text-xs font-display uppercase tracking-wider text-gray-400 mb-3">
            Completed Tasks
          </h4>
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-jarvis-surface/30 border border-jarvis-primary/10"
              >
                <CheckCircle2 className="w-4 h-4 text-jarvis-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300 truncate">{task.description}</p>
                  {task.models && task.models.length > 0 && (
                    <p className="text-xs text-jarvis-primary mt-1">
                      Models: {task.models.map(m => m.name).join(', ')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
