const CLICKS = [
  { time: 4, color: 1, x: 341, y: 896 },
  { time: 8, color: 2, x: 423, y: 896 },
  { time: 12, color: 0, x: 259, y: 896 },
  { time: 14.2, explore: true, x: 625, y: 895 }
];
const COLORS = ['#2457ff', '#ff8369', '#373a48'];
const CROPS = [[17,123,721,486], [729,122,720,487], [1441,123,723,486]];
const ease = x => { x = Math.max(0, Math.min(1, x)); return x*x*(3-2*x); };

function demoState(t) {
  t = Math.max(0, Math.min(18, t));
  let color = 0, from = 0, changed = -100;
  for (const click of CLICKS) if (click.time <= t && !click.explore) {
    from = color; color = click.color; changed = click.time;
  }
  const entrance = ease(t / 1.5);
  const cursor = { x: 820, y: 945 };
  for (const click of CLICKS) {
    if (t >= click.time - 1 && t <= click.time + .35) {
      const p = ease((t - click.time + 1) / .85);
      cursor.x += (click.x - cursor.x) * p;
      cursor.y += (click.y - cursor.y) * p;
      break;
    }
  }
  return { color, from, mix: ease((t - changed) / .65), changed,
    entrance, x: 470 + (1-entrance)*240,
    y: 485 - (1-entrance)*130 + Math.sin(t*2)*8,
    scale: .7 + entrance*.3 + Math.sin(Math.min(1,t/1.5)*Math.PI)*.055,
    angle: (1-entrance)*-22 + Math.sin(t*1.7)*1.3,
    features: ease((t-14.2)/.8), cursor, t };
}

if (typeof module !== 'undefined') module.exports = { demoState, CLICKS, COLORS, CROPS };

if (typeof document !== 'undefined') {
  const canvas = document.querySelector('#scene'), ctx = canvas.getContext('2d');
  const plate = new Image(), shoes = new Image();
  plate.src = 'assets/studio.png'; shoes.src = 'assets/shoes.png';
  let origin, manual = false, selected = 0, previous = 0, changedAt = -100, showFeatures = false, revealAt = 0;
  function changeColor(color) {
    if (!Number.isInteger(color) || color < 0 || color > 2) return;
    if (!manual) { const s = demoState(((performance.now()-origin)/1000)%18); selected=s.color; }
    previous = selected; selected = color; changedAt = performance.now()/1000; manual = true;
  }
  const swatches = document.querySelectorAll('[data-color]');
  swatches.forEach(button => {
    button.onclick = () => changeColor(Number(button.dataset.color));
  });
  document.querySelector('#explore').onclick = () => {
    if (!manual) selected = demoState(((performance.now()-origin)/1000)%18).color;
    previous = selected; manual = true; showFeatures = !showFeatures; revealAt = performance.now()/1000;
  };
  const snippets = [
    ['<main id="studio">', '  <canvas id="scene" width="941"', '    height="1672"></canvas>', '  <div class="swatches">', '    <button data-color="0"></button>', '    <button data-color="1"></button>', '    <button data-color="2"></button>', '  </div>', '  <button id="explore"></button>', '</main>'],
    ['#studio {', '  position: relative;', '  width: 941px; height: 1672px;', '  transform-origin: top center;', '}', '.swatches {', '  position: absolute;', '  left: 232px; top: 867px;', '  display: flex; gap: 24px;', '}'],
    ['swatches.forEach(button => {', '  button.onclick = () =>', '    changeColor(Number(button.dataset.color));', '});', 'function changeColor(color) {', '  previous = selected;', '  selected = color;', '  changedAt = performance.now() / 1000;', '  manual = true;', '}']
  ];
  function roundRect(x,y,w,h,r,fill,stroke) {
    ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();
    if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1.5;ctx.stroke();}
  }
  function render(s) {
    ctx.clearRect(0,0,941,1672);
    if(plate.complete && plate.naturalWidth) ctx.drawImage(plate,0,0,941,1672);
    // A ripple follows each click; it does not precede the cursor interaction.
    const age=s.t-s.changed;
    if(age>=0 && age<1.2){ctx.save();ctx.globalAlpha=(1-age/1.2)*.55;ctx.strokeStyle=COLORS[s.color];ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(470,776,70+age*290,12+age*42,0,0,Math.PI*2);ctx.stroke();ctx.restore();}
    if(shoes.complete && shoes.naturalWidth){
      ctx.save();ctx.translate(s.x,s.y);ctx.rotate(s.angle*Math.PI/180);ctx.scale(s.scale,s.scale);
      if(s.mix<1){ctx.globalAlpha=1-s.mix;ctx.drawImage(shoes,...CROPS[s.from],-382,-258,764,516);}
      ctx.globalAlpha=s.mix;ctx.drawImage(shoes,...CROPS[s.color],-382,-258,764,516);ctx.restore();
    }
    const f=s.features;
    if(f>0){ctx.save();ctx.globalAlpha=f;
      ctx.strokeStyle='#2457ff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(620,327);ctx.lineTo(536,408);ctx.moveTo(833,558);ctx.lineTo(734,687);ctx.stroke();
      roundRect(530+(1-f)*40,255,268,70,20,'#f9fcfff0','#c5d7ff');roundRect(724+(1-f)*30,505,196,60,18,'#f9fcfff0','#c5d7ff');
      ctx.fillStyle='#102044';ctx.font='bold 21px Arial';ctx.fillText('Breathable mesh',553+(1-f)*40,298);ctx.font='bold 18px Arial';ctx.fillText('Cushioned sole',741+(1-f)*30,541);
      for(const [x,y] of [[536,408],[734,687]]){ctx.beginPath();ctx.arc(x,y,8,0,7);ctx.fillStyle='#2457ff';ctx.fill();ctx.strokeStyle='white';ctx.stroke();}ctx.restore();
    }
    ctx.save();ctx.shadowColor='#426ad34d';ctx.shadowBlur=18;
    roundRect(203,852,273,85,43,'#fffdfb');roundRect(500,852,250,85,43,'#2457ff');ctx.restore();
    for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(259+i*82,896,25,0,7);ctx.fillStyle=COLORS[i];ctx.fill();if(i===s.color){ctx.strokeStyle='white';ctx.lineWidth=2;ctx.stroke();ctx.beginPath();ctx.arc(259+i*82,896,30,0,7);ctx.strokeStyle='#2457ff';ctx.stroke();}}
    ctx.font='bold 31px Arial';ctx.fillStyle='white';ctx.fillText('Explore',573,906);
    for(let panel=0;panel<3;panel++){
      const start=Math.min(6,Math.floor(s.t/3));const top=[1055,1290,1534][panel];
      ctx.save();ctx.beginPath();ctx.rect(22,top-6,896,panel===2?112:142);ctx.clip();
      ctx.font='21px monospace';
      snippets[panel].slice(start,start+4).forEach((text,row)=>{ctx.fillStyle='#7a8aa7';ctx.fillText(start+row+1,51,top+row*32);ctx.fillStyle=['#77caff','#efb75a','#d4b1ff'][panel];ctx.fillText(text,104,top+row*32);});ctx.restore();
    }
    if(!manual && s.t>=2.7){const c=s.cursor;ctx.save();ctx.translate(c.x,c.y);ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(6,36);ctx.lineTo(16,26);ctx.lineTo(24,40);ctx.lineTo(30,37);ctx.lineTo(22,23);ctx.lineTo(35,20);ctx.closePath();ctx.fillStyle='white';ctx.fill();ctx.strokeStyle='#102044';ctx.lineWidth=2;ctx.stroke();ctx.restore();
      for(const click of CLICKS){const a=s.t-click.time;if(a>=0&&a<.35){ctx.save();ctx.globalAlpha=1-a/.35;ctx.strokeStyle='#2457ff';ctx.lineWidth=3;ctx.beginPath();ctx.arc(click.x,click.y,8+a*100,0,7);ctx.stroke();ctx.restore();}}
    }
  }
  function resize(){const scale=Math.min(1,innerWidth/941);document.querySelector('#studio').style.transform=`scale(${scale})`;document.querySelector('#studio').style.marginLeft=`${(innerWidth-941)/2}px`;document.body.style.height=`${1672*scale}px`;}
  addEventListener('resize',resize);resize();
  function loop(now){origin??=now;const t=((now-origin)/1000)%18;const s=demoState(t);
    if(manual){s.from=previous;s.color=selected;s.mix=ease((now/1000-changedAt)/.65);s.changed=changedAt;s.t=now/1000;s.entrance=1;s.x=470;s.y=485+Math.sin(t*2)*8;s.scale=1;s.angle=Math.sin(t*1.7)*1.3;s.features=showFeatures?ease((now/1000-revealAt)/.8):0;}
    render(s);requestAnimationFrame(loop);
  }
  window.seekSneakerDemo=t=>render(demoState(t));requestAnimationFrame(loop);
}
