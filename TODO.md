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

