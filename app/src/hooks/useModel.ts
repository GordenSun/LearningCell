import { useEffect, useReducer } from 'react';
import {
  getLoadEntry,
  loadModel,
  subscribeCache,
  type LoadEntry,
  type LoadStatus,
} from '../lib/modelLoader';

export interface UseModelState {
  status: LoadStatus;
  progress: number;
  entry?: LoadEntry;
}

interface Options {
  /** 当 entry 不存在时是否立即启动下载（默认 true） */
  autoStart?: boolean;
  fileSize: number;
}

/**
 * 订阅一个模型的加载状态。
 * - autoStart=true 时若尚未启动会立即触发下载。
 * - autoStart=false 时仅观察由外部（如 App 编排）启动的下载进度。
 */
export function useModel(url: string, opts: Options): UseModelState {
  const { autoStart = true, fileSize } = opts;
  const [, forceUpdate] = useReducer((n: number) => n + 1, 0);

  // 当观察的目标尚不存在时，订阅 cache 增长事件，等到它创建后再切换到 entry 的局部订阅。
  useEffect(() => {
    let unsubCache: (() => void) | null = null;
    let unsubEntry: (() => void) | null = null;

    const attach = () => {
      const entry = getLoadEntry(url);
      if (!entry) return false;
      if (unsubCache) {
        unsubCache();
        unsubCache = null;
      }
      const listener = () => forceUpdate();
      entry.listeners.add(listener);
      unsubEntry = () => entry.listeners.delete(listener);
      return true;
    };

    if (autoStart) {
      loadModel(url, { fileSize });
    }

    if (!attach()) {
      unsubCache = subscribeCache(() => {
        if (attach()) {
          forceUpdate();
        }
      });
    }

    return () => {
      unsubCache?.();
      unsubEntry?.();
    };
  }, [url, fileSize, autoStart]);

  const entry = getLoadEntry(url);
  if (!entry) {
    return { status: 'idle', progress: 0 };
  }
  return { status: entry.status, progress: entry.progress, entry };
}
