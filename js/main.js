(function(){
  var TRACKS=[{name:'Kai Angel — Pretty Girls',url:'audio/pretty.mp3'},{name:'Kai Angel feat. 9mice — Lipstick',url:'audio/lipstick.mp3'},{name:'9mice feat. Kai Angel — Phoenix',url:'audio/phoenix.mp3'},{name:'9mice — Honey Bunny',url:'audio/honey.mp3'}];
  var cur=0,audio=null,tn=document.getElementById('tn');
  var EVS=['click','keydown','touchend','pointerup'];
  function renderList(){
    var pl=document.getElementById('pl');pl.innerHTML='';
    TRACKS.forEach(function(t,i){
      var li=document.createElement('li'),b=document.createElement('button');
      b.type='button';if(i===cur)b.className='cur';
      var n=document.createElement('span');n.className='n';n.textContent=(i<9?'0':'')+(i+1);
      var s=document.createElement('span');s.className='t';s.textContent=t.name;
      var e=document.createElement('span');e.className='eq';e.innerHTML='<i></i><i></i><i></i>';
      b.appendChild(n);b.appendChild(s);b.appendChild(e);
      b.addEventListener('click',function(){
        unkick();
        if(i===cur&&audio){if(audio.paused)audio.play().catch(function(){});else audio.pause();}
        else go(i);
      });
      li.appendChild(b);pl.appendChild(li);
    });
  }
  function go(i){
    cur=(i+TRACKS.length)%TRACKS.length;
    if(audio)audio.pause();
    var t=TRACKS[cur],a=new Audio(t.blob||t.url);audio=a;
    a.addEventListener('error',function(){if(a===audio)tn.textContent='не удалось загрузить трек';});
    audio.addEventListener('ended',function(){go(cur+1);});
    audio.addEventListener('play',ui);audio.addEventListener('pause',ui);
    tn.textContent=TRACKS[cur].name;
    renderList();
    audio.play().catch(function(){});
  }
  function unkick(){EVS.forEach(function(e){document.removeEventListener(e,kick);});}
  function kick(ev){
    if(ev&&ev.target&&ev.target.closest&&ev.target.closest('#pp,#bp,#pl'))return;
    if(audio&&audio.paused){audio.play().then(unkick).catch(function(){});}else unkick();
  }
  var pp=document.getElementById('pp'),bp=document.getElementById('bp');
  function ui(){
    var on=audio&&!audio.paused;
    pp.innerHTML='<svg viewBox="0 0 24 24"><path d="'+(on?'M6 5h4v14H6zM14 5h4v14h-4z':'M8 5v14l11-7z')+'"/></svg>';
    pp.setAttribute('aria-label',on?'Пауза':'Играть');
    document.getElementById('pl').classList.toggle('on',!!on);
    bp.innerHTML='<svg viewBox="0 0 24 24"><path d="'+(on?'M6 5h4v14H6zM14 5h4v14h-4z':'M8 5v14l11-7z')+'"/></svg><span>'+(on?'Пауза':'Включить музыку')+'</span>';
  }
  [pp,bp].forEach(function(b){b.addEventListener('click',function(){
    unkick();
    if(!audio)return;
    if(audio.paused)audio.play().catch(function(){});else audio.pause();
  });});
  document.getElementById('prev').addEventListener('click',function(){go(cur-1);});
  document.getElementById('next').addEventListener('click',function(){go(cur+1);});
  EVS.forEach(function(e){document.addEventListener(e,kick);});
  go(0);
})();
(function(){
  var wrap=document.getElementById('plwrap');
  if(!wrap||(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches))return;
  wrap.classList.add('loading');
  var started=false;
  function start(){
    if(started)return;started=true;
    wrap.classList.remove('loading');wrap.classList.add('intro');
    setTimeout(function(){wrap.classList.remove('intro');},3400);
  }
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(e){if(e[0].isIntersecting){io.disconnect();setTimeout(start,400);}},{threshold:0.3});
    io.observe(wrap);
  }else setTimeout(start,800);
})();
(function(){
  var cv=document.getElementById('bg'),c=cv.getContext('2d'),W,H,dpr,off,tips,leaves,ty,tx,
      still=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
  function rng(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
  function build(){
    dpr=Math.min(window.devicePixelRatio||1,2);W=window.innerWidth;H=window.innerHeight;
    cv.width=W*dpr;cv.height=H*dpr;
    var narrow=W<780,R=rng(11),g;tips=[];
    tx=narrow?W*.8:W*.84;ty=H*.9;
    off=document.createElement('canvas');off.width=cv.width;off.height=cv.height;
    g=off.getContext('2d');g.scale(dpr,dpr);g.lineCap='round';
    var gr=g.createLinearGradient(0,0,W,0);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(.5,'rgba(255,255,255,.35)');gr.addColorStop(1,'rgba(255,255,255,0)');
    g.fillStyle=gr;g.fillRect(0,ty,W,1);
    function br(x,y,len,a,w,d){
      var x2=x+Math.cos(a)*len,y2=y+Math.sin(a)*len;
      g.strokeStyle='rgba(255,255,255,'+(.5+.5*d/9)+')';g.lineWidth=Math.max(w,.6);
      g.beginPath();g.moveTo(x,y);g.lineTo(x2,y2);g.stroke();
      if(d<=0){tips.push([x2,y2]);if(R()<.45){g.fillStyle='rgba(255,255,255,.6)';g.beginPath();g.arc(x2,y2,1.6,0,6.3);g.fill();}return;}
      var up=-Math.PI/2,k=d>6?2:(R()<.25?3:2);
      for(var i=0;i<k;i++){
        var s=k===3?(i-1):(i?1:-1),na=a+s*(.22+R()*.4);na+=(up-na)*.07;
        br(x2,y2,len*(.72+R()*.1),na,w*.68,d-1);
      }
    }
    br(tx,ty,H*(narrow?.15:.17),-Math.PI/2+.03,Math.max(H*.016,9),9);
    for(var r=-2;r<=2;r++){g.strokeStyle='rgba(255,255,255,.5)';g.lineWidth=3;g.beginPath();g.moveTo(tx,ty-2);g.lineTo(tx+r*14,ty+1);g.stroke();}
    var u=H*.0075,px=tx-(narrow?W*.2:W*.075);
    g.save();g.translate(px,ty);g.strokeStyle=g.fillStyle='#f4f4f4';g.lineCap='round';
    function ln(x1,y1,x2,y2,w){g.lineWidth=w*u;g.beginPath();g.moveTo(x1*u,y1*u);g.lineTo(x2*u,y2*u);g.stroke();}
    ln(0,-4,-1.2,0,1.3);ln(0,-4,1.2,0,1.3);ln(0,-4,0,-7.2,2.6);
    ln(0,-7,-1.6,-4.4,1);ln(0,-7,1.5,-5.2,1);ln(0,-7.2,.6,-8.6,.9);
    g.beginPath();g.arc(.7*u,-9.1*u,1.25*u,0,6.3);g.fill();
    g.beginPath();g.moveTo(1.7*u,-9.6*u);g.lineTo(2.3*u,-10*u);g.lineTo(1.9*u,-9.1*u);g.fill();
    g.restore();
    leaves=[];var n=narrow?22:34;for(var i=0;i<n;i++)leaves.push(mk(true));
  }
  function mk(init){
    var t=tips[(Math.random()*tips.length)|0],gv=190+Math.random()*65|0;
    return{x:t[0],y:init?t[1]+Math.random()*(ty-t[1]):t[1],s:3+Math.random()*4,vy:.3+Math.random()*.55,ph:Math.random()*6.3,sw:.3+Math.random()*.6,r:Math.random()*6.3,vr:(Math.random()-.5)*.04,col:'rgba('+gv+','+gv+','+gv+','+(.45+Math.random()*.5)+')'};
  }
  function draw(){
    c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,W,H);c.drawImage(off,0,0,W,H);
    for(var i=0;i<leaves.length;i++){
      var l=leaves[i];
      if(!still){l.y+=l.vy;l.ph+=.02;l.x+=Math.sin(l.ph)*l.sw+.18;l.r+=l.vr;if(l.y>ty){leaves[i]=l=mk(false);}}
      c.save();c.translate(l.x,l.y);c.rotate(l.r);c.fillStyle=l.col;c.beginPath();
      c.moveTo(0,-l.s);c.quadraticCurveTo(l.s*.8,0,0,l.s);c.quadraticCurveTo(-l.s*.8,0,0,-l.s);c.fill();c.restore();
    }
    if(!still)requestAnimationFrame(draw);
  }
  var tm;window.addEventListener('resize',function(){clearTimeout(tm);tm=setTimeout(function(){build();if(still)draw();},150);});
  build();draw();
})();
