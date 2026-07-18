const fs = require('fs');
const path = require('path');

const root = 'd:/memeticsingularity/IdeaProjects/sea-of-remnants';

const shadows = {
  黑: [
    ['shadow-sleeping-doll', '安眠人偶'],
    ['shadow-his-war', '他的战争'],
    ['shadow-flower-of-mourning', '何人致哀之花'],
    ['shadow-lost-gem', '遗落宝石'],
    ['shadow-law-of-civilization', '文明法则'],
    ['shadow-fishbone-string', '鱼骨串'],
    ['shadow-ribbon-tear', '缎带泪'],
    ['shadow-broken-rhapsody', '破碎狂想曲'],
  ],
  紫: [
    ['shadow-captains-gift', '船长的礼物'],
    ['shadow-floating-compass', '沉浮罗盘'],
    ['shadow-beauty-of-ship', '船之美'],
    ['shadow-dream-under-daylight', '白日下的梦'],
    ['shadow-flag-held-high', '昂首之旗'],
    ['shadow-veterans-bugle', '老将的军号'],
    ['shadow-death-of-mini-catfish', '迷你号鲇鱼的消亡'],
    ['shadow-mechanical-life', '机械生命'],
    ['shadow-time-of-deviation', '偏差之时'],
    ['shadow-moment-leave-barrel', '离膛一瞬'],
    ['shadow-now-is-future', '此刻即未来'],
    ['shadow-scratched-page', '被划掉的一页'],
  ],
  蓝: [
    ['shadow-unyielding-flame', '不屈焰火'],
    ['shadow-tranquil-whisper', '安宁絮语'],
    ['shadow-swift-wind', '疾步之风'],
    ['shadow-eye-of-insight', '洞悉之眼'],
    ['shadow-wave-of-thought', '思维浪潮'],
    ['shadow-sand-armor', '沙尘战甲'],
    ['shadow-layered-rock-shatter', '层岩俱裂'],
    ['shadow-emerald-fang', '翠绿利牙'],
    ['shadow-amber-shell', '琥珀壳壁'],
    ['shadow-azure-sigh', '蔚蓝叹息'],
    ['shadow-purple-mist-dust', '紫霞尘埃'],
    ['shadow-pink-song', '粉色歌谣'],
  ],
};

const crews = {
  SSR: [
    ['crew-molly', '茉莉'],
    ['crew-colonel-scorched-face', '焦面上校'],
    ['crew-iron-fist-commander', '铁腕统领'],
    ['crew-isabella', '伊莎贝拉'],
    ['crew-small-axe', '小斧头'],
    ['crew-hungry-cat', '饿猫'],
    ['crew-heg', '黑格'],
  ],
  SR: [
    ['crew-omen-eye', '预兆之眼'],
    ['crew-as', '艾丝'],
    ['crew-hai-he', '海赫'],
    ['crew-sosia', '索西亚'],
    ['crew-coward', '懦夫'],
    ['crew-nonsense-prophet', '胡话先知'],
    ['crew-follower', '跟屁虫'],
    ['crew-ghost-hand-shipwright', '鬼手船匠'],
    ['crew-clockmaker', '钟表匠'],
    ['crew-puppeteer', '人偶师'],
    ['crew-dad-tonino', '托尼诺老爹'],
    ['crew-miser', '吝啬鬼'],
  ],
};

function writeShadows() {
  const dir = path.join(root, 'content/data/shadows');
  fs.mkdirSync(dir, { recursive: true });
  for (const [rarity, list] of Object.entries(shadows)) {
    for (const [id, name] of list) {
      const slug = id.replace('shadow-', '');
      const yaml = `id: ${id}\nslug: ${slug}\nname: ${name}\ntype: 往日之影\nrarity: ${rarity}\nimage: /images/shadows/${slug}.png\ntags:\n  - ${rarity}券\n`;
      fs.writeFileSync(path.join(dir, `${slug}.yaml`), yaml);
    }
  }
}

function writeCrews() {
  const dir = path.join(root, 'content/data/crews');
  fs.mkdirSync(dir, { recursive: true });
  for (const [rarity, list] of Object.entries(crews)) {
    for (const [id, name] of list) {
      const slug = id.replace('crew-', '');
      const yaml = `id: ${id}\nslug: ${slug}\nname: ${name}\ntype: 船员\nrarity: ${rarity}\nrole: 待补充\nelement: 待补充\nobtain: 招募\nimage: /images/crews/${slug}.png\ntags:\n  - ${rarity}\n  - 待补充\nbaseStats:\n  hp: 0\n  atk: 0\n  def: 0\n  spd: 0\nbuildNotes: |\n  待补充。\n`;
      fs.writeFileSync(path.join(dir, `${slug}.yaml`), yaml);
    }
  }
}

function writePools() {
  const dir = path.join(root, 'content/data/recruitment-pools');
  fs.mkdirSync(dir, { recursive: true });

  const blackCrews = [
    'crew-molly',
    'crew-colonel-scorched-face',
    'crew-iron-fist-commander',
    'crew-isabella',
    'crew-small-axe',
    'crew-hungry-cat',
    'crew-sea-burial',
    'crew-heg',
  ];
  const purpleCrews = [
    'crew-omen-eye',
    'crew-as',
    'crew-hai-he',
    'crew-sosia',
    'crew-coward',
    'crew-nonsense-prophet',
    'crew-follower',
    'crew-ghost-hand-shipwright',
    'crew-clockmaker',
    'crew-puppeteer',
    'crew-dad-tonino',
    'crew-miser',
  ];
  const blackShadows = [
    'shadow-sleeping-doll',
    'shadow-his-war',
    'shadow-flower-of-mourning',
    'shadow-lost-gem',
    'shadow-law-of-civilization',
    'shadow-fishbone-string',
    'shadow-ribbon-tear',
    'shadow-broken-rhapsody',
  ];
  const purpleShadows = [
    'shadow-captains-gift',
    'shadow-floating-compass',
    'shadow-beauty-of-ship',
    'shadow-dream-under-daylight',
    'shadow-flag-held-high',
    'shadow-veterans-bugle',
    'shadow-death-of-mini-catfish',
    'shadow-mechanical-life',
    'shadow-time-of-deviation',
    'shadow-moment-leave-barrel',
    'shadow-now-is-future',
    'shadow-scratched-page',
  ];
  const blueShadows = [
    'shadow-unyielding-flame',
    'shadow-tranquil-whisper',
    'shadow-swift-wind',
    'shadow-eye-of-insight',
    'shadow-wave-of-thought',
    'shadow-sand-armor',
    'shadow-layered-rock-shatter',
    'shadow-emerald-fang',
    'shadow-amber-shell',
    'shadow-azure-sigh',
    'shadow-purple-mist-dust',
    'shadow-pink-song',
  ];

  const indentList = (arr) => arr.map((x) => `    - ${x}`).join('\n');

  const zhimeng = `id: pool-zhimeng-xianyin
slug: zhimeng-xianyin
name: 织梦弦音
bannerName: 织梦弦音
type: limited
currency: 来一杯金币
singleCost: 180
tenCost: 1800
upItems:
  - crewIds:
      - crew-molly
    upRate: 0.5
    guaranteeNextOnMiss: true
  - crewIds:
      - crew-omen-eye
      - crew-as
    upRate: 0.5
    guaranteeNextOnMiss: true
tiers:
  - key: black
    label: 黑券
    baseRate: 0.008
    comprehensiveRate: 0.0184
    hardPity: 80
    pool:
      crewIds:
${indentList(blackCrews)}
      shadowIds: []
  - key: purple
    label: 紫券
    baseRate: 0.06
    comprehensiveRate: 0.13
    hardPity: 10
    mixed: true
    pool:
      crewIds:
${indentList(purpleCrews)}
      shadowIds:
${indentList(purpleShadows)}
  - key: blue
    label: 蓝券
    baseRate: 0.932
    comprehensiveRate: 0.8458
    pool:
      crewIds: []
      shadowIds:
${indentList(blueShadows)}
pityRules:
  - type: hard_pity
    threshold: 80
    tier: black
    firstUpId: crew-molly
    guaranteeUpAfterMiss: true
  - type: purple_guarantee
    threshold: 10
    tier: purple
  - type: up_guarantee
    threshold: 1
    tier: black
    guaranteeUpAfterMiss: true
  - type: up_guarantee
    threshold: 1
    tier: purple
    guaranteeUpAfterMiss: true
`;

  const pilu = `id: pool-pilu-secret
slug: pilu-secret
name: 噼噜的旧日秘藏
bannerName: 噼噜的旧日秘藏
type: limited
currency: 噼噜的最爱
singleCost: 180
tenCost: 1800
upItems:
  - shadowIds:
      - shadow-sleeping-doll
    upRate: 0.75
    guaranteeNextOnMiss: true
  - shadowIds:
      - shadow-death-of-mini-catfish
      - shadow-now-is-future
    upRate: 0.5
    guaranteeNextOnMiss: true
tiers:
  - key: black
    label: 黑券
    baseRate: 0.008
    comprehensiveRate: 0.0184
    hardPity: 80
    pool:
      crewIds: []
      shadowIds:
${indentList(blackShadows)}
  - key: purple
    label: 紫券
    baseRate: 0.06
    comprehensiveRate: 0.13
    hardPity: 10
    pool:
      crewIds: []
      shadowIds:
${indentList(purpleShadows)}
  - key: blue
    label: 蓝券
    baseRate: 0.932
    comprehensiveRate: 0.8515
    pool:
      crewIds: []
      shadowIds:
${indentList(blueShadows)}
pityRules:
  - type: hard_pity
    threshold: 80
    tier: black
    firstUpId: shadow-sleeping-doll
    guaranteeUpAfterMiss: true
  - type: purple_guarantee
    threshold: 10
    tier: purple
  - type: up_guarantee
    threshold: 1
    tier: black
    guaranteeUpAfterMiss: true
  - type: up_guarantee
    threshold: 1
    tier: purple
    guaranteeUpAfterMiss: true
`;

  const neverLeaveBlackCrews = blackCrews.filter((id) => id !== 'crew-molly');
  const neverLeavePurpleCrews = purpleCrews;
  const neverLeave = `id: pool-never-leave
slug: never-leave
name: 这里不散场
bannerName: 这里不散场
type: standard
currency: 来一杯银币
singleCost: 180
tenCost: 1800
upItems: []
tiers:
  - key: black
    label: 黑券
    baseRate: 0.008
    comprehensiveRate: 0.0184
    hardPity: 80
    pool:
      crewIds:
${indentList(neverLeaveBlackCrews)}
      shadowIds:
${indentList(blackShadows)}
  - key: purple
    label: 紫券
    baseRate: 0.06
    comprehensiveRate: 0.13
    hardPity: 10
    mixed: true
    pool:
      crewIds:
${indentList(neverLeavePurpleCrews)}
      shadowIds:
${indentList(purpleShadows)}
  - key: blue
    label: 蓝券
    baseRate: 0.932
    comprehensiveRate: 0.8458
    pool:
      crewIds: []
      shadowIds:
${indentList(blueShadows)}
pityRules:
  - type: hard_pity
    threshold: 80
    tier: black
    guaranteeUpAfterMiss: false
  - type: purple_guarantee
    threshold: 10
    tier: purple
`;

  const memory = `id: pool-memory-reunion
slug: memory-reunion
name: 记忆重逢
bannerName: 记忆重逢
type: weekly
currency: 免费
singleCost: 0
tenCost: 0
upItems: []
tiers: []
pityRules: []
`;

  fs.writeFileSync(path.join(dir, 'zhimeng-xianyin.yaml'), zhimeng);
  fs.writeFileSync(path.join(dir, 'pilu-secret.yaml'), pilu);
  fs.writeFileSync(path.join(dir, 'never-leave.yaml'), neverLeave);
  fs.writeFileSync(path.join(dir, 'memory-reunion.yaml'), memory);
}

writeShadows();
writeCrews();
writePools();
console.log('Generated shadow, crew, and recruitment pool YAML files.');
