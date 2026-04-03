# SSC Creator Frequency Compact → Full Modal
Status: ✅ Created | ⏳ In Progress | ✅ Completed

## 1. ⏳ Create Global Modal Template [pages/app.html]
```
Global modal #creatorFreqModal for all contexts (allies/map/makequest).
- Large photo
- Name + "LC: X" header (no hashtag)
- Full 7-freq SVG chart (reuse calculator.js buildFreqChart)
- Close button
```
Files: pages/app.html, css/quest-theme.css
Owner: BLACKBOXAI

## 2. Update Make Quest Signature Preview [pages/app.html]
```
#mqSigPanel → .sig-compact
<div class="sig-compact">
  <img src="avatar.jpg"> 
  <span>Your Name</span>
  <span class="lc-trigger" onclick="showCreatorFreqModal(data)">LC: 7</span>
</div>
```
Trigger: click .lc-trigger → modal
Files: pages/app.html
Owner: BLACKBOXAI

## 3. Update Allies List [pages/app.html]
```
#alliesList items → .ally-compact + .lc-trigger onclick
<div class="ally-compact">
  <img src="avatar">
  <span>Ally Name</span>
  <span class="lc-trigger">LC: 3</span>
</div>
```
Files: pages/app.html, js/app.js (update renderAllies)
Owner: BLACKBOXAI

## 4. Update Map Popups [js/app.js / Leaflet]
```
bindPopup compact HTML template + onclick="showCreatorFreqModal(quest.creator)"
```
Files: js/app.js (addQuestMarker)
Owner: BLACKBOXAI

## 5. JS Modal Handler [js/app.js]
```
window.showCreatorFreqModal(userData) {
  // populate #creatorFreqModal with photo/name/lc/buildFreqChart(freqs)
  // show modal
}
```
Mock data until backend confirmed.
Files: js/app.js, js/calculator.js (reuse chart)
Owner: BLACKBOXAI

## 6. Styles [css/quest-theme.css]
```
.sig-compact, .ally-compact { display:flex; gap:12px; align:center; }
.lc-trigger { font-bold; color:gold; cursor:pointer; }
.freq-modal { backdrop-filter; etc. }
```
Files: css/quest-theme.css
Owner: BLACKBOXAI

## 7. ✅ Test & Deploy
```
- Static mock data
- Local server test
- Responsive/mobile tap
- Backend data: {name,photo,lc,freqs[]}
```
CLI: npx serve .
Files: All
Owner: User

Progress: 0/7


---

# World Hub + RPG Realm Map + Leaderboard
Status: Planned

## Phase 1 - World Hub Landing
- Add sectionWorldHub as default view in #panelMap (index.html)
  - Title: THE WORLD
  - Buttons: ENTER THE REALM (switchMapSection realm), OPEN WORLD MAP (switchMapSection map), VIEW RANKINGS (switchMapSection ranks)
- Update sub-nav buttons: MAP | REALM | ALLIES | RANKS
- Update switchTab('map') in app.js to show hub first; lazy-init Leaflet map on first MAP open
Files: sourcecode-life/calculator/index.html, sourcecode-life/calculator/app.js

## Phase 2 - SVG Realm Map (sectionMapRealm)
- Back button to hub
- Inline SVG with 6 tappable zones (polygon + label):
  THE GROVE (Sage) - Consistency streaks
  THE FORUM (Teal) - Community participation
  THE CITADEL (Gold) - Leaderboard challenges
  THE NETWORK (Blue) - Social / ally quests
  THE LIBRARY (Purple) - Content / creation
  THE WILDS (Red) - Physical / IRL map quests
- Tapping a zone opens realmZonePanel (slide-in overlay) with quest list
Files: sourcecode-life/calculator/index.html, sourcecode-life/calculator/styles.css

## Phase 3 - Life Quest Data and Logic (app.js)
- Define REALM_ZONES constant - each zone has id, label, color, icon, quests array
- ~5 quests per zone (30 total): id, title, desc, type, goal (numeric), autoKey (optional localStorage counter)
- Progress stored in localStorage key scl_realm_quests as JSON { questId: { progress, done } }
- Realm_openZone(id) - builds quest list, inserts into panel, slides in
- Realm_tapComplete(questId) - increments progress, checks goal, marks done, calls Achievements_check()
- Auto-counted quests read existing counters: scl_irl_completed, scl_30day_done, scl_quests_created etc.
Files: sourcecode-life/calculator/app.js

## Phase 4 - Leaderboard / RANKS Panel (sectionMapRanks)
- Back button to hub
- Ranks_build() computes player score from XP, quests, streak, allies, realm quests
- Mock top-10 table labeled GLOBAL RANKINGS - COMING SOON
- Player row highlighted gold with YOU marker
- Player personal stats summary above table
Files: sourcecode-life/calculator/index.html, sourcecode-life/calculator/app.js, sourcecode-life/calculator/styles.css

## Open Questions
- Should zone quests link out to website/community, or stay fully in-app?
- Should some zones be locked behind stat thresholds (e.g. Citadel requires Rank 5)?

Progress: 0/4 phases
