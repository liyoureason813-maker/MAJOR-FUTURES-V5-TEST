/* MAJOR FUTURES V5.0 alpha: merged discovery layer; the two published apps remain unchanged. */
(()=>{'use strict';
const CATALOG=Array.isArray(window.MF_CATALOG)?window.MF_CATALOG:[];
const PROFILE_KEY='mf_v5_alpha_profile_v1';
const HISTORY_KEY='major_futures_holland_history_v1';
const PUBLISHED={major:'https://liyoureason813-maker.github.io/MAJOR-FUTURES/',global:'https://liyoureason813-maker.github.io/global-majors-guide/'};
const TYPES={R:'现实型',I:'研究型',A:'艺术型',S:'社会型',E:'企业型',C:'常规型'};
const SUBJECTS=['数学','高数','物理','化学','生物','经济','商务'];
const q=(s,root=document)=>root.querySelector(s),qa=(s,root=document)=>Array.from(root.querySelectorAll(s));
const escapeHTML=(v)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let saved={subjects:[],manual:[],compare:[]};
try{const p=JSON.parse(localStorage.getItem(PROFILE_KEY)||'{}');if(p&&typeof p==='object')saved={subjects:Array.isArray(p.subjects)?p.subjects.filter(s=>SUBJECTS.includes(s)):[],manual:Array.isArray(p.manual)?p.manual.filter(t=>TYPES[t]).slice(0,3):[],compare:Array.isArray(p.compare)?p.compare.filter(id=>CATALOG.some(m=>m.id===id)).slice(0,3):[]}}catch(e){}
let history=null;
let activeApp='major';
let loadedApp='';
let selectedMajor='';
const save=()=>{try{localStorage.setItem(PROFILE_KEY,JSON.stringify(saved))}catch(e){}};
const toast=(msg)=>{const el=q('#toast');el.textContent=msg;el.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('show'),2500)};
function readHistory(){
 try{const arr=JSON.parse(localStorage.getItem(HISTORY_KEY)||'[]');history=Array.isArray(arr)?arr.find(v=>v&&v.result&&Array.isArray(v.result.ranked)&&/^[RIASEC]{3}$/.test(v.result.code||'')):null}catch(e){history=null}
 renderProfile();return history;
}
function code(){return saved.manual.length?saved.manual.join(''):history?.result?.code||''}
function codeKind(){return saved.manual.length?'manual':history?'assessment':'empty'}
function scrollTop(){try{window.scrollTo({top:0,behavior:'instant'})}catch(e){window.scrollTo(0,0)}}
function show(page){const supported=['home','profile','catalog','compare','workbench','sources'];if(!supported.includes(page))page='home';qa('.page').forEach(el=>el.classList.toggle('visible',el.id==='page-'+page));qa('.navbtn').forEach(el=>el.classList.toggle('active',el.dataset.page===page));document.title=(page==='home'?'MAJOR FUTURES':({profile:'我的兴趣与课程',catalog:'百大专业',compare:'专业对比',workbench:'原系统功能',sources:'来源与路线'})[page])+' · V5.0 Alpha';window.history.replaceState(null,'',`#${page}`);scrollTop();if(page==='catalog')renderCatalog();if(page==='compare')renderCompare();if(page==='workbench')loadApp(activeApp);}
function go(page){show(page)}
function toggleManual(t){if(saved.manual.includes(t))saved.manual=saved.manual.filter(v=>v!==t);else if(saved.manual.length<3)saved.manual.push(t);else{toast('最多选择3种兴趣类型');return}save();renderProfile();renderCatalog()}
function renderProfile(){
 const c=code(),kind=codeKind();q('#myCode').textContent=c||'— — —';
 q('#assessmentStatus').textContent=history?`检测到最近一条测评：${history.result.code} · ${new Date(history.createdAt).toLocaleDateString('zh-CN')}。${kind==='manual'?'当前已用手动选择覆盖排序。':'当前专业排序将使用该结果。'}`:'没有在当前域名下检测到已完成的测评历史。你仍可以在下方手动选择兴趣类型，或打开原系统完成60题。';
 q('#homeHistory').textContent=history?`最近一条RIASEC兴趣代码为 ${history.result.code}。可按此结果探索100个专业。`:'当前尚未检测到测评记录。可先做60题测评，也可通过选课和关键词探索100个专业。';
 q('#interestPicker').innerHTML=Object.entries(TYPES).map(([key,zh])=>`<button type="button" data-interest="${key}" class="${saved.manual.includes(key)?'selected':''}" aria-pressed="${saved.manual.includes(key)}" title="${zh}">${key}</button>`).join('');
 q('#subjectPicks').innerHTML=SUBJECTS.map(name=>`<label><input type="checkbox" value="${name}" ${saved.subjects.includes(name)?'checked':''}>${name}</label>`).join('');
 q('#subjectCount').textContent=saved.subjects.length?'已选择：'+saved.subjects.join('、'):'尚未选择科目';
}
function interestScore(m){const c=code();if(!c)return 0;return m.riasec.reduce((sum,k,i)=>{const idx=c.indexOf(k);return idx<0?sum:sum+(3-idx)*5-Math.min(i,2)},0)}
function subjectScore(m){if(!saved.subjects.length)return 0;return m.subjects.reduce((sum,s)=>sum+(saved.subjects.includes(s.name)?({core:5,suggested:3,bridge:1}[s.level]||0):0),0)}
function totalScore(m){return interestScore(m)+subjectScore(m)}
function courseText(m,full=false){return m.subjects.map(s=>`${s.name}（${({core:'核心',suggested:'推荐',bridge:'桥接'})[s.level]}）`).join(full?' / ':' · ')}
function renderCatalog(){
 const cat=q('#categorySelect').value;const term=q('#majorSearch').value.trim().toLowerCase();const sort=q('#sortSelect').value;
 const subset=CATALOG.filter(m=>(!cat||m.category===cat)&&(!term||[m.zh,m.en,m.category,m.id].join(' ').toLowerCase().includes(term)));
 subset.sort((a,b)=>sort==='name'?a.zh.localeCompare(b.zh,'zh-CN'):sort==='category'?a.category.localeCompare(b.category,'zh-CN')||a.zh.localeCompare(b.zh,'zh-CN'):(totalScore(b)-totalScore(a))||a.zh.localeCompare(b.zh,'zh-CN'));
 const has=Boolean(code()||saved.subjects.length);
 q('#catalogHelp').textContent=has?`探索排序参考：${code()?'兴趣 '+code()+'（'+(codeKind()==='manual'?'手动模拟':'测评记录')+'）':''}${code()&&saved.subjects.length?' + ':''}${saved.subjects.length?'已选科目 '+saved.subjects.join('、'):''}。排序是启发式参考，不代表录取概率。`:'当前没有兴趣或选课条件，按名称显示。进入“我的兴趣与选课”后可查看更个性化的探索排序。';
 q('#catalogCount').textContent=`${subset.length} / ${CATALOG.length} 个专业`;
 q('#majorGrid').innerHTML=subset.length?subset.map(m=>`<article class="major-card"><div class="card-top"><small>${escapeHTML(m.category)}</small>${has&&totalScore(m)>0?'<b>优先探索</b>':''}</div><h3>${escapeHTML(m.zh)}</h3><div class="en">${escapeHTML(m.en)}</div><div class="card-ria">RIASEC：<b>${m.riasec.join(' · ')}</b></div><div class="card-subjects">${m.subjects.map(s=>`<span class="pill ${s.level}">${escapeHTML(s.name)} · ${{core:'核心',suggested:'推荐',bridge:'桥接'}[s.level]}</span>`).join('')}</div><div class="card-actions"><button type="button" class="${saved.compare.includes(m.id)?'added':''}" data-compare="${m.id}">${saved.compare.includes(m.id)?'✓ 已加入':'＋ 加入对比'}</button><button type="button" data-major-detail="${m.id}">进入完整图鉴 ↗</button>${m.careerBridges?.length?`<button type="button" data-career-detail="${m.id}">职业路径深读 ↗</button>`:''}</div></article>`).join(''):'<div class="empty">未找到对应专业。请调整关键词或学科类别。</div>';
}
function renderCompare(){const ms=saved.compare.map(id=>CATALOG.find(m=>m.id===id)).filter(Boolean);const el=q('#compareArea');
 if(!ms.length){el.innerHTML='<div class="compare-empty">尚未选择专业。请到“百大专业地图”中添加1至3个专业。</div>';return}
 const td=(fn)=>'<tr>'+['<td>'+fn(null,true)+'</td>',...ms.map(m=>'<td>'+fn(m,false)+'</td>')].join('')+'</tr>';
 el.innerHTML=`<table class="compare-table"><thead><tr><th>对比维度</th>${ms.map(m=>`<th>${escapeHTML(m.zh)}<br><small>${escapeHTML(m.en)}</small><br><button class="compare-remove" data-remove="${m.id}">移除 ×</button></th>`).join('')}</tr></thead><tbody>${td((m,header)=>header?'学科类别':escapeHTML(m.category))}${td((m,header)=>header?'兴趣倾向':m.riasec.join(' · '))}${td((m,header)=>header?'A-Level映射':escapeHTML(courseText(m,true)))}${td((m,header)=>header?'当前兴趣对应':code()?`${interestScore(m)>0?'有相似类型':'相似类型较少'}（探索性判断）`:'尚未填写兴趣')}${td((m,header)=>header?'已选课程对应':saved.subjects.length?escapeHTML(m.subjects.filter(s=>saved.subjects.includes(s.name)).map(s=>s.name).join('、')||'没有直接重叠的映射科目'):'尚未选择科目')}${td((m,header)=>header?'详细资料':`<button class="linkbtn" data-major-detail="${m.id}">打开原图鉴 ↗</button>`)}</tbody></table>`;
}
function modifyCompare(id){if(saved.compare.includes(id))saved.compare=saved.compare.filter(x=>x!==id);else if(saved.compare.length<3)saved.compare.push(id);else{toast('最多比较3个专业，请先移除一个');return}save();renderCatalog();renderCompare();toast('专业对比已更新')}
function chooseApp(app){activeApp=app==='global'?'global':'major';loadApp(activeApp)}
function loadApp(app){
 qa('.app-switch [data-app]').forEach(el=>el.classList.toggle('active',el.dataset.app===app));
 const title=app==='major'?'MAJOR FUTURES V4.2.2 · 正式网站':'海外百大专业指南 · 正式网站';q('#appLocation').textContent=title;
 const url=PUBLISHED[app];q('#externalSite').href=url;
 const frame=q('#legacyFrame');frame.title=title;
 if(loadedApp!==app){frame.src=url;loadedApp=app}
 q('#embedNotice').hidden=false;q('#embedNotice').textContent='如浏览器不显示此模块，可点击“独立标签页打开”。首次加载需要连接网络。';
}
function openDetail(id){const m=CATALOG.find(x=>x.id===id);if(!m)return;selectedMajor=m.zh;q('#selectedMajorText').textContent=`你选中了：${m.zh}（${m.en}）。请在下方完整图鉴搜索该名称查看详情。`;q('#selectedMajorHint').hidden=false;chooseApp('global');go('workbench');toast(`请在完整图鉴中搜索「${m.zh}」查看详细资料。`);
 // The published React bundle has no documented deep-link API. Do not attempt brittle DOM injection.
}
function openCareer(id){const m=CATALOG.find(x=>x.id===id);if(!m?.careerBridges?.length)return;const names=m.careerBridges.map(v=>v.zh+(v.relationship==='related'?'（相关方向）':'')).join('、');selectedMajor=names;q('#selectedMajorText').textContent=`与「${m.zh}」关联的MAJOR FUTURES职业分析：${names}。请在下方原网站的“探索专业”中搜索相应方向。相关方向不等于同一专业。`;q('#selectedMajorHint').hidden=false;chooseApp('major');go('workbench');toast(`请在职业地图中搜索「${m.careerBridges[0].zh}」`)}
function init(){
 const cats=[...new Set(CATALOG.map(x=>x.category))].sort((a,b)=>a.localeCompare(b,'zh-CN'));q('#categorySelect').insertAdjacentHTML('beforeend',cats.map(x=>`<option value="${escapeHTML(x)}">${escapeHTML(x)}</option>`).join(''));
 qa('.navbtn').forEach(b=>b.addEventListener('click',()=>go(b.dataset.page)));
 document.addEventListener('click',(e)=>{const jump=e.target.closest('[data-jump]');if(jump){go(jump.dataset.jump);return}const nav=e.target.closest('a[data-nav]');if(nav){e.preventDefault();go(nav.dataset.nav);return}const op=e.target.closest('[data-open]');if(op){chooseApp(op.dataset.open);go('workbench');return}const interest=e.target.closest('[data-interest]');if(interest){toggleManual(interest.dataset.interest);return}const compare=e.target.closest('[data-compare]');if(compare){modifyCompare(compare.dataset.compare);return}const remove=e.target.closest('[data-remove]');if(remove){modifyCompare(remove.dataset.remove);return}const career=e.target.closest('[data-career-detail]');if(career){openCareer(career.dataset.careerDetail);return}const detail=e.target.closest('[data-major-detail]');if(detail){openDetail(detail.dataset.majorDetail);return}});
 q('#subjectPicks').addEventListener('change',(e)=>{if(e.target.matches('input[type=checkbox]')){const v=e.target.value;if(e.target.checked&&!saved.subjects.includes(v))saved.subjects.push(v);else if(!e.target.checked)saved.subjects=saved.subjects.filter(s=>s!==v);save();renderProfile();renderCatalog()}});
 q('#clearSubjects').addEventListener('click',()=>{saved.subjects=[];save();renderProfile();renderCatalog()});
 q('#clearInterest').addEventListener('click',()=>{saved.manual=[];save();readHistory();renderCatalog()});
 q('#syncButton').addEventListener('click',()=>{readHistory();renderCatalog();toast(history?'已读取最近一条测评结果':'未找到本浏览器的已完成测评记录')});
 q('#readHistory').addEventListener('click',()=>{readHistory();renderCatalog();toast(history?'测评记录已同步':'尚未发现测评记录')});
 q('#majorSearch').addEventListener('input',renderCatalog);q('#categorySelect').addEventListener('change',renderCatalog);q('#sortSelect').addEventListener('change',renderCatalog);
 q('#resetCatalog').addEventListener('click',()=>{q('#majorSearch').value='';q('#categorySelect').value='';q('#sortSelect').value='relevance';renderCatalog()});
 qa('.app-switch [data-app]').forEach(b=>b.addEventListener('click',()=>chooseApp(b.dataset.app)));
 q('#copyMajorName').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(selectedMajor);toast('专业名称已复制')}catch(e){toast('复制不可用，可直接选择名称后复制')}});
 q('#reloadApp').addEventListener('click',()=>{const fr=q('#legacyFrame');fr.src=PUBLISHED[activeApp];toast('正在重新加载原网站模块')});
 window.addEventListener('storage',(e)=>{if(e.key===HISTORY_KEY){readHistory();renderCatalog()}});
 readHistory();renderCatalog();renderCompare();go(location.hash.slice(1)||'home');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
