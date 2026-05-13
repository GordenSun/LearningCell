import type { CellModel } from '../data/models';
import { useModel } from '../hooks/useModel';

interface Props {
  models: CellModel[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function Sidebar({ models, activeId, onSelect }: Props) {
  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <header className="sidebar-header">
          <span className="dot" />
          细 胞 类 型
        </header>
        <ul className="cell-list">
          {models.map((m) => (
            <CellItem
              key={m.id}
              model={m}
              active={m.id === activeId}
              onSelect={() => onSelect(m.id)}
            />
          ))}
        </ul>
      </div>

    </aside>
  );
}

function CellItem({
  model,
  active,
  onSelect,
}: {
  model: CellModel;
  active: boolean;
  onSelect: () => void;
}) {
  const { status, progress } = useModel(model.modelUrl, {
    autoStart: false,
    fileSize: model.fileSize,
  });
  const downloaded = status === 'done';
  const downloading = status === 'downloading' || status === 'parsing';
  const queued = status === 'idle';
  const percent = Math.round(progress * 100);

  return (
    <li>
      <button
        type="button"
        className={`cell-item${active ? ' active' : ''}`}
        onClick={onSelect}
        style={{ '--accent': model.accent } as React.CSSProperties}
      >
        <div className="cell-thumb">
          <img src={model.imageUrl} alt={model.name} loading="lazy" />
          {active && <span className="badge">当前</span>}
        </div>
        <div className="cell-meta">
          <div className="cell-name">{model.name}</div>
          <div className="cell-sub">{model.subtitle}</div>
          <div className="cell-status">
            {downloaded && (
              <span className="status-chip ok">
                <Check /> 已就绪
              </span>
            )}
            {downloading && (
              <span className="status-chip loading">
                <span className="mini-bar">
                  <span className="mini-fill" style={{ width: `${percent}%` }} />
                </span>
                {percent}%
              </span>
            )}
            {queued && <span className="status-chip idle">排队中</span>}
          </div>
        </div>
      </button>
    </li>
  );
}

function Check() {
  return (
    <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8.5l3 3 7-7" />
    </svg>
  );
}
