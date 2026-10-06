import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const data=JSON.parse(fs.readFileSync('dist/schools.json','utf8'));
assert.equal(data.schools.length,23);
assert.equal(new Set(data.schools.map(s=>s.id)).size,23);
for(const s of data.schools){
  for(const key of ['name','city','state','region','type','gender','website','reviewed'])assert(s[key],`${s.id}: missing ${key}`);
  for(const key of ['deadline','tuition','visits','exam','admissions','activities','college']){const f=s[key];assert(f.text);assert(['verified','tentative','unknown'].includes(f.status));if(f.url)assert.equal(new URL(f.url).protocol,'https:');}
  for(const d of s.deadline.dates){assert.match(d,/^\d{4}-\d{2}-\d{2}$/);assert.equal(s.deadline.status,'verified');assert(!Number.isNaN(Date.parse(d)));}
  assert(s.tuition.amount===null||Number.isFinite(s.tuition.amount));
}
const html=fs.readFileSync('dist/index.html','utf8');
for(const path of ['styles.css','app.js','schools.json'])assert(fs.existsSync('dist/'+path));
for(const id of ['search','location','type','gender','sort','results','count','reset','compare','comparison','closecompare','comparisonTable'])assert(html.includes(`id="${id}"`));
const elements={};
const element=id=>elements[id]??=( {value:id==='sort'?'local':id==='date-view'?'upcoming':'',style:{},listeners:{},setAttribute(k,v){this[k]=v;},addEventListener(e,fn){this.listeners[e]=fn;},focus(){},innerHTML:'',textContent:''} );
const savedProgress=new Map();
const localStorage={getItem:k=>savedProgress.get(k)||null,setItem:(k,v)=>savedProgress.set(k,v)};
const ctx=vm.createContext({localStorage,document:{getElementById:element},fetch:async()=>({ok:true,json:async()=>data}),URL,console,Date,Set});
vm.runInContext(fs.readFileSync('dist/app.js','utf8'),ctx);
await new Promise(resolve=>setTimeout(resolve,20));
assert(element('count').textContent.startsWith('23 of 23'));
element('gender').value='Girls-only';vm.runInContext('render()',ctx);assert(element('count').textContent.startsWith('1 of 23'));
element('gender').value='';element('search').value='leman';vm.runInContext('render()',ctx);assert(element('results').innerHTML.includes('Léman'));
element('search').value='impossible-nonmatch';vm.runInContext('render()',ctx);assert(element('results').innerHTML.includes('No schools'));
element('search').value='';element('sort').value='tuition';assert.equal(vm.runInContext('filtered()[0].tuition.amount',ctx),0);
assert.equal(vm.runInContext('filtered().at(-1).tuition.amount',ctx),null);
vm.runInContext("selected=new Set(['franklin','st-peters']);compare()",ctx);assert.equal(element('comparison').hidden,false);assert(element('comparisonTable').innerHTML.includes('College records'));assert(element('comparisonTable').innerHTML.includes('Saint Peter'));
vm.runInContext('closeCompare()',ctx);assert.equal(element('comparison').hidden,true);
assert.equal(vm.runInContext("safeUrl('javascript:alert(1)')",ctx),'#');
assert.equal(vm.runInContext("esc('<script>')",ctx),'&lt;script&gt;');
console.log('Passed: 23 records, required fields, URLs, date schema, assets, filtering, accent-insensitive search, empty state, tuition sorting, comparison, escaping.');

element('sort').value='name';
vm.runInContext("toggleSchool('franklin')",ctx);
assert.equal(vm.runInContext("expanded.has('franklin')",ctx),true);
assert(element('results').innerHTML.includes('id="details-franklin" >'));
assert(element('results').innerHTML.includes('aria-expanded="true"'));
vm.runInContext("toggleSchool('franklin')",ctx);
assert.equal(vm.runInContext("expanded.has('franklin')",ctx),false);
assert(element('results').innerHTML.includes('id="details-franklin" hidden'));
assert(!vm.runInContext("compact(schools.find(s=>s.id==='franklin'),'tuition')",ctx).includes('fees'));
assert(vm.runInContext("compact(schools.find(s=>s.id==='st-dominic'),'visits')",ctx).includes('Unconfirmed'));
for(const school of data.schools)for(const key of ['visits','deadline','exam','college'])assert(school[key].summary);
console.log('Passed: compact summaries, tuition display, expandable rows, ARIA state, unconfirmed labeling.');
for(const school of data.schools){assert(school.niche);assert.equal(new URL(school.niche.url).hostname,'www.niche.com');assert.equal(school.niche.metric,'Overall Niche Grade');assert(school.niche.checked);}
assert.equal(data.schools.filter(s=>s.niche.grade!==null).length,21);
element('sort').value='niche';
assert.equal(vm.runInContext('filtered()[0].niche.grade',ctx),'A+');
assert.equal(vm.runInContext('filtered().at(-1).niche.grade',ctx),null);
assert(vm.runInContext("compact(schools.find(s=>s.id==='kindle'),'niche')",ctx).includes('Not rated'));
assert(vm.runInContext("field('Niche rating',schools[0].niche)",ctx).includes('Niche source'));
assert(vm.runInContext("field('Niche rating',schools[0].niche)",ctx).includes('Checked 2026-09-22'));
console.log('Passed: Niche source coverage, external labels, checked dates and grade sorting with missing grades last.');

for(const school of data.schools)for(const key of ['visits','deadline','exam'])assert(['2026-09-22','2026-10-02','2026-10-06'].includes(school[key].checked));
assert(!vm.runInContext("field('Entrance exam',schools.find(s=>s.id==='franklin').exam)",ctx).includes('Niche grade'));
assert(vm.runInContext("compact(schools.find(s=>s.id==='mcnair'),'exam')",ctx).includes('Register by Oct 2'));
for(const id of ['mcnair','infinity']){const s=data.schools.find(s=>s.id===id);assert.equal(s.deadline.dates.length,0);assert(s.exam.text.includes('Oct 24, 2026'));}
for(const s of data.schools)for(const key of ['visits','deadline','exam'])assert(!s[key].text.includes('supplied document'));
console.log('Passed: admissions checked dates, prerequisite labeling, source-specific annotations, and removal of guide-only admissions data.');

element('search').value='';element('sort').value='local';
for(const [group,total] of [['jersey-city',9],['nj-other',8],['nyc',6]]){
 element('location').value=group;
 assert.equal(vm.runInContext('filtered().length',ctx),total);
 assert.equal(vm.runInContext(`filtered().every(s=>locationGroup(s)==='${group}')`,ctx),true);
}
element('location').value='';
assert.equal(vm.runInContext("filtered().slice(0,9).every(s=>s.city==='Jersey City')",ctx),true);
assert.equal(vm.runInContext("filtered().slice(9,17).every(s=>s.state==='NJ'&&s.city!=='Jersey City')",ctx),true);
element('reset').listeners.click();assert.equal(element('sort').value,'local');
console.log('Passed: Jersey City / other NJ / NYC filtering, local ordering, and reset default.');

for(const school of data.schools)for(const key of ['visits','deadline']){
 const f=school[key];assert(f.items.length);for(const item of f.items){assert(item.date);assert(item.detail);}
 assert.equal(f.text,f.items.map(item=>item.date+' — '+item.detail).join('\n')+(f.detailNote?'\n'+f.detailNote:''));
}
assert(vm.runInContext("field('Visits',schools.find(s=>s.id==='franklin').visits)",ctx).includes('<li><strong>Oct 7, 2026</strong>'));
vm.runInContext("selected=new Set(['franklin','st-peters']);compare()",ctx);
assert(element('comparisonTable').innerHTML.includes('<ul class="dateitems">'));
assert(vm.runInContext("detailContent({items:[{date:'<bad>',detail:'&'}]})",ctx).includes('&lt;bad&gt;'));
console.log('Passed: date-first bullets, export consistency, comparison rendering and escaped list content.');

assert.equal(data.exams.length,9);
const events=vm.runInContext('plannerEvents',ctx);
assert.equal(new Set(events.map(e=>e.id)).size,events.length);
for(const event of events){assert(event.schoolIds.length);assert(event.schoolIds.every(id=>data.schools.some(s=>s.id===id)));if(event.isoDate)assert.match(event.isoDate,/^\d{4}-\d{2}-\d{2}$/);}
assert(events.some(e=>e.isoDate==='2026-10-02'&&e.schoolIds.includes('mcnair')&&e.schoolIds.includes('infinity')));
assert(!events.some(e=>e.isoDate&&e.date.includes('unconfirmed')));
assert.equal(events.filter(e=>e.isoDate==='2026-12-12'&&e.schoolIds.includes('seton-hall')&&e.kind==='Exam').length,1);
vm.runInContext("setTab('dates')",ctx);assert.equal(element('panel-schools').hidden,true);assert.equal(element('tab-dates')['aria-selected'],'true');
element('date-school').value='mcnair';element('date-view').value='all';vm.runInContext('renderDates()',ctx);
assert(element('date-results').innerHTML.includes('PSAT signup'));assert(!element('date-results').innerHTML.includes('Paper SSAT'));
const task=events.find(e=>e.isoDate==='2026-10-02'&&e.schoolIds.includes('mcnair'));
vm.runInContext(`setTaskDone(${JSON.stringify(task.id)},true)`,ctx);
assert(savedProgress.get('jersey-city-high-schools:2027:completed').includes(task.id));
vm.runInContext('completedTasks=new Set();readProgress()',ctx);assert.equal(vm.runInContext(`completedTasks.has(${JSON.stringify(task.id)})`,ctx),true);
element('date-view').value='completed';assert.equal(vm.runInContext('visibleEvents().length',ctx),1);
vm.runInContext(`setTaskDone(${JSON.stringify(task.id)},false)`,ctx);assert.equal(vm.runInContext('visibleEvents().length',ctx),0);
element('exam-school').value='kindle';vm.runInContext('renderExams()',ctx);assert(element('exam-results').innerHTML.includes('No exam'));assert(!element('exam-results').innerHTML.includes('SSAT'));
element('exam-school').value='franklin';vm.runInContext('renderExams()',ctx);assert(element('exam-results').innerHTML.includes('Optional'));assert(element('exam-results').innerHTML.includes('ISEE'));
vm.runInContext("setTab('exams')",ctx);assert.equal(element('panel-dates').hidden,true);assert.equal(element('panel-exams').hidden,false);
savedProgress.set('jersey-city-high-schools:2027:completed','not json');vm.runInContext('readProgress();renderDates()',ctx);assert(element('progress-note').textContent.includes('unavailable'));
console.log('Passed: tab switching, shared events, undated handling, school filters, exam alternatives, completion persistence and invalid storage fallback.');

// Refresh regression checks: preserve uncertainty, date semantics and existing checklist keys.
const schoolById=id=>data.schools.find(s=>s.id===id);
for(const id of ['high-tech','county-prep']){
 const d=schoolById(id).deadline;
 assert.deepEqual(d.dates,['2026-11-13']);
 assert(d.items.some(i=>i.kind==='Applications open'&&i.isoDate==='2026-10-05'));
 assert(d.items.some(i=>i.id===id+'-deadline-1'&&i.isoDate==='2026-11-13'));
}
for(const id of ['pingry','delbarton']){
 const f=schoolById(id)[id==='pingry'?'visits':'deadline'];
 assert.equal(f.status,'tentative');
 assert(f.items.filter(i=>i.status==='tentative').every(i=>i.isoDate===null));
}
assert.deepEqual(schoolById('delbarton').deadline.dates,[]);
assert.deepEqual(schoolById('kindle').deadline.dates,['2027-02-15']);
assert.deepEqual(schoolById('hoboken-high').deadline.dates,['2026-11-24']);
assert(schoolById('horace-mann').deadline.items.find(i=>i.id==='horace-mann-deadline-1').detail.includes('prior two years'));
assert.equal(schoolById('pingry').exam.milestones.length,2);
const tachs=data.exams.find(e=>e.id==='tachs');
assert.equal(tachs.events.find(e=>e.id==='tachs-check').isoDate,'2026-10-28');
assert.equal(tachs.events.filter(e=>e.kind==='Exam').length,2);
assert(events.some(e=>e.id==='franklin-applications-open'&&e.url==='https://www.franklinjc.org/admissions/apply'));
assert(vm.runInContext("evidence({status:'tentative',sources:[{label:'<bad>',url:'javascript:alert(1)'}]})",ctx).includes('href="#"'));
assert(vm.runInContext("evidence({status:'tentative',sources:[{label:'<bad>',url:'https://example.com'}]})",ctx).includes('&lt;bad&gt;'));
for(const school of data.schools)for(const key of ['admissions','visits','deadline','exam'])for(const source of school[key].sources||[])assert.equal(new URL(source.url).protocol,'https:');
console.log('Passed: refreshed deadlines, application-opening semantics, conflicts, score milestones, TACHS alternatives, stable checklist keys and escaped supplemental sources.');
