import * as THREE from 'three';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

const BASE = import.meta.env.BASE_URL;

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(`${BASE}draco/`.replace(/\/+/g, '/'));
// 优先使用 wasm；浏览器不支持时 three.js 会自动回退到 js 解码器
dracoLoader.setDecoderConfig({ type: 'wasm' });
dracoLoader.preload();

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

export type LoadStatus = 'idle' | 'downloading' | 'parsing' | 'done' | 'error';

export interface LoadEntry {
  status: LoadStatus;
  /** 0 ~ 1 */
  progress: number;
  buffer?: ArrayBuffer;
  gltf?: GLTF;
  error?: unknown;
  promise: Promise<GLTF>;
  listeners: Set<() => void>;
}

const cache = new Map<string, LoadEntry>();
const cacheListeners = new Set<() => void>();

function notifyEntry(entry: LoadEntry) {
  entry.listeners.forEach((fn) => fn());
}

function notifyCache() {
  cacheListeners.forEach((fn) => fn());
}

export function subscribeCache(listener: () => void): () => void {
  cacheListeners.add(listener);
  return () => {
    cacheListeners.delete(listener);
  };
}

async function fetchWithProgress(
  url: string,
  expectedSize: number,
  onProgress: (loaded: number, total: number) => void
): Promise<ArrayBuffer> {
  const response = await fetch(url, { cache: 'force-cache' });
  if (!response.ok) {
    throw new Error(`下载失败：${url} (${response.status})`);
  }
  const headerTotal = Number(response.headers.get('Content-Length')) || 0;
  const total = headerTotal > 0 ? headerTotal : expectedSize;

  if (!response.body) {
    const buffer = await response.arrayBuffer();
    onProgress(buffer.byteLength, total || buffer.byteLength);
    return buffer;
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let loaded = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      chunks.push(value);
      loaded += value.length;
      onProgress(loaded, Math.max(total, loaded));
    }
  }

  const buffer = new Uint8Array(loaded);
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.length;
  }
  return buffer.buffer;
}

function parseGLTF(buffer: ArrayBuffer, base: string): Promise<GLTF> {
  return new Promise((resolve, reject) => {
    gltfLoader.parse(buffer, base, resolve, reject);
  });
}

export interface LoadOptions {
  fileSize: number;
}

/**
 * 启动一次加载（如已加载过则直接复用缓存）。
 * 调用方需要显式触发，以便上层决定加载顺序和优先级。
 */
export function loadModel(url: string, options: LoadOptions): LoadEntry {
  const existing = cache.get(url);
  if (existing) return existing;

  const entry: LoadEntry = {
    status: 'downloading',
    progress: 0,
    listeners: new Set(),
    promise: Promise.resolve() as unknown as Promise<GLTF>,
  };
  cache.set(url, entry);
  notifyCache();

  entry.promise = (async () => {
    try {
      const buffer = await fetchWithProgress(url, options.fileSize, (loaded, total) => {
        entry.status = 'downloading';
        entry.progress = Math.min(0.95, (loaded / Math.max(1, total)) * 0.95);
        notifyEntry(entry);
      });
      entry.buffer = buffer;
      entry.status = 'parsing';
      entry.progress = 0.97;
      notifyEntry(entry);

      const gltf = await parseGLTF(buffer, '');
      entry.gltf = gltf;
      entry.status = 'done';
      entry.progress = 1;
      notifyEntry(entry);
      return gltf;
    } catch (error) {
      entry.status = 'error';
      entry.error = error;
      notifyEntry(entry);
      throw error;
    }
  })();

  return entry;
}

export function getLoadEntry(url: string): LoadEntry | undefined {
  return cache.get(url);
}

/** 后台静默预加载（不会抛错） */
export function preloadModel(url: string, options: LoadOptions): void {
  const entry = loadModel(url, options);
  entry.promise.catch(() => {
    /* 静默失败 */
  });
}

/** 克隆 GLTF.scene 一份以便每个 Canvas 实例使用 */
export function cloneScene(gltf: GLTF): THREE.Group {
  const cloned = gltf.scene.clone(true);
  cloned.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) {
      const mesh = obj as THREE.Mesh;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
  });
  return cloned;
}
