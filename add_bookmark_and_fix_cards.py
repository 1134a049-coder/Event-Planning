# -*- coding: utf-8 -*-
import re

with open("app.js", "r", encoding="utf-8") as f:
    content = f.read()

bookmark_and_card_code = r"""
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
  const modalBookmarkIcon = document.getElementById('modalBookmarkIcon');
  if (modalBookmarkIcon && currentModalActId === id) {
    modalBookmarkIcon.innerHTML = getBookmarkSVG(isMarked);
  }
  const modalBookmarkBtnText = document.getElementById('modalBookmarkBtnText');
  if (modalBookmarkBtnText && currentModalActId === id) {
    modalBookmarkBtnText.textContent = isMarked ? '已標記為想參加心願' : '標記此活動為想參加心願';
  }
  const modalBookmarkBtnWrap = document.getElementById('modalBookmarkBtnWrap');
  if (modalBookmarkBtnWrap && currentModalActId === id) {
    modalBookmarkBtnWrap.classList.toggle('active', isMarked);
  }
}

function toggleUnifiedBookmark(id) {
  const act = activitiesData.find(a => a.id === id);
  const title = act ? act.title : id;
  const isCurrentlyMarked = favoriteIds.has(id);
  const nextMarked = !isCurrentlyMarked;

  if (nextMarked) {
    favoriteIds.add(id);
    if (favoritesSessionPool) favoritesSessionPool.add(id);
    showToast(`已收藏「${title}」至心願清單！❤️`);
  } else {
    favoriteIds.delete(id);
    if (currentCategory === 'favorites') {
      if (!favoritesUnmarkedList.includes(id)) {
        favoritesUnmarkedList.push(id);
      }
    }
    showToast(`已取消收藏「${title}」。`);
  }

  saveFavorites();
  updateBookmarkButtons(id, nextMarked);
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
"""

# 尋找 function createCardHTML(act) { ... } 到 openDetailModalById 前的段落
pattern = r"// 產生單張卡片 HTML.*?function createCardHTML\(act\) \{.*?\}\s*(?=// ={5,}\s*// 3\. 活動詳細 Modal)"
content = re.sub(pattern, lambda m: bookmark_and_card_code + "\n", content, flags=re.DOTALL)

with open("app.js", "w", encoding="utf-8") as f:
    f.write(content)

print("已成功補充 getBookmarkSVG、toggleUnifiedBookmark 與最新卡片結構！")
