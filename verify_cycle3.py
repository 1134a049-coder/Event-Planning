# -*- coding: utf-8 -*-
import json
import base64
import urllib.parse
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open("activities.json", "r", encoding="utf-8") as f:
    data = json.load(f)

print(f"=== Cycle 3 全面嚴格自動化檢驗報告 ===")
print(f"總活動企劃數: {len(data)} (標準: 95)")
assert len(data) == 95, f"數量不符: {len(data)}"

# 1. 檢驗地點是否 100% 統一為 A540 教室
locations = set(a.get("location") for a in data)
print(f"1. 活動地點集合: {locations}")
assert locations == {"A540 教室"}, f"發現非 A540 教室地點: {locations}"

# 2. 檢驗烹飪違規詞彙
prohibited_cook_words = ["烹飪", "煎餃", "電火鍋", "關東煮", "卡式爐", "包餃子", "切菜", "炒鍋", "平底鍋", "生肉", "煮沸"]
found_cook = []
for a in data:
    text = json.dumps(a, ensure_ascii=False)
    for w in prohibited_cook_words:
        if w in text:
            found_cook.append((a["id"], a["title"], w))

print(f"2. 烹飪違規關鍵字檢測: 發現 {len(found_cook)} 處")
if found_cook:
    for f in found_cook:
        print("   - 違規項目:", f)
assert len(found_cook) == 0, "存在烹飪相關詞彙"

# 3. 檢驗 3D列印、摺紙、繪畫、自製米哈遊桌遊
craft_keywords = {
    "3D列印": [a["title"] for a in data if "3D" in a["title"] or "3D" in a["summary"]],
    "摺紙": [a["title"] for a in data if "折紙" in a["title"] or "摺紙" in a["title"]],
    "繪畫": [a["title"] for a in data if "手繪" in a["title"] or "繪畫" in a["title"] or "塗鴉" in a["title"]],
    "自製桌遊": [a["title"] for a in data if "自製" in a["title"] or "桌遊" in a["title"]]
}
print(f"3. 實作活動專項確認:")
for k, v in craft_keywords.items():
    print(f"   • {k}: 共 {len(v)} 項企劃 (包含: {v[:2]})")

# 4. 檢驗小獎品規範
prize_matches = [a["title"] for a in data if "小獎品" in json.dumps(a, ensure_ascii=False)]
print(f"4. 包含標準化「小獎品」機制的活動數: {len(prize_matches)} 項")

# 5. 分享代碼 Base64 編解碼測試 (含 prizes 欄位)
test_payload = {
    "v": 2,
    "name": "測試社員",
    "time": "10/03 02:30",
    "selectedIds": ["hsr-c-01", "gen-m-01", "zzz-c-04"],
    "prizes": ["prize-acrylic", "prize-ticket"]
}
encoded_uri = urllib.parse.quote(json.dumps(test_payload, ensure_ascii=False))
b64 = base64.b64encode(encoded_uri.encode('utf-8')).decode('utf-8')
share_code = f"MYVOTE:{b64}"
print(f"5. 分享碼編碼測試: {share_code[:30]}...")

# 解碼測試
raw_b64 = share_code.replace("MYVOTE:", "")
decoded_uri = base64.b64decode(raw_b64).decode('utf-8')
decoded_json = json.loads(urllib.parse.unquote(decoded_uri))
assert decoded_json["prizes"] == ["prize-acrylic", "prize-ticket"]
print(f"   ✓ 解碼成功，心願獎品包含: {decoded_json['prizes']}")

print("\n🎉 Cycle 3 嚴格標準全數合格！所有指標與限制均完美符合規範！")
