/* =========================================================
   賽親官網 全站程式 kp.js（115/10/30 正式版 2.0）
   放在 https://kindredplus.github.io/kp.js

   載入方式：後台「關於賽親 → 關於賽親列表」排序第一筆（緣起，about&id=15）的「標題」欄，
   在原本的標題文字後面接上一段：
     <script src="https://kindredplus.github.io/kp.js"></script>
   這個標題會出現在每一頁的選單裡，所以每一頁都會載入本檔。刪掉這段，網站就回到原樣。

   功能：載入字型與 kp.css、換掉頁首頁尾、設定各頁瀏覽器標題與說明、首頁海報輪播、
         首頁自動帶入最新消息、預約諮詢頁插入說明內容、最新消息列表頁加標題區、
         舊網址轉址（預設關閉）、預覽模式。

   要改選單、電話、地址、網址，改下面「設定」區即可。
   獨居陪伴計畫、樂齡共學計畫兩頁在後台建好後，把網址填進 LINKS.alone、LINKS.learning。

   預覽模式：網址最後加上 #kp-preview，會把 pages/ 資料夾裡的新內容暫時套進目前頁面
   （只在自己的瀏覽器顯示，不會改到網站）。要預覽還沒建立的頁面，可在任一「關懷方式」頁
   網址最後加 #kp-preview=alone 或 #kp-preview=learning。
   ========================================================= */
(function () {
  'use strict';

  /* 後台不執行（標題欄的程式碼在後台列表也可能被載入） */
  if (/\/WebAdmin/i.test(location.pathname)) return;
  /* 標題在頁首、手機選單、頁尾、側欄都會出現，只執行一次 */
  if (window.__kp) return;
  window.__kp = true;

  /* ================= 設定 ================= */
  var me = document.currentScript && document.currentScript.src;
  var BASE = me ? me.replace(/[^\/?#]*([?#].*)?$/, '') : 'https://kindredplus.github.io/';
  var VERSION = '2.0.0';

  var SITE = {
    name: '財團法人臺北市長者賽親關懷基金會',
    nameEn: 'KINDRED PLUS PHILANTHROPIC FOUNDATION OF TAIPEI',
    short: '賽親關懷基金會',
    phone: '02-2325-0969',
    phoneHref: 'tel:0223250969',
    hours: '週一至週五 08:30–17:30',
    email: 'service@kindredplus.org',
    address: '臺北市中正區重慶南路三段 2 號 4 樓 F 室',
    line: 'https://lin.ee/Fea36s2',
    lineId: '@924crjjk',
    facebook: 'https://www.facebook.com/profile.php?id=100088555500101',
    regNo: '立案字號　北市社團字第1103104730號　統一編號　88231890'
  };

  /* 網址代號 → 後台頁面（改架構時只改這裡）。空字串表示頁面還沒建立 */
  var LINKS = {
    home: 'index.php',
    news: 'index.php?action=news&cid=7',
    about: 'index.php?action=about&id=15',
    plan: 'index.php?action=caring_methods&id=1',
    trust: 'index.php?action=caring_methods&id=13',
    alone: 'index.php?action=caring_methods&id=22',      /* 獨居陪伴計畫（115/10/30 後台新建） */
    learning: 'index.php?action=caring_methods&id=23',   /* 樂齡共學計畫（115/10/30 後台新建） */
    partner: 'index.php?action=recruitment&id=9',
    disclosure: 'index.php?action=about&id=14',
    donate: 'index.php?action=recruitment&id=6',
    contact: 'index.php?action=contact',
    rules: 'index.php?action=caring_methods&id=20'
  };

  /* 頁首選單（115/10/30 董事長）：[代號, 名稱, 段落錨點, 說明] */
  var MENU = [
    { key: 'news', label: '最新消息' },
    { key: 'about', label: '關於賽親', keys: ['about'], items: [['about', '緣起', 'origin'], ['about', '董事會', 'board'], ['about', '大事記', 'history'], ['about', '執行團隊', 'team']] },
    { key: 'plans', label: '我們的計畫', keys: ['plan', 'trust', 'alone', 'learning'], href: ['home', 'programmes'], items: [['plan', '生活陪跑教練', '', '每週到府陪伴，量身規劃晚年生活'], ['trust', '安養信託守護', '', '賽親擔任信託監察人，定期探訪'], ['alone', '獨居陪伴計畫', '', '讓沒有家人在身邊的長輩，也有人陪'], ['learning', '樂齡共學計畫', '', '專家開講，一起運動、活躍老化']] },
    { key: 'partner', label: '企業合作專區', keys: ['partner'], items: [['partner', '企業永續從家庭開始', ''], ['partner', '合作方式', 'ways'], ['partner', '永續價值', 'esg'], ['partner', '企業夥伴', 'partners'], ['contact', '合作洽詢', 'form']] },
    { key: 'disclosure', label: '公開資訊', keys: ['disclosure'], items: [['disclosure', '經費預算及工作計畫書', 'plan'], ['disclosure', '工作報告', 'report'], ['disclosure', '財務報告', 'finance'], ['disclosure', '捐款芳名錄', 'donors'], ['disclosure', '勸募公開徵信', 'fund']] },
    { key: 'contact', label: '歡迎來電', keys: ['contact'], items: [['contact', '聯絡方式', ''], ['contact', '線上表單', 'form']] },
    { key: 'donate', label: '我要捐款', keys: ['donate'], btn: true, items: [['donate', '線上捐款', 'online'], ['donate', '匯款與劃撥', 'transfer'], ['donate', '收據與徵信', 'receipt']] }
  ];
  /* 頁尾五欄，依選單順序 */
  var FOOTER_COLS = [['news', 'about'], ['plans'], ['partner'], ['disclosure'], ['contact', 'donate']];

  /* 各頁的瀏覽器標題與搜尋引擎說明 */
  var PAGES = {
    home: ['賽親關懷基金會｜長者最佳生活陪跑教練', '賽親關懷基金會由律師、醫師、會計師等專業人士捐助成立。樂齡生活規畫師固定探訪都會區長輩，陪他們把日子過好，也提前規劃以後的生活。'],
    news: ['最新消息｜賽親關懷基金會', '賽親關懷基金會的活動紀實、講座與新聞稿。'],
    about: ['關於賽親｜賽親關懷基金會', '賽親關懷基金會的緣起、董事會、大事記與執行團隊。'],
    plan: ['生活陪跑教練｜賽親關懷基金會', '樂齡生活規畫師每週到府陪伴，量身規劃晚年生活。'],
    trust: ['安養信託守護｜賽親關懷基金會', '賽親擔任安養信託監察人，定期探訪，守護老本。'],
    alone: ['獨居陪伴計畫｜賽親關懷基金會', '讓沒有家人在身邊的長輩，也有人陪。規畫師每週探訪社區與社會住宅的獨居長者。'],
    learning: ['樂齡共學計畫｜賽親關懷基金會', '專家開講健康、法律與理財，一起運動、活躍老化。'],
    partner: ['企業合作專區｜賽親關懷基金會', '關懷員工、員工親眷與社區長者，為員工舉辦樂齡生活講座，依企業的需要量身規劃。'],
    disclosure: ['公開資訊｜賽親關懷基金會', '本會的工作計畫、工作報告、財務報告與捐款芳名錄，依年度公開。'],
    donate: ['捐款支持｜賽親關懷基金會', '線上捐款、銀行匯款、郵政劃撥與外幣匯款資訊，以及收據與徵信說明。'],
    contact: ['預約諮詢｜賽親關懷基金會', '歡迎來電、來信，或填寫線上表單，我們會與您聯繫。']
  };

  /* 舊網址轉到新頁面。新頁面都上線、檢查過後，才把 REDIRECTS_ON 改成 true */
  var REDIRECTS_ON = true;
  var REDIRECTS = {
    'about:1': LINKS.about + '#board',
    'about:2': LINKS.about + '#history',
    'about:3': LINKS.about + '#team',
    'about:4': LINKS.disclosure,
    'about:5': LINKS.disclosure + '#finance',
    'about:9': LINKS.plan + '#join',
    'about:10': LINKS.disclosure + '#donors',
    'about:11': LINKS.disclosure + '#report',
    'about:13': LINKS.disclosure + '#fund',
    'recruitment:11': LINKS.donate,
    'recruitment:12': LINKS.disclosure + '#donors',
    'caring_methods:17': LINKS.plan,
    'caring_methods:18': LINKS.plan,
    'caring_methods:19': LINKS.plan + '#join',
    'caring_methods:21': LINKS.plan + '#join',
    'news:1': LINKS.news, 'news:8': LINKS.news, 'news:10': LINKS.news, 'news:11': LINKS.news, 'news:12': LINKS.news, 'news:13': LINKS.news
  };

  /* 預覽模式：代號 → [pages/ 裡的檔名, 後台內容放的位置] */
  var PREVIEW = {
    home: ['home.html', '.i_about .ptxt'],
    about: ['about.html', '.about_sec .unreset'],
    disclosure: ['disclosure.html', '.about_sec .unreset'],
    plan: ['plan.html', '.care_sec .unreset'],
    trust: ['trust.html', '.care_sec .unreset'],
    alone: ['alone.html', '.care_sec .unreset'],
    learning: ['learning.html', '.care_sec .unreset'],
    partner: ['partner.html', '.member_sec .unreset'],
    donate: ['donate.html', '.member_sec .unreset']
  };

  /* ================= 判斷目前頁面 ================= */
  var q = new URLSearchParams(location.search);
  var action = q.get('action') || '';
  var id = q.get('id') || '';
  var cid = q.get('cid') || '';

  if (REDIRECTS_ON && REDIRECTS[action + ':' + (id || cid)]) {
    location.replace(REDIRECTS[action + ':' + (id || cid)]);
    return;
  }

  function pageOf(url) {
    var m = String(url).match(/action=([a-z_]+)(?:&(?:amp;)?(?:id|cid)=(\d+))?/);
    return m ? m[1] + ':' + (m[2] || '') : (url === 'index.php' ? 'index:' : '');
  }
  var BY_PAGE = {};
  Object.keys(LINKS).forEach(function (k) { if (LINKS[k]) BY_PAGE[pageOf(LINKS[k])] = k; });
  function currentKey() {
    if (!action || action === 'index') return 'home';
    if (action === 'news_in' || action === 'news') return 'news';
    if (action === 'contact') return 'contact';
    return BY_PAGE[action + ':' + (id || cid)] || '';
  }
  var KEY = currentKey();

  /* ================= 立即執行：字型、樣式 ================= */
  var root = document.documentElement;
  root.classList.add('kp');
  try { if (localStorage.getItem('kp-big') === '1') root.classList.add('kp-big'); } catch (e) {}
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) root.classList.add('kp-motion');

  /* 樣式加在 <head>。不用 document.write：本檔是在頁首選單裡被載入的，
     寫進去的樣式表會在換掉頁首時一起被刪掉（首頁沒有自己的 kp.css 連結，會整頁沒樣式） */
  function addHead(tag, attrs) {
    var el = document.createElement(tag);
    Object.keys(attrs).forEach(function (k) { if (k === 'text') el.textContent = attrs[k]; else el.setAttribute(k, attrs[k]); });
    (document.head || root).appendChild(el);
    return el;
  }
  /* kp.css 下載完之前，先把馬亞舊頁首頁尾藏起來，避免閃一下 */
  addHead('style', { id: 'kp-pre', text: 'html.kp body>header>.wrapper,html.kp body>footer>.wrapper,html.kp .fixedSocialLink,html.kp .inbanner,html.kp .phone-block{display:none!important}html.kp body{padding-top:0!important}' });
  addHead('link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' });
  addHead('link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' });
  addHead('link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@500;700&family=Noto+Serif+TC:wght@700&display=swap' });
  /* 網址不加版本參數：各頁內容最前面也有一行同網址的 kp.css（讓後台編輯畫面看得到版面），同一頁只下載一次 */
  addHead('link', { rel: 'stylesheet', href: BASE + 'kp.css' });
  var LOGO = BASE + 'img/logo.png';

  /* ================= 工具 ================= */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function each(list, fn) { Array.prototype.forEach.call(list, fn); }
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return (ctx || document).querySelectorAll(sel); }
  /* 代號＋錨點 → 網址；頁面還沒建立時連到首頁「我們的計畫」 */
  function href(key, anchor) {
    if (key === 'plans') return LINKS.home + '#programmes';
    var u = LINKS[key];
    if (!u) return LINKS.home + '#programmes';
    return u + (anchor ? '#' + anchor : '');
  }
  function icon(name) {
    if (name === 'down') return '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';
    if (name === 'line') return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3C6.5 3 2 6.6 2 11c0 3.9 3.5 7.2 8.3 7.9.3.1.8.2.9.5.1.3.1.7 0 1l-.1.9c0 .3-.2 1 .9.6s5.9-3.5 8-6C21.4 14.4 22 12.8 22 11c0-4.4-4.5-8-10-8z" fill="currentColor"/></svg>';
    if (name === 'fb') return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8.5V6.8c0-.8.2-1.3 1.4-1.3H17V2.6C16.7 2.6 15.7 2.5 14.6 2.5 12.2 2.5 10.6 4 10.6 6.6v1.9H8v3.2h2.6V21H14v-9.3h2.6l.4-3.2H14z" fill="currentColor"/></svg>';
    return '';
  }
  function menuByKey(k) { for (var i = 0; i < MENU.length; i++) if (MENU[i].key === k) return MENU[i]; return null; }

  /* ================= 頁首 ================= */
  function buildHeader() {
    var header = $('body > header');
    if (!header) { header = document.createElement('header'); document.body.insertBefore(header, document.body.firstChild); }
    var big = root.classList.contains('kp-big');
    function link(it) {
      var cur = it[0] === KEY && !it[2] ? ' aria-current="page"' : '';
      return '<a href="' + esc(href(it[0], it[2])) + '"' + cur + '>' + it[1] + (it[3] ? '<small>' + it[3] + '</small>' : '') + '</a>';
    }
    var nav = MENU.map(function (m) {
      if (!m.items) return '<a href="' + esc(href(m.key)) + '"' + (m.key === KEY ? ' aria-current="page"' : '') + '>' + m.label + '</a>';
      var on = (m.keys || []).indexOf(KEY) >= 0;
      return '<div class="kp-nav__group' + (m.btn ? ' kp-nav__group--btn' : '') + (on ? ' is-current' : '') + '">' +
        '<button type="button" aria-haspopup="true" aria-expanded="false">' + m.label + icon('down') + '</button>' +
        '<div class="kp-nav__menu' + (m.btn ? ' kp-nav__menu--end' : '') + '">' + m.items.map(link).join('') + '</div></div>';
    }).join('');
    /* 手機選單：只列七個大項，不展開 */
    var drawer = MENU.map(function (m) {
      var on = m.key === KEY || (m.keys || []).indexOf(KEY) >= 0;
      return '<a' + (m.btn ? ' class="kp-btn"' : '') + ' href="' + esc(m.href ? href(m.href[0], m.href[1]) : href(m.key)) + '"' + (on ? ' aria-current="page"' : '') + '>' + m.label + '</a>';
    }).join('');
    header.id = 'kp-header';
    header.className = 'kp-header';
    header.innerHTML =
      '<div class="kp-utility"><div class="kp-utility__in"><span>' + SITE.name + '</span><span class="kp-utility__links">' +
        '<span class="kp-size" role="group" aria-label="字級"><span>字級</span><button type="button" data-size="0" aria-pressed="' + !big + '">標準</button><button type="button" data-size="1" aria-pressed="' + big + '">大</button></span>' +
        '<a href="' + SITE.line + '" target="_blank" rel="noopener">LINE ' + SITE.lineId + '</a>' +
        '<a href="' + SITE.phoneHref + '">' + SITE.phone + '</a>' +
      '</span></div></div>' +
      '<div class="kp-bar-wrap"><div class="kp-bar">' +
        '<a class="kp-logo" href="' + LINKS.home + '" aria-label="' + SITE.short + '首頁"><img src="' + LOGO + '" alt="賽親基金會 Kindred Plus Foundation" width="224" height="72"></a>' +
        '<nav class="kp-nav" aria-label="主選單">' + nav + '</nav>' +
        '<button type="button" class="kp-menu-btn" aria-expanded="false" aria-controls="kp-drawer">選單</button>' +
      '</div></div>' +
      '<nav class="kp-drawer" id="kp-drawer" aria-label="手機選單">' + drawer + '</nav>';

    /* 字級 */
    each($$('.kp-size button', header), function (b) {
      b.addEventListener('click', function () {
        var on = b.getAttribute('data-size') === '1';
        root.classList.toggle('kp-big', on);
        try { localStorage.setItem('kp-big', on ? '1' : '0'); } catch (e) {}
        each($$('.kp-size button', header), function (x) { x.setAttribute('aria-pressed', String(x.getAttribute('data-size') === (on ? '1' : '0'))); });
        fitNav();
      });
    });
    /* 手機選單 */
    var mb = $('.kp-menu-btn', header), dr = $('.kp-drawer', header);
    mb.addEventListener('click', function () {
      root.style.setProperty('--kp-header-h', header.getBoundingClientRect().bottom + 'px');
      var open = dr.classList.toggle('is-open');
      mb.setAttribute('aria-expanded', String(open));
      mb.textContent = open ? '關閉' : '選單';
      document.body.style.overflow = open ? 'hidden' : '';
    });
    /* 下拉選單：滑鼠移過、鍵盤移入都會打開（kp.css）；觸控平板用點的 */
    var groups = $$('.kp-nav__group', header);
    function closeAll(except) {
      each(groups, function (g) { if (g !== except) { g.classList.remove('is-open'); $('button', g).setAttribute('aria-expanded', 'false'); } });
    }
    each(groups, function (g) {
      var b = $('button', g);
      b.addEventListener('click', function () {
        var open = !g.classList.contains('is-open');
        closeAll(g);
        g.classList.toggle('is-open', open);
        b.setAttribute('aria-expanded', String(open));
      });
    });
    document.addEventListener('click', function (e) { if (!e.target.closest || !e.target.closest('.kp-nav__group')) closeAll(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });
  }

  /* 選單排不下時改用手機選單（字型、字級「大」、螢幕寬度都會影響） */
  function fitNav() {
    root.classList.remove('kp-navfold');
    var bar = $('.kp-bar'), nav = $('.kp-nav');
    if (!bar || !nav || getComputedStyle(nav).display === 'none') return;
    if (bar.scrollWidth > bar.clientWidth + 1 || nav.offsetHeight > 60) root.classList.add('kp-navfold');
  }
  function onScroll() {
    var h = $('#kp-header');
    if (h) h.classList.toggle('is-scrolled', window.scrollY > 40);
  }

  /* ================= 頁尾 ================= */
  function buildFooter() {
    var footer = $('body > footer');
    if (!footer) { footer = document.createElement('footer'); document.body.appendChild(footer); }
    var cols = FOOTER_COLS.map(function (col) {
      return '<div>' + col.map(function (k) {
        var m = menuByKey(k);
        return '<div class="kp-footer__group"><strong><a href="' + esc(m.href ? href(m.href[0], m.href[1]) : href(m.key)) + '">' + m.label + '</a></strong>' +
          (m.items || []).map(function (it) { return '<a href="' + esc(href(it[0], it[2])) + '">' + it[1] + '</a>'; }).join('') + '</div>';
      }).join('') + '</div>';
    }).join('');
    footer.className = 'kp-footer';
    footer.innerHTML =
      '<div class="kp-footer__main">' +
        '<div class="kp-footer__org"><div><p class="kp-footer__name">財團法人臺北市長者<br>賽親關懷基金會</p><span class="kp-footer__en">' + SITE.nameEn + '</span></div>' +
          '<div class="kp-footer__contact"><span>' + SITE.address + '</span><span>電話 <a href="' + SITE.phoneHref + '">' + SITE.phone + '</a>　' + SITE.hours + '</span><a href="mailto:' + SITE.email + '">' + SITE.email + '</a></div>' +
          '<div class="kp-social"><a href="' + SITE.line + '" target="_blank" rel="noopener" aria-label="LINE 官方帳號">' + icon('line') + '</a><a href="' + SITE.facebook + '" target="_blank" rel="noopener" aria-label="Facebook 粉絲專頁">' + icon('fb') + '</a></div>' +
        '</div>' +
        '<nav class="kp-footer__cols" aria-label="網站地圖">' + cols + '</nav>' +
      '</div>' +
      '<div class="kp-footer__bottom"><span>© ' + SITE.name + '</span><span>' + SITE.regNo + '</span><a href="' + LINKS.rules + '">網路及資訊使用規範</a></div>';
  }

  /* ================= 跳到主要內容 ================= */
  function skipLink() {
    var main = $('.kp-content') || $('.innermainbox');
    if (!main) return;
    if (!main.id) main.id = 'kp-main';
    main.setAttribute('tabindex', '-1');
    var a = document.createElement('a');
    a.className = 'kp-skip'; a.href = '#' + main.id; a.textContent = '跳到主要內容';
    document.body.insertBefore(a, document.body.firstChild);
  }

  /* ================= 瀏覽器標題與說明 ================= */
  function setMeta() {
    var p = PAGES[KEY];
    if (!p) return;
    var title = p[0];
    if (action === 'news_in') {
      var t = $('.rv_titlein');
      if (t) title = t.textContent.trim() + '｜' + SITE.short;
    }
    document.title = title;
    var m = $('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.setAttribute('name', 'description'); document.head.appendChild(m); }
    if (action !== 'news_in') m.setAttribute('content', p[1]);
  }

  /* ================= 拿掉 unreset（馬亞給後台文章用的預設樣式，會把新內容的連結變藍、圖片高度變形） ================= */
  function unreset() {
    each($$('.unreset'), function (u) { if ($('.kp-content', u)) u.classList.remove('unreset'); });
  }

  /* ================= 範本頁：最新消息列表、文章、預約諮詢 ================= */
  function tplHead(crumb, eyebrow, h1) {
    var d = document.createElement('div');
    d.className = 'kp-content kp-tplhead';
    d.innerHTML = '<section class="kp-pagehead"><div class="kp-wrap"><div class="kp-pagehead__text">' +
      '<span class="kp-crumb"><a href="' + LINKS.home + '">首頁</a>　／　' + crumb + '</span>' +
      '<span class="kp-eyebrow">' + eyebrow + '</span><h1>' + h1 + '</h1></div></div></section>';
    return d;
  }
  function templates(done) {
    var main = $('.innermainbox');
    if (!main) { done(); return; }
    if (action === 'news' && (cid === '7' || cid === '')) {
      document.body.classList.add('kp-tpl-news');
      main.parentNode.insertBefore(tplHead('最新消息', 'NEWS', '最新消息'), main);
    }
    if (action === 'news_in') document.body.classList.add('kp-tpl-article');
    if (action === 'contact') {
      document.body.classList.add('kp-tpl-contact');
      var msg = $('.contact_sec textarea[name="content"]');
      if (msg && !msg.placeholder) msg.placeholder = '想詢問的事、方便聯絡的時段；企業洽詢請寫公司名稱';
      /* 後台的聯絡頁不能放自訂內容，說明內容放在 GitHub 的 pages/contact.html，由這裡插在表單前面 */
      if (!$('.kp-content', main)) {
        fetch(BASE + 'pages/contact.html', { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw r; return r.text(); }).then(function (html) {
          var box = document.createElement('div');
          box.innerHTML = html.replace(/<link[^>]*kp\.css[^>]*>/i, '');
          main.insertBefore(box, main.firstChild);
          fixPending(box); done();
        }).catch(function () { main.parentNode.insertBefore(tplHead('預約諮詢', 'CONTACT', '預約諮詢'), main); done(); });
        return;
      }
    }
    done();
  }

  /* ================= 還沒建立的頁面：內容裡暫用「#」的計畫連結 ================= */
  /* 獨居陪伴計畫、樂齡共學計畫兩頁建好、LINKS 填好之後，連到正式網址；還沒建好時連到首頁「我們的計畫」，不會停在原頁 */
  function fixPending(scope) {
    each($$('.kp-content a[href="#"]', scope || document), function (a) {
      var t = a.textContent;
      if (t.indexOf('獨居陪伴') >= 0) a.setAttribute('href', href('alone'));
      else if (t.indexOf('樂齡共學') >= 0) a.setAttribute('href', href('learning'));
    });
  }

  /* ================= 首頁海報輪播：手動切換，不自動播放（長輩來不及讀） ================= */
  function carousels() {
    each($$('.kp-carousel'), function (c) {
      var slides = [].slice.call($$('.kp-slide', c));
      if (!slides.length) return;
      var next = c.nextElementSibling;
      var tabs = next && next.classList.contains('kp-cartabs') ? [].slice.call($$('button', next)) : [];
      var i = 0;
      function go(n) {
        i = (n + slides.length) % slides.length;
        slides.forEach(function (s, k) { s.classList.toggle('is-on', k === i); s.setAttribute('aria-hidden', String(k !== i)); });
        tabs.forEach(function (t, k) { t.setAttribute('aria-selected', String(k === i)); });
        each($$('.kp-car-pos', c), function (p) { p.textContent = (i + 1) + ' / ' + slides.length; });
      }
      c.addEventListener('click', function (e) {
        if (e.target.closest('.kp-prev')) go(i - 1);
        if (e.target.closest('.kp-next')) go(i + 1);
      });
      tabs.forEach(function (t, k) { t.addEventListener('click', function () { go(k); }); });
      go(0);
    });
  }

  /* ================= 首頁：自動帶入最新消息（讀 cid=7 列表最新幾篇） ================= */
  function latestNews() {
    var box = $('[data-kp-news]');
    if (!box) return;
    var n = parseInt(box.getAttribute('data-kp-news'), 10) || 4;
    fetch(LINKS.news).then(function (r) { return r.text(); }).then(function (t) {
      var d = new DOMParser().parseFromString(t, 'text/html');
      var items = [].slice.call(d.querySelectorAll('.newslist a.oneset'), 0, n);
      if (!items.length) return;
      box.className = 'kp-grid kp-grid--4 kp-newscards';
      box.innerHTML = items.map(function (a) {
        var img = a.querySelector('.photo img');
        var date = ((a.querySelector('.date') || {}).textContent || '').replace(/\s/g, '').replace(/\//g, '.');
        var title = ((a.querySelector('.newstitle') || {}).textContent || '').trim();
        return '<a class="kp-card" href="' + esc(a.getAttribute('href')) + '">' +
          (img ? '<img src="' + esc(img.getAttribute('src')) + '" alt="" loading="lazy">' : '') +
          '<div class="kp-card__top"><span class="kp-small">' + esc(date) + '</span><span class="kp-card__title">' + esc(title) + '</span></div></a>';
      }).join('');
    }).catch(function () {});
  }

  /* ================= 動畫：只播一次；長文（緣起）不加；沒有設定「減少動態」才啟用 ================= */
  function reveal() {
    if (!root.classList.contains('kp-motion') || !('IntersectionObserver' in window)) return;
    var groups = [];
    each($$('.kp-pagehead__text > *, .kp-pagehead__media, .kp-imghero .kp-wrap'), function (el, i) { el.setAttribute('data-kp-reveal', ''); el.style.setProperty('--kp-delay', (i * 0.12) + 's'); groups.push(el); });
    each($$('.kp-content .kp-sec:not(#origin) .kp-split__aside, .kp-content .kp-sec:not(#origin) .kp-split__main > *, .kp-content .kp-sec--alt .kp-split__aside, .kp-content .kp-sec--alt .kp-split__main > *, .kp-content .kp-head, .kp-content .kp-grid > *, .kp-content .kp-band__text > *, .kp-content .kp-box, .kp-content .kp-cta__text, .kp-content .kp-cta__act, .kp-content .kp-logos > *, .kp-content .kp-year'), function (el) {
      if (el.hasAttribute('data-kp-reveal')) return;
      el.setAttribute('data-kp-reveal', ''); groups.push(el);
    });
    var io = new IntersectionObserver(function (entries) {
      var n = 0;
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        if (!el.style.getPropertyValue('--kp-delay')) el.style.setProperty('--kp-delay', (n++ * 0.1) + 's');
        el.classList.add('is-in'); io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    groups.forEach(function (el) { io.observe(el); });
    /* 保險：3 秒後全部顯示 */
    setTimeout(function () { groups.forEach(function (el) { el.classList.add('is-in'); }); }, 3000);
  }

  /* 舊版型 body 裡有一個多出來的「<」字元，順手清掉 */
  function cleanStray() {
    each([].slice.call(document.body.childNodes), function (n) {
      if (n.nodeType === 3 && n.textContent.trim() === '<') n.parentNode.removeChild(n);
    });
  }

  /* ================= 預覽模式 ================= */
  function previewPages(done) {
    var m = location.hash.match(/^#kp-preview(?:=([a-z]+))?/);
    var k = m ? (m[1] || KEY) : (window.KP_PREVIEW_PAGES ? KEY : '');
    var p = PREVIEW[k];
    if (!p) { done(); return; }
    fetch(BASE + 'pages/' + p[0] + '?t=' + Date.now()).then(function (r) { return r.text(); }).then(function (html) {
      var box = $(p[1]);
      if (box) box.innerHTML = html;
      done();
    }).catch(function () { done(); });
  }

  /* 錨點：換掉頁首後高度改變，重新捲到網址上的段落 */
  function rescroll() {
    var h = location.hash.slice(1);
    if (!h || /^kp-/.test(h)) return;
    var t = document.getElementById(h);
    if (t) t.scrollIntoView();
  }

  /* ================= 啟動 ================= */
  function start() {
    cleanStray();
    previewPages(function () {
      unreset();
      buildHeader();
      buildFooter();
      setMeta();
      templates(function () {
        skipLink();
        fixPending();
        carousels();
        latestNews();
        reveal();
        fitNav();
        onScroll();
        rescroll();
      });
    });
    window.addEventListener('resize', fitNav);
    window.addEventListener('scroll', onScroll, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitNav);
    window.addEventListener('load', fitNav);
  }
  window.KP = { version: VERSION, key: KEY, links: LINKS };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
