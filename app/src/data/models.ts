export interface CellModel {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  description: string;
  size: string;
  location: string;
  visibleInLM: string;
  accent: string;
  features: { name: string; detail: string }[];
  funFact: string;
  whereItOccurs: {
    text: string;
    habitat: string;
  };
  modelUrl: string;
  imageUrl: string;
  /** 经过 Draco 压缩后的真实文件大小（字节），用于估算下载进度 */
  fileSize: number;
  /** 默认绕 Y 轴的旋转角度（弧度）；用于让模型呈现合适的视角 */
  defaultRotationY: number;
  /** 在统一归一化尺寸基础上的显示倍率，用于让不同模型默认呈现大小不同 */
  displayScale: number;
}

const BASE = import.meta.env.BASE_URL;
const asset = (p: string) => `${BASE}${p}`.replace(/\/+/g, '/');

export const MODELS: CellModel[] = [
  {
    id: 'plant-cell',
    name: '植物细胞',
    subtitle: '真核细胞 · 自养生物',
    category: '真核细胞',
    accent: '#7fb069',
    description:
      '植物细胞是构成植物体的基本单位。与动物细胞不同，它拥有坚硬的细胞壁、能进行光合作用的叶绿体，以及储存营养与水分的大型液泡，使其既能保持形态又能为整个生态系统提供能量。',
    size: '10 – 100 微米',
    location: '植物的根、茎、叶、花、果实',
    visibleInLM: '是',
    features: [
      { name: '细胞壁', detail: '由纤维素构成，提供形态支撑与机械保护' },
      { name: '叶绿体', detail: '光合作用场所，将光能转化为有机物' },
      { name: '大液泡', detail: '储存水分、糖、色素，维持膨压' },
      { name: '细胞核', detail: '储存遗传信息，调控代谢与分裂' },
      { name: '线粒体', detail: '细胞的能量工厂，进行有氧呼吸' },
      { name: '内质网与高尔基体', detail: '蛋白质合成、加工与运输' },
    ],
    funFact:
      '一片成熟叶子里可能含有数百万个叶绿体，它们让地球的每一次呼吸都变得甘甜。',
    whereItOccurs: {
      text: '从苔藓到参天大树，植物细胞无处不在地构筑着大地的绿色。',
      habitat: '陆生植物 · 水生藻类 · 蕨类',
    },
    modelUrl: asset('models/plant-cell.glb'),
    imageUrl: asset('images/plant-cell.jpg'),
    fileSize: 6030628,
    defaultRotationY: -Math.PI / 4,
    displayScale: 1.4,
  },
  {
    id: 'animal-cell',
    name: '动物细胞',
    subtitle: '真核细胞 · 异养生物',
    category: '真核细胞',
    accent: '#e8859a',
    description:
      '动物细胞缺少细胞壁和叶绿体，依赖灵活的细胞膜与丰富的细胞器协作完成代谢与运动。从你正在跳动的心肌细胞到大脑皮层中的胶质细胞，它们以惊人的多样性塑造着复杂的生命体。',
    size: '10 – 30 微米',
    location: '所有动物的组织与器官',
    visibleInLM: '是',
    features: [
      { name: '细胞膜', detail: '磷脂双分子层，选择性地控制物质进出' },
      { name: '细胞核', detail: '遗传中心，包含 DNA 与核仁' },
      { name: '线粒体', detail: '产生 ATP，被称为「细胞的电厂」' },
      { name: '内质网', detail: '粗面合成蛋白质，光面合成脂质' },
      { name: '高尔基体', detail: '蛋白质的加工与分拣中心' },
      { name: '溶酶体', detail: '细胞的「回收站」，分解代谢废物' },
    ],
    funFact:
      '一个成年人体内大约有 37 万亿个细胞——它们每一秒都在协作，构成你正在阅读这段文字的「你」。',
    whereItOccurs: {
      text: '从单细胞原生动物到鲸鱼，所有动物的身体都是由动物细胞组成。',
      habitat: '哺乳动物 · 鱼类 · 昆虫 · 鸟类',
    },
    modelUrl: asset('models/animal-cell.glb'),
    imageUrl: asset('images/animal-cell.jpg'),
    fileSize: 10673912,
    defaultRotationY: -Math.PI / 4,
    displayScale: 1.4,
  },
  {
    id: 'white-blood-cell',
    name: '白细胞',
    subtitle: '免疫细胞 · 身体的卫士',
    category: '免疫细胞',
    accent: '#c8a2d8',
    description:
      '白细胞是免疫系统的核心成员，巡逻在血液与淋巴中。它们能够识别入侵的病原体，通过吞噬、释放细胞因子或精准杀伤的方式守护机体的稳态。',
    size: '6 – 20 微米',
    location: '血液、淋巴系统、骨髓',
    visibleInLM: '是',
    features: [
      { name: '不规则的细胞核', detail: '不同亚型呈分叶或马蹄形' },
      { name: '细胞膜与伪足', detail: '可主动变形，穿越毛细血管壁' },
      { name: '吞噬泡', detail: '包裹并消化入侵的细菌或异物' },
      { name: '颗粒体', detail: '储存酶与抗菌肽，释放后清除病原' },
      { name: '线粒体', detail: '提供免疫反应所需的能量' },
    ],
    funFact:
      '一个健康成年人每天会生成约 1000 亿个新的白细胞，几乎是地球总人口的十二倍。',
    whereItOccurs: {
      text: '每一滴血液里，都游弋着千万个白细胞，全天候巡逻你的身体。',
      habitat: '血液 · 骨髓 · 脾脏 · 淋巴结',
    },
    modelUrl: asset('models/white-blood-cell.glb'),
    imageUrl: asset('images/white-blood-cell.jpg'),
    fileSize: 10812336,
    defaultRotationY: -Math.PI / 4,
    displayScale: 1.4,
  },
  {
    id: 'neuron',
    name: '神经元',
    subtitle: '可兴奋细胞 · 信息传递者',
    category: '神经细胞',
    accent: '#f0a868',
    description:
      '神经元是信息处理的基本单元。突出的树突像天线一样接收信号，长长的轴突则把电脉冲送往远方。它们用化学和电的语言编织出感知、记忆与思考。',
    size: '细胞体 4 – 100 微米，轴突可达 1 米',
    location: '大脑、脊髓、周围神经系统',
    visibleInLM: '是（须染色）',
    features: [
      { name: '细胞体', detail: '包含核与主要细胞器，整合输入信号' },
      { name: '树突', detail: '分支繁多，接收来自其他神经元的信号' },
      { name: '轴突', detail: '传导电脉冲，可延伸至身体远端' },
      { name: '髓鞘', detail: '加快传导速度，由施旺细胞或少突胶质细胞包裹' },
      { name: '突触', detail: '通过神经递质把信号传递给下一个细胞' },
    ],
    funFact:
      '人脑约有 860 亿个神经元，它们之间的连接数超过银河系恒星总数。',
    whereItOccurs: {
      text: '从蝴蝶的复眼到人类的大脑皮层，神经元让动物拥有了感觉与思考的能力。',
      habitat: '中枢神经系统 · 周围神经 · 感觉器官',
    },
    modelUrl: asset('models/neuron.glb'),
    imageUrl: asset('images/neuron.jpg'),
    fileSize: 7359744,
    defaultRotationY: -Math.PI / 4,
    displayScale: 1.8,
  },
  {
    id: 'dna',
    name: 'DNA 双螺旋',
    subtitle: '遗传分子 · 生命的蓝图',
    category: '生物大分子',
    accent: '#9cc4e4',
    description:
      'DNA 由两条互补的核苷酸链组成，盘旋成优雅的双螺旋。它把生命的指令写成 A、T、G、C 四个字母，让信息得以在亿万年之间一代代地复制、表达与演化。',
    size: '直径约 2 纳米，长度因物种而异',
    location: '细胞核、线粒体、叶绿体',
    visibleInLM: '仅电镜可见',
    features: [
      { name: '双螺旋骨架', detail: '由磷酸与脱氧核糖交替连接而成' },
      { name: '碱基对', detail: 'A 与 T、G 与 C 通过氢键互补配对' },
      { name: '大沟与小沟', detail: '蛋白质识别 DNA 的关键结构' },
      { name: '半保留复制', detail: '每一次复制都保留一条母链作模板' },
    ],
    funFact:
      '把一个细胞里的 DNA 拉成直线约有 2 米长；全身细胞的 DNA 接起来可往返太阳数百次。',
    whereItOccurs: {
      text: '从最古老的细菌到你身上的每一个细胞，DNA 都在静静守护着生命的密码。',
      habitat: '细菌 · 古菌 · 真核生物 · 病毒（部分）',
    },
    modelUrl: asset('models/dna.glb'),
    imageUrl: asset('images/dna.jpg'),
    fileSize: 9977020,
    defaultRotationY: 0,
    displayScale: 1.2,
  },
];

export const DEFAULT_MODEL_ID = MODELS[0].id;
