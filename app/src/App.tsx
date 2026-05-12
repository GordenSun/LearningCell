import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_MODEL_ID, MODELS } from './data/models';
import { Sidebar } from './components/Sidebar';
import { ModelViewer } from './components/ModelViewer';
import { InfoPanel } from './components/InfoPanel';
import { getLoadEntry, loadModel, preloadModel } from './lib/modelLoader';
import './app.css';

function App() {
  const [activeId, setActiveId] = useState<string>(DEFAULT_MODEL_ID);
  const activeModel = useMemo(
    () => MODELS.find((m) => m.id === activeId) ?? MODELS[0],
    [activeId]
  );

  // 启动加载编排：
  //   1. 立刻启动默认模型的下载（也由 ModelViewer 内的 useModel 触发，这里做兜底）；
  //   2. 等默认模型解析完成（或 5s 超时）后，按顺序串行预加载其它模型，
  //      避免多个 ~10MB 文件同时下载抢占带宽。
  useEffect(() => {
    let cancelled = false;

    const firstEntry = loadModel(activeModel.modelUrl, {
      fileSize: activeModel.fileSize,
    });

    let started = false;
    const queueOthers = () => {
      if (cancelled || started) return;
      started = true;
      const queue = MODELS.filter((m) => m.id !== activeModel.id);
      let i = 0;
      const next = () => {
        if (cancelled || i >= queue.length) return;
        const m = queue[i++];
        preloadModel(m.modelUrl, { fileSize: m.fileSize });
        const entry = getLoadEntry(m.modelUrl);
        entry?.promise.finally(() => {
          if (cancelled) return;
          setTimeout(next, 120);
        });
      };
      next();
    };

    const timer = setTimeout(queueOthers, 5000);
    firstEntry.promise
      .then(() => {
        clearTimeout(timer);
        queueOthers();
      })
      .catch(() => {
        clearTimeout(timer);
        queueOthers();
      });

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // 仅在挂载时触发，用户后续切换模型不会重启队列
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 48 48" width="36" height="36">
              <defs>
                <radialGradient id="bm" cx="50%" cy="45%" r="55%">
                  <stop offset="0%" stopColor="#c8e6a0" />
                  <stop offset="55%" stopColor="#7fb069" />
                  <stop offset="100%" stopColor="#3f6b3a" />
                </radialGradient>
              </defs>
              <circle cx="24" cy="24" r="22" fill="url(#bm)" />
              <circle cx="24" cy="24" r="7" fill="#5c2a8c" opacity="0.85" />
              <circle cx="14" cy="16" r="2.4" fill="#f1c40f" opacity="0.85" />
              <circle cx="34" cy="14" r="1.8" fill="#e67e22" opacity="0.85" />
              <circle cx="34" cy="32" r="2.2" fill="#1e88e5" opacity="0.85" />
              <circle cx="14" cy="34" r="1.9" fill="#c0392b" opacity="0.85" />
            </svg>
          </div>
          <div>
            <h1 className="brand-title">细胞结构工坊</h1>
            <p className="brand-tagline">
              <span className="brand-pen">在显微镜下探索生命之美</span>
              <span className="brand-sep">·</span>
              <span>Cell Architecture Studio</span>
            </p>
          </div>
        </div>
        <div className="topbar-meta">
          <span className="meta-pill">教学版 v1.0</span>
          <span className="meta-text">支持 3D 旋转 · 中文教学</span>
        </div>
      </header>

      <main className="layout">
        <Sidebar models={MODELS} activeId={activeId} onSelect={setActiveId} />

        <section className="stage">
          <div className="stage-header">
            <div>
              <h2 className="stage-title">{activeModel.name}</h2>
              <p className="stage-sub">{activeModel.subtitle}</p>
            </div>
            <div
              className="stage-accent"
              style={{ background: activeModel.accent }}
              aria-hidden="true"
            />
          </div>
          <ModelViewer key={activeModel.id} model={activeModel} />
        </section>

        <InfoPanel model={activeModel} />
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} 细胞结构工坊 · 用于课堂教学与科普展示</span>
        <span className="footer-tip">
          模型已使用 Draco 压缩 · 首个模型加载后其余模型在后台静默下载
        </span>
      </footer>
    </div>
  );
}

export default App;
