(function(){
  var C = window.TITANLAB_CONFIG || {};
  var total = Number(C.TOTAL_SLOTS)||100, taken = Math.min(Number(C.TAKEN_SLOTS)||0,total), left = Math.max(total-taken,0), pct = Math.round(taken/total*100);
  var tgUrl = C.TELEGRAM_URL || '#', refUrl = C.REF_URL || '#';
  var ctaHref = (C.CTA_MODE === 'form') ? '#form' : tgUrl;
  function setAll(sel, fn){ document.querySelectorAll(sel).forEach(fn); }

  /* numbers & names */
  setAll('.js-taken', function(e){ e.textContent = taken; });
  setAll('.js-left',  function(e){ e.textContent = left; });
  setAll('.js-total', function(e){ e.textContent = total; });
  setAll('.js-price', function(e){ e.textContent = C.ORIGINAL_PRICE || 499; });
  setAll('.js-broker',function(e){ e.textContent = C.BROKER_NAME || 'our partner broker'; });
  /* star renderer — supports half stars (4.5, 4.9 ...) */
  var starUid = 0;
  function starsHTML(rating, size){
    var r = Math.max(0, Math.min(5, Number(rating) || 0)), h = '', uid = ++starUid;
    for(var i=0;i<5;i++){
      var f = Math.max(0, Math.min(1, r - i)) * 100, id = 'tlstar'+uid+'_'+i;
      h += '<svg viewBox="0 0 24 24" width="'+size+'" height="'+size+'" aria-hidden="true">'
         + '<defs><linearGradient id="'+id+'" x1="0" x2="1" y1="0" y2="0">'
         + '<stop offset="'+f+'%" stop-color="#A4DC2F"/><stop offset="'+f+'%" stop-color="rgba(255,255,255,.2)"/>'
         + '</linearGradient></defs>'
         + '<path fill="url(#'+id+')" d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z"/></svg>';
    }
    return '<span class="stars-svg" role="img" aria-label="'+r+' out of 5 stars">'+h+'</span>';
  }

  /* social proof #1 — stars + trader count */
  var P1 = C.SOCIAL_PROOF_1 || {};
  setAll('[data-proof1]', function(el){
    var t = el.querySelector('[data-proof1-text]');
    if(t) t.textContent = P1.TEXT || 'Trusted by traders worldwide';
    el.insertAdjacentHTML('afterbegin', starsHTML(P1.STARS != null ? P1.STARS : 5, 15));
  });

  /* one main action across the page */
  var ctaLabel = C.CTA_LABEL || 'Show Me How', hdrLabel = C.HEADER_CTA_LABEL || ctaLabel;
  setAll('[data-cta]', function(a){
    var label = a.hasAttribute('data-cta-header') ? hdrLabel : ctaLabel, done = false;
    [].slice.call(a.childNodes).forEach(function(n){
      if(!done && n.nodeType === 3 && n.textContent.trim()){ n.textContent = label + ' '; done = true; }
    });
    if(!done) a.insertBefore(document.createTextNode(label + ' '), a.firstChild);
  });
  setAll('[data-cta-label]', function(b){
    [].slice.call(b.childNodes).forEach(function(n){ if(n.nodeType === 3 && n.textContent.trim()) n.textContent = ctaLabel + ' '; });
  });

  /* social proof #2 — logo row or star rating */
  var P2 = C.SOCIAL_PROOF_2 || {};
  setAll('[data-proof2]', function(el){
    if(String(P2.MODE || 'logos').toLowerCase() === 'rating'){
      el.innerHTML = '<div class="rating">' + starsHTML(P2.STARS != null ? P2.STARS : 5, 24)
        + (P2.SCORE ? '<span class="score">'+P2.SCORE+'</span>' : '')
        + (P2.SCORE_TEXT ? '<span class="txt">'+P2.SCORE_TEXT+'</span>' : '') + '</div>';
      return;
    }
    var logos = Array.isArray(P2.LOGOS) ? P2.LOGOS : [];
    var h = '<span class="strip-label">'+(P2.LABEL || 'Trusted by')+'</span><div class="logos">';
    logos.forEach(function(src, i){
      src = String(src || '').trim();
      h += src ? '<span class="logo-slot filled"><img src="'+src+'" alt="" loading="lazy"></span>'
               : '<span class="logo-slot">Logo '+(i+1)+'</span>';
    });
    el.innerHTML = h + '</div>';
  });
  document.getElementById('year').textContent = new Date().getFullYear();

  /* links */
  setAll('[data-tg-url]', function(a){ a.href = tgUrl; });
  setAll('[data-tg-handle]', function(e){ e.textContent = C.TELEGRAM_HANDLE || ''; });
  setAll('[data-ref]', function(a){ a.href = refUrl; });
  setAll('[data-cta]', function(a){
    a.href = ctaHref;
    if (C.CTA_MODE !== 'form') { a.target = '_blank'; a.rel = 'noopener'; } else { a.removeAttribute('target'); }
  });
  /* header contact: phone (if set) or Telegram */
  var phone = (C.PHONE || '').trim();
  setAll('[data-contact-link]', function(a){
    a.href = phone ? ('tel:' + phone.replace(/[^\d+]/g,'')) : tgUrl;
    a.setAttribute('aria-label', phone ? ('Call ' + phone) : 'Contact us on Telegram');
    if(!phone){ a.target = '_blank'; a.rel = 'noopener'; }
  });
  setAll('[data-contact-text]', function(e){ e.textContent = phone || (C.TELEGRAM_HANDLE || 'Telegram'); });
  setAll('[data-contact-icon]', function(e){
    e.innerHTML = phone ? '<svg><use href="#i-phone"/></svg>' : '<svg><use href="#i-tg"/></svg>';
    e.classList.toggle('tg', !phone);
  });

  /* ---- shared media filler: image / video file / YouTube (incl. Shorts) ---- */
  var ICON = '<svg><use href="#i-media"/></svg>';
  function mediaHTML(src, label, autoplay){
    var yt = src.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/);
    if(yt) return '<iframe src="https://www.youtube.com/embed/'+yt[1]+'?rel=0" title="'+label+'" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>';
    if(/\.(mp4|webm|mov|m4v|ogv)(\?|#|$)/i.test(src)) return '<video src="'+src+'" controls playsinline preload="metadata"'+(autoplay ? ' muted loop autoplay' : '')+'></video>';
    return '<img src="'+src+'" alt="'+label+'" loading="lazy">';
  }
  function fillMedia(f, src, label, hint, autoplay){
    src = String(src || '').trim();
    if(!src){
      if(!f.children.length){ f.innerHTML = '<div class="ph"><span class="ico">'+ICON+'</span><b>'+label+'</b>'+(hint ? '<small>'+hint+'</small>' : '')+'</div>'; }
      else { f.classList.add('filled'); }
      return;
    }
    f.innerHTML = mediaHTML(src, label, autoplay); f.classList.add('filled');
  }

  /* media slots */
  var M = C.MEDIA || {};
  setAll('[data-media]', function(f){
    var key = f.getAttribute('data-media');
    fillMedia(f, M[key], f.getAttribute('data-label') || 'Image or video', 'Add an image / video URL in MEDIA config → "'+key+'"', true);
  });

  /* ---- "Real results" rail: 6 vertical videos, infinite horizontal loop ---- */
  var VIDS = Array.isArray(C.PROOF_VIDEOS) ? C.PROOF_VIDEOS : [];
  while(VIDS.length < 6) VIDS.push('');
  VIDS = VIDS.slice(0, 6);
  var YT_RE = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/;

  function buildCard(src, i, isDup){
    var card = document.createElement('div');
    card.className = 'vcard';
    if(isDup) card.setAttribute('aria-hidden', 'true');
    var fig = document.createElement('figure');
    fig.className = 'media vertical';
    card.appendChild(fig);
    var cap = document.createElement('div');
    cap.className = 'cap';
    cap.innerHTML = '<span class="av">'+String.fromCharCode(65+i)+'</span><span>Member video #'+(i+1)+'</span>';
    card.appendChild(cap);

    var label = 'Video ' + (i+1);
    src = String(src || '').trim();
    if(!src){
      fig.innerHTML = '<div class="ph"><span class="ico">'+ICON+'</span><b>'+label+'</b><small>Vertical 9:16 &rarr; PROOF_VIDEOS['+i+']</small></div>';
      return card;
    }
    var yt = src.match(YT_RE);
    if(yt){
      /* lightweight facade — the real iframe is only created on click */
      fig.innerHTML = '<button class="vplay" type="button" data-yt="'+yt[1]+'" aria-label="Play '+label+'"'+(isDup?' tabindex="-1"':'')+'>'
        + '<img src="https://i.ytimg.com/vi/'+yt[1]+'/hqdefault.jpg" alt="" loading="lazy">'
        + '<span class="pbtn"><svg viewBox="0 0 24 24"><path fill="currentColor" d="M8 5v14l11-7z"/></svg></span></button>';
    } else if(/\.(mp4|webm|mov|m4v|ogv)(\?|#|$)/i.test(src)){
      fig.innerHTML = '<video src="'+src+'" controls playsinline preload="metadata"'+(isDup?' tabindex="-1"':'')+'></video>';
    } else {
      fig.innerHTML = '<img src="'+src+'" alt="'+label+'" loading="lazy">';
    }
    fig.classList.add('filled');
    return card;
  }

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  setAll('[data-proof-rail]', function(rail){
    var SETS = 3, DRIFT = 0.4;
    rail.innerHTML = '';
    for(var set = 0; set < SETS; set++){
      VIDS.forEach(function(src, i){ rail.appendChild(buildCard(src, i, set !== 1)); });
    }

    var setW = 0, pos = 0, target = null, hovering = false, playing = false, pauseUntil = 0, started = false;
    function gap(){ return parseFloat(getComputedStyle(rail).columnGap) || 18; }
    function measure(){
      var g = gap(), w = 0;
      for(var i = 0; i < VIDS.length && i < rail.children.length; i++) w += rail.children[i].offsetWidth + g;
      var prev = setW; setW = w;
      if(!started && setW > 0){ pos = setW; rail.scrollLeft = pos; started = true; }
      else if(prev > 0 && setW > 0 && prev !== setW){ pos = rail.scrollLeft / prev * setW; rail.scrollLeft = pos; }
    }
    /* seamless wrap: content repeats every setW, so shifting by setW is invisible */
    function wrap(){
      if(setW <= 0) return;
      if(pos > setW * 1.5){ pos -= setW; rail.scrollLeft = pos; if(target !== null) target -= setW; }
      else if(pos < setW * 0.5){ pos += setW; rail.scrollLeft = pos; if(target !== null) target += setW; }
    }
    function nudge(){ pauseUntil = Date.now() + 1400; }
    function paused(){ return hovering || playing || document.hidden || Date.now() < pauseUntil; }

    function tick(){
      if(setW <= 0) measure();
      /* the visitor scrolled by hand — take their position as the truth */
      if(Math.abs(rail.scrollLeft - pos) > 2) pos = rail.scrollLeft;
      if(target !== null){
        var d = target - pos;
        if(Math.abs(d) < 0.5){ pos = target; target = null; }
        else pos += d * 0.14;
        rail.scrollLeft = pos;
      } else if(!paused() && !reduceMotion){
        pos += DRIFT;              /* accumulated as a float, then written once */
        rail.scrollLeft = pos;
      } else {
        pos = rail.scrollLeft;
      }
      wrap();
      requestAnimationFrame(tick);
    }

    /* pause while the visitor is looking, touching or playing something */
    rail.addEventListener('mouseenter', function(){ hovering = true; });
    rail.addEventListener('mouseleave', function(){ hovering = false; });
    rail.addEventListener('focusin',   function(){ hovering = true; });
    rail.addEventListener('focusout',  function(){ hovering = false; });
    ['wheel','touchstart','pointerdown'].forEach(function(ev){
      rail.addEventListener(ev, function(){ target = null; pos = rail.scrollLeft; nudge(); }, {passive:true});
    });
    rail.addEventListener('touchend', nudge, {passive:true});
    rail.addEventListener('play',  function(){ playing = true; },  true);
    rail.addEventListener('pause', function(){ playing = false; }, true);
    rail.addEventListener('ended', function(){ playing = false; }, true);

    /* YouTube facade -> real embed on click */
    rail.addEventListener('click', function(ev){
      var btn = ev.target.closest && ev.target.closest('.vplay');
      if(!btn) return;
      var id = btn.getAttribute('data-yt');
      playing = true;
      btn.parentNode.innerHTML = '<iframe src="https://www.youtube.com/embed/'+id+'?rel=0&autoplay=1&playsinline=1" title="Member video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    });

    /* arrows glide two cards at a time — no ends, so never disabled */
    var wrapEl = rail.parentNode;
    var prev = wrapEl.querySelector('.rail-btn.prev'), next = wrapEl.querySelector('.rail-btn.next');
    function step(){ var c = rail.querySelector('.vcard'); return (c ? c.offsetWidth : 246) + gap(); }
    function glide(dir){ target = (target === null ? rail.scrollLeft : target) + dir * step() * 2; nudge(); }
    if(prev) prev.addEventListener('click', function(){ glide(-1); });
    if(next) next.addEventListener('click', function(){ glide(1); });

    window.addEventListener('resize', measure);
    measure();
    requestAnimationFrame(tick);
  });

  /* progress bars */
  var bars = document.querySelectorAll('.js-bar');
  var barObs = ('IntersectionObserver' in window) ? new IntersectionObserver(function(entries){
    entries.forEach(function(en){ if(en.isIntersecting){ en.target.style.width = pct + '%'; barObs.unobserve(en.target); } });
  },{threshold:.3}) : null;
  bars.forEach(function(b){ if(barObs){ barObs.observe(b); } else { b.style.width = pct + '%'; } });

  /* reveal */
  var rev = document.querySelectorAll('.reveal');
  var ro = ('IntersectionObserver' in window) ? new IntersectionObserver(function(entries){
    entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); ro.unobserve(en.target); } });
  },{threshold:.12, rootMargin:'0px 0px -6% 0px'}) : null;
  rev.forEach(function(el){ if(ro){ ro.observe(el); } else { el.classList.add('in'); } });

  /* lead form */
  var form = document.getElementById('lead-form'), card = document.querySelector('.lead-card');
  if(form){
    form.addEventListener('submit', function(ev){
      ev.preventDefault();
      var name = form.name.value.trim(), contact = form.contact.value.trim();
      if(!name || !contact){ var f = !name ? form.name : form.contact; f.focus(); f.style.borderColor = 'var(--red)'; return; }
      var data = { name:name, contact:contact, page:location.href, time:new Date().toISOString() };
      var btn = form.querySelector('button[type=submit]'); btn.disabled = true; btn.textContent = 'Sending…';
      var finish = function(){ card.classList.add('done'); card.scrollIntoView({behavior:'smooth', block:'center'}); };
      // Open Telegram inside the click gesture (avoids popup blockers), then submit the data
      if(tgUrl && tgUrl !== '#'){ try{ window.open(tgUrl, '_blank', 'noopener'); }catch(e){} }
      if(C.FORM_ENDPOINT){
        fetch(C.FORM_ENDPOINT, {method:'POST', headers:{'Content-Type':'application/json','Accept':'application/json'}, body:JSON.stringify(data)}).catch(function(){}).then(finish);
      } else { setTimeout(finish, 300); }
    });
    ['name','contact'].forEach(function(n){ form[n].addEventListener('input', function(){ this.style.borderColor=''; }); });
  }

  /* comparison table (desktop, 5 points) + differentiator cards (mobile, 6) */
  var COLS = ['TitanLab','Manual charting','Paid indicators','Signal groups','Bots / EA'];
  var ROWS = [
    ['Auto-draws OB · FVG · Liquidity · BOS/CHoCH', [1,0,1,0,0]],
    ['Real-time alerts on TradingView',            [1,0,1,0,0]],
    ['You understand every entry (ICT/SMC logic)',  [1,1,1,0,0]],
    ['1-on-1 setup support',                        [1,0,0,1,0]],
    ['100% free',                                   [1,1,0,0,0]],
    ['Runs on TradingView — nothing to install',    [1,1,1,0,0]]
  ];
  var ok = '<span class="ok"><svg><use href="#i-check"/></svg></span>', no = '<span class="no"><svg><use href="#i-x"/></svg></span>';
  var t = '<table class="compare"><thead><tr><th></th>';
  COLS.forEach(function(c,i){ t += '<th class="'+(i===0?'us':'')+'">'+c+'</th>'; });
  t += '</tr></thead><tbody>';
  ROWS.slice(0,5).forEach(function(r){
    t += '<tr><td>'+r[0]+'</td>';
    r[1].forEach(function(v,i){ t += '<td class="'+(i===0?'us':'')+'">'+(v?ok:no)+'</td>'; });
    t += '</tr>';
  });
  t += '</tbody></table>';
  document.getElementById('compare-table').innerHTML = t;
  var d = '';
  ROWS.forEach(function(r){
    d += '<div class="diff reveal"><div class="t"><span class="ok"><svg><use href="#i-check"/></svg></span><span>'+r[0]+'</span></div><div class="cols">';
    r[1].forEach(function(v,i){ d += '<span class="'+(v?'y':'n')+'">'+COLS[i]+' '+(v?'✓':'✕')+'</span>'; });
    d += '</div></div>';
  });
  var dc = document.getElementById('diff-cards'); dc.innerHTML = d;
  dc.querySelectorAll('.reveal').forEach(function(el){ if(ro){ ro.observe(el); } else { el.classList.add('in'); } });
})();
