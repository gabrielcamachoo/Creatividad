/**
 * Utilidades para exportación y restauración de copias de seguridad de MiSemáforo en JSON.
 */

export interface BackupData {
  version: number;
  exportedAt: string;
  appName: string;
  data: Record<string, unknown>;
}

export function exportFullBackupJson(): void {
  try {
    const rawData: Record<string, unknown> = {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('misemaforo') || key.startsWith('semaforo'))) {
        try {
          rawData[key] = JSON.parse(localStorage.getItem(key) || 'null');
        } catch {
          rawData[key] = localStorage.getItem(key);
        }
      }
    }

    const backup: BackupData = {
      version: 2,
      exportedAt: new Date().toISOString(),
      appName: 'MiSemáforo Quest',
      data: rawData,
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().slice(0, 10);
    link.download = `misemaforo_respaldo_${dateStr}.json`;
    link.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Error al exportar respaldo JSON:', err);
    alert('No se pudo generar el archivo de respaldo: ' + (err as Error).message);
  }
}

export function importFullBackupJson(file: File): Promise<boolean> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        if (!text) return resolve(false);

        const parsed = JSON.parse(text);
        let itemsToRestore: Record<string, unknown> = {};

        if (parsed.data && typeof parsed.data === 'object') {
          itemsToRestore = parsed.data;
        } else if (typeof parsed === 'object') {
          // Si el usuario importó un JSON plano de claves
          itemsToRestore = parsed;
        }

        const validKeys = Object.keys(itemsToRestore).filter(
          (k) => k.startsWith('misemaforo') || k.startsWith('semaforo')
        );

        if (validKeys.length === 0) {
          return resolve(false);
        }

        validKeys.forEach((key) => {
          const val = itemsToRestore[key];
          if (typeof val === 'string') {
            localStorage.setItem(key, val);
          } else {
            localStorage.setItem(key, JSON.stringify(val));
          }
        });

        resolve(true);
      } catch (err) {
        console.error('Error al restaurar JSON:', err);
        resolve(false);
      }
    };

    reader.onerror = () => resolve(false);
    reader.readAsText(file);
  });
}
