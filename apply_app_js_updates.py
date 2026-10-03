# -*- coding: utf-8 -*-
"""
Script to apply Cycle 1 & 2 updates to app.js
1. Updates FALLBACK_ACTIVITIES with the refreshed activities.json
2. Adds PRIZE_CANDIDATES & prize modal logic
3. Updates openDetailModal to put Activity Plan in first position, basic info in second, no memo
4. Updates share code to include prizes
5. Updates handleCategoryTabSwitch for prize button toggle
"""
import json
import re

with open("activities.json", "r", encoding="utf-8") as f:
    activities = json.load(f)

with open("app.js", "r", encoding="utf-8") as f:
    js_content = f.read()

# 1. 替換 FALLBACK_ACTIVITIES
# 尋找 const FALLBACK_ACTIVITIES = [ ... ];
fallback_json = json.dumps(activities, ensure_ascii=False, indent=2)
new_fallback_block = f"const FALLBACK_ACTIVITIES = {fallback_json};"

# 使用正則替換 FALLBACK_ACTIVITIES 宣告 (使用 lambda 避免 \n 被轉譯成實體換行)
pattern = r"const FALLBACK_ACTIVITIES = \[.*?\];"
js_content = re.sub(pattern, lambda m: new_fallback_block, js_content, flags=re.DOTALL)

# 2. 加入 PRIZE_CANDIDATES 與獎品函式
prize_logic = """
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
"""

# 在 activitiesData 宣告之後插入獎品邏輯
js_content = js_content.replace("let activitiesData = [];", "let activitiesData = [];\n" + prize_logic)

# 在 loadStoredState 中載入獎品
load_prizes_code = """    const savedPrizes = localStorage.getItem('mihoyo_selected_prizes');
    if (savedPrizes) {
      try {
        const arr = JSON.parse(savedPrizes);
        selectedPrizeIds = new Set(Array.isArray(arr) ? arr : []);
      } catch (e) {
        selectedPrizeIds = new Set();
      }
    }
    updatePrizeBadge();
"""
js_content = js_content.replace("saveMemberVotes();", "saveMemberVotes();\n" + load_prizes_code)

# 3. 更新 generateAndCopyShareCode 加入 prizes
old_gen_code = """  const votePayload = {
    v: 1,
    name: nickname,
    time: new Date().toLocaleString([], { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
    selectedIds: Array.from(favoriteIds)
  };"""

new_gen_code = """  const votePayload = {
    v: 2,
    name: nickname,
    time: new Date().toLocaleString([], { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
    selectedIds: Array.from(favoriteIds),
    prizes: Array.from(selectedPrizeIds)
  };"""
js_content = js_content.replace(old_gen_code, new_gen_code)

# 4. 更新 importMemberShareCode 記錄 prizes
old_import_code = """    const newRecord = {
      id: `vote-${Date.now()}`,
      name: payload.name,
      time: payload.time || new Date().toLocaleString(),
      selectedIds: payload.selectedIds
    };"""

new_import_code = """    const newRecord = {
      id: `vote-${Date.now()}`,
      name: payload.name,
      time: payload.time || new Date().toLocaleString(),
      selectedIds: payload.selectedIds,
      prizes: Array.isArray(payload.prizes) ? payload.prizes : []
    };"""
js_content = js_content.replace(old_import_code, new_import_code)

# 5. 更新 handleCategoryTabSwitch 按鈕切換
old_tab_code = """  if (cat === 'stats') {
    if (systemMainTitle) systemMainTitle.textContent = '社員票選統計圖表';
    if (systemIntroActions) systemIntroActions.style.display = 'inline-flex';"""

new_tab_code = """  if (cat === 'stats') {
    if (systemMainTitle) systemMainTitle.textContent = '社員票選統計圖表';
    const btnOpenPrizeModal = document.getElementById('btnOpenPrizeModal');
    const btnHeaderImportCode = document.getElementById('btnHeaderImportCode');
    const btnHeaderBackToLibrary = document.getElementById('btnHeaderBackToLibrary');
    if (btnOpenPrizeModal) btnOpenPrizeModal.style.display = 'none';
    if (btnHeaderImportCode) btnHeaderImportCode.style.display = 'inline-flex';
    if (btnHeaderBackToLibrary) btnHeaderBackToLibrary.style.display = 'inline-flex';"""
js_content = js_content.replace(old_tab_code, new_tab_code)

old_tab_else = """  } else {
    if (systemMainTitle) systemMainTitle.textContent = '米哈遊社團活動企劃庫';
    if (systemIntroActions) systemIntroActions.style.display = 'none';"""

new_tab_else = """  } else {
    if (systemMainTitle) systemMainTitle.textContent = '米哈遊社團活動企劃庫';
    const btnOpenPrizeModal = document.getElementById('btnOpenPrizeModal');
    const btnHeaderImportCode = document.getElementById('btnHeaderImportCode');
    const btnHeaderBackToLibrary = document.getElementById('btnHeaderBackToLibrary');
    if (btnOpenPrizeModal) btnOpenPrizeModal.style.display = 'inline-flex';
    if (btnHeaderImportCode) btnHeaderImportCode.style.display = 'none';
    if (btnHeaderBackToLibrary) btnHeaderBackToLibrary.style.display = 'none';"""
js_content = js_content.replace(old_tab_else, new_tab_else)

# 6. 重構 openDetailModal 彈窗結構
# 將「活動企劃做什麼」置頂於第一位置，「活動基本資訊」置於第二位置，地點鎖定 A540 教室，小獎品標準化，徹底移除備忘錄
old_modal_render_pattern = r"modalBody\.innerHTML = `.*?`;\s*modalBody\.querySelectorAll\('\.btn-status-toggle'\)"

new_modal_render_block = """modalBody.innerHTML = `
    <!-- 社員心願標記操作列 (純淨無備忘錄，杜絕混淆) -->
    <div class="modal-bookmark-bar">
      <button 
        type="button" 
        id="modalBookmarkBtnWrap"
        class="btn-action btn-modal-bookmark-toggle ${isSelected ? 'active' : ''}" 
        onclick="toggleUnifiedBookmark('${act.id}')"
      >
        <span id="modalBookmarkIcon" style="display: inline-flex; align-items: center;">${getBookmarkSVG(isSelected)}</span>
        <span id="modalBookmarkBtnText">${isSelected ? '已標記為想參加心願' : '標記此活動為想參加心願'}</span>
      </button>
      <span class="modal-prep-sync">✨ 點擊收藏可於右上角一鍵匯出投票</span>
    </div>

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

  // 清除舊備忘錄事件綁定"""

js_content = re.sub(old_modal_render_pattern, lambda m: new_modal_render_block, js_content, flags=re.DOTALL)

# 清理舊的 noteArea 監聽邏輯
old_note_listener = """  const noteArea = document.getElementById('actPersonalNote');
  const noteStatus = document.getElementById('noteSaveStatus');
  if (noteArea) {
    let debounceTimer = null;
    noteArea.addEventListener('input', (e) => {
      if (noteStatus) noteStatus.textContent = '⏳ 正在自動儲存...';
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        saveActivityNote(act.id, e.target.value);
        if (noteStatus) noteStatus.textContent = '✅ 已即時儲存至本機！';
      }, 400);
    });
  }"""
js_content = js_content.replace(old_note_listener, "// 備忘錄功能已依使用者指示完全移除")

# 7. 在 member-box-card 加上心願小獎品顯示
old_member_box_header = """              <div style="font-size: 0.75rem; color: var(--text-muted);">匯入時間：${vote.time}</div>"""

new_member_box_header = """              <div style="font-size: 0.75rem; color: var(--text-muted);">匯入時間：${vote.time}</div>
              ${Array.isArray(vote.prizes) && vote.prizes.length > 0 ? `
                <div style="font-size: 0.74rem; color: #d97706; margin-top: 4px; display: flex; align-items: center; gap: 4px; flex-wrap: wrap;">
                  <span>🎁 心願小獎品：</span>
                  <strong>${vote.prizes.map(pid => {
                    const p = PRIZE_CANDIDATES.find(x => x.id === pid);
                    return p ? p.name : pid;
                  }).join('、')}</strong>
                </div>
              ` : ''}"""
js_content = js_content.replace(old_member_box_header, new_member_box_header)

# 8. 掛載函式至 window
js_content += """
window.openPrizeModal = openPrizeModal;
window.closePrizeModal = closePrizeModal;
window.togglePrizeSelection = togglePrizeSelection;
window.updatePrizeBadge = updatePrizeBadge;
"""

with open("app.js", "w", encoding="utf-8") as f:
    f.write(js_content)

print("app.js 更新完成！已落實 Cycle 1 與 Cycle 2 全部要求！")
