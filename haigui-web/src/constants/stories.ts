export type StoryDifficulty = 'easy' | 'medium' | 'hard' | 'expert'

export interface TurtleStory {
  id: string
  title: string
  difficulty: StoryDifficulty
  surface: string
  bottom: string
}

export const stories: TurtleStory[] = [
  {
    id: 'story-001',
    title: '雨夜敲门声',
    difficulty: 'easy',
    surface: '深夜暴雨，女人听到敲门声后立刻报警。警察到时，门外只有一把湿雨伞。',
    bottom:
      '女人是独居盲人，刚刚洗完澡准备休息。她听到敲门后下意识问“谁”，门外没有回答，却把伞靠在门边。她意识到对方知道她看不见，正在试探她是否独居，于是立刻报警。',
  },
  {
    id: 'story-002',
    title: '最后一张车票',
    difficulty: 'medium',
    surface: '男人买到当天最后一张末班车票，却在发车前把票撕碎，转身离开。',
    bottom:
      '男人原本要去外地见病危的父亲，但在候车时收到消息：父亲已经去世。他不想让母亲在深夜独自处理后事，于是改乘更快的夜航班，车票因此被撕掉。',
  },
  {
    id: 'story-003',
    title: '不会说话的证人',
    difficulty: 'medium',
    surface: '警察找到了唯一“目击者”，它不会说话，却让凶手当场崩溃。',
    bottom:
      '目击者是一只家里的智能音箱。警方播放凶案当晚自动录下的语音片段，里面有凶手与受害人的争执声和一句关键口头禅，凶手听到后意识到无法抵赖，情绪失控。',
  },
  {
    id: 'story-004',
    title: '永不熄灭的灯',
    difficulty: 'hard',
    surface: '废弃灯塔多年无人值守，却每晚准时亮灯。直到一天灯突然灭了，海边小镇立刻封港。',
    bottom:
      '灯塔其实被一位退役老船长秘密维护。他年轻时因失误导致同伴在迷雾中遇难，此后坚持每晚点灯提醒渔船避开暗礁。那天灯灭是因为老船长去世，小镇居民知道真相后为他停港致哀。',
  },
  {
    id: 'story-005',
    title: '倒放的生日歌',
    difficulty: 'expert',
    surface: '女孩在生日会上听到一段倒放的生日歌后，马上让所有人离开房子。',
    bottom:
      '女孩是音频工程师，听出“倒放生日歌”里夹着极低频的结构共振测试音。那是开发商在旧楼拆除前用来检测承重风险的信号，说明建筑已被判定为危楼且即将处理。她立即疏散众人，避免了坍塌事故。',
  },
]
