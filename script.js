/* ── Cursor ── */
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px';});
(function lag(){rx+=(mx-rx)*.11;ry+=(my-ry)*.11;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(lag);})();
document.querySelectorAll('a,button').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cur.style.width='22px';cur.style.height='22px';cur.style.background='var(--gold)';ring.style.width='54px';ring.style.height='54px';});
  el.addEventListener('mouseleave',()=>{cur.style.width='12px';cur.style.height='12px';cur.style.background='var(--crimson)';ring.style.width='36px';ring.style.height='36px';});
});

/* ── Particles ── */
const canvas=document.getElementById('particles');
const ctx=canvas.getContext('2d');
let W,H;
function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight;}
resize();window.addEventListener('resize',resize);
const COLS=['rgba(192,24,58,','rgba(13,43,78,','rgba(232,184,75,'];
const pts=Array.from({length:55},()=>({
  x:Math.random()*window.innerWidth,y:Math.random()*window.innerHeight,
  r:Math.random()*2.5+.8,vx:(Math.random()-.5)*.4,vy:(Math.random()-.5)*.4,
  c:COLS[Math.floor(Math.random()*3)],o:Math.random()*.35+.1
}));
function draw(){
  ctx.clearRect(0,0,W,H);
  pts.forEach(p=>{
    p.x+=p.vx;p.y+=p.vy;
    if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle=p.c+p.o+')';ctx.fill();
  });
  for(let i=0;i<pts.length;i++)for(let j=i+1;j<pts.length;j++){
    const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y,d=Math.hypot(dx,dy);
    if(d<120){ctx.beginPath();ctx.moveTo(pts[i].x,pts[i].y);ctx.lineTo(pts[j].x,pts[j].y);ctx.strokeStyle='rgba(192,24,58,'+(0.07*(1-d/120))+')';ctx.lineWidth=.6;ctx.stroke();}
  }
  requestAnimationFrame(draw);
}
draw();

/* ── 3D card tilt ── */
document.querySelectorAll('.card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=e.clientX-r.left,y=e.clientY-r.top;
    const rx2=((y-r.height/2)/r.height)*10,ry2=-((x-r.width/2)/r.width)*10;
    card.style.transform=`perspective(900px) rotateX(${rx2}deg) rotateY(${ry2}deg) translateY(-10px) scale(1.025)`;
    card.style.boxShadow=`0 50px 100px rgba(13,43,78,.22)`;
    card.style.transition='box-shadow .1s';
  });
  card.addEventListener('mouseleave',()=>{
    card.style.transition='transform .5s cubic-bezier(.23,1,.32,1), box-shadow .4s ease';
    card.style.transform='perspective(900px) rotateX(0) rotateY(0) translateY(0) scale(1)';
    card.style.boxShadow='';
    setTimeout(()=>card.style.transition='',500);
  });
});

/* ── Ripple ── */
document.querySelectorAll('.go-btn').forEach(btn=>{
  btn.addEventListener('click',e=>{
    // Only prevent default if href is '#' or not set (button-like)
    if (
      btn.tagName === 'BUTTON' ||
      (btn.tagName === 'A' && (!btn.getAttribute('href') || btn.getAttribute('href') === '#'))
    ) {
      e.preventDefault();
    }
    const r=btn.getBoundingClientRect();
    const rip=document.createElement('span');
    rip.className='ripple';
    const s=Math.max(r.width,r.height);
    rip.style.cssText=`width:${s}px;height:${s}px;left:${e.clientX-r.left-s/2}px;top:${e.clientY-r.top-s/2}px;`;
    btn.appendChild(rip);setTimeout(()=>rip.remove(),600);
  });
});

/* ── Counter animation ── */
function animCount(el){
  const target=+el.dataset.target, suffix=el.dataset.suffix||'';
  let start=null;
  const dur=1800;
  function step(ts){
    if(!start)start=ts;
    const p=Math.min((ts-start)/dur,1);
    const ease=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;
    el.textContent=Math.round(ease*target)+(p>=1?suffix:'');
    if(p<1)requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
const statsBar=document.querySelector('.stats-bar');
let done=false;
new IntersectionObserver(([e])=>{if(e.isIntersecting&&!done){done=true;document.querySelectorAll('.stat-num[data-target]').forEach(animCount);}},{threshold:.5}).observe(statsBar);

/* ── Letter stagger on title ── */
const gs = document.querySelector('h1 .gradient-text');
gs.innerHTML = gs.textContent.split('').map((c,i)=>
  `<span style="display:inline-block;animation:dropLetter .5s ${.55+i*.045}s cubic-bezier(.34,1.56,.64,1) both">${c===' '?'&nbsp;':c}</span>`
).join('');