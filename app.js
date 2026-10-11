/**
 * 米哈遊社團活動企劃書系統 - 核心前端邏輯 (app.js)
 * 支援 95 項企劃、LocalStorage 本機狀態持久化、
 * 活動勾選匯出/分享碼、匯入社員投票、統計排行榜 (由高到低/點擊預覽)、
 * 長條圓餅圖表、方框社員清單、以及詳細彈窗前後切換與備份還原功能。
 */

// 備用內建完整資料（防止直接以 file:// 協定開啟時受限於瀏覽器 CORS）
const FALLBACK_ACTIVITIES = [
  {
    "id": "act-anime-01",
    "title": "新番放映茶會 × 跨遊戲深淵通關指南 ＆ 社長帳號診療室",
    "subtitle": "動漫放映 × 原神深境螺旋與各遊高難關卡實戰診療",
    "category": "原神",
    "categoryKey": "genshin",
    "subType": "休閒",
    "subTypeKey": "casual",
    "badgeColor": "#06b6d4",
    "participants": "全體社員 (自由入座交流)",
    "duration": "2 小時",
    "location": "社團活動室 / 多媒體教室",
    "summary": "放鬆看番聊遊戲！前半場大螢幕放映當季最熱門新番與百萬二創動畫，邊吃點心邊聊動漫梗。後半場由社長親自坐鎮，以大螢幕投屏剖析當期深淵機制與元素反應軸，為社員帳號進行 1 對 1 聖遺物健檢與平民滿星配隊急救！",
    "highlight": "零社恐吃零食看動漫、社長現場手把手健檢救急深淵滿星！",
    "schedule": [
      {
        "time": "18:30 - 19:15",
        "item": "精選新番放映廳、同人二創名場面賞析、享用茶水點心"
      },
      {
        "time": "19:15 - 19:35",
        "item": "當期深境螺旋與各遊版本深淵機制剖析、原魔弱點講解"
      },
      {
        "time": "19:35 - 20:20",
        "item": "社長 1 對 1 大螢幕健檢診療（聖遺物詞條評分、平民配隊優化）"
      },
      {
        "time": "20:20 - 20:30",
        "item": "聖遺物玄學強化 4 升 20 現場代點同樂、自由交流"
      }
    ],
    "supplies": [
      "大螢幕投影設備與音響",
      "低延遲手機/筆電投屏轉接器",
      "派對餅乾點心與茶水飲料",
      "深淵原魔機制分析速查手冊"
    ],
    "budget": "約 300 ~ 450 元（零食飲料開銷）",
    "rules": "1. 放映期間請保持環境整潔，飲料請置於防傾倒杯墊上。\n2. 帳號健檢採排隊叫號制，每人限諮詢一組核心深淵隊伍。\n3. 玄學強化代點純屬同樂，請平常心看待詞條結果。",
    "extraNotes": [
      "【附註 1：不限遊戲】健檢以原神深淵為主，但星鐵混沌、絕區零防衛戰亦可自備帳號諮詢！",
      "【附註 2：新手友善】就算練度未滿、只打前幾層深淵的萌新社員也歡迎來喝奶茶交流。"
    ]
  },
  {
    "id": "act-anime-02",
    "title": "動漫同樂夜 × 當期高難關卡速通攻略 ＆ 社長一對一配隊健檢",
    "subtitle": "動漫熱播 × 崩壞：星穹鐵道混沌回憶與各遊弱點擊破軸優化",
    "category": "崩壞：星穹鐵道",
    "categoryKey": "hsr",
    "subType": "休閒",
    "subTypeKey": "casual",
    "badgeColor": "#818cf8",
    "participants": "全體社員 (自由入座交流)",
    "duration": "2 小時",
    "location": "社團活動室 / 隔音多媒體教室",
    "summary": "告別刮痧與超時！一邊喝特調蘇樂達飲料看當季精彩新番，一邊由社長深入剖析星鐵當期「混沌回憶」與「末日幻影」高難弱點機制。現場提供一對一速度調軸診斷，教你用四星平民戰神替換高金陣容，手操凹過滿星！",
    "highlight": "速度閾值無情診斷、低金手操調軸破防秘笈現場傳授！",
    "schedule": [
      {
        "time": "18:30 - 19:15",
        "item": "動漫熱播連賞、經典神曲與短片播放、點心享用"
      },
      {
        "time": "19:15 - 19:35",
        "item": "版本環境弱點速報、虛韌性機制與擊破/追擊隊調速拆解"
      },
      {
        "time": "19:35 - 20:20",
        "item": "社長一對一配隊健檢（診斷速度門檻、有效遺器詞條清查）"
      },
      {
        "time": "20:20 - 20:30",
        "item": "疑難雜症現場試打與操作指點"
      }
    ],
    "supplies": [
      "投影機與立體環繞音響",
      "投屏同屏設備",
      "蘇樂達氣泡水與派對炸物點心",
      "星鐵速度軸計算對照表"
    ],
    "budget": "約 350 ~ 500 元",
    "rules": "1. 自行攜帶已登入遊戲之設備（手機/平板/筆電）。\n2. 諮詢時請先備妥當前主力角色的遺器面板截圖以加快進度。",
    "extraNotes": [
      "【附註 1：量身打造】社長將針對社員目前擁有的角色池給予最佳化養成順序建議。"
    ]
  },
  {
    "id": "act-anime-03",
    "title": "新番吃瓜賞析會 × 遊戲新版本解析 ＆ 社長現場玄學健檢",
    "subtitle": "新番名場面 × 絕區零式輿防衛戰與版本趨勢吃瓜評測",
    "category": "絕區零",
    "categoryKey": "zzz",
    "subType": "休閒",
    "subTypeKey": "casual",
    "badgeColor": "#f59e0b",
    "participants": "全體社員 (自由入座交流)",
    "duration": "2 小時",
    "location": "社團活動室",
    "summary": "打造六分街錄影帶小店般的愜意交流！放映社員票選生草新番與各家手遊新版本前瞻爆料，社長帶領全體社員評測當期式輿防衛戰紛爭節點；現場提供驅動盤詞條診斷，並加碼「社長代抽代強化」玄學體檢大會！",
    "highlight": "絕區零失衡爆發軸健檢、新番吃瓜大吐槽、玄學強化滿堂彩！",
    "schedule": [
      {
        "time": "18:30 - 19:15",
        "item": "錄影帶店新番同樂、二創生草短片吐槽大會、享用零食"
      },
      {
        "time": "19:15 - 19:35",
        "item": "版本前瞻新角強度吃瓜評測、式輿防衛戰怪物抗性解析"
      },
      {
        "time": "19:35 - 20:15",
        "item": "驅動盤與帳號健檢（抓出無效詞條、連攜技時機點診斷）"
      },
      {
        "time": "20:15 - 20:30",
        "item": "全場代抽代強化玄學時刻、大合照"
      }
    ],
    "supplies": [
      "投影機、手把、音響設備",
      "零食開箱包與特色汽水",
      "驅動盤 4+2 詞條效益速查圖"
    ],
    "budget": "約 300 ~ 450 元",
    "rules": "1. 社員可自由投屏展示自己的驅動盤極品胚子。\n2. 嚴禁引戰角色強度，保持輕鬆歡樂吃瓜氣氛。",
    "extraNotes": [
      "【附註 1：手速無憂】不論動作遊戲熟練度如何，都能獲得最實用的招架彈刀走位建議。"
    ]
  },
  {
    "id": "act-3d-01",
    "title": "想要什麼自己印！自選遊戲動漫週邊 3D 列印初體驗",
    "subtitle": "零門檻自選模型庫 × 神之眼/小公仔/吊飾 × 免費印製下次領取",
    "category": "原神",
    "categoryKey": "genshin",
    "subType": "手作",
    "subTypeKey": "craft",
    "badgeColor": "#06b6d4",
    "participants": "10 ~ 15 人",
    "duration": "2 小時",
    "location": "電腦教室 / 創客自造實驗室",
    "summary": "帶你認識 3D 列印的魔法！零建模基礎也能輕鬆學會，帶領社員瀏覽 Thingiverse、MakerWorld 等知名免費模型庫，想印原神神之眼、蘭那羅木雕、或是任何動漫遊戲公仔吊飾任你自由挑選。現場實作切片參數，社團免費幫印，下次社課直接領取實體！",
    "highlight": "自選喜愛動漫模型、社團全額補助耗材排程、下週拿到專屬實體周邊！",
    "schedule": [
      {
        "time": "18:30 - 19:00",
        "item": "3D 列印原理科普（FDM 熱熔沉積、PLA 環保線材、避免炒麵翻車）"
      },
      {
        "time": "19:00 - 19:35",
        "item": "模型庫尋寶實作：自選模型 STL 檔，調整縮放比例與支撐結構"
      },
      {
        "time": "19:35 - 20:15",
        "item": "實機示範切片匯出、啟動 3D 列印機噴頭、觀察第一層成型"
      },
      {
        "time": "20:15 - 20:30",
        "item": "登記各社員模型名稱與顏色、排定印製日程清單"
      }
    ],
    "supplies": [
      "FDM 3D 列印機 1~2 台",
      "多色 PLA 環保線材（金、銀、白、夜光藍等）",
      "切片軟體安裝檔 (Bambu Studio / Cura)",
      "範例列印樣品展示箱"
    ],
    "budget": "約 350 ~ 500 元（耗材線材補貼）",
    "rules": "1. 每位社員限挑選 1 款成品模型（體積限制 8x8x8 cm 內、耗材重量 50g 內）。\n2. 嚴禁挑選未授權商用或結構過於脆弱之極細模型。",
    "extraNotes": [
      "【附註 1：自備筆電佳】社員可自備筆電跟著操作切片，未帶者可由幹部公用電腦代為操作。",
      "【附註 2：下週領件】印好之成品將於下次社課發放，並附贈細緻砂紙供現場打磨！"
    ]
  },
  {
    "id": "act-3d-02",
    "title": "自訂專屬模型！桌上實用文具＆角色立體擺件 3D 列印工坊",
    "subtitle": "兼具實用與美觀 × 折紙小鳥筆插/手機架/光錐座 × 3D 打印實作",
    "category": "崩壞：星穹鐵道",
    "categoryKey": "hsr",
    "subType": "手作",
    "subTypeKey": "craft",
    "badgeColor": "#818cf8",
    "participants": "10 ~ 15 人",
    "duration": "2 小時",
    "location": "電腦教室 / 創客自造實驗室",
    "summary": "桌上文具不撞款，想要什麼自己印！精選高實用性模型庫——可插原子筆的立體折紙小鳥造型座、帕姆列車長手機支架、光錐卡牌展示座、或各類動漫理線器任挑。現場教導切片參數調整，下次社課發放成品並附贈斜口鉗與砂紙體驗修整樂趣！",
    "highlight": "兼具美觀與書桌實用性、近距離觀察噴頭成型、打造專屬桌面好物！",
    "schedule": [
      {
        "time": "18:30 - 19:05",
        "item": "實用模型設計解析（壁厚、填充率強度、層高對外觀影響）"
      },
      {
        "time": "19:05 - 19:40",
        "item": "社員搜尋並挑選桌面實用週邊模型，調整自訂尺寸"
      },
      {
        "time": "19:40 - 20:15",
        "item": "檔案傳輸機台、熱床調平校準教學、機台運轉即時監控"
      },
      {
        "time": "20:15 - 20:30",
        "item": "登記列印顏色偏好、下次社課拆支撐與打磨技巧預告"
      }
    ],
    "supplies": [
      "3D 列印機、耗材（晴空藍、經典黃、櫻花粉 PLA）",
      "斜口鉗、美工刀、打磨砂紙組",
      "樣品展示件"
    ],
    "budget": "約 350 ~ 450 元",
    "rules": "1. 模型列印時間預計 2~4 小時/件，社課現場展示首發件，其餘排程後印製。\n2. 下週領取實體後由幹部指導安全拆支撐。",
    "extraNotes": [
      "【附註 1：手殘無憂】切片軟體已預設好新手防翻車參數，人人都能一次成功。"
    ]
  },
  {
    "id": "act-3d-03",
    "title": "動手做專屬周邊！客製化角色公仔＆潮流外殼 3D 打印實戰",
    "subtitle": "專屬刻字客製化 × 邦布/動漫可動關節模型 × 潮流收納小物",
    "category": "絕區零",
    "categoryKey": "zzz",
    "subType": "手作",
    "subTypeKey": "craft",
    "badgeColor": "#f59e0b",
    "participants": "10 ~ 15 人",
    "duration": "2 小時",
    "location": "創客實驗室 / 社團活動室",
    "summary": "化身六分街潮玩工匠！教社員在切片軟體中把自己的英文名字、社團暱稱刻在模型底座上，製作獨一無二的專屬配件。模型可選伊埃斯/鯊魚邦布公仔、指尖陀螺玩具、或客製化耳機收納硬殼，解密卡扣公差與活動關節列印秘訣！",
    "highlight": "模型上雕刻個人專屬暱稱、學習活動關節列印原理、最潮酷桌上小物！",
    "schedule": [
      {
        "time": "18:30 - 19:05",
        "item": "潮玩 3D 模型結構解密（活動鉸鏈、卡扣公差與防拉絲調整）"
      },
      {
        "time": "19:05 - 19:40",
        "item": "切片軟體客製文字教學：在模型底座刻上個人名字/符號"
      },
      {
        "time": "19:40 - 20:15",
        "item": "傳送排程列印、第一層擠出觀察、耗材色彩搭配挑選"
      },
      {
        "time": "20:15 - 20:30",
        "item": "收件確認、交流心得與下次社課領取說明"
      }
    ],
    "supplies": [
      "3D 列印機、多色線材（黑白灰潮黑酷色調 PLA）",
      "刻字教學範例檔案",
      "防燙工具與刮刀"
    ],
    "budget": "約 350 ~ 480 元",
    "rules": "1. 刻字長度建議 2~8 個英數字，以確保列印字體清晰。\n2. 尊重原創設計，客製檔案僅供社團學習使用。",
    "extraNotes": [
      "【附註 1：質感拉滿】下次社課領件時加碼提供微量壓克力顏料進行眼睛點睛上色。"
    ]
  },
  {
    "id": "act-game-01",
    "title": "合體神操作！「鍵鼠分離雙人同心」BOSS 挑戰賽",
    "subtitle": "一人鍵盤一人滑鼠 × 極限走位與瞄準分離 × 雙人同心討伐戰",
    "category": "原神",
    "categoryKey": "genshin",
    "subType": "競技",
    "subTypeKey": "score",
    "badgeColor": "#06b6d4",
    "participants": "12 ~ 16 人 (兩人一組自由組隊)",
    "duration": "2 小時",
    "location": "多媒體教室 / 電腦教室",
    "summary": "考驗神級默契與爆笑配合！兩人一組操作同一台電腦，隊員 A 只能按鍵盤（負責移動走位 WASD 與釋放技能 QE），隊員 B 只能按滑鼠（負責滑鼠視角轉向、普攻連點與右鍵閃避），嚴禁肢體接觸！挑戰討伐大世界指定週本 BOSS，比拼擊殺速度與團滅次數！",
    "highlight": "「你快閃避啊！」「你沒轉視角我怎麼看得到！」生草爆笑默契考驗、贏取米遊盲盒！",
    "schedule": [
      {
        "time": "18:30 - 18:50",
        "item": "分組抽籤搭檔、宣布比賽規則與禁用作弊項目"
      },
      {
        "time": "18:50 - 19:10",
        "item": "熱身練習：雙人合體在 1 分鐘內打擊木樁或清理小怪"
      },
      {
        "time": "19:10 - 20:00",
        "item": "正式淘汰賽：鍵鼠分離討伐若陀龍王 / 無相系列 BOSS"
      },
      {
        "time": "20:00 - 20:15",
        "item": "巔峰總決賽：前兩強極速通關爭奪戰（大螢幕現場解說轉播）"
      },
      {
        "time": "20:15 - 20:30",
        "item": "頒發「最佳默契獎」與「最快團滅搞笑獎」"
      }
    ],
    "supplies": [
      "比賽用主機 2~4 台（或社員筆電）",
      "獨立鍵盤與滑鼠各 4 套",
      "大螢幕投影同屏轉播器",
      "官方角色壓克力立牌 / 實體盲盒獎品"
    ],
    "budget": "約 400 ~ 550 元（盲盒獎品與零食）",
    "rules": "1. 操作鍵盤者嚴禁觸碰滑鼠，操作滑鼠者嚴禁觸碰鍵盤，違者每次罰加時 15 秒。\n2. 禁止使用巨集腳本或外部改鍵軟體。\n3. 比賽以總用時（含團滅懲罰時間）由少到多排序。",
    "extraNotes": [
      "【附註 1：笑果拉滿】最考驗溝通與默契，圍觀群眾歡笑聲不斷，破冰首選企劃！"
    ]
  },
  {
    "id": "act-game-02",
    "title": "盲打聲控指揮官！「一人蒙眼一人語音導航」生存挑戰",
    "subtitle": "戴眼罩盲打極限操作 × 指揮官喉嚨叫破聲控 × 考驗絕對信任",
    "category": "絕區零",
    "categoryKey": "zzz",
    "subType": "競技",
    "subTypeKey": "score",
    "badgeColor": "#f59e0b",
    "participants": "12 ~ 16 人 (兩人一組)",
    "duration": "2 小時",
    "location": "社團活動室",
    "summary": "把命運交給隊友！操作者戴上全遮光眼罩完全看不見螢幕，手握手把或鍵鼠；隊友化身「戰場指揮官」，只能用口頭語音下達導航與戰鬥指令（例如：「向左翻滾！」「現在招架彈刀！」「開大招！」）。挑戰避開機關陷阱並擊敗精英怪，堅持最久者獲勝！",
    "highlight": "指揮官聲嘶力竭咆哮導航、操作者盲人摸象極限閃避、信任度大考驗！",
    "schedule": [
      {
        "time": "18:30 - 18:50",
        "item": "規則講解、分發遮光眼罩、指令術語協調制定"
      },
      {
        "time": "18:50 - 19:15",
        "item": "第一輪【盲人走迷宮】：聲控避開燃燒地板與障礙物"
      },
      {
        "time": "19:15 - 20:00",
        "item": "第二輪【聲控獵殺】：盲打挑戰低難度怪物，比拼存活秒數"
      },
      {
        "time": "20:00 - 20:15",
        "item": "決賽【盲打雙人擂台】：堅持最久前三名爭霸"
      },
      {
        "time": "20:15 - 20:30",
        "item": "頒發「最佳聲控領航獎」與「耳背默契獎」"
      }
    ],
    "supplies": [
      "全新衛生遮光眼罩 6~8 副",
      "遊戲手把與鍵鼠設備",
      "計時碼錶與大螢幕投屏",
      "米遊正版角色徽章全套獎品"
    ],
    "budget": "約 350 ~ 450 元",
    "rules": "1. 操作者嚴禁偷看，眼罩移位視同違規。\n2. 指揮官嚴禁碰觸操作者之雙手或設備，只能透過說話引導。",
    "extraNotes": [
      "【附註 1：安全第一】現場保持走道平整，操作全程在座椅上進行。"
    ]
  },
  {
    "id": "act-game-03",
    "title": "混亂雙人鐵人接力賽：「鍵鼠分離 × 蒙眼指揮」默契大考驗",
    "subtitle": "合體操作 ＋ 蒙眼聲控 ＋ 禁忌詞懲罰 × 雙人三項鐵人闖關賽",
    "category": "崩壞：星穹鐵道",
    "categoryKey": "hsr",
    "subType": "競技",
    "subTypeKey": "score",
    "badgeColor": "#818cf8",
    "participants": "12 ~ 16 人 (2~3 人一隊)",
    "duration": "2 小時",
    "location": "多媒體教室",
    "summary": "闖關元素集大成！每隊兩人合體闖過三道高能關卡：第一棒「一人鍵盤一人滑鼠」極速清理營地；第二棒「一人蒙眼一人聲控」完成閃避與探索；第三棒挑戰特定副本時「全隊禁止說出指定字詞（如『大招』『快點』），說錯一次罰暫停 5 秒！累積積分最高隊伍榮登鐵人總冠軍！",
    "highlight": "三段式多樣趣味接力、全員輪流上陣無冷場、冠亞軍贏取空月祝福/月卡！",
    "schedule": [
      {
        "time": "18:30 - 18:45",
        "item": "各隊抽籤點名、公布三關接力規則與禁忌詞清單"
      },
      {
        "time": "18:45 - 19:25",
        "item": "預賽第一棒【鍵鼠分離競速】＆ 第二棒【蒙眼聲控防禦】"
      },
      {
        "time": "19:25 - 20:05",
        "item": "複賽第三棒【禁忌指令極限通關】（罰秒扣分制）"
      },
      {
        "time": "20:05 - 20:20",
        "item": "總積分結算、各關亮點重播剪輯"
      },
      {
        "time": "20:20 - 20:30",
        "item": "頒發「默契鐵人冠軍隊」月卡大獎與全體紀念票根"
      }
    ],
    "supplies": [
      "計時器、眼罩、鍵鼠設備",
      "禁忌詞號碼牌與犯規鈴",
      "冠軍獎品（現場自選空月祝福 / 小月卡或實體周邊）",
      "社團特製雷射紀念票根"
    ],
    "budget": "約 450 ~ 600 元",
    "rules": "1. 每隊隊員必須輪流擔任操作者與指揮官，不得由同一人獨攬。\n2. 禁忌詞由裁判在場邊隨機監控鳴鈴。",
    "extraNotes": [
      "【附註 1：熱度最高】結合所有有趣機制的總決賽玩法，適合社課期中高潮舉辦！"
    ]
  },
  {
    "id": "act-ai-01",
    "title": "網頁應用 AI 生成教學：打造社博網站 ＆ 提示詞融合大亂鬥",
    "subtitle": "製作社博網站與自製 App × 零門檻部署上傳 × 全員 Prompt 融合實戰",
    "category": "米哈遊社團 / 跨界 AI",
    "categoryKey": "all",
    "subType": "手作",
    "subTypeKey": "craft",
    "badgeColor": "#a855f7",
    "participants": "全體社員 (自備手機、平板或筆電)",
    "duration": "2 小時",
    "location": "電腦教室 / 多媒體社課活動室",
    "summary": "人人都能用 AI 寫出專屬 App！解密社團博覽會展示網站與米遊企劃書系統的誕生過程，帶領社員用日常自然語言（Prompt）生成互動網頁與個人應用，並教學如何免費部署上傳至 GitHub Pages。活動最高潮為「提示詞大亂鬥」——每人匿名寫下天馬行空的對話提示詞，現場融合所有社員的提示詞餵給 AI，見證會生成出什麼超展開的生草或驚艷成果！",
    "highlight": "解密社博網站幕後製作、零程式碼自製專屬 App、全員 Prompt 融合大合體現場實測！",
    "schedule": [
      {
        "time": "18:30 - 18:50",
        "item": "幕後大公開：社團博覽會網站與米遊企劃系統的架構介紹與成果展示"
      },
      {
        "time": "18:50 - 19:25",
        "item": "AI 網頁生成實戰：如何向 AI 下精準指令，生成卡片、彈窗、抽卡動畫等互動功能"
      },
      {
        "time": "19:25 - 19:45",
        "item": "免費上傳發布教學：介紹 GitHub / Vercel 零成本部署法，把作品變成正式網址"
      },
      {
        "time": "19:45 - 20:15",
        "item": "活動看點【提示詞大亂鬥】：全員撰寫自訂 Prompt，現場融合大合體餵給 AI 即時跑出成果"
      },
      {
        "time": "20:15 - 20:30",
        "item": "生成成果現場大螢幕品評與歡樂吐槽、儲存個人作品、交流合照"
      }
    ],
    "supplies": [
      "大螢幕投影機與同屏設備",
      "主流 AI 生成工具示範環境 (Claude / ChatGPT / Gemini 等)",
      "提示詞融合線上表單 (Google 表單或 Slido)",
      "GitHub 免費上傳部署流程懶人包講義"
    ],
    "budget": "約 200 ~ 300 元（講義印製、現場茶水零食補貼）",
    "rules": "1. 提示詞大亂鬥請盡情發揮想像力，但嚴禁輸入違規或攻擊性文字。\n2. 建議攜帶個人筆電操作體驗最佳，亦可使用手機瀏覽器直接參與互動。",
    "extraNotes": [
      "【附註 1：零程式門檻】完全不需要寫過任何一行程式碼，只要會用中文聊天就能做出完整網頁！",
      "【附註 2：成果立即可用】當天課堂生成的個人 App 或個人作品，可直接生成網址分享到社群限動！"
    ]
  }
];

let activitiesData = FALLBACK_ACTIVITIES;
window.activitiesData = activitiesData;

// ==========================================================================
// 社團小獎品清單與心願管理系統 (優化指標 8)
// ==========================================================================
const PRIZE_CANDIDATES = [
  {
    id: "prize-acrylic",
    name: "官方授權角色壓克力立牌",
    desc: "高透光雙面夾層印刷，精緻原神/星鐵/絕區零角色桌面擺件",
    icon: "🌟"
  },
  {
    id: "prize-badge",
    name: "米遊官方正版盲盒徽章 / 角色吧唧",
    desc: "馬口鐵雙閃亮膜，全套角色盲抽驚喜體驗",
    icon: "🎖️"
  },
  {
    id: "prize-ticket",
    name: "社團專屬特製雷射紀念票根",
    desc: "燙金工藝＋雷射炫彩流水號，附硬質透明收藏卡夾",
    icon: "🎫"
  },
  {
    id: "prize-keychain",
    name: "萌系邦布 / 派蒙毛絨立體鑰匙圈",
    desc: "柔軟親膚絨毛掛件，書包與鑰匙百搭配件",
    icon: "🧸"
  },
  {
    id: "prize-postcards",
    name: "提瓦特 ＆ 星穹鐵道典藏明信片 5 入組",
    desc: "珠光特種紙全彩印製，典藏遊戲名場面與同人賀圖",
    icon: "🖼️"
  },
  {
    id: "prize-stickers",
    name: "米哈遊角色潮流防水塗鴉貼紙大禮包",
    desc: "耐磨防水 PVC 貼紙 50 張，筆電、安全帽與滑板隨心貼",
    icon: "🏷️"
  }
];

let selectedPrizeIds = new Set();

function openPrizeModal() {
  const modal = document.getElementById('prizeModalBackdrop');
  if (!modal) return;
  renderPrizeOptionsList();
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePrizeModal() {
  const modal = document.getElementById('prizeModalBackdrop');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
  updatePrizeBadge();
}

function togglePrizeSelection(prizeId) {
  if (selectedPrizeIds.has(prizeId)) {
    selectedPrizeIds.delete(prizeId);
  } else {
    if (selectedPrizeIds.size >= 2) {
      showToast('小獎品心願最多勾選 2 項唷！🎁');
      return;
    }
    selectedPrizeIds.add(prizeId);
  }
  try {
    localStorage.setItem('mihoyo_selected_prizes', JSON.stringify(Array.from(selectedPrizeIds)));
  } catch (e) {}
  renderPrizeOptionsList();
  updatePrizeBadge();
}

function updatePrizeBadge() {
  const badge = document.getElementById('selectedPrizeCountBadge');
  if (badge) {
    const count = selectedPrizeIds.size;
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-block' : 'none';
  }
}

function renderPrizeOptionsList() {
  const container = document.getElementById('prizeOptionsList');
  const summaryText = document.getElementById('prizeSelectedSummaryText');
  if (summaryText) {
    summaryText.textContent = `${selectedPrizeIds.size} 項 / 最多 2 項`;
  }
  if (!container) return;

  container.innerHTML = PRIZE_CANDIDATES.map(p => {
    const isChecked = selectedPrizeIds.has(p.id);
    return `
      <div class="prize-item-card ${isChecked ? 'is-selected' : ''}" onclick="togglePrizeSelection('${p.id}')">
        <div class="prize-item-left">
          <div class="prize-item-icon">${p.icon}</div>
          <div class="prize-item-info">
            <div class="prize-item-title">${p.name}</div>
            <div class="prize-item-desc">${p.desc}</div>
          </div>
        </div>
        <div class="prize-checkbox-wrap">
          ${isChecked ? '✓' : ''}
        </div>
      </div>
    `;
  }).join('');
}

let currentCategory = 'all'; // all, hsr, genshin, zzz, favorites, stats
let currentSubType = 'all';   // all, casual, score, craft
let searchQuery = '';

// 當前彈窗瀏覽的上下文池 (Context Pool) 與活動 ID
let currentModalContextPool = [];
let currentModalActId = null;

// ==========================================================================
// 1. 本機資料持久化 (LocalStorage State Engine)
// ==========================================================================
const STORAGE_KEYS = {
  FAVORITES: 'mihoyo_fav_activities',
  SELECTED: 'mihoyo_selected_activities',
  CATEGORY: 'mihoyo_current_category',
  SUBTYPE: 'mihoyo_current_subtype',
  SEARCH: 'mihoyo_search_query',
  STATUSES: 'mihoyo_activity_statuses',
  NOTES: 'mihoyo_activity_notes',
  GACHA_HISTORY: 'mihoyo_gacha_history',
  USER_NICKNAME: 'mihoyo_user_nickname',
  USER_INTERESTS: 'mihoyo_user_interests',
  USER_SPECIALTIES: 'mihoyo_user_specialties',
  USER_EXPECTATION: 'mihoyo_user_expectation',
  DEVICE_ID: 'mihoyo_club_device_id',
  MY_SUBMISSION: 'mihoyo_my_cloud_submission',
  CLOUD_API_URL: 'mihoyo_cloud_api_url',
  MEMBER_VOTES: 'mihoyo_member_votes'
};

let favoriteIds = new Set();
let favoritesSessionPool = new Set();
let favoritesUnmarkedList = [];
let selectedActivityIds = new Set();
let activityStatuses = {}; // { [actId]: 'none' | 'wish' | 'planned' | 'completed' }
let activityNotes = {};    // { [actId]: string }
let gachaHistory = [];     // Array of { id, title, time, category }
let memberVotes = [];      // Array of { id, name, time, selectedIds: [] }

// 預設示範投票資料 (阿鐵、悠悠、奇奇)
const DEMO_VOTES = [
  {
    id: "demo-vote-1",
    name: "阿鐵",
    time: "10/10 14:20",
    interests: ["動漫新番", "星鐵高難", "3D列印", "模型改裝"],
    specialties: "3D列印機操作與切片軟體、星鐵排軸計算",
    expectation: "希望能認識更多崩鐵同好，學會用社團的 3D 列印機印出自己本命角色的專屬光錐與週邊！",
    selectedIds: ["act-anime-02", "act-3d-01", "act-game-03"]
  },
  {
    id: "demo-vote-2",
    name: "悠悠",
    time: "10/10 15:45",
    interests: ["原神深淵", "二創繪圖", "Cosplay", "動漫新番"],
    specialties: "角色二創插畫、文案企劃、日文日常會話",
    expectation: "最期待新番同樂會跟帳號健檢！每次深淵都卡 11 層，想讓社長幫忙看看聖遺物怎麼配，也想跟社友交流繪畫！",
    selectedIds: ["act-anime-01", "act-game-01", "act-ai-01"]
  },
  {
    id: "demo-vote-3",
    name: "奇奇",
    time: "10/10 16:10",
    interests: ["絕區零動作", "AI詠唱", "影片剪輯", "競技闖關"],
    specialties: "Shorts 短影音剪輯、AI 提示詞工程、節奏格鬥手操",
    expectation: "超想玩一人鍵盤一人滑鼠的雙人挑戰！還有 AI 提示詞大亂鬥，想看看大家 Prompt 融合後會生出什麼超展開的畫面！",
    selectedIds: ["act-anime-03", "act-game-02", "act-ai-01"]
  }
];

// 載入所有本機儲存紀錄
function loadStoredState() {
  try {
    const savedFavs = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (savedFavs) favoriteIds = new Set(JSON.parse(savedFavs));

    const savedSelected = localStorage.getItem(STORAGE_KEYS.SELECTED);
    if (savedSelected) selectedActivityIds = new Set(JSON.parse(savedSelected));
    if (selectedActivityIds.size === 0 && favoriteIds.size > 0) {
      selectedActivityIds = new Set(favoriteIds);
    }

    const savedStatuses = localStorage.getItem(STORAGE_KEYS.STATUSES);
    if (savedStatuses) activityStatuses = JSON.parse(savedStatuses);

    const savedNotes = localStorage.getItem(STORAGE_KEYS.NOTES);
    if (savedNotes) activityNotes = JSON.parse(savedNotes);

    const savedGacha = localStorage.getItem(STORAGE_KEYS.GACHA_HISTORY);
    if (savedGacha) gachaHistory = JSON.parse(savedGacha);

    const savedVotes = localStorage.getItem(STORAGE_KEYS.MEMBER_VOTES);
    if (savedVotes) {
      try {
        const parsed = JSON.parse(savedVotes);
        memberVotes = Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        memberVotes = [];
      }
    } else {
      memberVotes = [];
    }
    window.memberVotes = memberVotes;

    const savedPrizes = localStorage.getItem('mihoyo_selected_prizes');
    if (savedPrizes) {
      try {
        const arr = JSON.parse(savedPrizes);
        selectedPrizeIds = new Set(Array.isArray(arr) ? arr : []);
      } catch (e) {
        selectedPrizeIds = new Set();
      }
    }
    updatePrizeBadge();

    const savedCat = localStorage.getItem(STORAGE_KEYS.CATEGORY);
    if (savedCat && savedCat !== 'stats') currentCategory = savedCat;
    else currentCategory = 'all';

    const savedSub = localStorage.getItem(STORAGE_KEYS.SUBTYPE);
    if (savedSub) currentSubType = savedSub;

    const savedSearch = localStorage.getItem(STORAGE_KEYS.SEARCH);
    if (savedSearch) searchQuery = savedSearch;

    const savedName = localStorage.getItem(STORAGE_KEYS.USER_NICKNAME);
    const nicknameInput = document.getElementById('shareUserNickname');
    if (nicknameInput && savedName) nicknameInput.value = savedName;

    updateVoteBadges();
    console.log('✅ 本機紀錄成功復原：狀態、勾選與統計已同步！');
  } catch (e) {
    console.warn('讀取本機紀錄失敗，使用預設值：', e);
  }
}

// 儲存篩選狀態
function saveFilterState() {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORY, currentCategory);
    localStorage.setItem(STORAGE_KEYS.SUBTYPE, currentSubType);
    localStorage.setItem(STORAGE_KEYS.SEARCH, searchQuery);
  } catch (e) {
    console.warn('儲存篩選狀態失敗：', e);
  }
}

// 儲存喜好清單
function saveFavorites() {
  try {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(Array.from(favoriteIds)));
  } catch (e) {
    console.warn('儲存喜好失敗：', e);
  }
  updateHeaderBadges();
  updateSubTypeBadges();
}

// 儲存勾選活動
function saveSelectedActivities() {
  try {
    localStorage.setItem(STORAGE_KEYS.SELECTED, JSON.stringify(Array.from(selectedActivityIds)));
  } catch (e) {
    console.warn('儲存勾選清單失敗：', e);
  }
  updateSelectedCountBadge();
}

// 儲存社員投票清單
function saveMemberVotes() {
  try {
    localStorage.setItem(STORAGE_KEYS.MEMBER_VOTES, JSON.stringify(memberVotes));
  } catch (e) {
    console.warn('儲存投票失敗：', e);
  }
  window.memberVotes = memberVotes;
  updateVoteBadges();
}

// 更新已選取計數器
function updateSelectedCountBadge() {
  const count = selectedActivityIds.size;
  const badge = document.getElementById('selectedCountBadge');
  if (badge) badge.textContent = count;
  const shareBadge = document.getElementById('shareSelectedCount');
  if (shareBadge) shareBadge.textContent = count;
}

// 更新統計頁投票人數徽章與分享彈窗紀錄
function updateVoteBadges() {
  const badge = document.getElementById('statsTabVotesCount');
  if (badge) {
    badge.textContent = `${memberVotes.length}人`;
    badge.style.display = 'none'; // 依使用者需求，切換按鈕維持純圓形圖標，不顯示人數計數
  }
  const modalBadge = document.getElementById('modalMemberVotesCount');
  if (modalBadge) {
    modalBadge.textContent = memberVotes.length;
  }
  renderShareModalMemberList();
}

// 渲染分享彈窗內的已匯入社員清單
function renderShareModalMemberList() {
  const listEl = document.getElementById('modalMemberVotesList');
  if (!listEl) return;
  if (memberVotes.length === 0) {
    listEl.innerHTML = `<span style="color: #94a3b8; font-size: 0.8rem; padding: 6px 0;">尚無已匯入的社員紀錄。</span>`;
    return;
  }
  listEl.innerHTML = memberVotes.map(v => `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 7px 12px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; font-size: 0.82rem;">
      <div>
        <strong style="color: #f1f5f9;">👤 ${v.name}</strong>
        <span style="color: #38bdf8; font-size: 0.76rem; margin-left: 8px; font-weight: 600;">(投了 ${v.selectedIds ? v.selectedIds.length : 0} 項)</span>
      </div>
      <button onclick="deleteMemberVote('${v.id}')" style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.35); color: #fca5a5; cursor: pointer; font-size: 0.75rem; padding: 3px 8px; border-radius: 4px;" title="刪除此紀錄">
        ✕ 刪除
      </button>
    </div>
  `).join('');
}

// 勾選/取消勾選活動
function toggleSelectActivity(id, isChecked) {
  if (isChecked) {
    selectedActivityIds.add(id);
  } else {
    selectedActivityIds.delete(id);
  }
  saveSelectedActivities();

  // 更新卡片外觀
  const card = document.getElementById(`card-${id}`);
  if (card) {
    const label = card.querySelector('.card-select-label');
    if (label) {
      label.classList.toggle('checked', isChecked);
      const span = label.querySelector('span');
      if (span) span.textContent = isChecked ? '已選取' : '選取';
    }
  }
  updateSharePreviewList();
}

// 勾選當前顯示的所有活動
function selectAllVisibleActivities() {
  const filtered = getFilteredActivities();
  filtered.forEach(act => selectedActivityIds.add(act.id));
  saveSelectedActivities();
  renderCards();
  showToast(`已勾選當前顯示的 ${filtered.length} 項活動！☑️`);
}

// 清除所有勾選
function clearAllSelectedActivities() {
  selectedActivityIds.clear();
  saveSelectedActivities();
  renderCards();
  showToast('已清空所有勾選項目 ❌');
}

// 儲存活動狀態 (未安排 / 想參加 / 籌備中 / 已舉辦)
function setActivityStatus(actId, status) {
  if (!status || status === 'none') {
    delete activityStatuses[actId];
  } else {
    activityStatuses[actId] = status;
  }
  try {
    localStorage.setItem(STORAGE_KEYS.STATUSES, JSON.stringify(activityStatuses));
  } catch (e) {
    console.warn('儲存活動狀態失敗：', e);
  }
  
  renderCards();
  updateModalStatusControls(actId);
  
  const statusLabels = {
    'wish': '🟣 已標記：想參加 🙋',
    'planned': '🟡 已標記：籌備中 📝',
    'completed': '🟢 已標記：已舉辦 ✅',
    'none': '⚪ 已重設活動進度狀態'
  };
  showToast(statusLabels[status] || '狀態已更新！');
}

// 儲存活動私房筆記
function saveActivityNote(actId, noteText) {
  const trimmed = noteText.trim();
  if (trimmed) {
    activityNotes[actId] = trimmed;
  } else {
    delete activityNotes[actId];
  }
  try {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(activityNotes));
  } catch (e) {
    console.warn('儲存筆記失敗：', e);
  }
  
  const card = document.getElementById(`card-${actId}`);
  if (card) {
    let noteBadge = card.querySelector('.badge-note-tag');
    if (trimmed) {
      if (!noteBadge) {
        const badgesLeft = card.querySelector('.card-badges-left');
        if (badgesLeft) {
          noteBadge = document.createElement('span');
          noteBadge.className = 'badge-note-tag';
          noteBadge.title = '有自訂幹部備忘筆記';
          noteBadge.innerHTML = '📝 備忘';
          badgesLeft.appendChild(noteBadge);
        }
      }
    } else {
      if (noteBadge) noteBadge.remove();
    }
  }
}

// 重設所有篩選與搜尋
function resetAllFilters() {
  currentCategory = 'all';
  currentSubType = 'all';
  searchQuery = '';
  
  saveFilterState();
  
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.category === 'all');
  });
  document.querySelectorAll('.sub-pill-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.subtype === 'all');
  });
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';
  
  handleCategoryTabSwitch('all');
  updateSubTypeBadges();
  renderCards();
  showToast('已還原為全部篩選條件 🔄');
}

// 初始化入口
document.addEventListener('DOMContentLoaded', async () => {
  loadStoredState();
  await loadActivitiesData();
  restoreSavedUIState();
  setupEventListeners();
  updateHeaderBadges();
  updateSubTypeBadges();
  updateSelectedCountBadge();
  updateVoteBadges();
  
  if (currentCategory === 'stats') {
    handleCategoryTabSwitch('stats');
  } else {
    renderCards();
  }
});

// 恢復儲存的按鈕與輸入框狀態
function restoreSavedUIState() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === currentCategory);
  });

  const subPillBtns = document.querySelectorAll('.sub-pill-btn');
  subPillBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.subtype === currentSubType);
  });

  const searchInput = document.getElementById('searchInput');
  if (searchInput && searchQuery) {
    searchInput.value = searchQuery;
  }
}

// 切換特定企劃的喜好狀態
function toggleFavorite(id) {
  const act = activitiesData.find(a => a.id === id);
  const title = act ? act.title : id;

  if (favoriteIds.has(id)) {
    favoriteIds.delete(id);
    showToast(`已從喜好清單移除「${title}」💔`);
  } else {
    favoriteIds.add(id);
    showToast(`已將「${title}」加入喜好清單 ❤️`);
  }

  saveFavorites();

  if (currentCategory === 'favorites') {
    renderCards();
  } else {
    const btns = document.querySelectorAll(`.btn-favorite[data-id="${id}"]`);
    const isFav = favoriteIds.has(id);
    btns.forEach(btn => {
      if (isFav) {
        btn.classList.add('active');
        btn.querySelector('.fav-icon').textContent = '❤️';
        btn.title = '取消喜好';
      } else {
        btn.classList.remove('active');
        btn.querySelector('.fav-icon').textContent = '🤍';
        btn.title = '標註喜好';
      }
    });
  }

  updateModalFavBtn(id);
}

// 更新頂部喜好計數徽章
function updateHeaderBadges() {
  const count = favoriteIds.size;
  const favCountBadge = document.getElementById('favCountBadge');
  const favTabCount = document.getElementById('favTabCount');

  if (favCountBadge) favCountBadge.textContent = `${count} 份`;
  if (favTabCount) favTabCount.textContent = count;

  const totalCount = document.getElementById('totalCount');
  if (totalCount && activitiesData.length > 0) {
    totalCount.textContent = `${activitiesData.length} 份完整企劃`;
  }
}

// 載入 JSON 資料（具備 fallback 機制）
async function loadActivitiesData() {
  try {
    const res = await fetch('./activities.json?t=' + Date.now());
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    activitiesData = await res.json();
    window.activitiesData = activitiesData;
    console.log(`成功由 activities.json 載入 ${activitiesData.length} 份活動企劃！`);
  } catch (err) {
    console.warn('由 activities.json 載入失敗，啟用內建完整備用資料庫：', err);
    activitiesData = FALLBACK_ACTIVITIES;
    window.activitiesData = activitiesData;
  }
}

// 處理大分類切換 (包含統計專題分頁)
function handleCategoryTabSwitch(cat) {
  currentCategory = cat;
  saveFilterState();

  const cardsContainer = document.getElementById('cardsContainer');
  const statsContainer = document.getElementById('statsContainer');
  const mainFilterRow = document.getElementById('mainFilterRow');
  const subFilterRow = document.getElementById('subFilterRow');
  const toolbarBottom = document.getElementById('toolbarBottom');
  const panelFilterZone = document.getElementById('panelFilterZone');
  const panelMemberZone = document.getElementById('panelMemberZone');
  const btnMemberStatsToggle = document.getElementById('btnMemberStatsToggle');
  const systemMainTitle = document.getElementById('systemMainTitle') || document.querySelector('.system-intro-title h2');

  const btnHeaderBackToLibrary = document.getElementById('btnHeaderBackToLibrary');
  const btnHeaderImportCode = document.getElementById('btnHeaderImportCode');
  const btnOpenPrizeModal = document.getElementById('btnOpenPrizeModal');
  const memberQuickFilterRow = document.getElementById('memberQuickFilterRow');

  if (cat === 'stats') {
    if (systemMainTitle) systemMainTitle.textContent = '社員票選統計圖表';
    if (cardsContainer) cardsContainer.style.display = 'none';
    if (panelFilterZone) panelFilterZone.style.display = 'none';
    if (mainFilterRow) mainFilterRow.style.display = 'none';
    if (subFilterRow) subFilterRow.style.display = 'none';
    if (toolbarBottom) toolbarBottom.style.display = 'none';
    if (panelMemberZone) panelMemberZone.style.display = 'block';
    if (memberQuickFilterRow) {
      memberQuickFilterRow.style.display = memberVotes.length > 0 ? 'flex' : 'none';
    }
    if (btnMemberStatsToggle) {
      btnMemberStatsToggle.classList.add('active');
      btnMemberStatsToggle.title = '返回活動企劃書庫';
    }
    if (btnHeaderBackToLibrary) btnHeaderBackToLibrary.style.display = 'inline-flex';
    if (btnHeaderImportCode) btnHeaderImportCode.style.display = 'inline-flex';
    if (btnOpenPrizeModal) btnOpenPrizeModal.style.display = 'none';

    if (statsContainer) {
      statsContainer.style.display = 'flex';
      renderStatsView();
    }
  } else {
    if (systemMainTitle) systemMainTitle.textContent = '米哈遊社團活動企劃庫';
    if (cardsContainer) cardsContainer.style.display = 'grid';
    if (panelFilterZone) panelFilterZone.style.display = 'block';
    if (mainFilterRow) mainFilterRow.style.display = 'flex';
    if (subFilterRow) subFilterRow.style.display = 'flex';
    if (toolbarBottom) toolbarBottom.style.display = 'flex';
    if (panelMemberZone) panelMemberZone.style.display = 'none';
    if (memberQuickFilterRow) memberQuickFilterRow.style.display = 'none';
    if (btnMemberStatsToggle) {
      btnMemberStatsToggle.classList.remove('active');
      btnMemberStatsToggle.title = '切換至社員投票統計圖表';
    }
    if (btnHeaderBackToLibrary) btnHeaderBackToLibrary.style.display = 'none';
    if (btnHeaderImportCode) btnHeaderImportCode.style.display = 'none';
    if (btnOpenPrizeModal) btnOpenPrizeModal.style.display = 'inline-flex';

    if (statsContainer) statsContainer.style.display = 'none';
    
    // 同步活動大分類按鈕 active 樣式
    document.querySelectorAll('.filter-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.category === cat);
    });

    updateSubTypeBadges();
    renderCards();
  }
}

// 事件監聽設定
function setupEventListeners() {
  // 0. 導航列 Logo 回到首頁
  const navBrandHome = document.getElementById('navBrandHome');
  if (navBrandHome) {
    navBrandHome.addEventListener('click', () => {
      handleCategoryTabSwitch('all');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 0.1 依需求移除深淺切換功能，重設並鎖定為標準主題
  document.documentElement.removeAttribute('data-theme');
  try { localStorage.removeItem('mihoyo_theme'); } catch (e) {}

  // 1. 第一層：大分類標籤切換 (全部 / 星鐵 / 原神 / 絕區零 / 喜好)
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      handleCategoryTabSwitch(btn.dataset.category);
    });
  });

  // 2. 第二層：活動性質小標籤 (全部 / 休閒 / 競技 / 手作)
  const subPillBtns = document.querySelectorAll('.sub-pill-btn');
  subPillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      subPillBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSubType = btn.dataset.subtype;
      saveFilterState();
      renderCards();
    });
  });

  // 3. 搜尋框、清空按鈕與熱門關鍵字提示標籤
  const searchInput = document.getElementById('searchInput');
  const btnSearchClear = document.getElementById('btnSearchClear');
  const searchSuggestionsDropdown = document.getElementById('searchSuggestionsDropdown');
  const suggestionChips = document.querySelectorAll('.suggestion-chip');

  if (searchInput) {
    const handleSearchInput = () => {
      searchQuery = searchInput.value.trim().toLowerCase();
      if (btnSearchClear) {
        btnSearchClear.style.display = searchInput.value ? 'inline-flex' : 'none';
      }
      saveFilterState();
      renderCards();
    };

    searchInput.addEventListener('input', handleSearchInput);

    if (searchSuggestionsDropdown) {
      searchInput.addEventListener('focus', () => {
        searchSuggestionsDropdown.classList.add('show');
      });
      document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchSuggestionsDropdown.contains(e.target)) {
          searchSuggestionsDropdown.classList.remove('show');
        }
      });
    }

    if (btnSearchClear) {
      btnSearchClear.addEventListener('click', () => {
        searchInput.value = '';
        btnSearchClear.style.display = 'none';
        handleSearchInput();
        searchInput.focus();
      });
    }

    suggestionChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const kw = chip.dataset.keyword || chip.textContent.trim();
        searchInput.value = kw;
        if (btnSearchClear) btnSearchClear.style.display = 'inline-flex';
        if (searchSuggestionsDropdown) searchSuggestionsDropdown.classList.remove('show');
        handleSearchInput();
      });
    });
  }

  // 4. 卡片展開 / 收起切換 (極簡模式切換)
  const btnToggleCollapse = document.getElementById('btnToggleCollapse');
  const toggleCollapseText = document.getElementById('toggleCollapseText');
  const toggleCollapseIcon = document.getElementById('toggleCollapseIcon');
  const cardsContainer = document.getElementById('cardsContainer');

  function setCardsCollapseState(isCollapsed) {
    if (!cardsContainer || !btnToggleCollapse) return;
    if (isCollapsed) {
      cardsContainer.classList.add('cards-collapsed');
      btnToggleCollapse.classList.add('active');
      if (toggleCollapseText) toggleCollapseText.textContent = '收起';
      if (toggleCollapseIcon) {
        toggleCollapseIcon.innerHTML = `
          <polyline points="17 11 12 6 7 11"></polyline>
          <polyline points="17 18 12 13 7 18"></polyline>
        `;
      }
      btnToggleCollapse.title = '目前為收起樣式，點擊切換為展開';
    } else {
      cardsContainer.classList.remove('cards-collapsed');
      btnToggleCollapse.classList.remove('active');
      if (toggleCollapseText) toggleCollapseText.textContent = '展開';
      if (toggleCollapseIcon) {
        toggleCollapseIcon.innerHTML = `
          <polyline points="7 13 12 18 17 13"></polyline>
          <polyline points="7 6 12 11 17 6"></polyline>
        `;
      }
      btnToggleCollapse.title = '目前為展開樣式，點擊切換為收起';
    }
  }

  if (btnToggleCollapse && cardsContainer) {
    btnToggleCollapse.addEventListener('click', () => {
      const isCurrentlyCollapsed = cardsContainer.classList.contains('cards-collapsed');
      const nextCollapsed = !isCurrentlyCollapsed;
      setCardsCollapseState(nextCollapsed);
      try {
        localStorage.setItem('mihoyo_cards_collapsed', nextCollapsed ? '1' : '0');
      } catch (err) {}
    });

    const savedCollapse = localStorage.getItem('mihoyo_cards_collapsed');
    if (savedCollapse !== null) {
      setCardsCollapseState(savedCollapse === '1');
    }
  }

  // 手風琴全局展開/收起 & 全選
  const btnExpandAll = document.getElementById('btnExpandAll');
  const btnCollapseAll = document.getElementById('btnCollapseAll');
  const btnSelectAllVisible = document.getElementById('btnSelectAllVisible');
  const btnClearSelected = document.getElementById('btnClearSelected');

  if (btnExpandAll) btnExpandAll.addEventListener('click', () => document.querySelectorAll('.accordion-item').forEach(i => i.classList.add('open')));
  if (btnCollapseAll) btnCollapseAll.addEventListener('click', () => document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open')));
  if (btnSelectAllVisible) btnSelectAllVisible.addEventListener('click', selectAllVisibleActivities);
  if (btnClearSelected) btnClearSelected.addEventListener('click', clearAllSelectedActivities);

  // 5. 命運抽卡
  const btnGacha = document.getElementById('btnGacha');
  if (btnGacha) btnGacha.addEventListener('click', triggerGachaDraw);

  // 6. 匯出備份 JSON 與匯入備份
  const btnExport = document.getElementById('btnExport');
  if (btnExport) btnExport.addEventListener('click', exportActivitiesJson);

  const btnImportBackup = document.getElementById('btnImportBackup');
  const backupFileInput = document.getElementById('backupFileInput');
  if (btnImportBackup && backupFileInput) {
    btnImportBackup.addEventListener('click', () => backupFileInput.click());
    backupFileInput.addEventListener('change', handleBackupFileUpload);
  }

  // 7. 重設篩選
  const btnResetFilter = document.getElementById('btnResetFilter');
  if (btnResetFilter) btnResetFilter.addEventListener('click', resetAllFilters);

  // 8. 分享活動下拉選單與彈窗相關
  const topShareBtn = document.getElementById('topShareBtn');
  const shareDropdown = document.querySelector('.share-dropdown');
  const topNavExportShare = document.getElementById('topNavExportShare');
  const topNavImportShare = document.getElementById('topNavImportShare');

  if (topShareBtn && shareDropdown) {
    topShareBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      shareDropdown.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!shareDropdown.contains(e.target)) {
        shareDropdown.classList.remove('open');
      }
    });
  }

  if (topNavExportShare) {
    topNavExportShare.addEventListener('click', (e) => {
      e.preventDefault();
      if (shareDropdown) shareDropdown.classList.remove('open');
      openShareModal();
      setTimeout(() => {
        const nickInput = document.getElementById('shareUserNickname');
        if (nickInput) {
          nickInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          nickInput.focus();
        }
      }, 150);
    });
  }

  if (topNavImportShare) {
    topNavImportShare.addEventListener('click', (e) => {
      e.preventDefault();
      if (shareDropdown) shareDropdown.classList.remove('open');
      openShareModal();
      setTimeout(() => {
        const importInput = document.getElementById('importShareCodeInput');
        if (importInput) {
          importInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          importInput.focus();
        }
      }, 150);
    });
  }

  const btnOpenShareModal = document.getElementById('btnOpenShareModal');
  const shareModalClose = document.getElementById('shareModalClose');
  const shareModalBackdrop = document.getElementById('shareModalBackdrop');
  const btnGenerateShareCode = document.getElementById('btnGenerateShareCode');
  const btnConfirmImportCode = document.getElementById('btnConfirmImportCode');
  const btnLoadDemoVotes = document.getElementById('btnLoadDemoVotes');

  if (btnOpenShareModal) btnOpenShareModal.addEventListener('click', openShareModal);
  if (shareModalClose) shareModalClose.addEventListener('click', closeShareModal);
  if (shareModalBackdrop) {
    shareModalBackdrop.addEventListener('click', (e) => {
      if (e.target === shareModalBackdrop) closeShareModal();
    });
  }
  if (btnGenerateShareCode) btnGenerateShareCode.addEventListener('click', generateAndCopyShareCode);
  if (btnConfirmImportCode) btnConfirmImportCode.addEventListener('click', importMemberShareCode);
  if (btnLoadDemoVotes) btnLoadDemoVotes.addEventListener('click', loadDemoVotesAction);
  const btnClearAllMemberVotes = document.getElementById('btnClearAllMemberVotes');
  if (btnClearAllMemberVotes) btnClearAllMemberVotes.addEventListener('click', clearAllMemberVotes);

  // 社員活動專區：快速匯入與快速匯出
  const btnQuickImportShare = document.getElementById('btnQuickImportShare');
  if (btnQuickImportShare) {
    btnQuickImportShare.addEventListener('click', () => {
      openShareModal();
      setTimeout(() => {
        const importInput = document.getElementById('importShareCodeInput');
        if (importInput) {
          importInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          importInput.focus();
        }
      }, 150);
    });
  }

  const btnQuickExportShare = document.getElementById('btnQuickExportShare');
  if (btnQuickExportShare) {
    btnQuickExportShare.addEventListener('click', () => {
      openShareModal();
      setTimeout(() => {
        const nickInput = document.getElementById('shareUserNickname');
        if (nickInput) {
          nickInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          nickInput.focus();
        }
      }, 150);
    });
  }

  // 社員活動專區：切換社員投票統計看板
  const btnMemberStatsToggle = document.getElementById('btnMemberStatsToggle');
  if (btnMemberStatsToggle) {
    btnMemberStatsToggle.addEventListener('click', () => {
      if (currentCategory === 'stats') {
        handleCategoryTabSwitch('all');
      } else {
        handleCategoryTabSwitch('stats');
      }
    });
  }

  // 9. 小獎品清單彈窗
  const btnOpenPrizeModal = document.getElementById('btnOpenPrizeModal');
  const prizeModalClose = document.getElementById('prizeModalClose');
  const prizeModalBackdrop = document.getElementById('prizeModalBackdrop');
  if (btnOpenPrizeModal) btnOpenPrizeModal.addEventListener('click', openPrizeModal);
  if (prizeModalClose) prizeModalClose.addEventListener('click', closePrizeModal);
  if (prizeModalBackdrop) {
    prizeModalBackdrop.addEventListener('click', (e) => {
      if (e.target === prizeModalBackdrop) closePrizeModal();
    });
  }

  // 10. 注意事項與排程彈窗
  const noticeModalBackdrop = document.getElementById('noticeModalBackdrop');
  const noticeModalClose = document.getElementById('noticeModalClose');
  const noticeModalConfirmBtn = document.getElementById('noticeModalConfirmBtn');
  const closeNotice = () => { if (noticeModalBackdrop) noticeModalBackdrop.classList.remove('active'); };
  if (noticeModalClose) noticeModalClose.addEventListener('click', closeNotice);
  if (noticeModalConfirmBtn) noticeModalConfirmBtn.addEventListener('click', closeNotice);
  if (noticeModalBackdrop) {
    noticeModalBackdrop.addEventListener('click', (e) => {
      if (e.target === noticeModalBackdrop) closeNotice();
    });
  }

  const scheduleModalBackdrop = document.getElementById('scheduleModalBackdrop');
  const scheduleModalClose = document.getElementById('scheduleModalClose');
  const scheduleModalConfirmBtn = document.getElementById('scheduleModalConfirmBtn');
  const closeSchedule = () => { if (scheduleModalBackdrop) scheduleModalBackdrop.classList.remove('active'); };
  if (scheduleModalClose) scheduleModalClose.addEventListener('click', closeSchedule);
  if (scheduleModalConfirmBtn) scheduleModalConfirmBtn.addEventListener('click', closeSchedule);
  if (scheduleModalBackdrop) {
    scheduleModalBackdrop.addEventListener('click', (e) => {
      if (e.target === scheduleModalBackdrop) closeSchedule();
    });
  }

  // 11. Modal 閱讀彈窗關閉與前後導航
  const modalClose = document.getElementById('modalClose');
  const modalBackdrop = document.getElementById('modalBackdrop');
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  const btnModalPrev = document.getElementById('btnModalPrev');
  const btnModalNext = document.getElementById('btnModalNext');
  const btnModalNavPrevFooter = document.getElementById('btnModalNavPrevFooter');
  const btnModalNavNextFooter = document.getElementById('btnModalNavNextFooter');

  if (btnModalPrev) btnModalPrev.addEventListener('click', navigatePrevActivity);
  if (btnModalNext) btnModalNext.addEventListener('click', navigateNextActivity);
  if (btnModalNavPrevFooter) btnModalNavPrevFooter.addEventListener('click', navigatePrevActivity);
  if (btnModalNavNextFooter) btnModalNavNextFooter.addEventListener('click', navigateNextActivity);

  // 鍵盤左右鍵切換前後活動與 ESC 關閉
  document.addEventListener('keydown', (e) => {
    if (document.getElementById('modalBackdrop')?.classList.contains('active')) {
      if (e.key === 'ArrowLeft') navigatePrevActivity();
      if (e.key === 'ArrowRight') navigateNextActivity();
      if (e.key === 'Escape') closeModal();
    } else if (document.getElementById('shareModalBackdrop')?.classList.contains('active')) {
      if (e.key === 'Escape') closeShareModal();
    } else if (document.getElementById('prizeModalBackdrop')?.classList.contains('active')) {
      if (e.key === 'Escape') closePrizeModal();
    } else if (noticeModalBackdrop?.classList.contains('active')) {
      if (e.key === 'Escape') closeNotice();
    } else if (scheduleModalBackdrop?.classList.contains('active')) {
      if (e.key === 'Escape') closeSchedule();
    } else if (shareDropdown?.classList.contains('open')) {
      if (e.key === 'Escape') shareDropdown.classList.remove('open');
    }
  });
}

// 處理備份 JSON 檔案上傳還原
function handleBackupFileUpload(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    try {
      const parsed = JSON.parse(evt.target.result);
      if (parsed.userState) {
        const u = parsed.userState;
        if (Array.isArray(u.favorites)) {
          favoriteIds = new Set(u.favorites);
          localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(u.favorites));
        }
        if (Array.isArray(u.selected)) {
          selectedActivityIds = new Set(u.selected);
          localStorage.setItem(STORAGE_KEYS.SELECTED, JSON.stringify(u.selected));
        }
        if (u.statuses && typeof u.statuses === 'object') {
          activityStatuses = u.statuses;
          localStorage.setItem(STORAGE_KEYS.STATUSES, JSON.stringify(u.statuses));
        }
        if (u.notes && typeof u.notes === 'object') {
          activityNotes = u.notes;
          localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(u.notes));
        }
        if (Array.isArray(u.memberVotes)) {
          memberVotes = u.memberVotes;
          localStorage.setItem(STORAGE_KEYS.MEMBER_VOTES, JSON.stringify(u.memberVotes));
        }
        updateHeaderBadges();
        updateSubTypeBadges();
        updateSelectedCountBadge();
        updateVoteBadges();
        renderCards();
        if (currentCategory === 'stats') renderStatsView();
        showToast('🎉 備份資料已成功完全還原！');
      } else {
        alert('檔案格式不正確，找不到 userState 備份結構。');
      }
    } catch (err) {
      alert('解析備份檔案失敗，請確認是否為正確的 JSON 備份檔。');
      console.error(err);
    }
  };
  reader.readAsText(file);
  e.target.value = ''; // 重設 input
}

// 打開分享彈窗
function openShareModal() {
  const modal = document.getElementById('shareModalBackdrop');
  if (!modal) return;
  
  // 恢復已儲存之個人資訊
  const nameInput = document.getElementById('shareUserNickname');
  const interestsInput = document.getElementById('shareUserInterests');
  const specialtiesInput = document.getElementById('shareUserSpecialties');
  const expectationInput = document.getElementById('shareUserExpectation');
  
  // 若本裝置已有上傳回覆，自動帶入回覆紀錄以便隨時「修改回覆」
  const mySubRaw = localStorage.getItem(STORAGE_KEYS.MY_SUBMISSION);
  let mySub = null;
  if (mySubRaw) {
    try { mySub = JSON.parse(mySubRaw); } catch(e) {}
  }

  if (mySub) {
    if (nameInput) nameInput.value = mySub.name || '';
    if (interestsInput) interestsInput.value = Array.isArray(mySub.interests) ? mySub.interests.join(', ') : (mySub.interests || '');
    if (specialtiesInput) specialtiesInput.value = mySub.specialties || '';
    if (expectationInput) expectationInput.value = mySub.expectation || '';
  } else {
    if (nameInput) nameInput.value = localStorage.getItem(STORAGE_KEYS.USER_NICKNAME) || '';
    if (interestsInput) interestsInput.value = localStorage.getItem(STORAGE_KEYS.USER_INTERESTS) || '';
    if (specialtiesInput) specialtiesInput.value = localStorage.getItem(STORAGE_KEYS.USER_SPECIALTIES) || '';
    if (expectationInput) expectationInput.value = localStorage.getItem(STORAGE_KEYS.USER_EXPECTATION) || '';
  }

  if (typeof setupQuickTagButtons === 'function') {
    setupQuickTagButtons();
  }

  // 綁定設定按鈕事件
  const configBtn = document.getElementById('btnConfigureCloudUrl');
  if (configBtn) {
    configBtn.onclick = configureCloudApiUrl;
  }

  updateSharePreviewList();
  updateVoteBadges();
  updateDeviceUploadStatusUI();
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeShareModal() {
  const modal = document.getElementById('shareModalBackdrop');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

// 更新分享彈窗內的已選清單預覽
function updateSharePreviewList() {
  const previewBox = document.getElementById('shareSelectedPreview');
  const countBadge = document.getElementById('shareSelectedCount');
  const effectiveSet = selectedActivityIds.size > 0 ? selectedActivityIds : favoriteIds;
  if (countBadge) countBadge.textContent = effectiveSet.size;

  if (!previewBox) return;

  if (effectiveSet.size === 0) {
    previewBox.innerHTML = `<span style="color: #94a3b8;">⚠️ 您目前尚未收藏任何活動，請回到清單點擊卡片右上角的「❤️ 收藏」方框！</span>`;
    return;
  }

  const list = activitiesData.filter(a => effectiveSet.has(a.id));
  previewBox.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 4px;">
      ${list.map((act, i) => `
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed rgba(255,255,255,0.06); padding: 3px 0;">
          <span>${i + 1}. <strong>${act.title}</strong></span>
          <span style="color: #a5b4fc; font-size: 0.75rem;">${act.category}</span>
        </div>
      `).join('')}
    </div>
  `;
}

// 取得或產生此裝置的唯一識別碼 (限制一裝置僅一份回覆)
function getOrCreateDeviceId() {
  let devId = localStorage.getItem(STORAGE_KEYS.DEVICE_ID);
  if (!devId) {
    devId = 'dev_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 8);
    localStorage.setItem(STORAGE_KEYS.DEVICE_ID, devId);
  }
  return devId;
}

// 取得當前設定之雲端 API 網址 (Google Apps Script Web App URL)
function getCloudApiUrl() {
  return localStorage.getItem(STORAGE_KEYS.CLOUD_API_URL) || '';
}

// 設定自訂 Google Apps Script 雲端網址
function configureCloudApiUrl() {
  const currentUrl = getCloudApiUrl();
  const inputUrl = prompt(
    '【設定 Google 試算表雲端網址】\n' +
    '請貼上您部署好的 Google Apps Script 網頁應用程式網址 (Web App URL)：\n' +
    '(例如：https://script.google.com/macros/s/.../exec)\n' +
    '※ 若留空將使用本機專屬資料庫模式。',
    currentUrl
  );
  if (inputUrl !== null) {
    const trimmed = inputUrl.trim();
    if (trimmed) {
      localStorage.setItem(STORAGE_KEYS.CLOUD_API_URL, trimmed);
      showToast('✅ 已成功設定 Google 試算表雲端網址！');
      syncMemberVotesFromCloud(false);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CLOUD_API_URL);
      showToast('ℹ️ 已重設為本機專屬模式。');
    }
    updateDeviceUploadStatusUI();
  }
}
window.configureCloudApiUrl = configureCloudApiUrl;

// 更新彈窗內的「裝置上傳狀態」與按鈕文字（限制一裝置一份、修改回覆提示）
function updateDeviceUploadStatusUI() {
  const btnText = document.getElementById('btnUploadCloudText');
  const hintEl = document.getElementById('deviceUploadStatusHint');
  const mySubmissionRaw = localStorage.getItem(STORAGE_KEYS.MY_SUBMISSION);

  if (mySubmissionRaw) {
    try {
      const mySub = JSON.parse(mySubmissionRaw);
      if (btnText) btnText.textContent = '🔄 修改回覆並更新雲端';
      if (hintEl) {
        hintEl.innerHTML = `<span style="color: #10b981;">✅ 本裝置已登錄回覆（最後更新：${mySub.time || '剛才'}）。再次點擊將「修改回覆」並覆蓋雲端紀錄！</span>`;
      }
      return;
    } catch (e) {}
  }

  if (btnText) btnText.textContent = '☁️ 一鍵上傳至雲端';
  if (hintEl) {
    hintEl.innerHTML = `<span>📱 限制：本裝置限傳送 1 份資料，送出後可隨時在此「修改回覆」。</span>`;
  }
}

// 雲端上傳 / 修改回覆處理函式 (限制一裝置僅一份檔案)
async function generateAndCopyShareCode() {
  const nameInput = document.getElementById('shareUserNickname');
  let nickname = nameInput ? nameInput.value.trim() : '';

  if (!nickname) {
    nickname = prompt('請輸入您的社員姓名／暱稱（例如：阿鐵、悠悠、奇奇）：');
    if (!nickname) nickname = '熱心社員';
    if (nameInput) nameInput.value = nickname;
  }
  localStorage.setItem(STORAGE_KEYS.USER_NICKNAME, nickname);

  const interestsInput = document.getElementById('shareUserInterests');
  const rawInterests = interestsInput ? interestsInput.value.trim() : '';
  const interestsArray = rawInterests 
    ? rawInterests.split(/[,，、\s]+/).map(s => s.trim()).filter(Boolean)
    : [];

  const specialtiesInput = document.getElementById('shareUserSpecialties');
  const specialties = specialtiesInput ? specialtiesInput.value.trim() : '';

  const expectationInput = document.getElementById('shareUserExpectation');
  const expectation = expectationInput ? expectationInput.value.trim() : '';

  localStorage.setItem(STORAGE_KEYS.USER_INTERESTS, rawInterests);
  localStorage.setItem(STORAGE_KEYS.USER_SPECIALTIES, specialties);
  localStorage.setItem(STORAGE_KEYS.USER_EXPECTATION, expectation);

  const effectiveIds = selectedActivityIds.size > 0 
    ? Array.from(selectedActivityIds) 
    : Array.from(favoriteIds);

  if (effectiveIds.length === 0) {
    alert('您尚未收藏任何活動！請先在卡片上標記想參加的活動（點擊卡片右上角愛心）後再上傳。');
    return;
  }

  // 1. 取得本裝置唯一 Device ID (限制一裝置僅一份)
  const deviceId = getOrCreateDeviceId();
  const nowTime = new Date().toLocaleString([], { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  const hasExisting = Boolean(localStorage.getItem(STORAGE_KEYS.MY_SUBMISSION));

  const submissionPayload = {
    id: `vote-${deviceId}`,
    deviceId: deviceId,
    name: nickname,
    time: nowTime,
    interests: interestsArray,
    specialties: specialties,
    expectation: expectation,
    selectedIds: effectiveIds,
    updatedAt: new Date().toISOString()
  };

  // 2. 本地儲存本裝置的最新提交資料 (做為後續修改回覆的比對基準)
  localStorage.setItem(STORAGE_KEYS.MY_SUBMISSION, JSON.stringify(submissionPayload));

  // 3. 在本機 memberVotes 中執行「覆蓋修改」或「新增」（嚴格限制一裝置一份）
  const existingIndex = memberVotes.findIndex(v => v.deviceId === deviceId || v.id === `vote-${deviceId}`);
  if (existingIndex >= 0) {
    memberVotes[existingIndex] = submissionPayload;
  } else {
    memberVotes.unshift(submissionPayload);
  }
  saveMemberVotes();
  updateVoteBadges();
  updateDeviceUploadStatusUI();

  // 4. 若有設定 Google Apps Script 雲端網址，發送 HTTP POST 上傳至雲端試算表
  const cloudUrl = getCloudApiUrl();
  const btnEl = document.getElementById('btnGenerateShareCode');
  const origBtnHtml = btnEl ? btnEl.innerHTML : '';
  if (btnEl) btnEl.disabled = true;

  if (cloudUrl) {
    showToast('☁️ 正在上傳至雲端 Google 試算表...');
    try {
      // 使用 text/plain 避免 Google Apps Script 觸發 OPTIONS 預檢錯誤
      const res = await fetch(cloudUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'submit',
          deviceId: deviceId,
          name: nickname,
          interests: interestsArray,
          specialties: specialties,
          expectation: expectation,
          selectedIds: effectiveIds,
          time: nowTime
        })
      });
      const data = await res.json();
      if (data.status === 'success') {
        const msg = data.isUpdate || hasExisting 
          ? `✅ 已成功修改您的回覆並更新至雲端（${nickname}）！` 
          : `✅ 雲端上傳成功！已同步至社團試算表（${nickname}）！`;
        showToast(msg);
      } else {
        showToast(`✅ 資料已在本裝置保存並同步（雲端：${data.message || '已接收'}）`);
      }
    } catch (netErr) {
      console.warn('雲端上傳連線提示：', netErr);
      showToast(hasExisting ? '✅ 本機回覆已修改成功！（已保存於本裝置）' : '✅ 本機資料已新增成功！（已限制此裝置唯一回覆）');
    }
  } else {
    const actionDesc = hasExisting ? '已成功修改您的回覆！' : '已成功登錄本裝置資料！';
    showToast(`✅ ${actionDesc}（如需連線全體社團試算表，可點擊「雲端網址設定」）`);
  }

  if (btnEl) {
    btnEl.disabled = false;
    btnEl.innerHTML = origBtnHtml;
  }
  updateDeviceUploadStatusUI();
}

// 從雲端 Google 試算表讀取所有社員回覆並載入至本機中
async function syncMemberVotesFromCloud(silent = false) {
  const cloudUrl = getCloudApiUrl();
  if (!cloudUrl) return;

  try {
    const res = await fetch(cloudUrl + (cloudUrl.includes('?') ? '&' : '?') + 'action=read&t=' + Date.now());
    const result = await res.json();
    if (result && result.status === 'success' && Array.isArray(result.data)) {
      const myDeviceId = getOrCreateDeviceId();
      const myLocalSubRaw = localStorage.getItem(STORAGE_KEYS.MY_SUBMISSION);
      let myLocalSub = null;
      if (myLocalSubRaw) {
        try { myLocalSub = JSON.parse(myLocalSubRaw); } catch(e) {}
      }

      // 合併雲端名單 (以 deviceId 唯一去重，限制一裝置一份)
      const mergedMap = new Map();

      // 先載入雲端名單
      result.data.forEach(item => {
        if (item && item.deviceId) {
          mergedMap.set(item.deviceId, item);
        }
      });

      // 若本裝置有本機修改，以本裝置最新的為主
      if (myLocalSub && myLocalSub.deviceId) {
        mergedMap.set(myLocalSub.deviceId, myLocalSub);
      }

      memberVotes = Array.from(mergedMap.values());
      saveMemberVotes();
      updateVoteBadges();
      if (currentCategory === 'stats') {
        renderStatsView();
      }
      if (!silent) {
        showToast(`☁️ 已從雲端同步載入 ${result.data.length} 位社員的心願與卡片！`);
      }
    }
  } catch (err) {
    console.warn('從雲端同步失敗：', err);
    if (!silent) {
      showToast('⚠️ 連線雲端讀取失敗，請確認網路或 Google Apps Script 網址。');
    }
  }
}
window.syncMemberVotesFromCloud = syncMemberVotesFromCloud;

// 匯入社員分享碼 (支援模糊擷取與容錯)
function importMemberShareCode() {
  const input = document.getElementById('importShareCodeInput');
  if (!input) return;
  const rawCode = input.value.trim();

  if (!rawCode) {
    alert('請貼上社員的分享碼！');
    return;
  }

  try {
    let payload = null;

    // 1. 嘗試由 MYVOTE: 前綴提取
    const match = rawCode.match(/(?:MYVOTE:)?([A-Za-z0-9+/=]{12,})/);
    if (match && match[1]) {
      try {
        const b64 = match[1];
        const decodedUri = decodeURIComponent(atob(b64).split('').map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        payload = JSON.parse(decodedUri);
      } catch (e1) {
        // 回退嘗試直接 JSON parse
        payload = JSON.parse(rawCode);
      }
    } else {
      payload = JSON.parse(rawCode);
    }

    if (!payload || !payload.name || !Array.isArray(payload.selectedIds)) {
      throw new Error('格式不符合投票結構');
    }

    const existingIndex = memberVotes.findIndex(v => v.name === payload.name);
    let parsedInterests = [];
    if (Array.isArray(payload.interests)) {
      parsedInterests = payload.interests;
    } else if (typeof payload.interests === 'string' && payload.interests.trim()) {
      parsedInterests = payload.interests.split(/[,，、\s]+/).map(s => s.trim()).filter(Boolean);
    }

    const newRecord = {
      id: `vote-${Date.now()}`,
      name: payload.name,
      time: payload.time || new Date().toLocaleString([], { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      interests: parsedInterests,
      specialties: payload.specialties || '',
      expectation: payload.expectation || '',
      selectedIds: payload.selectedIds,
      prizes: Array.isArray(payload.prizes) ? payload.prizes : []
    };

    if (existingIndex >= 0) {
      memberVotes[existingIndex] = newRecord;
      showToast(`已更新社員「${payload.name}」的活動投票（共 ${payload.selectedIds.length} 項）！`);
    } else {
      memberVotes.unshift(newRecord);
      showToast(`已成功匯入社員「${payload.name}」的活動投票（共 ${payload.selectedIds.length} 項）！`);
    }

    saveMemberVotes();
    const savedPrizes = localStorage.getItem('mihoyo_selected_prizes');
    if (savedPrizes) {
      try {
        const arr = JSON.parse(savedPrizes);
        selectedPrizeIds = new Set(Array.isArray(arr) ? arr : []);
      } catch (e) {
        selectedPrizeIds = new Set();
      }
    }
    updatePrizeBadge();

    input.value = '';
    closeShareModal();
    updateVoteBadges();
    handleCategoryTabSwitch('stats');
  } catch (e) {
    alert('分享碼解析失敗，請確認代碼是否完整複製（可包含 MYVOTE:）！');
    console.error('Import error:', e);
  }
}

// 載入示範投票
function loadDemoVotesAction() {
  memberVotes = JSON.parse(JSON.stringify(DEMO_VOTES));
  saveMemberVotes();
  const savedPrizes = localStorage.getItem('mihoyo_selected_prizes');
  if (savedPrizes) {
    try {
      const arr = JSON.parse(savedPrizes);
      selectedPrizeIds = new Set(Array.isArray(arr) ? arr : []);
    } catch (e) {
      selectedPrizeIds = new Set();
    }
  }
  updatePrizeBadge();
  updateVoteBadges();

  closeShareModal();
  showToast('已載入三位社員（阿鐵、悠悠、奇奇）示範投票！');
  handleCategoryTabSwitch('stats');
}

// 刪除個別社員投票紀錄
function deleteMemberVote(voteId) {
  const target = memberVotes.find(v => v.id === voteId);
  const name = target ? target.name : '此社員';
  if (!confirm(`確定要刪除「${name}」的投票紀錄嗎？`)) return;

  memberVotes = memberVotes.filter(v => v.id !== voteId);
  saveMemberVotes();
  updateVoteBadges();
  renderStatsView();
  showToast(`已移除「${name}」的投票紀錄。`);
}

// 清空所有社員投票紀錄
function clearAllMemberVotes() {
  if (memberVotes.length === 0) {
    showToast('目前暫無任何已匯入的社員名單！');
    return;
  }
  if (confirm('確定要清空所有已匯入的社員名單紀錄嗎？清空後統計數據將同步重設。')) {
    memberVotes = [];
    saveMemberVotes();
    updateVoteBadges();
    if (currentCategory === 'stats') {
      renderStatsView();
    } else {
      renderCards();
    }
    showToast('已清空所有社員名單紀錄 🗑️');
  }
}
window.clearAllMemberVotes = clearAllMemberVotes;

// ==========================================================================
// 2. 社員投票統計專區 (Stats & Charts Rendering)
// ==========================================================================
function renderStatsView() {
  const container = document.getElementById('statsContainer');
  if (!container) return;

  if (memberVotes.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding: 70px 20px;">
        <div class="empty-state-icon">📊</div>
        <h3>目前尚無任何社員投票紀錄</h3>
        <p>邀請社員勾選心儀活動並匯出分享碼，在此匯入後即可生成熱門排行與圓餅統計！</p>
        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-top: 18px;">
          <button class="btn-action btn-primary" onclick="handleCategoryTabSwitch('all')" style="background: #f59e0b; color: #1e1b18; font-weight: 700; padding: 0 22px; height: 40px; border-radius: 9999px; cursor: pointer; border: none; font-size: 0.9rem;">
            📋 返回活動企劃庫 (瀏覽 95 份活動)
          </button>
          <button class="btn-action" onclick="loadDemoVotesAction()" style="background: linear-gradient(135deg, #6366f1, #a855f7); color: #fff; padding: 0 18px; height: 40px; border-radius: 9999px; cursor: pointer; border: none; font-size: 0.9rem;">
            👥 一鍵載入三位社員示範投票
          </button>
        </div>
      </div>
    `;
    return;
  }

  // 1. 票數匯總統計
  const voteCounts = {};
  const gameCounts = { 'hsr': 0, 'genshin': 0, 'zzz': 0, 'other': 0 };
  const typeCounts = { 'casual': 0, 'score': 0, 'craft': 0 };

  memberVotes.forEach(vote => {
    (vote.selectedIds || []).forEach(id => {
      voteCounts[id] = (voteCounts[id] || 0) + 1;
      const act = activitiesData.find(a => a.id === id);
      if (act) {
        if (gameCounts[act.categoryKey] !== undefined) {
          gameCounts[act.categoryKey]++;
        } else {
          gameCounts['other']++;
        }
        if (typeCounts[act.subTypeKey] !== undefined) {
          typeCounts[act.subTypeKey]++;
        }
      }
    });
  });

  // 2. 依票數「由高到低排序」，若平手依標題排序
  const rankedActivities = Object.keys(voteCounts).map(id => {
    return {
      id: id,
      count: voteCounts[id],
      act: activitiesData.find(a => a.id === id)
    };
  }).filter(item => item.act).sort((a, b) => b.count - a.count);

  const totalVotesCast = Object.values(voteCounts).reduce((a, b) => a + b, 0);

  // 儲存排行榜作為統計頁彈窗的切換上下文池
  currentModalContextPool = rankedActivities.map(r => r.act);

  // 繪製圓餅圖 (SVG Donut Chart)
  const pieSVG = createDonutChartSVG(typeCounts);

  container.innerHTML = `
    <!-- 統計看板頂部導航與標題 (包含圖一社員篩選條，同屬一個區塊位置中) -->
    <div style="margin-bottom: 20px; padding: 18px 20px; background: rgba(15, 23, 42, 0.65); border: 1px solid rgba(129, 140, 248, 0.25); border-radius: 12px; backdrop-filter: blur(12px);">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span style="background: rgba(99, 102, 241, 0.2); color: #c7d2fe; font-size: 0.76rem; font-weight: 700; padding: 3px 10px; border-radius: 999px; border: 1px solid rgba(129, 140, 248, 0.35);">
              👥 社員投票分析
            </span>
            <h3 style="font-size: 1.3rem; font-weight: 800; color: #fff; margin: 0;">統計圖表</h3>
          </div>
          <p style="font-size: 0.82rem; color: #94a3b8; margin: 0;">
            已自動彙整所有社員匯入之心願活動代碼，即時統計得票榜單、性質圓餅比例與個別社員選項方框
          </p>
        </div>
        <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
          <button class="btn-action" onclick="openShareModal()" style="background: linear-gradient(135deg, #2563eb, #3b82f6); color: #fff; font-weight: 600; padding: 0 18px; height: 36px; border-radius: 9999px; display: inline-flex; align-items: center; justify-content: center; border: none; cursor: pointer;">
            <svg class="mono-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="margin-right: 6px;">
              <path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"></path>
              <polyline points="8 10 12 14 16 10"></polyline>
              <line x1="12" y1="3" x2="12" y2="14"></line>
            </svg>
            <span>匯入代碼</span>
          </button>
          <button class="btn-action" onclick="handleCategoryTabSwitch('all')" style="background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.2); color: #fff; font-weight: 600; padding: 0 18px; height: 36px; border-radius: 9999px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer;">
            <svg class="mono-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="margin-right: 6px;">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>返回頁面</span>
          </button>
        </div>
      </div>
      <!-- 圖一內容：移動至圖二下方，同屬一個區塊位置中 -->
      <div class="member-quick-filter-bar" id="memberQuickFilterRow" style="margin-top: 14px; padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.08); background: transparent; border-left: none; border-right: none; border-bottom: none; border-radius: 0; width: 100%; display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
        <span class="member-filter-label" style="font-size: 0.82rem; color: #c7d2fe; font-weight: 700; white-space: nowrap;">👤 點開社員篩選內容：</span>
        <div class="member-filter-chips" id="memberFilterChipsContainer" style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
          <!-- 由 JavaScript 動態渲染各社員專屬篩選按鈕 -->
        </div>
      </div>
    </div>

    <!-- 頂部概覽看板 -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
      <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 18px; text-align: center;">
        <span style="font-size: 0.85rem; color: #94a3b8;">👥 已參與社員</span>
        <div style="font-size: 1.8rem; font-weight: 800; color: #38bdf8; margin-top: 4px;">${memberVotes.length} 位</div>
      </div>
      <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 18px; text-align: center;">
        <span style="font-size: 0.85rem; color: #94a3b8;">🎟️ 累計總選票數</span>
        <div style="font-size: 1.8rem; font-weight: 800; color: #10b981; margin-top: 4px;">${totalVotesCast} 票</div>
      </div>
      <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 18px; text-align: center;">
        <span style="font-size: 0.85rem; color: #94a3b8;">🔥 最熱門活動票數</span>
        <div style="font-size: 1.8rem; font-weight: 800; color: #f59e0b; margin-top: 4px;">${rankedActivities[0] ? rankedActivities[0].count + ' 票' : '0 票'}</div>
      </div>
      <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 18px; text-align: center;">
        <span style="font-size: 0.85rem; color: #94a3b8;">🏆 最高人氣企劃</span>
        <div style="font-size: 0.95rem; font-weight: 700; color: #fbbf24; margin-top: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${rankedActivities[0] ? rankedActivities[0].act.title : '暫無'}">
          ${rankedActivities[0] ? rankedActivities[0].act.title : '暫無'}
        </div>
      </div>
    </div>

    <!-- 雙圖表儀表板 (長條圖 & 圓餅圖) -->
    <div class="charts-grid">
      <!-- 長條圖：前 6 名熱門得票排行 -->
      <div class="chart-box">
        <div class="chart-title">
          <span>📊 活動熱門得票長條圖 (Top 6)</span>
        </div>
        <div style="margin-top: 10px;">
          ${rankedActivities.slice(0, 6).map(item => {
            const pct = Math.round((item.count / memberVotes.length) * 100);
            return `
              <div class="bar-row" onclick="openDetailModalById('${item.id}', 'ranked')" style="cursor: pointer;" title="點擊預覽此企劃">
                <span class="bar-label" title="${item.act.title}">${item.act.title}</span>
                <div class="bar-track">
                  <div class="bar-fill" style="width: ${pct}%;"></div>
                </div>
                <span class="bar-value">${item.count}票 (${pct}%)</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- 圓餅圖：活動類型偏好佔比 (休閒 vs 衝分 vs 動手) -->
      <div class="chart-box">
        <div class="chart-title">
          <span>🥧 活動性質偏好圓餅圖 (全社心願比例)</span>
        </div>
        <div style="display: flex; align-items: center; justify-content: space-around; gap: 20px; flex-wrap: wrap;">
          ${pieSVG}
          <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.85rem;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="display: inline-block; width: 12px; height: 12px; background: #818cf8; border-radius: 3px;"></span>
              <span>☕ 休閒：<strong>${typeCounts.casual} 票</strong></span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="display: inline-block; width: 12px; height: 12px; background: #f59e0b; border-radius: 3px;"></span>
              <span>🏆 競技：<strong>${typeCounts.score} 票</strong></span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="display: inline-block; width: 12px; height: 12px; background: #ec4899; border-radius: 3px;"></span>
              <span>✂️ 手作：<strong>${typeCounts.craft} 票</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 熱門活動總統計清單 (由高到低排序，僅顯示標題，點擊預覽) -->
    <div class="stats-card-panel">
      <div class="stats-card-header">
        <h3>
          <span>🏆 全社想參加活動排行榜</span>
          <span style="font-size: 0.85rem; color: #94a3b8; font-weight: normal;">(由高到低排序 · 點擊直接開啟企劃預覽與切換)</span>
        </h3>
        <span style="font-size: 0.85rem; color: #10b981;">共 ${rankedActivities.length} 項活動獲得投票</span>
      </div>

      <div class="ranking-list">
        ${rankedActivities.map((item, idx) => {
          let rankBadge = `${idx + 1}`;
          if (idx === 0) rankBadge = '🥇 1';
          else if (idx === 1) rankBadge = '🥈 2';
          else if (idx === 2) rankBadge = '🥉 3';

          return `
            <div class="ranking-item" onclick="openDetailModalById('${item.id}', 'ranked')" title="點擊預覽「${item.act.title}」完整企劃書">
              <div class="ranking-badge">${rankBadge}</div>
              <div class="ranking-title">${item.act.title}</div>
              <span class="badge-category" style="font-size: 0.72rem; padding: 2px 6px;">${item.act.category}</span>
              <span class="badge-subtype badge-${item.act.subTypeKey}" style="font-size: 0.72rem; padding: 2px 6px;">${item.act.subType || ''}</span>
              <div class="ranking-votes">🔥 ${item.count} 票</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- 已匯入社員卡片清單 (以方框為單位的欄位) -->
    <div class="stats-card-panel">
      <div class="stats-card-header">
        <h3>
          <span>👥 已匯入社員心願卡盒</span>
          <span style="font-size: 0.85rem; color: #94a3b8; font-weight: normal;">(上方顯示暱稱，底下顯示選擇之活動內容，點擊可快速預覽)</span>
        </h3>
        <span style="font-size: 0.85rem; color: #cbd5e1;">共 ${memberVotes.length} 份紀錄</span>
      </div>

      <div class="member-boxes-grid">
        ${memberVotes.map(vote => {
          const acts = (vote.selectedIds || []).map(id => activitiesData.find(a => a.id === id)).filter(Boolean);
          const initial = (vote.name || '社').trim().charAt(0).toUpperCase();
          const interestsList = Array.isArray(vote.interests) && vote.interests.length > 0 
            ? vote.interests 
            : (typeof vote.interests === 'string' && vote.interests ? vote.interests.split(/[,，、\s]+/).filter(Boolean) : ['米哈遊同好', '二次元交流']);
          const specialtiesText = vote.specialties && vote.specialties.trim() 
            ? vote.specialties 
            : '熱情參與、各類遊戲體驗';
          const expectationText = vote.expectation && vote.expectation.trim() 
            ? vote.expectation 
            : '希望能和大家一起同樂交流、參與更多有趣的社團活動！';

          return `
            <div class="member-box-card" id="member-card-${vote.id}">
              <!-- 1. 基本資料：姓名與頭像 -->
              <div class="member-box-header">
                <div class="member-name-wrap">
                  <div class="member-avatar-badge">${initial}</div>
                  <div class="member-name-meta">
                    <h4 class="member-name-title">${vote.name}</h4>
                    <span class="member-time-caption">🕒 匯入時間：${vote.time || '剛才'}</span>
                  </div>
                </div>
                <div class="member-header-actions">
                  <span class="member-vote-count">選了 ${acts.length} 項</span>
                  <button class="member-delete-btn" onclick="deleteMemberVote('${vote.id}')" title="刪除此社員紀錄">✕</button>
                </div>
              </div>

              <!-- 2. 興趣愛好：以標籤（Tags/Badges）形式呈現 -->
              <div class="member-section">
                <div class="member-section-label">
                  <span>🏷️ 興趣愛好</span>
                </div>
                <div class="member-tags-wrap">
                  ${interestsList.map(tag => `
                    <span class="member-interest-tag">${tag}</span>
                  `).join('')}
                </div>
              </div>

              <!-- 3. 個人專長：列出擅長的技能或領域 -->
              <div class="member-section">
                <div class="member-section-label">
                  <span>⚡ 個人專長</span>
                </div>
                <div class="member-specialties-content">
                  ${specialtiesText}
                </div>
              </div>

              <!-- 4. 入社期望：引言或短文區塊呈現，強化視覺重點 -->
              <div class="member-expectation-card">
                <div class="member-expectation-header">
                  <svg class="expectation-quote-icon" viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                  </svg>
                  <span class="member-expectation-prompt">「在進來社團前，你期望在社團中參與到怎樣的社團活動？」</span>
                </div>
                <blockquote class="member-expectation-quote">
                  “${expectationText}”
                </blockquote>
              </div>

              <!-- 5. 該社員選擇的心願活動清單 -->
              <div class="member-section">
                <div class="member-section-label">
                  <span>📌 心願企劃 (${acts.length} 項)</span>
                </div>
                <div class="member-activities-list">
                  ${acts.length > 0 ? acts.map(act => `
                    <div class="member-activity-chip" onclick="openDetailModalById('${act.id}', 'member-${vote.id}')" title="點擊預覽此活動完整企劃">
                      <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 220px;">${act.title}</span>
                      <span style="font-size: 0.7rem; color: #94a3b8;">${act.subType || ''}</span>
                    </div>
                  `).join('') : '<span style="font-size: 0.8rem; color: #94a3b8;">尚未勾選活動</span>'}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  renderMemberQuickFilterChips();
}

// 渲染各社員專屬篩選按鈕
function renderMemberQuickFilterChips() {
  const containers = document.querySelectorAll('#memberFilterChipsContainer');
  if (!containers || containers.length === 0) return;

  containers.forEach(container => {
    if (memberVotes.length === 0) {
      container.innerHTML = `<span style="font-size: 0.8rem; color: #94a3b8;">目前尚無已匯入社員</span>`;
      return;
    }

    container.innerHTML = memberVotes.map(v => {
      const count = (v.selectedIds || []).length;
      return `
        <button 
          type="button" 
          class="member-chip-btn" 
          onclick="scrollToMemberCard('${v.id}')"
          title="點擊查看「${v.name}」所勾選的 ${count} 項活動"
        >
          <span>👤 ${v.name}</span>
          <span class="chip-count">${count}</span>
        </button>
      `;
    }).join('');
  });
}

function scrollToMemberCard(voteId) {
  const card = document.getElementById(`member-card-${voteId}`);
  if (card) {
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    card.style.transition = 'box-shadow 0.3s ease, border-color 0.3s ease';
    card.style.borderColor = '#f59e0b';
    card.style.boxShadow = '0 0 16px rgba(245, 158, 11, 0.5)';
    setTimeout(() => {
      card.style.borderColor = '';
      card.style.boxShadow = '';
    }, 2000);
  }
}
window.scrollToMemberCard = scrollToMemberCard;
window.renderMemberQuickFilterChips = renderMemberQuickFilterChips;

// 產生 SVG 圓餅環形圖
function createDonutChartSVG(typeCounts) {
  const total = (typeCounts.casual + typeCounts.score + typeCounts.craft) || 1;
  const pCasual = typeCounts.casual / total;
  const pScore = typeCounts.score / total;
  const pCraft = typeCounts.craft / total;

  const r = 40;
  const c = 2 * Math.PI * r;

  const dashCasual = (pCasual * c).toFixed(1);
  const dashScore = (pScore * c).toFixed(1);
  const dashCraft = (pCraft * c).toFixed(1);

  const offsetScore = (-(pCasual * c)).toFixed(1);
  const offsetCraft = (-((pCasual + pScore) * c)).toFixed(1);

  return `
    <svg width="120" height="120" viewBox="0 0 100 100" style="transform: rotate(-90deg);">
      <circle cx="50" cy="50" r="${r}" fill="transparent" stroke="rgba(255,255,255,0.05)" stroke-width="18" />
      <circle cx="50" cy="50" r="${r}" fill="transparent" stroke="#818cf8" stroke-width="18" stroke-dasharray="${dashCasual} ${c}" stroke-dashoffset="0" />
      <circle cx="50" cy="50" r="${r}" fill="transparent" stroke="#f59e0b" stroke-width="18" stroke-dasharray="${dashScore} ${c}" stroke-dashoffset="${offsetScore}" />
      <circle cx="50" cy="50" r="${r}" fill="transparent" stroke="#ec4899" stroke-width="18" stroke-dasharray="${dashCraft} ${c}" stroke-dashoffset="${offsetCraft}" />
    </svg>
  `;
}

// 動態計算各分類與子類型標籤數量
function updateSubTypeBadges() {
  // 動態更新四大遊戲分類按鈕上的徽章數字
  const appBadgeAll = document.getElementById('appBadgeAll');
  const appBadgeHsr = document.getElementById('appBadgeHsr');
  const appBadgeGenshin = document.getElementById('appBadgeGenshin');
  const appBadgeZzz = document.getElementById('appBadgeZzz');

  if (appBadgeAll) appBadgeAll.textContent = activitiesData.length;
  if (appBadgeHsr) appBadgeHsr.textContent = activitiesData.filter(a => a.categoryKey === 'hsr').length;
  if (appBadgeGenshin) appBadgeGenshin.textContent = activitiesData.filter(a => a.categoryKey === 'genshin').length;
  if (appBadgeZzz) appBadgeZzz.textContent = activitiesData.filter(a => a.categoryKey === 'zzz').length;

  let baseList = activitiesData;

  if (currentCategory === 'favorites') {
    baseList = activitiesData.filter(a => favoriteIds.has(a.id));
  } else if (currentCategory === 'hsr') {
    baseList = activitiesData.filter(a => a.categoryKey === 'hsr');
  } else if (currentCategory === 'genshin') {
    baseList = activitiesData.filter(a => a.categoryKey === 'genshin');
  } else if (currentCategory === 'zzz') {
    baseList = activitiesData.filter(a => a.categoryKey === 'zzz');
  }

  const badgeAll = document.getElementById('badgeAll');
  const badgeCasual = document.getElementById('badgeCasual');
  const badgeScore = document.getElementById('badgeScore');
  const badgeCraft = document.getElementById('badgeCraft');

  if (badgeAll) badgeAll.textContent = baseList.length;
  if (badgeCasual) badgeCasual.textContent = baseList.filter(a => a.subTypeKey === 'casual').length;
  if (badgeScore) badgeScore.textContent = baseList.filter(a => a.subTypeKey === 'score').length;
  if (badgeCraft) badgeCraft.textContent = baseList.filter(a => a.subTypeKey === 'craft').length;
}

// 取得篩選後的清單
function getFilteredActivities() {
  return activitiesData.filter(act => {
    let matchCat = false;
    if (currentCategory === 'all' || currentCategory === 'stats') {
      matchCat = true;
    } else if (currentCategory === 'favorites') {
      matchCat = favoriteIds.has(act.id);
    } else {
      matchCat = (act.categoryKey === currentCategory || act.categoryKey === 'all');
    }

    let matchSub = false;
    if (currentSubType === 'all') {
      matchSub = true;
    } else {
      matchSub = (act.subTypeKey === currentSubType);
    }

    if (!matchCat || !matchSub) return false;
    if (!searchQuery) return true;

    const userNote = activityNotes[act.id] || '';
    const fullText = [
      act.title,
      act.subtitle,
      act.category,
      act.subType || '',
      act.summary,
      act.highlight,
      act.rules,
      act.location,
      userNote,
      ...(act.supplies || []),
      ...(act.extraNotes || [])
    ].join(' ').toLowerCase();

    return fullText.includes(searchQuery);
  });
}

// 渲染便利貼卡盒網格
function renderCards() {
  const container = document.getElementById('cardsContainer');
  if (!container) return;

  const filtered = getFilteredActivities();

  // 更新當前預設切換池為篩選結果
  currentModalContextPool = filtered;

  if (filtered.length === 0) {
    if (activitiesData.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">📋</div>
          <h3>目前企劃庫為空</h3>
          <p>活動企劃已全數清空，隨時可匯入或錄入全新活動企劃！</p>
          <button class="btn-action" onclick="openShareModal()" style="margin-top: 14px;">📥 匯入活動或備份</button>
        </div>
      `;
      return;
    }
    if (currentCategory === 'favorites') {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">❤️</div>
          <h3>尚未收藏任何活動企劃</h3>
          <p>您目前還沒有標註任何喜好企劃。點擊卡片右上角的心形圖示 ❤️ 即可加入喜好清單！</p>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <h3>沒有找到相符的活動企劃</h3>
          <p>請嘗試更換篩選條件或輸入不同的關鍵字搜尋。</p>
          <button class="btn-action" onclick="resetAllFilters()" style="margin-top: 14px;">🔄 重設篩選條件</button>
        </div>
      `;
    }
    return;
  }

  container.innerHTML = filtered.map(act => createCardHTML(act)).join('');

  // 綁定手風琴展開收起
  container.querySelectorAll('.accordion-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = btn.closest('.accordion-item');
      item.classList.toggle('open');
    });
  });

  // 綁定愛心喜好點擊
  container.querySelectorAll('.btn-favorite').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      toggleFavorite(id);
    });
  });

  // 綁定查看完整企劃彈窗
  container.querySelectorAll('.btn-card-detail').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      openDetailModalById(id, 'cards');
    });
  });

  // 綁定卡片點擊開啟彈窗 (嚴格防冒泡)
  container.querySelectorAll('.postit-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.accordion-toggle') || e.target.closest('.card-select-label') || e.target.closest('input')) {
        return;
      }
      const id = card.id.replace('card-', '');
      openDetailModalById(id, 'cards');
    });
  });

  // 綁定複製摘要按鈕
  container.querySelectorAll('.btn-copy-card').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      const act = activitiesData.find(a => a.id === id);
      if (act) copyActivitySummary(act);
    });
  });

  // 渲染位於統計圖表卡片內的社員快速篩選按鈕
  renderMemberQuickFilterChips();
}


// ==========================================================================
// 書籤圖標與喜好選取系統 (比照使用者附圖樣式)
// ==========================================================================
function getBookmarkSVG(isMarked) {
  if (isMarked) {
    return `<svg class="card-bookmark-svg is-solid" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <defs>
        <linearGradient id="solidBmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffe699"/>
          <stop offset="30%" stop-color="#ffb7a4"/>
          <stop offset="70%" stop-color="#f472b6"/>
          <stop offset="100%" stop-color="#fb7185"/>
        </linearGradient>
      </defs>
      <path d="M 5 4.8 C 5 3.8 5.8 3 6.8 3 L 17.2 3 C 18.2 3 19 3.8 19 4.8 L 19 20.2 C 19 21.0 18.1 21.5 17.4 21.0 L 12 17.2 L 6.6 21.0 C 5.9 21.5 5 21.0 5 20.2 Z" 
            fill="url(#solidBmGrad)" 
            stroke="url(#solidBmGrad)" 
            stroke-width="1" 
            stroke-linejoin="round"/>
    </svg>`;
  } else {
    return `<svg class="card-bookmark-svg is-hollow" viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
      <path d="M 5 4.8 C 5 3.8 5.8 3 6.8 3 L 17.2 3 C 18.2 3 19 3.8 19 4.8 L 19 20.2 C 19 21.0 18.1 21.5 17.4 21.0 L 12 17.2 L 6.6 21.0 C 5.9 21.5 5 21.0 5 20.2 Z" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2.2" 
            stroke-linecap="round" 
            stroke-linejoin="round"/>
    </svg>`;
  }
}

function updateBookmarkButtons(id, isMarked) {
  const card = document.getElementById(`card-${id}`);
  if (card) {
    const btn = card.querySelector('.btn-bookmark-toggle');
    if (btn) {
      btn.classList.toggle('active', isMarked);
      btn.title = isMarked ? '已標記心願 (點擊取消)' : '未標記心願 (點擊收藏)';
      btn.innerHTML = getBookmarkSVG(isMarked);
    }
  }
  if (currentModalActId === id) {
    updateModalFavBtn(id);
  }
}

function toggleUnifiedBookmark(id) {
  const act = activitiesData.find(a => a.id === id);
  const title = act ? act.title : id;
  const isCurrentlyMarked = favoriteIds.has(id);
  const nextMarked = !isCurrentlyMarked;

  if (nextMarked) {
    favoriteIds.add(id);
    selectedActivityIds.add(id);
    if (favoritesSessionPool) favoritesSessionPool.add(id);
    showToast(`已收藏「${title}」至心願清單！❤️`);
  } else {
    favoriteIds.delete(id);
    selectedActivityIds.delete(id);
    if (currentCategory === 'favorites') {
      if (!favoritesUnmarkedList.includes(id)) {
        favoritesUnmarkedList.push(id);
      }
    }
    showToast(`已取消收藏「${title}」。`);
  }

  saveFavorites();
  saveSelectedActivities();
  updateBookmarkButtons(id, nextMarked);
  updateSharePreviewList();
}

// 產生單張卡片 HTML (結合書籤、A540教室、小獎品)
function createCardHTML(act) {
  const isMarked = favoriteIds.has(act.id);
  const notesList = (act.extraNotes || []).map(note => `<li>${note}</li>`).join('');
  const scheduleRows = (act.schedule || []).map(s => `
    <div class="schedule-row">
      <span class="schedule-time">${s.time}</span>
      <span class="schedule-item">${s.item}</span>
    </div>
  `).join('');
  const supplyPills = (act.supplies || []).map(sup => `
    <span class="supply-tag">${sup}</span>
  `).join('');

  return `
    <article class="postit-card card-${act.subTypeKey || 'casual'}" id="card-${act.id}">
      <div class="card-header">
        <div class="card-badges-left">
          <span class="badge-category">${act.category}</span>
          <span class="badge-subtype badge-${act.subTypeKey}">${act.subType || ''}</span>
        </div>
        <button 
          class="btn-bookmark-toggle ${isMarked ? 'active' : ''}" 
          data-id="${act.id}" 
          type="button" 
          title="${isMarked ? '已標記心願 (點擊取消)' : '未標記心願 (點擊收藏)'}"
          onclick="event.stopPropagation(); toggleUnifiedBookmark('${act.id}')"
        >
          ${getBookmarkSVG(isMarked)}
        </button>
      </div>

      <div class="card-body">
        <h3 class="card-title">${act.title}</h3>
        <p class="card-subtitle">${act.subtitle}</p>

        <div class="card-summary">
          ${act.summary}
        </div>

        <div class="card-meta-list">
          <div><strong>規模：</strong>${act.participants}</div>
          <div><strong>時長：</strong>${act.duration}</div>
          <div><strong>地點：</strong><span class="location-badge">A540 教室</span></div>
          <div><strong>亮點：</strong>${act.highlight}</div>
        </div>

        <div class="accordion-container">
          <div class="accordion-item">
            <button class="accordion-toggle" type="button">
              <span>📌 更多介紹與活動小叮嚀 (${(act.extraNotes || []).length} 條)</span>
              <span class="accordion-arrow">▼</span>
            </button>
            <div class="accordion-content">
              <ul class="notes-list">${notesList}</ul>
            </div>
          </div>

          <div class="accordion-item">
            <button class="accordion-toggle" type="button">
              <span>🗓️ 活動時程安排 (${(act.schedule || []).length} 階段)</span>
              <span class="accordion-arrow">▼</span>
            </button>
            <div class="accordion-content">
              <div class="schedule-list">${scheduleRows}</div>
            </div>
          </div>

          <div class="accordion-item">
            <button class="accordion-toggle" type="button">
              <span>🎒 準備物資與小獎品</span>
              <span class="accordion-arrow">▼</span>
            </button>
            <div class="accordion-content">
              <p style="margin-bottom: 6px; color: #f59e0b; font-weight: 600;">💰 預估預算：${act.budget}</p>
              <div class="tag-pills-wrap">${supplyPills}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="card-footer">
        <button class="btn-card-detail" data-id="${act.id}" type="button">
          <svg class="mono-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
          <span>查看完整企劃書</span>
        </button>
        <button class="btn-copy-card" data-id="${act.id}" title="複製企劃摘要發給幹部群" type="button">
          <svg class="mono-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
        </button>
      </div>
    </article>
  `;
}

// ==========================================================================
// 3. 活動詳細 Modal 彈窗與自適應前後切換 (Navigation Engine)
// ==========================================================================
function openDetailModalById(id, contextSource) {
  const act = activitiesData.find(a => a.id === id);
  if (!act) return;

  // 自適應上下文池更新
  if (contextSource === 'cards') {
    currentModalContextPool = getFilteredActivities();
  } else if (contextSource === 'ranked') {
    // 依排行榜順序
    const voteCounts = {};
    memberVotes.forEach(v => (v.selectedIds || []).forEach(x => voteCounts[x] = (voteCounts[x] || 0) + 1));
    currentModalContextPool = Object.keys(voteCounts)
      .map(k => activitiesData.find(a => a.id === k))
      .filter(Boolean)
      .sort((a, b) => (voteCounts[b.id] || 0) - (voteCounts[a.id] || 0));
  } else if (contextSource && contextSource.startsWith('member-')) {
    const memberId = contextSource.replace('member-', '');
    const vote = memberVotes.find(v => v.id === memberId);
    if (vote) {
      currentModalContextPool = (vote.selectedIds || []).map(x => activitiesData.find(a => a.id === x)).filter(Boolean);
    }
  }

  if (!currentModalContextPool || currentModalContextPool.length === 0) {
    currentModalContextPool = activitiesData;
  }

  openDetailModal(act);
}

// 切換至上一項活動
function navigatePrevActivity() {
  if (!currentModalActId) return;
  const pool = (currentModalContextPool && currentModalContextPool.length > 0) ? currentModalContextPool : activitiesData;
  const idx = pool.findIndex(a => a.id === currentModalActId);
  if (idx > 0) {
    openDetailModal(pool[idx - 1]);
  } else {
    openDetailModal(pool[pool.length - 1]);
  }
}

// 切換至下一項活動
function navigateNextActivity() {
  if (!currentModalActId) return;
  const pool = (currentModalContextPool && currentModalContextPool.length > 0) ? currentModalContextPool : activitiesData;
  const idx = pool.findIndex(a => a.id === currentModalActId);
  if (idx >= 0 && idx < pool.length - 1) {
    openDetailModal(pool[idx + 1]);
  } else {
    openDetailModal(pool[0]);
  }
}

// 更新 Modal 彈窗內的喜好按鈕樣式 (右上方放置喜好標籤，採用原有標誌按鍵)
function updateModalFavBtn(id) {
  if (currentModalActId !== id) return;
  const isFav = favoriteIds.has(id);
  const btn = document.getElementById('modalHeaderFavBtn');
  const icon = document.getElementById('modalHeaderFavIcon');
  const text = document.getElementById('modalHeaderFavText');
  if (btn) {
    btn.classList.toggle('active', isFav);
    btn.title = isFav ? '已標記心願 (點擊取消)' : '未標記心願 (點擊收藏)';
    btn.onclick = (e) => {
      e.stopPropagation();
      toggleUnifiedBookmark(id);
    };
  }
  if (icon) {
    icon.innerHTML = getBookmarkSVG(isFav);
  }
  if (text) {
    text.textContent = isFav ? '已標記心願' : '標記心願';
  }
}

// 更新 Modal 內的狀態按鈕樣式
function updateModalStatusControls(actId) {
  if (currentModalActId !== actId) return;
  const currentStatus = activityStatuses[actId] || 'none';
  document.querySelectorAll('.btn-status-toggle').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.status === currentStatus);
  });
}

// 開啟詳細 Modal 彈窗
function openDetailModal(act) {
  currentModalActId = act.id;
  const modal = document.getElementById('modalBackdrop');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitleText = document.getElementById('modalSubtitleText');
  const modalNavCounter = document.getElementById('modalNavCounter');
  const modalBody = document.getElementById('modalBody');

  if (modalTitle) modalTitle.textContent = act.title;
  if (modalSubtitleText) modalSubtitleText.textContent = `${act.category} · ${act.subType || ''} | ${act.subtitle}`;

  // 更新進度計數器
  const pool = (currentModalContextPool && currentModalContextPool.length > 0) ? currentModalContextPool : activitiesData;
  const curIdx = pool.findIndex(a => a.id === act.id);
  if (modalNavCounter) {
    if (curIdx >= 0) {
      modalNavCounter.textContent = `(${curIdx + 1} / ${pool.length})`;
    } else {
      modalNavCounter.textContent = `(1 / ${pool.length})`;
    }
  }

  const scheduleHTML = (act.schedule || []).map(s => `
    <div style="display: flex; gap: 12px; padding: 6px 0; border-bottom: 1px dashed rgba(255,255,255,0.06);">
      <strong style="color: #38bdf8; min-width: 100px;">${s.time}</strong>
      <span>${s.item}</span>
    </div>
  `).join('');

  const notesHTML = (act.extraNotes || []).map(n => `<li style="margin-bottom: 6px;">${n}</li>`).join('');
  const suppliesHTML = (act.supplies || []).map(s => `<li style="margin-bottom: 4px;">${s}</li>`).join('');
  
  const currentStatus = activityStatuses[act.id] || 'none';
  const savedNote = activityNotes[act.id] || '';
  const isSelected = selectedActivityIds.has(act.id);

  modalBody.innerHTML = `
    <!-- 1. 活動企劃：做甚麼與時程表 (第一順位，標題正下方，如附圖二) -->
    <div class="modal-section modal-section-lead">
      <div class="modal-section-title">
        <svg class="mono-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        <span>活動企劃：我們要做什麼？</span>
      </div>
      <p class="modal-lead-summary">${act.summary}</p>
      <div class="modal-highlight-box">
        <strong>✨ 特色亮點：</strong>${act.highlight}
      </div>
      
      <div style="margin-top: 14px;">
        <div class="modal-subheading">⏱️ 完整活動時程表</div>
        <div class="modal-schedule-container">${scheduleHTML}</div>
      </div>
    </div>

    <!-- 2. 活動基本資訊 (第二順位，活動企劃下方，地點鎖定 A540 教室) -->
    <div class="modal-section">
      <div class="modal-section-title">
        <svg class="mono-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        <span>活動基本資訊</span>
      </div>
      <div class="modal-info-grid">
        <div><strong>👥 人數規模：</strong>${act.participants}</div>
        <div><strong>⏳ 預估耗時：</strong>${act.duration}</div>
        <div><strong>📍 活動地點：</strong><span class="location-badge">A540 教室</span></div>
        <div><strong>💰 預算預估：</strong>${act.budget}</div>
        <div><strong>🎁 競賽獎勵：</strong><span class="prize-badge">小獎品</span></div>
      </div>
    </div>

    <!-- 3. 規則公約與社員須知 -->
    <div class="modal-section">
      <div class="modal-section-title">
        <svg class="mono-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
        <span>規則公約與社員須知</span>
      </div>
      <pre class="modal-rules-box">${act.rules}</pre>
    </div>

    <!-- 4. 現場必備器材與物資 -->
    <div class="modal-section">
      <div class="modal-section-title">
        <svg class="mono-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
        <span>現場必備器材與物資</span>
      </div>
      <ul class="modal-supplies-list">${suppliesHTML}</ul>
    </div>
  `;

  // 同步右上方喜好標籤按鈕狀態
  updateModalFavBtn(act.id);

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('modalBackdrop');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
  currentModalActId = null;
}

// 命運抽卡！
function triggerGachaDraw() {
  const gachaOverlay = document.getElementById('gachaOverlay');
  const gachaResultText = document.getElementById('gachaResultText');
  const gachaResultDetail = document.getElementById('gachaResultDetail');

  if (!gachaOverlay) return;

  const currentPool = getFilteredActivities();
  const targetPool = currentPool.length > 0 ? currentPool : activitiesData;

  gachaOverlay.classList.add('active');
  gachaResultText.textContent = "祈願連線中...命運星軌轉動中！⭐";
  gachaResultDetail.textContent = `正在從當前 ${targetPool.length} 份企劃中抽出最佳活動...`;

  setTimeout(() => {
    const randomAct = targetPool[Math.floor(Math.random() * targetPool.length)];
    
    gachaHistory.unshift({
      id: randomAct.id,
      title: randomAct.title,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      category: randomAct.category
    });
    if (gachaHistory.length > 10) gachaHistory.pop();
    try {
      localStorage.setItem(STORAGE_KEYS.GACHA_HISTORY, JSON.stringify(gachaHistory));
    } catch (e) {}

    gachaResultText.textContent = `🎉 恭喜抽出：${randomAct.title}！`;
    gachaResultDetail.innerHTML = `
      <div style="font-size: 1.1rem; color: #f59e0b; margin-top: 8px; font-weight: bold;">
        【${randomAct.category} · ${randomAct.subType || ''}】${randomAct.subtitle}
      </div>
      <p style="margin-top: 10px; color: #e2e8f0;">${randomAct.summary}</p>
      <div style="margin-top: 20px;">
        <button class="btn-action" id="btnGoToRandomCard" style="background: linear-gradient(135deg, #f59e0b, #ef4444); color: #fff; font-weight: bold; padding: 10px 24px;">
          👉 立即查看這份企劃
        </button>
        <button class="btn-action" id="btnCloseGacha" style="margin-left: 10px; padding: 10px 18px;">
          關閉
        </button>
      </div>
    `;

    document.getElementById('btnCloseGacha').onclick = () => {
      gachaOverlay.classList.remove('active');
    };

    document.getElementById('btnGoToRandomCard').onclick = () => {
      gachaOverlay.classList.remove('active');
      openDetailModalById(randomAct.id, 'gacha');
      const targetCard = document.getElementById(`card-${randomAct.id}`);
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetCard.style.outline = '3px solid #f59e0b';
        setTimeout(() => targetCard.style.outline = '', 3000);
      }
    };
  }, 1200);
}

// 複製企劃摘要
function copyActivitySummary(act) {
  const isFavText = favoriteIds.has(act.id) ? " (已標註喜好 ❤️)" : "";
  const status = activityStatuses[act.id] ? ` [狀態: ${activityStatuses[act.id]}]` : "";
  const text = `【北商米遊同好會活動企劃】${act.title}${isFavText}${status}\n分類：${act.category} (${act.subType || ''})\n人數：${act.participants} | 預計時間：${act.duration}\n地點：${act.location}\n亮點：${act.highlight}\n介紹：${act.summary}`;
  navigator.clipboard.writeText(text).then(() => {
    showToast(`已成功複製「${act.title}」活動摘要！`);
  });
}

// 複製完整企劃 Markdown
function copyFullActivityPlan(act) {
  const statusLabel = {
    'wish': '想參加 🙋',
    'planned': '籌備中 📝',
    'completed': '已舉辦 ✅',
    'none': '未安排'
  }[activityStatuses[act.id] || 'none'];

  const userNote = activityNotes[act.id] ? `\n\n## 幹部私房備忘錄\n${activityNotes[act.id]}` : '';

  const text = `# 【活動企劃書】${act.title}
- 所屬分類：${act.category} · ${act.subType || ''} (${act.subtitle})
- 人數規模：${act.participants}
- 預計耗時：${act.duration}
- 建議地點：${act.location}
- 預算估計：${act.budget}
- 當前狀態：${statusLabel}${userNote}

## 一、活動概念與亮點
${act.summary}
★ 核心亮點：${act.highlight}

## 二、活動流程
${(act.schedule || []).map(s => `- **${s.time}**：${s.item}`).join('\n')}

## 三、規則公約
${act.rules}

## 四、物資清單
${(act.supplies || []).map(s => `- ${s}`).join('\n')}

## 五、幹部額外附註
${(act.extraNotes || []).map(n => `- ${n}`).join('\n')}

## 六、三位社員交叉對比審查評語
- **⚔️ 阿鐵 (硬核深淵技術黨)**：${((act.subType === '競技' || act.subType === '衝分')) ? '⭐⭐⭐⭐⭐ 極限壓輪、無傷走位與四星逆襲最考驗實力，規則公平且充滿熱血！' : (act.subType === '休閒') ? '不拼極限數值，大家同屏抽卡開盲盒氣氛極好，深淵打累後的最佳放鬆！' : '原以為手殘做不出來，但配備預製模具與速乾燈，連我這種只會按鍵盤的人都能一次成功！'}
- **☕ 悠悠 (佛系休閒氛圍黨)**：${(act.subType === '休閒') ? '⭐⭐⭐⭐⭐ 徹底告別劇本殺與上台簡報！零社恐、零尷尬，喝奶茶吃炸雞聊天超快樂！' : ((act.subType === '競技' || act.subType === '衝分')) ? '不用擔心自己練度不夠，現場設有觀戰競猜席與雙人手把賽，看神仙打架也超爽！' : '邊播原聲帶音樂邊動手捏周邊，完成後拍照發限動超級吸睛，完全沒時間壓力！'}
- **🎨 奇奇 (文創手作生活黨)**：${((act.subType === '手作' || act.subType === '動手製作')) ? '⭐⭐⭐⭐⭐ 無毒材料、嚴格控制在 90 分鐘內完工，100% 把精緻實體周邊帶回家！' : (act.subType === '休閒') ? '零食盲測評分與盲盒互換很有社交溫度，拍照紀錄發社刊超級好看！' : '賽後頒發手作專屬壓克力獎牌，並設有「手殘抽象搞笑獎」，人人有獎！'}
`;
  navigator.clipboard.writeText(text).then(() => {
    showToast(`已複製完整「${act.title}」企劃書 Markdown！`);
  });
}

// 匯出 JSON 檔案
function exportActivitiesJson() {
  const exportData = {
    activities: activitiesData,
    userState: {
      favorites: Array.from(favoriteIds),
      selected: Array.from(selectedActivityIds),
      statuses: activityStatuses,
      notes: activityNotes,
      memberVotes: memberVotes,
      exportTime: new Date().toISOString()
    }
  };
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `activities_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast("已成功下載包含個人備忘、投票統計與狀態的完整備份 JSON！");
}

// 輕量 Toast 提示
function showToast(message) {
  let toast = document.getElementById('toastMsg');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastMsg';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

// ==========================================================================
// 4. 掛載所有外部呼叫函式至 window (確保 inline HTML 安全呼叫)
// ==========================================================================
window.activitiesData = activitiesData;
window.memberVotes = memberVotes;
window.favoriteIds = favoriteIds;
window.selectedActivityIds = selectedActivityIds;
window.handleCategoryTabSwitch = handleCategoryTabSwitch;
window.renderStatsView = renderStatsView;
window.renderCards = renderCards;
window.importMemberShareCode = importMemberShareCode;
window.loadDemoVotesAction = loadDemoVotesAction;
window.deleteMemberVote = deleteMemberVote;
window.clearAllMemberVotes = clearAllMemberVotes;
window.generateAndCopyShareCode = generateAndCopyShareCode;
window.toggleUnifiedBookmark = toggleUnifiedBookmark;
window.updateVoteBadges = updateVoteBadges;

window.openDetailModalById = openDetailModalById;
window.openDetailModal = openDetailModal;
window.closeModal = closeModal;
window.navigatePrevActivity = navigatePrevActivity;
window.navigateNextActivity = navigateNextActivity;
window.toggleSelectActivity = toggleSelectActivity;
window.openShareModal = openShareModal;
window.closeShareModal = closeShareModal;
window.resetAllFilters = resetAllFilters;
window.handleBackupFileUpload = handleBackupFileUpload;

window.openPrizeModal = openPrizeModal;
window.closePrizeModal = closePrizeModal;
window.togglePrizeSelection = togglePrizeSelection;
window.updatePrizeBadge = updatePrizeBadge;
window.updateModalFavBtn = updateModalFavBtn;


// 設置分享彈窗快速推薦標籤按鈕點擊
function setupQuickTagButtons() {
  document.querySelectorAll('.tag-chip-btn').forEach(btn => {
    btn.onclick = function() {
      const field = this.getAttribute('data-field');
      const tag = this.getAttribute('data-tag');
      const targetInput = field === 'interests' 
        ? document.getElementById('shareUserInterests') 
        : document.getElementById('shareUserSpecialties');
      if (!targetInput) return;
      
      const currentVal = targetInput.value.trim();
      const existing = currentVal ? currentVal.split(/[,，、\s]+/).map(s => s.trim()).filter(Boolean) : [];
      if (!existing.includes(tag)) {
        existing.push(tag);
        targetInput.value = existing.join(', ');
      }
    };
  });
}
