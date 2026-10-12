/**
 * 米哈遊社團活動企劃書系統 - 核心前端邏輯 (app.js)
 * 支援 9 項精選社團活動企劃、LocalStorage 本機狀態持久化、
 * 活動勾選匯出/分享碼、匯入社員投票、統計排行榜 (由高到低/點擊預覽)、
 * 長條圓餅圖表、方框社員清單、以及詳細彈窗前後切換與備份還原功能。
 */

// 備用內建完整資料（防止直接以 file:// 協定開啟時受限於瀏覽器 CORS）
const FALLBACK_ACTIVITIES = [
  {
    "id": "act-casual-01",
    "title": "🍿 1. 新番同樂會 × 社長帳號健檢",
    "subtitle": "看最新動漫、吃點心！社長現場親自幫看帳號、研究破關攻略",
    "category": "米哈遊社團 / 休閒交流",
    "categoryKey": "all",
    "subType": "休閒",
    "subTypeKey": "casual",
    "badgeColor": "#06b6d4",
    "participants": "全體社員 (自由入座交流，自備零食茶水)",
    "duration": "2 小時",
    "location": "社團活動室 / 多媒體教室",
    "summary": "看最新動漫、吃點心！社長現場親自幫看帳號、研究破關攻略。現場備妥點心與茶水，社員齊聚一堂放鬆同樂看新番；社長更會親自下場，一對一幫大家看帳號、健檢聖遺物與配隊，給出最實用的通關建議！",
    "highlight": "看最新動漫、吃點心！社長現場親自幫看帳號、研究破關攻略！",
    "gameStages": [
      "當季最新人氣熱血新番同樂放映與二創賞析",
      "版本高難深淵 / 混沌 / 防衛戰帳號一對一健檢",
      "聖遺物 / 遺器 / 驅動盤詞條健檢與配隊優化",
      "玄學代抽代強化同樂時刻"
    ],
    "schedule": [
      {
        "time": "18:30 - 19:15",
        "item": "新番同樂放映廳、享用點心茶水交流"
      },
      {
        "time": "19:15 - 20:00",
        "item": "社長親自 1 對 1 投屏帳號健檢、破關攻略探討"
      },
      {
        "time": "20:00 - 20:30",
        "item": "全場代抽代強化玄學時刻、大合照交流結語"
      }
    ],
    "supplies": [
      "大螢幕投影機、同屏轉接設備與音響",
      "各遊速度軸與有效詞條對照速查手冊",
      "茶水飲料與派對零食餅乾點心"
    ],
    "budget": "約 300 ~ 450 元（零食飲料開銷）",
    "rules": "1. 健檢採排隊叫號制，每人限諮詢一組主力挑戰陣容以保證全員時間。\n2. 諮詢前請先備妥角色面板與武器截圖。\n3. 玄學代抽強化純屬同樂交流，請平常心看待結果。",
    "extraNotes": [
      "【附註 1：不限單一遊戲】無論是原神、星鐵、絕區零或其他手遊均可諮詢！",
      "【附註 2：萌新完全友善】練度不足或卡關的萌新社員亦強烈推薦前來交流！"
    ]
  },
  {
    "id": "act-casual-02",
    "title": "🍿 2. 派對遊戲大亂鬥 × 零食爽爽吃",
    "subtitle": "揪團開打 Switch 派對遊戲！現場備妥滿滿零食飲料，歡樂對決無壓力，來看看誰才是社團的派對遊戲王！",
    "category": "米哈遊社團 / 休閒同樂",
    "categoryKey": "all",
    "subType": "休閒",
    "subTypeKey": "casual",
    "badgeColor": "#3b82f6",
    "participants": "全體社員 (自由組隊 / 輪替對決)",
    "duration": "2 小時",
    "location": "社團活動室 / 娛樂多功能室",
    "summary": "揪團開打 Switch 派對遊戲！現場備妥滿滿零食飲料，歡樂對決無壓力，來看看誰才是社團的派對遊戲王！多款熱門多人同樂遊戲輪番上陣，邊吃零食邊打電動，徹底釋放課業壓力！",
    "highlight": "揪團開打 Switch 派對遊戲！現場備妥滿滿零食飲料，歡樂對決無壓力，來看看誰才是社團的派對遊戲王！",
    "gameStages": [
      "任天堂 Switch 派對大亂鬥系列",
      "馬力歐賽車競速同樂賽",
      "節奏與搞笑合作闖關遊戲",
      "派對遊戲王趣味積分爭霸"
    ],
    "schedule": [
      {
        "time": "18:30 - 18:45",
        "item": "零食飲料自助吧開放、派對遊戲分組"
      },
      {
        "time": "18:45 - 19:40",
        "item": "Switch 派對遊戲輪替大亂鬥"
      },
      {
        "time": "19:40 - 20:15",
        "item": "「社團派對遊戲王」四強巔峰對決"
      },
      {
        "time": "20:15 - 20:30",
        "item": "頒發零食大獎、合照同樂交流"
      }
    ],
    "supplies": [
      "Switch 主機、底座與 4 組原廠無線手把",
      "派對同樂遊戲多款",
      "豐富零食大禮包、汽水與無糖茶飲"
    ],
    "budget": "約 350 ~ 500 元（派對零食飲品採購）",
    "rules": "1. 輪流上場體驗，每局遊戲結束後自動換人。\n2. 愛惜社團主機與手把設備。\n3. 重在娛樂交流，友誼第一、勝負第二！",
    "extraNotes": [
      "【附註 1：歡迎自備手把】社員亦可自備習慣之 Switch 手把前來同樂！",
      "【附註 2：休閒觀戰無壓力】不想操作的社員亦可在沙發區享用零食加油觀戰！"
    ]
  },
  {
    "id": "act-casual-03",
    "title": "🎮 3. 絕區零桌遊同人桌遊",
    "subtitle": "揪團化身繩匠探索空洞！透過簡單好上手的桌遊來一場歡樂對決，一同爭奪空洞寶物！",
    "category": "米哈遊社團 / 桌遊體驗",
    "categoryKey": "zzz",
    "subType": "休閒",
    "subTypeKey": "casual",
    "badgeColor": "#eab308",
    "participants": "12 ~ 20 人 (4~5 人一桌開局)",
    "duration": "2 小時",
    "location": "社團活動室 / 研討室",
    "summary": "揪團化身繩匠探索空洞！透過簡單好上手的桌遊來一場歡樂對決，一同爭奪空洞寶物！規則精簡好學，一分鐘新手教學即可迅速開局，在棋盤上重現新艾利都的刺激探索與歡樂坑隊友時光！",
    "highlight": "揪團化身繩匠探索空洞！透過簡單好上手的桌遊來一場歡樂對決，一同爭奪空洞寶物！",
    "gameStages": [
      "空洞格子探索與隨機事件觸發",
      "邦布夥伴支援卡牌聯動",
      "珍稀空洞寶物爭奪與防禦",
      "繩匠個人成就與積分結算"
    ],
    "schedule": [
      {
        "time": "18:30 - 18:45",
        "item": "桌遊背景與角色卡牌展示、一分鐘規則教學"
      },
      {
        "time": "18:45 - 19:15",
        "item": "第一輪試玩熱身回合"
      },
      {
        "time": "19:15 - 20:10",
        "item": "正式空洞探索奪寶大賽"
      },
      {
        "time": "20:10 - 20:30",
        "item": "積分結算、空洞寶物紀念獎派發與合影"
      }
    ],
    "supplies": [
      "絕區零同人主題桌遊實體套件 3~4 組",
      "角色立牌棋子與特製空洞骰子",
      "遊戲專用保護牌套與籌碼幣"
    ],
    "budget": "約 250 ~ 350 元（耗材牌套與獎勵小禮品）",
    "rules": "1. 遵循輪抽與出牌順序，嚴禁提前偷看空洞事件牌堆。\n2. 每回合出牌思考時間建議在 60 秒內以保流暢度。\n3. 尊重桌遊配件，保持桌面整潔。",
    "extraNotes": [
      "【附註 1：完全零門檻】無需任何桌遊經驗，幹部現場同桌引導，新手隨時加入！",
      "【附註 2：沉浸體驗】現場播放新艾利都爵士電子背景音樂，氛圍感拉滿！"
    ]
  },
  {
    "id": "act-game-01",
    "title": "🤝 雙人合體挑戰：鍵鼠極限分工",
    "subtitle": "一人控鍵盤走位、一人握滑鼠輸出！挑戰極限分工，看看誰才是神隊友，高分過關即可抽獎！",
    "category": "米哈遊社團 / 關卡挑戰",
    "categoryKey": "all",
    "subType": "遊戲",
    "subTypeKey": "score",
    "badgeColor": "#818cf8",
    "participants": "16 ~ 24 人 (2 人一組搭檔)",
    "duration": "2 小時",
    "location": "多媒體教室 / 電腦教室",
    "summary": "一人控鍵盤走位、一人握滑鼠輸出！挑戰極限分工，看看誰才是神隊友，高分過關即可抽獎！兩人合體操控同一角色，一人全權負責走位閃避與切角，一人全權負責瞄準普攻與爆發輸出，默契大考驗！過關達標即獲幸運抽獎機會抱走社團準備的精美獎品！",
    "highlight": "一人控鍵盤走位、一人握滑鼠輸出！挑戰極限分工，看看誰才是神隊友，高分過關即可抽獎！",
    "gameStages": [
      "大世界菁英首領快速討伐戰",
      "深淵/高難關卡限時合體通關",
      "極限分工默契配合防禦生存",
      "通關積分榜結算與抽獎環節"
    ],
    "schedule": [
      {
        "time": "18:30 - 18:45",
        "item": "搭檔分組抽籤、鍵鼠分離操作試機"
      },
      {
        "time": "18:45 - 19:40",
        "item": "預賽挑戰：雙人合體討伐指定精英首領"
      },
      {
        "time": "19:40 - 20:10",
        "item": "決賽巔峰對決：極限生存高分爭霸"
      },
      {
        "time": "20:10 - 20:30",
        "item": "過關幸運抽獎、頒發獎品與合照"
      }
    ],
    "supplies": [
      "雙人鍵盤滑鼠延長集線器與手把",
      "大螢幕實時轉播投屏設備",
      "抽獎箱與社團精美好禮（立牌/徽章/小周邊）"
    ],
    "budget": "約 350 ~ 500 元（抽獎獎品採購與道具）",
    "rules": "1. 鍵盤操控者嚴禁碰觸滑鼠，滑鼠操作者嚴禁碰觸鍵盤。\n2. 每局結束後搭檔可互換職責（鍵盤/滑鼠互換）。\n3. 達成指定擊殺時間或積分門檻，即得抽獎券 1 張！",
    "extraNotes": [
      "【附註 1：娛樂至上】爆笑連連的趣味合作，手殘萌新與手操高手皆能享受無窮樂趣！",
      "【附註 2：自由選角】各組可自由選擇最擅長或最具娛樂效果的角色陣容上場！"
    ]
  },
  {
    "id": "act-game-02",
    "title": "🙈 盲眼指揮挑戰：聲控神救援",
    "subtitle": "一人蒙眼操作、一人隔空指揮！全憑語音默契闖關，看誰能盲操神救援抱走大獎！",
    "category": "米哈遊社團 / 關卡挑戰",
    "categoryKey": "all",
    "subType": "遊戲",
    "subTypeKey": "score",
    "badgeColor": "#ec4899",
    "participants": "16 ~ 24 人 (2 人一組搭檔)",
    "duration": "2 小時",
    "location": "多媒體教室 / 視聽教室",
    "summary": "一人蒙眼操作、一人隔空指揮！全憑語音默契闖關，看誰能盲操神救援抱走大獎！操作者戴上全遮光眼罩盲打，指揮官坐在身後僅能透過語音導航方位、躲避危險紅圈並下達攻擊指令！考驗極限信任與聲控默契，成功上演神救援者抱走大獎！",
    "highlight": "一人蒙眼操作、一人隔空指揮！全憑語音默契闖關，看誰能盲操神救援抱走大獎！",
    "gameStages": [
      "蒙眼盲操走位閃避危險機制",
      "純語音導航攻擊方向與技能時機",
      "極限殘血神救援生死時速",
      "盲操神救援默契大獎爭霸"
    ],
    "schedule": [
      {
        "time": "18:30 - 18:45",
        "item": "發放全新親膚眼罩、聲控指令代號約定"
      },
      {
        "time": "18:45 - 19:35",
        "item": "預賽輪替：盲眼指揮限時生存挑戰"
      },
      {
        "time": "19:35 - 20:10",
        "item": "大螢幕轉播決賽：盲操神救援高光對決"
      },
      {
        "time": "20:10 - 20:30",
        "item": "頒發「盲操神救援」大獎與合影留念"
      }
    ],
    "supplies": [
      "全新親膚透氣遮光眼罩 12 副",
      "雙人長線耳機與麥克風 / 擴音設備",
      "大螢幕投屏轉播",
      "冠亞軍專屬精美大獎（正版立牌/月卡好禮）"
    ],
    "budget": "約 400 ~ 550 元（眼罩耗材與大獎獎品）",
    "rules": "1. 盲操者嚴禁偷看，指揮官嚴禁肢體碰觸操作者，僅能口頭語音提示。\n2. 各組隊員中途需換位，各體驗一次操作者與指揮官。\n3. 比賽設立安全防護，避免操作者手部大幅度碰撞。",
    "extraNotes": [
      "【附註 1：語音黑話允許】允許各組自訂專屬暗號（例如：「左三步」、「開盾」、「轉」等）提高效率！",
      "【附註 2：全場歡樂氣氛】設有「最佳爆笑花絮特別獎」，失誤也能收穫滿堂喝彩！"
    ]
  },
  {
    "id": "act-game-03",
    "title": "⚔️ 17. 平價 VS 奢華 × 深淵卡關攻略",
    "subtitle": "現場實測「奢華課長隊」的秒殺爽感，同時教你用「平價平民隊」打出高質感操作！現場提供滿滿攻略教學與配隊分析，讓你掌握滿星關鍵",
    "category": "米哈遊社團 / 攻略教學",
    "categoryKey": "genshin",
    "subType": "遊戲",
    "subTypeKey": "score",
    "badgeColor": "#f43f5e",
    "participants": "全體社員 (自備帳號 / 現場實操)",
    "duration": "2 小時",
    "location": "電腦教室 / 多功能視聽室",
    "summary": "現場實測「奢華課長隊」的秒殺爽感，同時教你用「平價平民隊」打出高質感操作！現場提供滿滿攻略教學與配隊分析，讓你掌握滿星關鍵！不論是手殘黨還是缺少限定五星的玩家，手把手教你如何用低成本四星陣容打出絲滑輸出軸與極限滿星！",
    "highlight": "現場實測「奢華課長隊」的秒殺爽感，同時教你用「平價平民隊」打出高質感操作！現場提供滿滿攻略教學與配隊分析，讓你掌握滿星關鍵！",
    "gameStages": [
      "奢華滿命課長隊傷害上限與速通視覺震撼",
      "平價平民隊（四星戰神）元素反應循環拆解",
      "怪物走位拉怪技巧與破盾時機點教學",
      "社員卡關現場投屏診斷與即刻調優"
    ],
    "schedule": [
      {
        "time": "18:30 - 18:50",
        "item": "奢華隊 VS 平民隊通關對比實測演示"
      },
      {
        "time": "18:50 - 19:35",
        "item": "平價隊伍配隊公式拆解、輸出手法手把手教學"
      },
      {
        "time": "19:35 - 20:15",
        "item": "社員實機實戰練習、幹部一對一卡關指導"
      },
      {
        "time": "20:15 - 20:30",
        "item": "滿星關鍵技巧總結、Q&A 交流分享"
      }
    ],
    "supplies": [
      "大螢幕投屏設備",
      "各版本深淵攻略指南手冊（彩色印製）",
      "示範帳號（課長頂配號與平民零氪號對比機）"
    ],
    "budget": "約 200 ~ 300 元（攻略講義印製與零食茶水）",
    "rules": "1. 嚴禁帳號密碼外洩，示範操作僅限本機投屏。\n2. 鼓勵使用平民陣容分享交流技巧，拒絕陣容歧視。\n3. 實機練習時間請遵守排隊次序。",
    "extraNotes": [
      "【附註 1：通用配隊心法】本活動教授之輸出軸與拉怪觀念通用於各大動作二次元手遊！",
      "【附註 2：現場發放錦囊】參與社員皆可領取一份「平民滿星速查小卡」！"
    ]
  },
  {
    "id": "act-craft-01",
    "title": "🖨️ 1. 3D列印製作體驗",
    "subtitle": "帶你認識 3D 列印機的操作原理！現場直接上網挑選你想要的模型素材，社團免費幫你印！",
    "category": "米哈遊社團 / 創客手作",
    "categoryKey": "all",
    "subType": "手作",
    "subTypeKey": "craft",
    "badgeColor": "#10b981",
    "participants": "12 ~ 18 人 (自備筆電或社團電腦)",
    "duration": "2 小時",
    "location": "電腦教室 / 創客工坊",
    "summary": "帶你認識 3D 列印機的操作原理！現場直接上網挑選你想要的模型素材，社團免費幫你印！主要是偏教學的活動內容，社團會處理好耗材無須付費，且會盡量讓大家有作品可以帶回家！現場實習切片軟體參數設定，並有樣品拆支撐體驗，個人登記模型課後免費代印！",
    "highlight": "帶你認識 3D 列印機的操作原理！現場直接上網挑選你想要的模型素材，社團免費幫你印！耗材社團處理無須付費，盡量讓大家有作品可以帶回家！",
    "gameStages": [
      "3D 列印機構造解密與 FDM 熔融成型原理",
      "開源模型庫素材挑選（角色立牌/邦布/神之眼）",
      "切片軟體參數設定與排版技巧",
      "實體樣品拆支撐與修件體驗"
    ],
    "schedule": [
      {
        "time": "18:30 - 18:50",
        "item": "3D 列印機成型原理與耗材特性講解"
      },
      {
        "time": "18:50 - 19:30",
        "item": "現場自由挑選模型素材、切片軟體實戰實操"
      },
      {
        "time": "19:30 - 20:10",
        "item": "機台運作觀摩、樣品拆支撐技巧練習"
      },
      {
        "time": "20:10 - 20:30",
        "item": "登記個人專屬模型課後代印、交流大合照"
      }
    ],
    "supplies": [
      "3D 列印機台現場運轉展示",
      "事先印製好的樣品模型供全員練習拆支撐",
      "模型專用修件剪鉗與打磨工具組",
      "開源 3D 模型推薦下載庫清單"
    ],
    "budget": "約 350 ~ 500 元（樣品耗材與五金配件，社團全額吸收）",
    "rules": "1. 耗材社團全額提供，社員無須付費！\n2. 課堂進行切片與樣品實作拆支撐，個人模型登記後由社團排程課後代印取件。\n3. 使用工具時請遵守幹部安全指導。",
    "extraNotes": [
      "【附註 1：無須付費】社團會處理好耗材無須付費，盡量讓大家有作品可以帶回家！",
      "【附註 2：自由選材】原神神之眼、星鐵光錐、絕區零邦布或動漫周邊皆可挑選！"
    ]
  },
  {
    "id": "act-craft-02",
    "title": "✨ 2. 摺紙創作體驗 周邊手作！",
    "subtitle": "一張色紙擁有無限可能，票選有興趣的作品，我們會手把手教學，讓你輕鬆帶走精美成果",
    "category": "米哈遊社團 / 紙藝手作",
    "categoryKey": "all",
    "subType": "手作",
    "subTypeKey": "craft",
    "badgeColor": "#f59e0b",
    "participants": "全體社員 (耗材社團全額提供)",
    "duration": "2 小時",
    "location": "社團活動室 / 美術教室",
    "summary": "一張色紙擁有無限可能，票選有興趣的作品，我們會手把手教學，讓你輕鬆帶走精美成果！主要是偏教學的活動內容，社團會處理好耗材無須付費，且會盡量讓大家有作品可以帶回家！透過巧手將平面的色彩摺疊為立體的二次元角色與道具周邊，滿載成就感！",
    "highlight": "一張色紙擁有無限可能，票選有興趣的作品，我們會手把手教學，讓你輕鬆帶走精美成果！耗材社團處理無須付費，作品輕鬆帶回家！",
    "gameStages": [
      "票選今日人氣周邊主題（角色小偶/立體道具/吉祥物）",
      "摺紙幾何比例與基礎折痕手法示範",
      "手把手步驟教學與細節定型",
      "精美包裝與作品展示"
    ],
    "schedule": [
      {
        "time": "18:30 - 18:45",
        "item": "領取進口專用紙材、票選今日目標摺紙作品"
      },
      {
        "time": "18:45 - 19:35",
        "item": "幹部大螢幕步驟分解、手把手摺疊教學"
      },
      {
        "time": "19:35 - 20:15",
        "item": "五官裝飾、定型加固與精美成果組裝"
      },
      {
        "time": "20:15 - 20:30",
        "item": "包裝成專屬周邊、作品欣賞合照"
      }
    ],
    "supplies": [
      "高品質雙面色紙、珠光摺紙與和紙",
      "摺痕壓棒、細節鑷子與水性白膠",
      "角色五官水貼/表情貼紙組",
      "成品保護透明盒與吊繩配件"
    ],
    "budget": "約 250 ~ 380 元（色紙材料包與配件，社團全額吸收）",
    "rules": "1. 耗材社團全部備妥無須付費，安心體驗創作！\n2. 每個步驟皆有幹部巡場手把手指導，零基礎社員保證學得會。\n3. 親手完成的摺紙周邊作品可直接帶回家收藏！",
    "extraNotes": [
      "【附註 1：零門檻保證】步驟循序漸進，就算是摺紙新手也能輕鬆做出精美成果！",
      "【附註 2：票選決定】現場民主票選最喜愛的作品樣式，做自己最想要的角色！"
    ]
  },
  {
    "id": "act-craft-03",
    "title": "🚀 3. 零程式 AI 建站體驗",
    "subtitle": "想做網站卻不會寫程式？只要會打字就能辦到！現場帶你體驗最新 AI 網頁生成軟體，下指令秒出精美畫面，社團手把手教你輕鬆上手！",
    "category": "米哈遊社團 / 科技實作",
    "categoryKey": "all",
    "subType": "手作",
    "subTypeKey": "craft",
    "badgeColor": "#8b5cf6",
    "participants": "全體社員 (自備手機、平板或筆電均可)",
    "duration": "2 小時",
    "location": "電腦教室 / 多功能活動室",
    "summary": "想做網站卻不會寫程式？只要會打字就能辦到！現場帶你體驗最新 AI 網頁生成軟體，下指令就能秒出精美畫面，社團手把手教你輕鬆上手！主要是偏教學的活動內容，社團會處理好工具無須付費，且會盡量讓大家有作品可以帶回家！當天就能打造出專屬的動漫個人頁、抽卡機或作品展示庫，並教學免費部署發布網址！",
    "highlight": "想做網站卻不會寫程式？只要會打字就能辦到！現場帶你體驗最新 AI 網頁生成軟體，下指令就能秒出精美畫面，社團手把手教你輕鬆上手！",
    "gameStages": [
      "自然語言提示詞（Prompt）直出精美網頁解密",
      "自選主題製作：個人二次元名片 / 抽卡模擬器 / 攻略庫",
      "互動效果與版面色彩個人化下指令微調",
      "免費部署發布、生成可分享專屬網址"
    ],
    "schedule": [
      {
        "time": "18:30 - 18:50",
        "item": "AI 網頁生成工具原理演示與精彩範例展示"
      },
      {
        "time": "18:50 - 19:35",
        "item": "下指令秒出畫面實作：手把手引導社員生成專屬網頁"
      },
      {
        "time": "19:35 - 20:10",
        "item": "個人化調整、免費部署教學並產出個人專屬網址"
      },
      {
        "time": "20:10 - 20:30",
        "item": "成果投屏展示互相體驗、交流合影"
      }
    ],
    "supplies": [
      "投影機與同屏設備",
      "AI 網頁生成示範環境與中文提示詞範本清單",
      "免費部署流程懶人包步驟講義"
    ],
    "budget": "約 150 ~ 250 元（流程講義印製、社團全額吸收）",
    "rules": "1. 全程免付費，工具皆使用免費合法之開源或免費體驗軟體。\n2. 只要會打字、會用中文描述想法即可，完全不需要程式基礎！\n3. 當天完成的網站成果可直接儲存並帶回家線上瀏覽！",
    "extraNotes": [
      "【附註 1：作品帶回家】課堂生成的個人網頁可產生正式網址，直接分享至社群動態！",
      "【附註 2：社團手把手】幹部現場一對一協助排除操作疑問，包教包會！"
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
  USER_GAMES: 'mihoyo_user_games',
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
    games: ["崩鐵", "原神", "絕區"],
    interests: ["動漫新番", "星鐵高難", "3D列印", "模型塗裝"],
    specialties: "3D建模、星鐵排軸計算",
    expectation: "希望能認識更多二次元同好，學會用社團的 3D 列印機印出自己本命角色的專屬光錐與武器！",
    selectedIds: ["act-core-01", "act-core-02", "act-core-03"]
  },
  {
    id: "demo-vote-2",
    name: "悠悠",
    time: "10/10 15:45",
    games: ["原神", "鳴潮", "方舟"],
    interests: ["原神深淵", "二創繪圖", "Cosplay", "動漫新番"],
    specialties: "角色二創插畫、文案策劃、活動主持",
    expectation: "最期待新番同樂會跟帳號健檢！每次深淵都卡關，想讓社長幫忙看看聖遺物怎麼配，也想跟大家交流繪畫！",
    selectedIds: ["act-core-01", "act-core-04", "act-core-05"]
  },
  {
    id: "demo-vote-3",
    name: "奇奇",
    time: "10/10 16:10",
    games: ["絕區", "三角州", "決勝時刻"],
    interests: ["絕區零動作", "影片剪輯", "電競賽事"],
    specialties: "影片剪輯、活動策劃、遊戲配隊攻略",
    expectation: "超想玩一人鍵盤一人滑鼠的雙人挑戰！還有趣味挑戰賽，想看看大家融合後會生出什麼超展開的畫面！",
    selectedIds: ["act-core-03", "act-core-04", "act-core-05"]
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
    const savedGames = localStorage.getItem(STORAGE_KEYS.USER_GAMES);
    const gamesInput = document.getElementById('shareUserGames');
    if (gamesInput && savedGames) gamesInput.value = savedGames;
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
  const myDeviceId = getOrCreateDeviceId();
  listEl.innerHTML = memberVotes.map(v => {
    const isMe = v.deviceId && v.deviceId === myDeviceId;
    return `
    <div style="display: flex; justify-content: space-between; align-items: center; padding: 7px 12px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; font-size: 0.82rem;">
      <div>
        <strong style="color: #f1f5f9;">👤 ${v.name}</strong>
        ${isMe ? `<span class="member-me-badge" style="margin-left: 6px;">本人</span>` : ''}
        <span style="color: #38bdf8; font-size: 0.76rem; margin-left: 8px; font-weight: 600;">(投了 ${v.selectedIds ? v.selectedIds.length : 0} 項)</span>
      </div>
      <span style="color: #94a3b8; font-size: 0.75rem;">${v.time || '已同步'}</span>
    </div>
  `;
  }).join('');
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

  // 若有設定雲端試算表網址，背景自動讀取最新全社心願
  if (getCloudApiUrl()) {
    syncMemberVotesFromCloud(true);
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
    const btnHeaderLottery = document.getElementById('btnHeaderLottery');
    if (btnHeaderLottery) btnHeaderLottery.style.display = 'inline-flex';
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
    const btnHeaderLottery = document.getElementById('btnHeaderLottery');
    if (btnHeaderLottery) btnHeaderLottery.style.display = 'none';
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

  // 12. 社員幸運抽獎彈窗
  const btnHeaderLottery = document.getElementById('btnHeaderLottery');
  const lotteryModalClose = document.getElementById('lotteryModalClose');
  const lotteryModalBackdrop = document.getElementById('lotteryModalBackdrop');
  if (btnHeaderLottery) btnHeaderLottery.addEventListener('click', openLotteryModal);
  if (lotteryModalClose) lotteryModalClose.addEventListener('click', closeLotteryModal);
  if (lotteryModalBackdrop) {
    lotteryModalBackdrop.addEventListener('click', (e) => {
      if (e.target === lotteryModalBackdrop) closeLotteryModal();
    });
  }

  // 鍵盤左右鍵切換前後活動與 ESC 關閉
  document.addEventListener('keydown', (e) => {
    if (document.getElementById('modalBackdrop')?.classList.contains('active')) {
      if (e.key === 'ArrowLeft') navigatePrevActivity();
      if (e.key === 'ArrowRight') navigateNextActivity();
      if (e.key === 'Escape') closeModal();
    } else if (document.getElementById('shareModalBackdrop')?.classList.contains('active')) {
      if (e.key === 'Escape') closeShareModal();
    } else if (document.getElementById('lotteryModalBackdrop')?.classList.contains('active')) {
      if (e.key === 'Escape') closeLotteryModal();
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
  const gamesInput = document.getElementById('shareUserGames');
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
    if (gamesInput) gamesInput.value = Array.isArray(mySub.games) ? mySub.games.join(', ') : (mySub.games || '');
    if (interestsInput) interestsInput.value = Array.isArray(mySub.interests) ? mySub.interests.join(', ') : (mySub.interests || '');
    if (specialtiesInput) specialtiesInput.value = mySub.specialties || '';
    if (expectationInput) expectationInput.value = mySub.expectation || '';
  } else {
    if (nameInput) nameInput.value = localStorage.getItem(STORAGE_KEYS.USER_NICKNAME) || '';
    if (gamesInput) gamesInput.value = localStorage.getItem(STORAGE_KEYS.USER_GAMES) || '';
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

// ==============================================================================
// 預設全體共用之 Google Apps Script 雲端試算表 Web App 網址
// ※ 若在此填入網址，所有造訪 GitHub Pages 的社員將「自動全體連線同一份雲端試算表」！
//    無需每個社員在手機上手動貼上網址。
// ==============================================================================
const DEFAULT_CLOUD_API_URL = 'https://script.google.com/macros/s/AKfycbxUt9hQOHGCsohAzF2Pk5AjP9NgN26R84SjApqxsp4hFDs8rXiAQx8TbNt8BlOpEijU/exec';

// 取得當前設定之雲端 API 網址 (Google Apps Script Web App URL)
function getCloudApiUrl() {
  return localStorage.getItem(STORAGE_KEYS.CLOUD_API_URL) || DEFAULT_CLOUD_API_URL || '';
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
  const mySubRow = document.getElementById('mySubmissionActionRow');
  const mySubSummary = document.getElementById('mySubmissionSummaryText');
  const mySubmissionRaw = localStorage.getItem(STORAGE_KEYS.MY_SUBMISSION);

  if (mySubmissionRaw) {
    try {
      const mySub = JSON.parse(mySubmissionRaw);
      if (btnText) btnText.textContent = '🔄 修改回覆';
      if (hintEl) {
        hintEl.innerHTML = `<span style="color: #10b981;">✅ 本裝置已登錄回覆（最後更新：${mySub.time || '剛才'}）。再次點擊將「修改回覆」並覆蓋雲端紀錄！</span>`;
      }
      if (mySubRow) mySubRow.style.display = 'flex';
      if (mySubSummary) {
        mySubSummary.textContent = `目前登記暱稱：${mySub.name || '熱心社員'} · 標記了 ${mySub.selectedIds ? mySub.selectedIds.length : 0} 項心願企劃`;
      }
      return;
    } catch (e) {}
  }

  if (btnText) btnText.textContent = '☁️ 上傳心願';
  if (hintEl) {
    hintEl.innerHTML = `<span>📱 限制：本裝置限傳送 1 份資料，送出後可隨時在此「修改回覆」或「自行撤回」。</span>`;
  }
  if (mySubRow) mySubRow.style.display = 'none';
}

// 雲端上傳 / 修改回覆處理函式 (限制一裝置僅一份檔案)
async function generateAndCopyShareCode() {
  const nameInput = document.getElementById('shareUserNickname');
  let nickname = nameInput ? nameInput.value.trim() : '';

  if (!nickname) {
    nickname = prompt('請輸入暱稱/名字：');
    if (!nickname) nickname = '熱心社員';
    if (nameInput) nameInput.value = nickname;
  }
  localStorage.setItem(STORAGE_KEYS.USER_NICKNAME, nickname);

  const gamesInput = document.getElementById('shareUserGames');
  const rawGames = gamesInput ? gamesInput.value.trim() : '';
  const gamesArray = rawGames 
    ? rawGames.split(/[,，、\s]+/).map(s => s.trim()).filter(Boolean)
    : [];
  localStorage.setItem(STORAGE_KEYS.USER_GAMES, rawGames);

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
    games: gamesArray,
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
          games: gamesArray,
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
  if (!cloudUrl) {
    if (!silent) {
      const wantSet = confirm(
        '⚠️ 尚未連線 Google 試算表雲端資料庫！\n\n' +
        '原因說明：\n' +
        'GitHub Pages 為靜態網站，其他社員在手機上填寫的心願，需要透過一組共用的「Google Apps Script Web App 網址」匯集到同一個 Google 試算表。\n\n' +
        '目前系統尚未設定該雲端網址。\n' +
        '點擊「確定」可立即前往設定貼上您的 Google Apps Script 雲端網址！'
      );
      if (wantSet) configureCloudApiUrl();
    }
    return;
  }

  if (!silent) showToast('☁️ 正在連線 Google 試算表讀取最新資料...');

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
          // 容錯防護：若 Apps Script 欄位位移導致 selectedIds 存於 time 欄位，自動智能修復
          if ((!item.selectedIds || item.selectedIds.length === 0) && typeof item.time === 'string' && item.time.startsWith('[')) {
            try {
              item.selectedIds = JSON.parse(item.time);
              if (item.updatedAt) {
                const d = new Date(item.updatedAt);
                item.time = !isNaN(d.getTime())
                  ? d.toLocaleString([], { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
                  : '剛才';
              } else {
                item.time = '剛才';
              }
            } catch(e) {}
          }
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
        if (result.data.length > 0) {
          showToast(`☁️ 已從雲端同步載入 ${result.data.length} 位社員的心願與卡片！`);
        } else {
          showToast(`☁️ 雲端試算表已連線成功！目前試算表尚無社員填寫紀錄。`);
        }
      }
    } else {
      if (!silent) {
        showToast(`⚠️ 雲端讀取異常：${(result && result.message) || '資料格式不符'}`);
      }
    }
  } catch (err) {
    console.warn('從雲端同步失敗：', err);
    if (!silent) {
      alert(
        '❌ 雲端試算表連線失敗！\n\n' +
        '可能原因：\n' +
        '1. Google Apps Script 部署作業的「誰可以存取」尚未設定為「所有人 (Anyone)」。\n' +
        '2. 雲端網址輸入有誤或網路連線受阻。\n\n' +
        '錯誤詳情：' + err.message
      );
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
    let parsedGames = [];
    if (Array.isArray(payload.games)) {
      parsedGames = payload.games;
    } else if (typeof payload.games === 'string' && payload.games.trim()) {
      parsedGames = payload.games.split(/[,，、\s]+/).map(s => s.trim()).filter(Boolean);
    }

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
      games: parsedGames,
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
  showToast("💡 為保護社員心願，公開看板不支援隨意刪除他人資料！請由該社員於「上傳心願」分享處自行撤回。");
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
      <div class="lottery-hero-banner">
        <div class="lottery-hero-left">
          <span class="lottery-hero-icon">🎁</span>
          <div class="lottery-hero-text">
            <h4>社員幸運抽獎活動進行中！</h4>
            <p>目前名單中共計 ${memberVotes.length} 位社員具備抽獎資格，點擊隨機抽出幸運得主！</p>
          </div>
        </div>
        <button type="button" class="btn-lottery-hero-action" onclick="openLotteryModal()">
          <span>🎲</span>
          <span>開啟社員抽獎 (候選 ${memberVotes.length} 人)</span>
        </button>
      </div>

      <div class="empty-state" style="padding: 70px 20px;">
        <div class="empty-state-icon">📊</div>
        <h3>目前尚無任何社員投票紀錄</h3>
        <p>邀請社員勾選心儀活動並匯出分享碼，在此匯入後即可生成熱門排行與圓餅統計！</p>
        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-top: 18px;">
          <button class="btn-action btn-primary" onclick="handleCategoryTabSwitch('all')" style="background: #f59e0b; color: #1e1b18; font-weight: 700; padding: 0 22px; height: 40px; border-radius: 9999px; cursor: pointer; border: none; font-size: 0.9rem;">
            📋 返回活動企劃庫 (瀏覽 ${activitiesData.length} 份活動)
          </button>
          <button class="btn-action" onclick="openLotteryModal()" style="background: linear-gradient(135deg, #f59e0b, #ec4899); color: #fff; padding: 0 18px; height: 40px; border-radius: 9999px; cursor: pointer; border: none; font-size: 0.9rem; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;">
            🎁 社員幸運抽獎
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
    <!-- 統計看板頂部導航與標題 (質感卡片配色，告別暗灰色) -->
    <div class="stats-header-card" style="margin-bottom: 20px; padding: 22px 24px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 14px; box-shadow: var(--shadow-card);">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
            <span class="stats-tag-badge" style="background: rgba(217, 119, 6, 0.1); color: var(--primary); font-size: 0.78rem; font-weight: 700; padding: 3px 12px; border-radius: 999px; border: 1px solid rgba(217, 119, 6, 0.25);">
              👥 社員投票分析
            </span>
            <h3 class="stats-header-title" style="font-size: 1.35rem; font-weight: 800; color: var(--text-main); margin: 0;">統計圖表</h3>
          </div>
          <p class="stats-header-subtitle" style="font-size: 0.85rem; color: var(--text-muted); margin: 4px 0 0 0; line-height: 1.5;">
            已自動彙整所有社員匯入之心願活動代碼，即時統計得票榜單、性質圓餅比例與個別社員選項方框
          </p>
        </div>
        <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
          <button class="btn-action" onclick="openShareModal()" style="background: linear-gradient(135deg, #2563eb, #3b82f6); color: #fff; font-weight: 600; padding: 0 18px; height: 36px; border-radius: 9999px; display: inline-flex; align-items: center; justify-content: center; border: none; cursor: pointer; box-shadow: 0 2px 6px rgba(37, 99, 235, 0.25);">
            <svg class="mono-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="margin-right: 6px;">
              <path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"></path>
              <polyline points="8 10 12 14 16 10"></polyline>
              <line x1="12" y1="3" x2="12" y2="14"></line>
            </svg>
            <span>匯入代碼</span>
          </button>
          <button class="btn-action btn-stats-back" onclick="handleCategoryTabSwitch('all')" style="background: var(--bg-card); border: 1px solid var(--border-color); color: var(--text-main); font-weight: 600; padding: 0 18px; height: 36px; border-radius: 9999px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: var(--transition);">
            <svg class="mono-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="margin-right: 6px;">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>返回頁面</span>
          </button>
        </div>
      </div>
      <!-- 圖一內容：移動至圖二下方，同屬一個區塊位置中 -->
      <div class="member-quick-filter-bar" id="memberQuickFilterRow" style="margin-top: 16px; padding-top: 14px; border-top: 1px solid var(--border-subtle); background: transparent; border-left: none; border-right: none; border-bottom: none; border-radius: 0; width: 100%; display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
        <span class="member-filter-label" style="font-size: 0.82rem; color: var(--primary); font-weight: 700; white-space: nowrap;">👤 點開社員篩選內容：</span>
        <div class="member-filter-chips" id="memberFilterChipsContainer" style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
          <!-- 由 JavaScript 動態渲染各社員專屬篩選按鈕 -->
        </div>
      </div>
    </div>

    <!-- 頂部概覽指標看板 (高質感典雅卡片排版) -->
    <div class="stats-overview-grid-top" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 20px;">
      <div class="stat-top-card" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 14px; padding: 18px 14px; text-align: center; box-shadow: var(--shadow-sm);">
        <span class="stat-top-label" style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">👥 已參與社員</span>
        <div class="stat-top-val" style="font-size: 1.8rem; font-weight: 800; color: #0284c7; margin-top: 6px;">${memberVotes.length} 位</div>
      </div>
      <div class="stat-top-card" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 14px; padding: 18px 14px; text-align: center; box-shadow: var(--shadow-sm);">
        <span class="stat-top-label" style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">🎟️ 累計總選票數</span>
        <div class="stat-top-val" style="font-size: 1.8rem; font-weight: 800; color: #059669; margin-top: 6px;">${totalVotesCast} 票</div>
      </div>
      <div class="stat-top-card" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 14px; padding: 18px 14px; text-align: center; box-shadow: var(--shadow-sm);">
        <span class="stat-top-label" style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">🔥 最熱門活動票數</span>
        <div class="stat-top-val" style="font-size: 1.8rem; font-weight: 800; color: #d97706; margin-top: 6px;">${rankedActivities[0] ? rankedActivities[0].count + ' 票' : '0 票'}</div>
      </div>
      <div class="stat-top-card" style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 14px; padding: 18px 14px; text-align: center; box-shadow: var(--shadow-sm);">
        <span class="stat-top-label" style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">🏆 最高人氣企劃</span>
        <div class="stat-top-val stat-top-title" style="font-size: 1.05rem; font-weight: 700; color: #b45309; margin-top: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding: 0 4px;" title="${rankedActivities[0] ? rankedActivities[0].act.title : '暫無'}">
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
                    <span class="member-time-caption">🕒 上傳時間：${vote.time || '剛才'}</span>
                  </div>
                </div>
                <div class="member-header-actions">
                  <span class="member-vote-count">選了 ${acts.length} 項</span>
                  ${(vote.deviceId && vote.deviceId === getOrCreateDeviceId()) ? `<span class="member-me-badge" title="這是您在此裝置登記的心願回覆">⭐ 本人</span>` : ''}
                </div>
              </div>

              <!-- 1.5 平時遊玩的遊戲標籤 -->
              ${Array.isArray(vote.games) && vote.games.length > 0 ? `
                <div class="member-section">
                  <div class="member-section-label">
                    <span>🎮 常玩遊戲</span>
                  </div>
                  <div class="member-games-wrap">
                    ${vote.games.map(g => `<span class="member-game-tag">🎮 ${g}</span>`).join('')}
                  </div>
                </div>
              ` : ''}

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

              <!-- 3. 個人擅長：列出擅長的技能或領域 -->
              <div class="member-section">
                <div class="member-section-label">
                  <span>⚡ 個人擅長</span>
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

        ${(act.gameStages && act.gameStages.length > 0) ? `
          <div class="card-game-stages-section">
            <div class="game-stages-label">🎮 涵蓋遊戲與挑戰關卡：</div>
            <div class="game-stages-tags">
              ${act.gameStages.map(gs => `<span class="game-stage-tag">${gs}</span>`).join('')}
            </div>
          </div>
        ` : ''}

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

      ${(act.gameStages && act.gameStages.length > 0) ? `
        <div style="margin-top: 14px;">
          <div class="modal-subheading">🎮 涵蓋詳細遊戲與挑戰關卡</div>
          <div class="game-stages-tags" style="margin-top: 8px;">
            ${act.gameStages.map(gs => `<span class="game-stage-tag" style="font-size: 0.85rem; padding: 5px 12px;">${gs}</span>`).join('')}
          </div>
        </div>
      ` : ''}
      
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

// ==============================================================================
// 社員自行撤回/移除回覆邏輯 (僅本人可從分享處移除，保障不影響他人資料且再傳送不遺失)
// ==============================================================================
async function removeMySubmissionAction() {
  const deviceId = getOrCreateDeviceId();
  const mySubRaw = localStorage.getItem(STORAGE_KEYS.MY_SUBMISSION);
  let mySubName = '您的回覆';
  if (mySubRaw) {
    try {
      const parsed = JSON.parse(mySubRaw);
      if (parsed.name) mySubName = `「${parsed.name}」的個人心願回覆`;
    } catch(e) {}
  }

  if (!confirm(`確定要撤回並移除 ${mySubName} 嗎？\n\n移除後系統與雲端將不再保留您的投票與名片資料。\n撤回後您可以隨時重新挑選活動並重新上傳！`)) {
    return;
  }

  const btn = document.getElementById('btnRemoveMySubmission');
  const origBtnText = btn ? btn.textContent : '';
  if (btn) {
    btn.disabled = true;
    btn.textContent = '⏳ 正在撤回移除...';
  }

  // 1. 若有設定雲端網址，發送 action: 'delete' 至 Google Apps Script 雲端試算表刪除該列
  const cloudUrl = getCloudApiUrl();
  if (cloudUrl) {
    try {
      await fetch(cloudUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'delete',
          deviceId: deviceId
        })
      });
    } catch (err) {
      console.warn('雲端刪除通知異常（本機將同步清除）：', err);
    }
  }

  // 2. 清除本機裝置紀錄
  localStorage.removeItem(STORAGE_KEYS.MY_SUBMISSION);

  // 3. 從本機 memberVotes 移除本人 deviceId
  memberVotes = memberVotes.filter(v => v.deviceId !== deviceId && v.id !== `vote-${deviceId}`);
  saveMemberVotes();
  updateVoteBadges();
  updateDeviceUploadStatusUI();

  // 4. 重設表單名稱為空或預設
  const nameInput = document.getElementById('shareUserNickname');
  if (nameInput) nameInput.value = '';

  if (currentCategory === 'stats') {
    renderStatsView();
  } else {
    renderCards();
  }

  if (btn) {
    btn.disabled = false;
    btn.textContent = origBtnText;
  }

  showToast('✅ 已成功撤回並移除您的個人回覆！再次傳送將作為全新回覆。');
}
window.removeMySubmissionAction = removeMySubmissionAction;

// ==============================================================================
// 社員幸運抽獎系統 (Member Lucky Draw System)
// ==============================================================================
let lotteryWonMemberIds = new Set();
let lotteryRollingTimer = null;
let isLotteryRolling = false;

function openLotteryModal() {
  const modal = document.getElementById('lotteryModalBackdrop');
  if (!modal) return;

  // 支援一人測試：若本機已有登記回覆但尚未合併至 memberVotes，自動即時納入
  const mySubRaw = localStorage.getItem(STORAGE_KEYS.MY_SUBMISSION);
  if (mySubRaw) {
    try {
      const mySub = JSON.parse(mySubRaw);
      if (mySub && mySub.name) {
        const exists = memberVotes.some(v => v.deviceId === mySub.deviceId || v.id === mySub.id);
        if (!exists) {
          memberVotes.unshift(mySub);
          saveMemberVotes();
          updateVoteBadges();
        }
      }
    } catch(e) {}
  }

  // 測試防呆：若尚未點擊上傳但已輸入過暱稱，自動包裝為 1 人測試候選
  if (memberVotes.length === 0) {
    const savedName = localStorage.getItem(STORAGE_KEYS.USER_NICKNAME);
    if (savedName && savedName.trim()) {
      const singleTestMember = {
        id: `vote-${getOrCreateDeviceId()}`,
        deviceId: getOrCreateDeviceId(),
        name: savedName.trim(),
        time: new Date().toLocaleString([], { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        games: (localStorage.getItem(STORAGE_KEYS.USER_GAMES) || '原神、崩壞：星穹鐵道').split(/[,，、\s]+/).filter(Boolean),
        interests: (localStorage.getItem(STORAGE_KEYS.USER_INTERESTS) || '').split(/[,，、\s]+/).filter(Boolean),
        specialties: localStorage.getItem(STORAGE_KEYS.USER_SPECIALTIES) || '米遊活動熱情參與',
        expectation: localStorage.getItem(STORAGE_KEYS.USER_EXPECTATION) || '期待更多社團連動活動',
        selectedIds: Array.from(selectedActivityIds.size > 0 ? selectedActivityIds : favoriteIds)
      };
      memberVotes.unshift(singleTestMember);
      saveMemberVotes();
      updateVoteBadges();
    }
  }

  const countHint = document.getElementById('lotteryCandidateCountHint');
  const poolStatus = document.getElementById('lotteryPoolStatusText');
  const totalCount = memberVotes.length;

  if (countHint) {
    if (totalCount === 1) {
      countHint.textContent = `🎯 測試模式已就緒：目前共有 1 位社員（${memberVotes[0].name}），可直接進行抽獎測試！`;
    } else if (totalCount > 1) {
      countHint.textContent = `目前共有 ${totalCount} 位已匯入之社員具備抽獎資格！`;
    } else {
      countHint.textContent = '目前名單中尚無任何社員，請先於「上傳心願」填寫暱稱送出或載入示範名單！';
    }
  }
  if (poolStatus) {
    poolStatus.textContent = `👥 候選社員：${totalCount} 位`;
  }

  // 若尚未抽獎，重設舞台為預設準備狀態
  if (!isLotteryRolling && (!lotteryWonMemberIds || lotteryWonMemberIds.size === 0)) {
    resetLotteryStageUI();
  }

  updateLotteryHistoryUI();
  modal.style.display = 'flex';
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}
window.openLotteryModal = openLotteryModal;

function closeLotteryModal() {
  const modal = document.getElementById('lotteryModalBackdrop');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      if (!modal.classList.contains('active')) {
        modal.style.display = 'none';
      }
    }, 250);
  }
  document.body.style.overflow = '';
  if (isLotteryRolling && lotteryRollingTimer) {
    clearTimeout(lotteryRollingTimer);
    isLotteryRolling = false;
  }
}
window.closeLotteryModal = closeLotteryModal;

function resetLotteryStageUI() {
  const stageBox = document.getElementById('lotteryStageBox');
  const avatarCircle = document.getElementById('lotteryAvatarCircle');
  const winnerName = document.getElementById('lotteryWinnerName');
  const winnerMeta = document.getElementById('lotteryWinnerMeta');
  const winnerDetails = document.getElementById('lotteryWinnerDetails');
  const btnStartText = document.getElementById('btnStartLotteryText');

  if (stageBox) stageBox.className = 'lottery-stage-box';
  if (avatarCircle) avatarCircle.textContent = '❓';
  if (winnerName) winnerName.textContent = '準備抽獎';
  if (winnerMeta) winnerMeta.textContent = '點擊下方按鈕，隨機挑選一位幸運社員！';
  if (winnerDetails) {
    winnerDetails.style.display = 'none';
    winnerDetails.innerHTML = '';
  }
  if (btnStartText) btnStartText.textContent = '開始幸運抽獎！';
}

function startLotteryDraw() {
  if (isLotteryRolling) return;
  // 支援 1 人抽獎測試：若名單暫為空但本機已有提交或暱稱資料，即時自動納入
  if (!memberVotes || memberVotes.length === 0) {
    const mySubRaw = localStorage.getItem(STORAGE_KEYS.MY_SUBMISSION);
    if (mySubRaw) {
      try {
        const mySub = JSON.parse(mySubRaw);
        if (mySub && mySub.name) {
          memberVotes.unshift(mySub);
          saveMemberVotes();
          updateVoteBadges();
        }
      } catch(e) {}
    }
  }
  if (!memberVotes || memberVotes.length === 0) {
    const savedName = localStorage.getItem(STORAGE_KEYS.USER_NICKNAME);
    if (savedName && savedName.trim()) {
      const singleTestMember = {
        id: `vote-${getOrCreateDeviceId()}`,
        deviceId: getOrCreateDeviceId(),
        name: savedName.trim(),
        time: new Date().toLocaleString([], { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        games: (localStorage.getItem(STORAGE_KEYS.USER_GAMES) || '原神、崩壞：星穹鐵道').split(/[,，、\s]+/).filter(Boolean),
        interests: (localStorage.getItem(STORAGE_KEYS.USER_INTERESTS) || '').split(/[,，、\s]+/).filter(Boolean),
        specialties: localStorage.getItem(STORAGE_KEYS.USER_SPECIALTIES) || '米遊活動熱情參與',
        expectation: localStorage.getItem(STORAGE_KEYS.USER_EXPECTATION) || '期待更多社團連動活動',
        selectedIds: Array.from(selectedActivityIds.size > 0 ? selectedActivityIds : favoriteIds)
      };
      memberVotes.unshift(singleTestMember);
      saveMemberVotes();
      updateVoteBadges();
    }
  }

  if (!memberVotes || memberVotes.length === 0) {
    alert('目前名單中尚無任何社員！\n請先於「上傳心願」填寫暱稱送出或載入示範名單後再進行抽獎。');
    return;
  }

  const excludeWonCheck = document.getElementById('lotteryExcludeWonCheck');
  const shouldExcludeWon = excludeWonCheck ? excludeWonCheck.checked : false;

  // 篩選具備抽獎資格之候選人
  let candidates = memberVotes.slice();
  if (shouldExcludeWon) {
    candidates = candidates.filter(m => !lotteryWonMemberIds.has(m.id || m.deviceId || m.name));
  }

  if (candidates.length === 0) {
    // 為了測試用，如果名單中只有 1 人，自動重置中獎記錄，允許重複測試抽獎
    if (memberVotes.length === 1) {
      lotteryWonMemberIds.clear();
      candidates = memberVotes.slice();
    } else {
      alert('所有社員均已中獎過一輪！\n請點擊「🔄 重設中獎紀錄」或取消勾選「排除已中獎者」以重新開始抽獎。');
      return;
    }
  }

  isLotteryRolling = true;
  const stageBox = document.getElementById('lotteryStageBox');
  const avatarCircle = document.getElementById('lotteryAvatarCircle');
  const winnerName = document.getElementById('lotteryWinnerName');
  const winnerMeta = document.getElementById('lotteryWinnerMeta');
  const winnerDetails = document.getElementById('lotteryWinnerDetails');
  const btnStart = document.getElementById('btnStartLottery');
  const btnStartText = document.getElementById('btnStartLotteryText');

  if (stageBox) stageBox.className = 'lottery-stage-box rolling';
  if (winnerDetails) winnerDetails.style.display = 'none';
  if (btnStart) btnStart.disabled = true;
  if (btnStartText) btnStartText.textContent = '🎲 命運轉盤轉動中...';

  // 隨機抽選出最終得主 (True Random Selection)
  const finalWinnerIndex = Math.floor(Math.random() * candidates.length);
  const winner = candidates[finalWinnerIndex];

  // 動態滾動輪播動畫 (Decelerating Slot Animation)
  let currentIndex = 0;
  let delay = 50;
  const startTime = Date.now();
  const rollDuration = 2600; // 總滾動時間 2.6 秒

  // 動畫輪播池 (若只有 1 人，加入動態轉動候選展示，最終必定 100% 抽中該社員)
  const rollAnimationPool = candidates.length === 1 
    ? [
        candidates[0],
        { name: '🎲 幸運輪盤轉動中...', games: ['專屬心願'], initial: '✨' },
        { name: '🌟 命運星光鎖定中...', games: ['米哈遊活動'], initial: '⭐' },
        { name: '🎉 即將揭曉幸運得主...', games: ['社團大獎'], initial: '🎁' }
      ]
    : candidates;

  function rollStep() {
    const elapsed = Date.now() - startTime;
    const randomDisplayMember = rollAnimationPool[currentIndex % rollAnimationPool.length];
    currentIndex++;

    const initial = (randomDisplayMember.name || '社').trim().charAt(0).toUpperCase();
    if (avatarCircle) avatarCircle.textContent = initial;
    if (winnerName) winnerName.textContent = randomDisplayMember.name;
    if (winnerMeta) winnerMeta.textContent = `常玩：${(randomDisplayMember.games || []).join('、') || '米哈遊系列'}`;

    if (elapsed < rollDuration) {
      // 依時間進度遞增延遲，產生漸進減速震撼定格效果
      delay = 50 + Math.pow(elapsed / rollDuration, 2.2) * 260;
      lotteryRollingTimer = setTimeout(rollStep, delay);
    } else {
      // 動畫結束，正式定格揭曉中獎者
      finishLotteryDraw(winner);
    }
  }

  rollStep();
}
window.startLotteryDraw = startLotteryDraw;

function finishLotteryDraw(winner) {
  isLotteryRolling = false;
  const stageBox = document.getElementById('lotteryStageBox');
  const avatarCircle = document.getElementById('lotteryAvatarCircle');
  const winnerName = document.getElementById('lotteryWinnerName');
  const winnerMeta = document.getElementById('lotteryWinnerMeta');
  const winnerDetails = document.getElementById('lotteryWinnerDetails');
  const btnStart = document.getElementById('btnStartLottery');
  const btnStartText = document.getElementById('btnStartLotteryText');

  if (stageBox) stageBox.className = 'lottery-stage-box won';
  if (btnStart) btnStart.disabled = false;
  if (btnStartText) btnStartText.textContent = '🎲 再次幸運抽獎！';

  const initial = (winner.name || '社').trim().charAt(0).toUpperCase();
  if (avatarCircle) avatarCircle.textContent = initial;
  if (winnerName) winnerName.innerHTML = `🎉 恭喜幸運社員：【${winner.name}】！`;

  const wishCount = (winner.selectedIds || []).length;
  if (winnerMeta) {
    winnerMeta.innerHTML = `<span style="color: #f59e0b; font-weight: 700;">👑 天選幸運得主誕生</span> · 🕒 ${winner.time || '剛才'} 上傳 · 勾選了 ${wishCount} 項心願企劃`;
  }

  // 取得中獎社員的心儀活動名稱
  const matchedActivities = (winner.selectedIds || [])
    .map(id => activitiesData.find(a => a.id === id))
    .filter(Boolean)
    .slice(0, 3);

  const gamesText = Array.isArray(winner.games) && winner.games.length > 0 
    ? winner.games.join('、') 
    : '米哈遊各大遊戲同好';
  const specialtiesText = winner.specialties && winner.specialties.trim() 
    ? winner.specialties 
    : '熱情參與、熱愛交流';
  const expectationText = winner.expectation && winner.expectation.trim() 
    ? winner.expectation 
    : '希望能和大家一起同樂交流、參與更多有趣的社團活動！';

  if (winnerDetails) {
    winnerDetails.style.display = 'flex';
    winnerDetails.innerHTML = `
      <div style="background: rgba(255,255,255,0.06); padding: 10px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
        <div style="margin-bottom: 4px;"><strong>🎮 常玩遊戲：</strong> <span style="color: #38bdf8;">${gamesText}</span></div>
        <div style="margin-bottom: 4px;"><strong>⚡ 個人擅長：</strong> <span style="color: #a7f3d0;">${specialtiesText}</span></div>
        <div style="margin-bottom: 6px;"><strong>💬 入社期望：</strong> <span style="color: #fde047;">${expectationText}</span></div>
        ${matchedActivities.length > 0 ? `
          <div style="border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 6px; margin-top: 6px;">
            <strong>📌 該社員心儀活動（前 ${matchedActivities.length} 項）：</strong>
            <span style="color: #cbd5e1;">${matchedActivities.map(a => a.title).join('、')}</span>
          </div>
        ` : ''}
      </div>
    `;
  }

  // 記錄至已中獎名單
  const winnerKey = winner.id || winner.deviceId || winner.name;
  lotteryWonMemberIds.add(winnerKey);
  updateLotteryHistoryUI();

  showToast(`🎉 恭喜「${winner.name}」成為本次幸運得主！`);
}

function updateLotteryHistoryUI() {
  const historyWrap = document.getElementById('lotteryHistoryWrap');
  const historyList = document.getElementById('lotteryHistoryList');
  const btnReset = document.getElementById('btnResetLotteryHistory');

  if (!historyWrap || !historyList) return;

  if (lotteryWonMemberIds.size === 0) {
    historyWrap.style.display = 'none';
    if (btnReset) btnReset.style.display = 'none';
    return;
  }

  historyWrap.style.display = 'block';
  if (btnReset) btnReset.style.display = 'inline-block';

  // 渲染已中獎晶片
  const wonNames = Array.from(lotteryWonMemberIds).map(key => {
    const m = memberVotes.find(v => (v.id === key || v.deviceId === key || v.name === key));
    return m ? m.name : key;
  });

  historyList.innerHTML = wonNames.map(name => `
    <span class="lottery-history-chip">🏆 ${name}</span>
  `).join('');
}

function resetLotteryHistory() {
  if (lotteryWonMemberIds.size === 0) return;
  if (!confirm('確定要重設本次的已中獎紀錄名單嗎？')) return;

  lotteryWonMemberIds.clear();
  updateLotteryHistoryUI();
  resetLotteryStageUI();
  showToast('已重設社員抽獎中獎紀錄！可重新開展抽獎。');
}
window.resetLotteryHistory = resetLotteryHistory;

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


// 設置分享彈窗快速推薦標籤按鈕點擊與高光聯動 (支援加入/取消與即時選中高光)
function setupQuickTagButtons() {
  document.querySelectorAll('.tag-chip-btn').forEach(btn => {
    btn.onclick = function() {
      const field = this.getAttribute('data-field');
      const tag = this.getAttribute('data-tag');
      let targetInput = null;
      if (field === 'games') targetInput = document.getElementById('shareUserGames');
      else if (field === 'interests') targetInput = document.getElementById('shareUserInterests');
      else targetInput = document.getElementById('shareUserSpecialties');
      if (!targetInput) return;
      
      const currentVal = targetInput.value.trim();
      let existing = currentVal ? currentVal.split(/[,，、\s]+/).map(s => s.trim()).filter(Boolean) : [];
      
      if (existing.includes(tag)) {
        // 若已存在，點擊則移除（Toggle 取消選取）
        existing = existing.filter(t => t !== tag);
        this.classList.remove('is-active');
      } else {
        // 若不存在，點擊加入
        existing.push(tag);
        this.classList.add('is-active');
      }
      targetInput.value = existing.join(', ');
      
      // 同步所有標籤的高光狀態
      updateQuickTagActiveStates();
    };
  });

  // 當使用者手動在輸入框打字時，自動同步更新標籤高光
  const gamesInput = document.getElementById('shareUserGames');
  if (gamesInput) {
    gamesInput.oninput = updateQuickTagActiveStates;
  }
  const interestsInput = document.getElementById('shareUserInterests');
  if (interestsInput) {
    interestsInput.oninput = updateQuickTagActiveStates;
  }
  const specialtiesInput = document.getElementById('shareUserSpecialties');
  if (specialtiesInput) {
    specialtiesInput.oninput = updateQuickTagActiveStates;
  }

  updateQuickTagActiveStates();
}

// 根據目前輸入框文字，動態點亮對應標籤按鈕
function updateQuickTagActiveStates() {
  const interestsInput = document.getElementById('shareUserInterests');
  const specialtiesInput = document.getElementById('shareUserSpecialties');

  const gamesInput = document.getElementById('shareUserGames');
  const curGames = gamesInput && gamesInput.value 
    ? gamesInput.value.split(/[,，、\s]+/).map(s => s.trim()).filter(Boolean) 
    : [];

  document.querySelectorAll('#shareQuickGames .tag-chip-btn').forEach(btn => {
    const tag = btn.getAttribute('data-tag');
    if (curGames.includes(tag)) {
      btn.classList.add('is-active');
    } else {
      btn.classList.remove('is-active');
    }
  });

  const curInterests = interestsInput && interestsInput.value 
    ? interestsInput.value.split(/[,，、\s]+/).map(s => s.trim()).filter(Boolean) 
    : [];

  const curSpecialties = specialtiesInput && specialtiesInput.value 
    ? specialtiesInput.value.split(/[,，、\s]+/).map(s => s.trim()).filter(Boolean) 
    : [];

  document.querySelectorAll('#shareQuickInterests .tag-chip-btn').forEach(btn => {
    const tag = btn.getAttribute('data-tag');
    if (curInterests.includes(tag)) {
      btn.classList.add('is-active');
    } else {
      btn.classList.remove('is-active');
    }
  });

  document.querySelectorAll('#shareQuickSpecialties .tag-chip-btn').forEach(btn => {
    const tag = btn.getAttribute('data-tag');
    if (curSpecialties.includes(tag)) {
      btn.classList.add('is-active');
    } else {
      btn.classList.remove('is-active');
    }
  });
}
window.updateQuickTagActiveStates = updateQuickTagActiveStates;
