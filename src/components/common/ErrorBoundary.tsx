import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home, Download } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary capturó un error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  private handleExportEmergencyBackup = () => {
    try {
      const backup: Record<string, unknown> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('misemaforo') || key.startsWith('semaforo'))) {
          try {
            backup[key] = JSON.parse(localStorage.getItem(key) || 'null');
          } catch {
            backup[key] = localStorage.getItem(key);
          }
        }
      }
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `misemaforo_respaldo_emergencia_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('No se pudo generar la copia automática: ' + (e as Error).message);
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900 text-slate-100">
          <div className="max-w-lg w-full p-6 sm:p-8 rounded-3xl bg-slate-800/90 border border-slate-700/80 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-heading font-black text-white">
                Tus datos están a salvo 🛡️
              </h1>
              <p className="text-sm text-slate-300">
                Ocurrió un error inesperado al renderizar este módulo, pero tu información académica
                está intacta en tu dispositivo.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={this.handleReset}
                className="px-4 py-2.5 rounded-xl font-heading font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center gap-2 transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reintentar</span>
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="px-4 py-2.5 rounded-xl font-heading font-bold text-xs bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center gap-2 transition"
              >
                <Home className="w-4 h-4" />
                <span>Ir al Inicio</span>
              </button>
              <button
                type="button"
                onClick={this.handleExportEmergencyBackup}
                className="px-4 py-2.5 rounded-xl font-heading font-bold text-xs bg-blue-600/30 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 flex items-center justify-center gap-2 transition"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Copia</span>
              </button>
            </div>

            {this.state.error && (
              <details className="text-left bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-2.5xs text-slate-400 font-mono">
                <summary className="cursor-pointer text-slate-400 hover:text-slate-300 font-bold mb-1">
                  Ver detalles técnicos del error
                </summary>
                <p className="text-rose-400 mt-2 font-semibold">{this.state.error.toString()}</p>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
