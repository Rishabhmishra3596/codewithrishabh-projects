(function(root){
const C=typeof module!=='undefined'?require('./code-data.js'):root.CodeData;
const clamp=n=>Math.max(0,Math.min(1,n));
const ease=n=>{n=clamp(n);return n*n*(3-2*n)};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const text=(x,y,s,size=12,fill='#333',weight=400,anchor='middle')=>`<text x="${x}" y="${y}" font-family="DejaVu Sans,sans-serif" font-size="${size}" fill="${fill}" font-weight="${weight}" text-anchor="${anchor}">${esc(s)}</text>`;
const stages=[{file:'index.html',label:'HTML Code',start:0,end:3.2,code:C.html},{file:'style.css',label:'CSS Code',start:3.2,end:17,code:C.css},{file:'app.js',label:'JavaScript Code',start:17,end:20,code:C.js}];
function typed(stage,t){return stage.code.slice(0,Math.floor(stage.code.length*clamp((t-stage.start)/(stage.end-stage.start))))}
function completedCSS(t){const s=typed(stages[1],t),i=s.lastIndexOf(';');return i<0?'':s.slice(0,i+1)}
function rule(s,selector){return (s.split(selector+' {')[1]||'').split('}')[0]}
function flags(t){const css=completedCSS(t),card=rule(css,'.auth-card'),input=rule(css,'input'),overlay=rule(css,'.overlay'),button=rule(css,'button');return {flex:card.includes('display: flex;'),wide:card.includes('width: 580px;'),white:card.includes('background: #ffffff;'),round:card.includes('border-radius: 20px;'),clip:card.includes('overflow: hidden;'),inputWide:input.includes('width: 100%;'),inputPad:input.includes('padding: 10px;'),inputBorder:input.includes('border: 0;'),inputGray:input.includes('background: #edebee;'),inputRound:input.includes('border-radius: 5px;'),red:overlay.includes('background: #ff0710;'),whiteText:overlay.includes('color: #ffffff;'),buttonRed:button.includes('background: #ff0710;'),buttonWhite:button.includes('color: #ffffff;'),buttonBorder:button.includes('border: 0;'),buttonRound:button.includes('border-radius: 5px;')}}
function mode(t){return ease((t-20.75)/.7)}
function ui(t){const f=flags(t),p=mode(t),h=typed(stages[0],t);if(!f.flex)return rawHtml(h);const w=f.wide?580:f.flex?450:280,x=f.wide?60:f.flex?135:70,y=150,half=w/2,cx=x+half/2+p*half,overlayX=x+half*(1-p),rx=f.round?20:0;
 const hasHead=h.includes('</h2>'),hasEmail=h.includes('Enter E-mail" required>'),hasPassword=h.includes('Enter Password" required>'),hasButton=h.includes('</button>'),hasOverlay=h.includes('class="overlay"'),hasHello=h.includes('Hello World</h2>'),hasSignup=h.includes('id="toggle"');
 let out=`<defs><clipPath id="authClip"><rect x="${x}" y="${y}" width="${w}" height="360" rx="${rx}"/></clipPath></defs>`;
 if(f.white)out+=`<rect x="${x}" y="${y}" width="${w}" height="360" rx="${rx}" fill="white"/>`;
 out+=`<g ${f.clip?'clip-path="url(#authClip)"':''}>`;
 const open=p>.5,heading=open?'Create Account':'Sign In',fieldLabels=open?['Enter Name','Enter E-mail','Enter Password']:['Enter E-mail','Enter Password'];
 if(hasHead)out+=text(cx,y+(open?60:80),heading,open?23:25,'#222',700);
 if(hasEmail)out+=text(cx,y+(open?95:120),open?'Sign up with your email':'Sign in with email & password',10,'#888');
 const fieldWidth=f.inputWide?half-60:125,fieldH=f.inputPad?32:22,fieldY=y+(open?116:145),gap=f.inputPad?43:33;
 const count=open?3:hasPassword?2:hasEmail?1:0;
 for(let i=0;i<count;i++){let yy=fieldY+i*gap;out+=`<rect x="${cx-fieldWidth/2}" y="${yy}" width="${fieldWidth}" height="${fieldH}" rx="${f.inputRound?5:0}" fill="${f.inputGray?'#edebee':'white'}" stroke="${f.inputBorder?'none':'#888'}"/>`+text(cx-fieldWidth/2+10,yy+fieldH/2+4,fieldLabels[i],10,'#999',400,'start')}
 if(hasButton){const yy=y+278;out+=`<rect x="${cx-53}" y="${yy}" width="106" height="29" rx="${f.buttonRound?5:0}" fill="${f.buttonRed?'#ff0710':'#eee'}" stroke="${f.buttonBorder?'none':'#888'}"/>`+text(cx,yy+19,open?'REGISTER':'SIGN IN',9,f.buttonWhite?'white':'#222',700);if(!open)out+=text(cx,y+260,'Forgot Password?',10,'#777')}
 if(hasOverlay){const ox=f.flex?overlayX:x,oy=f.flex?y:y+290,ow=f.flex?half:w,oc=ox+ow/2;
 if(f.red)out+=`<rect x="${ox}" y="${oy}" width="${ow}" height="${f.flex?360:70}" rx="${rx}" fill="#ff0710"/>`;
 const ink=f.whiteText?'white':'#222',ty=f.flex?oy+148:oy+25;
 if(hasHello)out+=text(oc,ty,open?'Welcome Back!':'Hello World',f.flex?25:18,ink,700);
 if(h.includes('Sign up and enjoy'))out+=text(oc,ty+(f.flex?34:20),open?'Sign in and continue your journey':'Sign up now and enjoy our site',f.flex?10:9,ink);
 if(hasSignup){const by=f.flex?oy+218:oy+54;out+=`<rect x="${oc-56}" y="${by}" width="112" height="28" rx="${f.buttonRound?5:0}" fill="${f.red?'none':'#eee'}" stroke="${f.red?'#ffb3b6':'#888'}"/>`+text(oc,by+18,open?'SIGN IN':'SIGN UP',9,ink,700)}
 }
 return out+'</g>';
}
function rawHtml(h){
 let o='',y=46;
 function heading(value){o+=`<text x="7" y="${y}" font-family="serif" font-size="29" font-weight="700">${value}</text>`;y+=22}
 function input(value){o+=`<rect x="8" y="${y}" width="210" height="26" fill="white" stroke="#777"/>`+text(13,y+18,value,14,'#767676',400,'start');y+=34}
 function button(value){o+=`<rect x="8" y="${y}" width="82" height="24" rx="3" fill="#efefef" stroke="#767676"/>`+text(49,y+16,value,11,'#222');y+=55}
 if(h.includes('Sign In</h2>'))heading('Sign In');
 if(h.includes('Enter E-mail" required>'))input('Enter E-mail');
 if(h.includes('Enter Password" required>'))input('Enter Password');
 if(h.includes('SIGN IN</button>'))button('SIGN IN');
 if(h.includes('Hello World</h2>'))heading('Hello World');
 if(h.includes('SIGN UP</button>'))button('SIGN UP');
 return o;
}
function highlight(line){const rx=/([a-z-]+(?=:\s)|"[^"\n]*"|'[^'\n]*'|#[a-fA-F0-9]{3,8}\b|\b(?:const|function|return|if|true|false|important)\b|\b\d+(?:\.\d+)?(?:px|%)?\b|[<>\/=])/g;let out='',last=0,m;while((m=rx.exec(line))){out+=esc(line.slice(last,m.index));const tok=m[0],c=/^["']/.test(tok)?'#a8d5a2':/^#|^\d/.test(tok)?'#f2c77d':/^[<>\/=]$/.test(tok)?'#87d8e3':/^[a-z-]+$/.test(tok)&&line[rx.lastIndex]===':'?'#8bd9e5':'#d6a6ef';out+=`<tspan fill="${c}">${esc(tok)}</tspan>`;last=rx.lastIndex}return out+esc(line.slice(last))}
function fileIcon(x,y,i){const colors=['#e37954','#75a9e0','#f0d559'],symbols=['<>','#','JS'];return text(x,y,symbols[i],11,colors[i],700,'start')}
function glyph(x,y,d,ink='#626973'){return `<path transform="translate(${x} ${y})" d="${d}" stroke="${ink}" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`}
function chrome(t){
 const controls=[['M12 1L6 7l6 6M6 7h13','#7b8189'],['M6 1l6 6-6 6M0 7h12','#a3aab3'],['M13 4a6 6 0 1 0 1 5M13 0v5H8','#39485b']];
 let o=`<rect width="720" height="720" fill="${flags(t).flex?'#eaf0ff':'#fff'}"/><rect width="720" height="72" fill="#fafafa"/><rect x="128" y="5" width="465" height="30" rx="15" fill="#e8edf4"/><path d="M0 38h720M0 71h720" stroke="#dfe3e9"/><circle cx="659" cy="20" r="9" fill="#355d98"/>`;
 controls.forEach(([d,ink],i)=>{o+=glyph([9,55,93][i],13,d,ink)});
 o+=glyph(144,15,'M0 2h14M0 10h14M5 0v4M9 8v4','#54667e');
 o+=text(169,24,'127.0.0.1:5500/index.html',15,'#34445c',400,'start');
 o+=glyph(541,14,'M5 10a5 5 0 1 1 0-10 5 5 0 0 1 0 10zM9 9l5 5','#54667e');
 o+=glyph(570,13,'M7 0l2 4 5 1-4 3 1 5-4-2-4 2 1-5-4-3 5-1z','#54667e');
 o+=glyph(616,13,'M3 1h9v4h3v4h-3v4H2v-3h3V6H2z','#54667e');
 o+=text(659,23,'R',9,'#fff',700)+`<path d="M696 16h.1m-.1 4h.1m-.1 4h.1" stroke="#485569" stroke-width="2.4" stroke-linecap="round"/>`;
 o+=glyph(17,49,'M0 0h4v4H0zM8 0h4v4H8zM0 8h4v4H0zM8 8h4v4H8z');
 o+=`<path d="M46 45v19m541-19v19" stroke="#d5dae1"/><circle cx="68" cy="55" r="6" fill="#4d87de"/><circle cx="215" cy="55" r="6" fill="#7968ba"/><circle cx="320" cy="55" r="6" fill="#4e91c9"/>`;
 o+=text(80,59,'CodeWithRishabh',12,'#485569',400,'start')+text(227,59,'Projects',12,'#485569',400,'start')+text(332,59,'Source Code',12,'#485569',400,'start');
 o+=glyph(601,50,'M0 0h6l2 2h8v10H0z')+text(624,59,'All Bookmarks',11,'#485569',400,'start');
 return o+`<g transform="translate(10 72)">${ui(t)}${pointer(t)}</g>`;
}
function editor(t){
 const phase=t<3.2?0:t<17?1:2,stage=stages[phase],lines=typed(stage,t).split('\n'),first=Math.max(0,lines.length-18);
 const ink='#a3acc4',name=['HTML','CSS','JavaScript'][phase];
 let o=`<rect y="720" width="720" height="560" fill="#222631"/><rect y="720" width="47" height="560" fill="#2c3342"/><rect x="47" y="720" width="673" height="33" fill="#171a23"/><rect x="47" y="753" width="673" height="27" fill="#232936"/><path d="M47 780H720M47 753H720M47 1257H720M100 780v477" stroke="#343d4e"/><rect y="1258" width="720" height="22" fill="#202632"/><path d="M0 719h720" stroke="#0d1119" stroke-width="2"/>`;
 const icons=['M1 2h13m-13 4h13m-13 4h13','M2 0h12v15H2zM6 4h12v15H6','M11 15a7 7 0 1 1 0-14 7 7 0 0 1 0 14zM16 13l6 7','M5 2v15m0-4c8 0 11-3 11-10m-13 0h4m7 0h4m-15 14h4','M5 1l13 8L5 17z','M1 1h7v7H1zM12 1h7v7h-7zM1 12h7v7H1zM12 12h7v7h-7z'];
 icons.forEach((d,i)=>{o+=glyph(13,730+i*44,d,i===1?'#b7c9ee':'#778aaf')});
 o+=`<circle cx="23" cy="1190" r="11" fill="#28334a" stroke="#598eac" stroke-width="1.5"/>`+text(23,1194,'R',10,'#bdd8ee',700);
 o+=glyph(15,1225,'M8 0v4m0 8v4M0 8h4m8 0h4M8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8z','#778aaf');
 stages.forEach((a,i)=>{const x=47+i*138,active=i===phase;o+=`<rect x="${x}" y="720" width="138" height="33" fill="${active?'#232936':'#191d26'}" stroke="#232936"/>`;
 o+=fileIcon(x+11,742,i)+text(x+34,742,a.file,14,active?'#ecf1fb':'#8793b0',400,'start');
 if(active)o+=glyph(x+119,733,'M0 0l8 8M8 0l-8 8','#b3bfd6');});
 o+=glyph(658,733,'M0 0h14v10H0zM7 0v10',ink)+text(692,741,'···',16,ink,700);
 o+=fileIcon(69,771,phase)+text(94,771,stage.file,11,'#92a1bf',400,'start');
 const colors=['#647a9c','#8b669a','#63949f','#706b91'];
 stage.code.split('\n').slice(0,28).forEach((line,i)=>{if(i>=lines.length||!line.trim())return;const dx=2*(line.length-line.trimStart().length);o+=`<path d="M${665+dx} ${794+i*3}h${Math.min(31-dx,line.trim().length*.74)}" stroke="${colors[i%4]}" opacity=".74"/>`});o+=`<rect x="709" y="${790+first*5}" width="6" height="71" rx="2" fill="#7790ab" opacity=".32"/>`;
 lines.slice(first).forEach((line,i)=>{const y=803+i*25,active=first+i===lines.length-1&&t<stage.end;if(active)o+=`<rect x="101" y="${y-18}" width="552" height="24" fill="#252b37" stroke="#3b4357"/>`;o+=text(83,y,first+i+1,16,active?'#afbde3':'#697b9e',400,'end')+`<text x="119" y="${y}" fill="#d4d4d4" font-family="DejaVu Sans Mono,monospace" font-size="18" xml:space="preserve">${highlight(line)}</text>`;if(active&&Math.floor(t*4)%2===0)o+=`<rect x="${119+line.length*10.84}" y="${y-16}" width="2" height="20" fill="#b6c5dd"/>`});
 return o+text(54,1273,'main    ⓧ 0    △ 0',11,ink,400,'start')+text(698,1273,`Ln ${lines.length}, Col ${lines.at(-1).length+1}     Spaces: 2     UTF-8     ${name}`,11,ink,400,'end');
}
function pointer(t){if(t<20.05)return '';const q=ease((t-20.05)/.65),x=625+(494-625)*q,y=535+(380-535)*q;let out='';if(t>=20.72&&t<20.98){const p=(t-20.72)/.26;out+=`<circle cx="494" cy="382" r="${5+18*p}" fill="none" stroke="#8abde4" stroke-width="2" opacity="${1-p}"/>`}out+=`<g transform="translate(${x} ${y})"><path d="M0 0V25L7 19L12 30L17 27L12 17H23Z" fill="white" stroke="#33475b" stroke-width="1.5"/></g>`;return out}
function svg(t){return `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="1280" viewBox="0 0 720 1280">${chrome(t)}${editor(t)}${t>=22.1?`<g opacity="${ease((t-22.1)/.35)}"><rect x="182" y="643" width="356" height="48" rx="24" fill="#18243b"/>${text(360,674,'@codewithrishabh3596',22,'white',700)}</g>`:''}</svg>`}
const api={svg,mode,stages,typed,completedCSS,flags,duration:24};if(typeof module!=='undefined')module.exports=api;else root.AuthReel=api;
})(typeof window!=='undefined'?window:globalThis);
