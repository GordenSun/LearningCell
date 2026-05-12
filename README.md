# 细胞结构工坊 · Cell Architecture Studio

一个面向中文课堂的交互式 3D 生物教学网页，支持对五个真实尺寸的细胞 / 分子模型进行旋转、缩放与观察。

> 🌱 _在显微镜下探索生命之美_

## 模型清单

| 概念 | 模型文件 | 简介 |
| --- | --- | --- |
| 植物细胞 | `app/public/models/plant-cell.glb` | 含细胞壁、叶绿体、大液泡等结构 |
| 动物细胞 | `app/public/models/animal-cell.glb` | 含细胞膜、内质网、高尔基体等 |
| 白细胞 | `app/public/models/white-blood-cell.glb` | 免疫系统的卫士 |
| 神经元 | `app/public/models/neuron.glb` | 树突、轴突与突触结构 |
| DNA 双螺旋 | `app/public/models/dna.glb` | 双螺旋骨架与碱基对 |

模型已使用 [Draco](https://google.github.io/draco/) 压缩，每个文件约 6 ~ 11 MB。

## 技术栈

- ⚡️ **Vite + React 19 + TypeScript** — 现代化前端工程
- 🎨 **three.js / @react-three/fiber / @react-three/drei** — WebGL 3D 渲染
- 🗜 **DRACOLoader（自带本地 wasm 解码器）** — 离线可用，无需访问 gstatic
- 🎯 **自定义流式加载器** — 用 `fetch + ReadableStream` 真实统计下载进度

## 本地开发

```bash
cd app
npm install
npm run dev
```

构建：

```bash
cd app
npm run build
npm run preview   # 本地预览构建产物
```

## 部署到 GitHub Pages

仓库内已经提供 `.github/workflows/deploy.yml`，把仓库推到 GitHub 后：

1. 进入 **Settings → Pages**
2. **Source** 选择 **GitHub Actions**
3. 推送到 `main` 分支即可自动构建并发布

工作流默认按 `/<仓库名>/` 作为站点根（兼容 `https://<user>.github.io/<repo>/`）。如果你要部署到根域名（自定义域名或用户主页 `user.github.io`），把 workflow 里的 `VITE_BASE` 改成 `"/"` 即可。

## 加载策略

- **优先加载**：用户进入页面后，会立即下载当前展示的模型（默认是体积最小、加载最快的 _植物细胞_，约 6 MB）。下载过程显示真实进度条与百分比。
- **后台静默**：默认模型解析完成后（或者 5 秒超时兜底），其它 4 个模型会按顺序串行下载，避免与首个模型抢占带宽。
- **缓存命中**：浏览器对 `.glb` 启用 `force-cache`，再次访问几乎无需等待。
- **手动覆盖**：当用户点击侧边栏中尚未加载完成的模型时，该模型的下载会立刻提升到前台，并显示进度。

## 目录结构

```
.
├── .github/workflows/deploy.yml   # GitHub Pages 自动部署
├── README.md
├── app/                           # Vite 前端工程
│   ├── public/
│   │   ├── draco/                 # 自带的 Draco 解码器
│   │   ├── images/                # 细胞缩略图（已压缩）
│   │   └── models/                # 5 个 .glb 模型
│   ├── src/
│   │   ├── components/            # UI 组件（侧栏、3D 查看器、信息面板等）
│   │   ├── data/models.ts         # 5 个生物概念的数据
│   │   ├── hooks/useModel.ts      # 加载状态订阅 hook
│   │   ├── lib/modelLoader.ts     # 流式下载 + Draco 解析 + 缓存
│   │   ├── App.tsx
│   │   └── ...
│   └── package.json
└── （根目录其它是源文件备份，例如未压缩的 PNG 与 .draco.glb 原始资源）
```

## 许可与说明

本仓库的模型与图片源文件来自仓库作者本人提供的教学素材，仅用于课堂教学与科普展示。

Made with 🌱 for biology classrooms.
