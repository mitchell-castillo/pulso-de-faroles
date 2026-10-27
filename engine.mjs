export const KEY='daily-games:pulso-de-faroles:v1';
export function neighbors(n,i){if(!Number.isInteger(i)||i<0||i>=n*n)throw Error('Casilla inválida');return [i,i%n?i-1:-1,i%n<n-1?i+1:-1,i>=n?i-n:-1,i<n*(n-1)?i+n:-1].filter(v=>v>=0)}
export function toggle(a,n,i){const b=[...a];for(const j of neighbors(n,i))b[j]=!b[j];return b}
const designs=[{n:3,press:[4],name:'Primer destello'},{n:3,press:[0,8],name:'Dos orillas'},{n:3,press:[1,4,6],name:'Cruce nocturno'},{n:4,press:[0,5,10],name:'Plaza de cobre'},{n:4,press:[1,7,8,14],name:'Viento del norte'},{n:5,press:[0,6,12,18,24],name:'El último faro'}];
export const LEVELS=designs.map((d,k)=>({...d,id:k,initial:d.press.reduce((a,i)=>toggle(a,d.n,i),Array(d.n*d.n).fill(false))}));
export const fresh=()=>({version:1,currentLevel:0,completed:[],bestMoves:{},runs:{}});
export function validate(raw){const s=fresh();if(!raw||raw.version!==1)return s;if(raw.completed&&!Array.isArray(raw.completed)){raw={...raw,bestMoves:Object.fromEntries(Object.entries(raw.completed).map(([k,v])=>[k,v?.bestMoves])),completed:Object.keys(raw.completed).map(Number)}}s.completed=[...new Set((Array.isArray(raw.completed)?raw.completed:[]).filter(v=>Number.isInteger(v)&&v>=0&&v<6))].sort(); // only a contiguous solved prefix unlocks stages
s.completed=s.completed.filter((_,i,a)=>a[i]===i&&a.slice(0,i).every((v,j)=>v===j));
s.currentLevel=Number.isInteger(raw.currentLevel)?Math.max(0,Math.min(raw.currentLevel,Math.min(s.completed.length,5))):0;
for(const l of LEVELS){const m=raw.bestMoves?.[l.id];if(s.completed.includes(l.id)&&Number.isInteger(m)&&m>0&&m<=10000)s.bestMoves[l.id]=m;const r=raw.runs?.[l.id];if(r&&Array.isArray(r.history)&&r.history.length<=10000&&r.history.every(v=>Number.isInteger(v)&&v>=0&&v<l.n*l.n))s.runs[l.id]={history:[...r.history]};}return s}
export function boardFor(s,k=s.currentLevel){const l=LEVELS[k];return (s.runs[k]?.history||[]).reduce((a,i)=>toggle(a,l.n,i),l.initial)}
export function play(s,i){const x=validate(s),k=x.currentLevel,l=LEVELS[k];if(boardFor(x).every(v=>!v))return x;neighbors(l.n,i);const h=x.runs[k]?.history||[];if(h.length>=10000)return x;x.runs[k]={history:[...h,i]};if(boardFor(x).every(v=>!v)){if(!x.completed.includes(k))x.completed.push(k);x.bestMoves[k]=Math.min(x.bestMoves[k]??Infinity,h.length+1)}return x}
export function undo(s){const x=validate(s),k=x.currentLevel;x.runs[k]={history:(x.runs[k]?.history||[]).slice(0,-1)};return x}
export function restart(s){const x=validate(s);x.runs[x.currentLevel]={history:[]};return x}
export function select(s,k){const x=validate(s);if(!Number.isInteger(k)||k<0||k>Math.min(x.completed.length,5))return x;x.currentLevel=k;return x}
export function load(storage){try{return validate(JSON.parse(storage.getItem(KEY)))}catch{return fresh()}}
export function save(storage,s){try{const x=validate(s);storage.setItem(KEY,JSON.stringify({...x,completed:Object.fromEntries(x.completed.map(k=>[k,{bestMoves:x.bestMoves[k]||1}])),run:x.runs[x.currentLevel]?.history.length?{level:x.currentLevel}:null,updatedAt:new Date().toISOString()}));return true}catch{return false}}
