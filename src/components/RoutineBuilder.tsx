import React, { useState } from 'react';
import {
  Zap,
  Plus,
  Trash2,
  Copy,
  Check,
  Cpu,
  Sparkles,
  ArrowRight,
  Shield,
  Sun,
  Lock,
} from 'lucide-react';
import { Product } from '../data/products';

interface RoutineBuilderProps {
  products: Product[];
}

interface RoutineRule {
  id: string;
  trigger: string;
  action: string;
  assistant: 'Google Home' | 'Amazon Alexa' | 'Apple HomeKit' | 'Matter Universal';
}

export const RoutineBuilder: React.FC<RoutineBuilderProps> = ({ products }) => {
  const [trigger, setTrigger] = useState<string>('Al armar el Sistema de Seguridad');
  const [selectedActions, setSelectedActions] = useState<string[]>([
    'Cerrar Cerradura Biométrica Quantum 3D',
    'Apagar Kit Iluminación Opal RGBW',
  ]);
  const [assistant, setAssistant] = useState<
    'Google Home' | 'Amazon Alexa' | 'Apple HomeKit' | 'Matter Universal'
  >('Google Home');
  const [savedRoutines, setSavedRoutines] = useState<RoutineRule[]>([
    {
    id: 'rt-1',
    trigger: 'Al armar el Sistema de Seguridad',
    action: 'Cerrar Cerradura Quantum 3D y activar radares mmWave',
    assistant: 'Google Home',
    },
  ]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const availableActionOptions = [
    'Cerrar Cerradura Biométrica Quantum 3D',
    'Activar sirena perimetral de Domo PTZ 4K',
    'Encender Iluminación Opal RGBW al 15% (Modo Nocturno)',
    'Suspender climatización por apertura de ventana',
    'Enviar notificación push cifrada AES-256',
  ];

  const addAction = (act: string) => {
    if (!selectedActions.includes(act)) {
      setSelectedActions([...selectedActions, act]);
    }
  };

  const removeAction = (act: string) => {
    setSelectedActions(selectedActions.filter((a) => a !== act));
  };

  const saveRoutine = () => {
    if (selectedActions.length === 0) return;
    const nextRule: RoutineRule = {
      id: `rt-${Date.now()}`,
      trigger,
      action: selectedActions.join(' + '),
      assistant,
    };
    setSavedRoutines((prev) => [nextRule, ...prev]);
  };

  const generateExportJson = (rule: RoutineRule) => {
    return JSON.stringify(
      {
        schemaVersion: '1.4-matter',
        routineName: `REYPLACE_${rule.assistant.replace(/\s+/g, '_')}_Rule`,
        targetAssistant: rule.assistant,
        ifTrigger: rule.trigger,
        thenExecuteActions: rule.action.split(' + '),
        securityEnclave: 'AES-256-GCM',
        timestamp: new Date().toISOString(),
      },
      null,
      2
    );
  };

  const copyJson = (rule: RoutineRule) => {
    const jsonStr = generateExportJson(rule);
    navigator.clipboard.writeText(jsonStr);
    setCopiedId(rule.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="neo-surface rounded-[32px] p-6 md:p-8 border border-slate-200/80 dark:border-slate-800/80 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-cyan-700 dark:text-[#70e9ff] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Automatización Condicional Avanzada
          </p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">
            Constructor de Rutinas «Si / Entonces»
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Encadena múltiples dispositivos inteligentes y exporta la configuración directamente a Google Home o Alexa.
          </p>
        </div>

        {/* Assistant Target Selector */}
        <div className="flex items-center gap-1 neo-inset p-1.5 rounded-2xl self-start">
          {(
            ['Google Home', 'Amazon Alexa', 'Matter Universal'] as const
          ).map((ast) => (
            <button
              key={ast}
              type="button"
              onClick={() => setAssistant(ast)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                assistant === ast
                  ? 'bg-cyan-600 dark:bg-[#70e9ff] text-white dark:text-[#070d1e]'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {ast}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Builder Form (7 cols) */}
        <div className="lg:col-span-7 neo-inset rounded-[26px] p-6 space-y-5">
          {/* Trigger Section */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-600 dark:text-[#70e9ff]" /> SI (Disparador / Evento)
            </label>
            <select
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              className="w-full neo-surface rounded-xl px-4 py-3 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-slate-200 dark:border-slate-800"
            >
              <option>Al armar el Sistema de Seguridad</option>
              <option>Al detectar presencia con radar mmWave en Sala</option>
              <option>Al desbloquear Cerradura Quantum 3D</option>
              <option>Al atardecer (Rutina Circadiana solar)</option>
              <option>Al superar temperatura de 26°C en termostato</option>
            </select>
          </div>

          {/* Actions Section */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <ArrowRight className="w-3.5 h-3.5 text-cyan-600 dark:text-[#70e9ff]" /> ENTONCES (Encadenar Dispositivos)
            </label>

            <div className="space-y-2">
              {selectedActions.map((act) => (
                <div
                  key={act}
                  className="neo-surface rounded-xl p-3 flex items-center justify-between gap-3 border border-slate-200 dark:border-slate-800 text-xs font-medium"
                >
                  <span className="text-slate-900 dark:text-white">{act}</span>
                  <button
                    type="button"
                    onClick={() => removeAction(act)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Add Action Selector */}
            <div className="pt-2">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                Añadir acción adicional al encadenamiento:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {availableActionOptions
                  .filter((a) => !selectedActions.includes(a))
                  .map((act) => (
                    <button
                      key={act}
                      type="button"
                      onClick={() => addAction(act)}
                      className="neo-surface px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-[#70e9ff] border border-slate-200 dark:border-slate-800"
                    >
                      + {act}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={saveRoutine}
            className="w-full py-3.5 px-5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 dark:bg-[#70e9ff] dark:hover:bg-[#56e2ff] text-white dark:text-[#070d1e] font-bold text-xs transition-colors shadow-lg"
          >
            Guardar y Compilar Rutina para {assistant}
          </button>
        </div>

        {/* Export & Saved Routines List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            Rutinas Compiladas & Exportación Matter
          </h4>

          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {savedRoutines.map((rule) => (
              <div
                key={rule.id}
                className="neo-inset rounded-2xl p-4 space-y-3 border border-slate-200/60 dark:border-slate-800"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-cyan-600/15 text-cyan-700 dark:text-[#70e9ff]">
                    {rule.assistant}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyJson(rule)}
                    className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-[#70e9ff] flex items-center gap-1"
                  >
                    {copiedId === rule.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" /> Copiado JSON
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Exportar Schema
                      </>
                    )}
                  </button>
                </div>

                <div className="text-xs space-y-1">
                  <p className="text-slate-500 dark:text-slate-400">
                    <strong>SI:</strong> {rule.trigger}
                  </p>
                  <p className="text-slate-800 dark:text-slate-200 font-medium">
                    <strong>ENTONCES:</strong> {rule.action}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
