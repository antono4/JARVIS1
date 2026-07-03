import { Cpu, CheckCircle2, Clock, XCircle } from 'lucide-react';
import type { AIModel } from '../types';

interface ModelPanelProps {
  models: AIModel[];
}

const CAPABILITY_ICONS: Record<string, string> = {
  text: '📝',
  image: '🎨',
  audio: '🎧',
  video: '🎬',
  code: '💻',
};

export function ModelPanel({ models }: ModelPanelProps) {
  const availableCount = models.filter(m => m.status === 'available').length;
  const busyCount = models.filter(m => m.status === 'busy').length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle2 className="w-3 h-3 text-green-500" />;
      case 'busy':
        return <Clock className="w-3 h-3 text-jarvis-accent" />;
      default:
        return <XCircle className="w-3 h-3 text-red-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'busy':
        return 'Busy';
      default:
        return 'Unavailable';
    }
  };

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-jarvis-primary" />
          <h3 className="font-display text-sm uppercase tracking-wider text-gray-200">
            AI Model Pool
          </h3>
        </div>
        <span className="text-xs font-mono text-jarvis-primary">
          {availableCount} Active
        </span>
      </div>

      {/* Summary badges */}
      <div className="flex gap-3 mb-5">
        <div className="flex-1 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-center">
          <p className="text-xl font-display text-green-500">{availableCount}</p>
          <p className="text-xs text-gray-400">Available</p>
        </div>
        <div className="flex-1 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
          <p className="text-xl font-display text-amber-500">{busyCount}</p>
          <p className="text-xs text-gray-400">Busy</p>
        </div>
        <div className="flex-1 p-3 rounded-xl bg-gray-500/10 border border-gray-500/20 text-center">
          <p className="text-xl font-display text-gray-500">{models.length}</p>
          <p className="text-xs text-gray-400">Total</p>
        </div>
      </div>

      {/* Model list */}
      <div className="space-y-3">
        {models.map((model) => (
          <div
            key={model.id}
            className={`p-4 rounded-xl border transition-all duration-300 card-hover ${
              model.status === 'available'
                ? 'bg-jarvis-surface/30 border-jarvis-primary/20 hover:border-jarvis-primary/40'
                : model.status === 'busy'
                ? 'bg-amber-500/5 border-amber-500/20'
                : 'bg-red-500/5 border-red-500/20 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-xl">{CAPABILITY_ICONS[model.capability]}</span>
                <div>
                  <h4 className="text-sm font-medium text-gray-200">{model.name}</h4>
                  <p className="text-xs text-gray-500">{model.provider}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {getStatusIcon(model.status)}
                <span className={`text-xs ${
                  model.status === 'available'
                    ? 'text-green-500'
                    : model.status === 'busy'
                    ? 'text-amber-500'
                    : 'text-red-500'
                }`}>
                  {getStatusText(model.status)}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              {model.description || `Specialized in ${model.capability} processing`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
