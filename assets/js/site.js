// Strength Records Registry. One script for every page; no framework, no build step.
(function () {
  'use strict';

  var CFG = window.SR_CONFIG || {};
  var LB_PER_KG = 2.2046;
  var page = document.body.getAttribute('data-page');
  var data = null;

  // ---------- helpers ----------
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function kg(n) { return (Math.round(n * 10) / 10).toString(); }
  function lb(n) { return Math.round(n * LB_PER_KG).toString(); }
  function fmtDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
    if (!m) return iso || '';
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return Number(m[3]) + ' ' + months[Number(m[2]) - 1] + ' ' + m[1];
  }
  function byId(list, id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }
  function getJson(url) {
    return fetch(url, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error(url + ' ' + r.status);
      return r.json();
    });
  }
  function load() {
    return Promise.all([getJson('data/index.json'), getJson('data/lifts.json'), getJson('data/divisions.json')]).then(function (res) {
      data = { records: res[0].records, lifts: res[1].lifts, cfg: res[2] };
      annotate(data.records);
      return data;
    });
  }
  function showLoadError(el) {
    if (el) el.innerHTML = '<div class="notice error"><p>The records could not be loaded. Check your connection and reload the page.</p></div>';
  }

  // ---------- record logic ----------
  function subOf(r) {
    return r.division === 'bodyweight' ? r['class'] : r.division === 'adaptive' ? (r.adaptive && r.adaptive.category) : '';
  }
  function tableKey(r) { return [r.lift, r.division, r.group, subOf(r) || ''].join('|'); }

  // Works out, for every record, whether it is the current record, a past record or neither.
  function annotate(records) {
    var tables = {};
    records.forEach(function (r) {
      r._key = tableKey(r);
      r._role = r.status === 'removed' ? 'removed' : 'verified';
      (tables[r._key] = tables[r._key] || []).push(r);
    });
    Object.keys(tables).forEach(function (k) {
      var live = tables[k].filter(function (r) { return r.status !== 'removed'; });
      live.sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : a.approved < b.approved ? -1 : a.approved > b.approved ? 1 : 0; });
      var best = 0, current = null;
      live.forEach(function (r) {
        if (r.weight_kg > best) { best = r.weight_kg; r._role = 'past'; current = r; }
      });
      if (current) current._role = 'current';
    });
  }

  function liftName(id) { var l = byId(data.lifts, id); return l ? l.name : id; }
  function tableLabel(r) {
    var parts = [];
    var d = byId(data.cfg.divisions, r.division);
    parts.push(d ? d.name : r.division);
    if (r.division === 'bodyweight') {
      var c = byId(data.cfg.classes[r.group] || [], r['class']);
      parts.push(c ? c.name : r['class']);
    }
    if (r.division === 'adaptive' && r.adaptive) {
      var a = byId(data.cfg.adaptive_categories, r.adaptive.category);
      parts.push(a ? a.name : r.adaptive.category);
    }
    var g = byId(data.cfg.groups, r.group);
    parts.push(g ? g.name : r.group);
    return parts.join(' · ');
  }
  function badges(r) {
    var out = [];
    if (r.example) out.push('<span class="badge example">Example</span>');
    if (r._role === 'current') out.push('<span class="badge current">Current record</span>');
    else if (r._role === 'past') out.push('<span class="badge past">Superseded</span>');
    else if (r._role === 'removed') out.push('<span class="badge removed">Removed</span>');
    else out.push('<span class="badge past">Verified lift</span>');
    if (r.status === 'under-review') out.push('<span class="badge review">Under review</span>');
    if (r.status === 'evidence-unavailable') out.push('<span class="badge review">Evidence unavailable</span>');
    return out.join(' ');
  }
  function holder(r, link) {
    if (r._role === 'removed' || !r.handle) return '<span class="muted">Name withheld</span>';
    var name = esc(r.handle);
    return link ? '<a href="records.html?q=' + encodeURIComponent(r.handle) + '&amp;history=1">' + name + '</a>' : name;
  }
  function recordUrl(r) { return 'record.html?id=' + encodeURIComponent(r.id); }
  function weightHtml(r) { return kg(r.weight_kg) + ' kg <small>' + lb(r.weight_kg) + ' lb</small>'; }

  function rowHtml(r) {
    return '<tr class="' + (r._role === 'current' ? 'is-current' : '') + '">' +
      '<td class="c-lift"><a href="' + recordUrl(r) + '">' + esc(liftName(r.lift)) + '</a></td>' +
      '<td class="c-weight">' + weightHtml(r) + '</td>' +
      '<td class="c-holder">' + holder(r, true) + '</td>' +
      '<td class="c-table">' + esc(tableLabel(r)) + '</td>' +
      '<td class="c-date">' + esc(fmtDate(r.date)) + '</td>' +
      '<td class="c-status">' + badges(r) + ' <a class="small" href="' + recordUrl(r) + '">View</a></td>' +
      '</tr>';
  }
  function tableHtml(rows) {
    return '<table class="records"><thead><tr><th>Lift</th><th>Weight</th><th>Lifter</th><th>Table</th><th>Date</th><th>Status</th></tr></thead><tbody>' +
      rows.map(rowHtml).join('') + '</tbody></table>';
  }
  function exampleNotice() {
    var any = data.records.some(function (r) { return r.example; });
    return any ? '<div class="notice example"><p><strong>These are example records.</strong> The registry has not launched yet. Anything marked <span class="badge example">Example</span> is made up to show how the site works and is not a real lift.</p></div>' : '';
  }
  function historyItem(r, showLift) {
    return '<li><span class="w">' + kg(r.weight_kg) + ' kg</span><span>' +
      (showLift ? '<a href="' + recordUrl(r) + '">' + esc(liftName(r.lift)) + '</a> · ' : '<a href="' + recordUrl(r) + '">' + holder(r, false) + '</a> · ') +
      esc(fmtDate(r.date)) + ' ' + badges(r) + '</span>' +
      '<span class="meta">' + esc(showLift ? tableLabel(r) : '') + (r._role === 'removed' && r.notes ? esc((showLift ? ' · ' : '') + 'Reason: ' + r.notes) : '') + '</span></li>';
  }

  // ---------- home ----------
  function initHome() {
    var latest = $('#latest'), lifts = $('#lifts');
    load().then(function () {
      var rows = data.records.filter(function (r) { return r._role === 'current'; });
      rows.sort(function (a, b) { return a.approved < b.approved ? 1 : a.approved > b.approved ? -1 : a.date < b.date ? 1 : -1; });
      latest.innerHTML = exampleNotice() + (rows.length ? tableHtml(rows.slice(0, 5)) : '<p class="muted">No records yet. Yours could be the first.</p>');
      lifts.innerHTML = data.lifts.map(function (l) {
        return '<li><a href="records.html?lift=' + encodeURIComponent(l.id) + '"><strong>' + esc(l.name) + '</strong><span>' + esc(l.short) + '</span></a></li>';
      }).join('');
    }).catch(function () { showLoadError(latest); });
  }

  // ---------- records ----------
  function initRecords() {
    var out = $('#results');
    var f = { lift: $('#f-lift'), division: $('#f-division'), group: $('#f-group'), sub: $('#f-sub'), q: $('#f-q'), history: $('#f-history') };
    var params = new URLSearchParams(location.search);

    function options(sel, items, allLabel) {
      sel.innerHTML = '<option value="">' + esc(allLabel) + '</option>' + items.map(function (i) {
        return '<option value="' + esc(i.id) + '">' + esc(i.name) + '</option>';
      }).join('');
    }
    function fillSub() {
      var keep = f.sub.value, label = $('#f-sub-label');
      if (f.division.value === 'bodyweight') {
        var seen = {}, list = [];
        (f.group.value ? [f.group.value] : ['all', 'women']).forEach(function (g) {
          (data.cfg.classes[g] || []).forEach(function (c) { if (!seen[c.id]) { seen[c.id] = 1; list.push(c); } });
        });
        list.sort(function (a, b) { return parseFloat(a.id) - parseFloat(b.id) || a.id.length - b.id.length; });
        label.textContent = 'Class';
        options(f.sub, list, 'All classes');
        f.sub.disabled = false;
      } else if (f.division.value === 'adaptive') {
        label.textContent = 'Category';
        options(f.sub, data.cfg.adaptive_categories, 'All categories');
        f.sub.disabled = false;
      } else {
        label.textContent = 'Class / category';
        options(f.sub, [], 'Not used');
        f.sub.disabled = true;
      }
      f.sub.value = keep;
      if (f.sub.value !== keep) f.sub.value = '';
    }
    function render() {
      var q = f.q.value.trim().toLowerCase();
      var rows = data.records.filter(function (r) {
        if (f.lift.value && r.lift !== f.lift.value) return false;
        if (f.division.value && r.division !== f.division.value) return false;
        if (f.group.value && r.group !== f.group.value) return false;
        if (f.sub.value && subOf(r) !== f.sub.value) return false;
        if (!f.history.checked && r._role !== 'current') return false;
        if (q && (r._role === 'removed' || r.handle.toLowerCase().indexOf(q) === -1)) return false;
        return true;
      });
      var order = {};
      data.lifts.forEach(function (l, i) { order[l.id] = i; });
      rows.sort(function (a, b) {
        return (order[a.lift] - order[b.lift]) || (a._key < b._key ? -1 : a._key > b._key ? 1 : 0) || (b.weight_kg - a.weight_kg) || (a.date < b.date ? -1 : 1);
      });
      var what = f.history.checked ? 'entr' + (rows.length === 1 ? 'y' : 'ies') + ', including history' : 'current record' + (rows.length === 1 ? '' : 's');
      out.innerHTML = exampleNotice() + '<p class="count" aria-live="polite">' + rows.length + ' ' + what + '</p>' +
        (rows.length ? tableHtml(rows) : '<div class="card"><p>Nothing matches those filters yet. <a href="submit.html">Submit a lift</a> and it could be the first record in this table.</p></div>');

      var p = new URLSearchParams();
      if (f.lift.value) p.set('lift', f.lift.value);
      if (f.division.value) p.set('division', f.division.value);
      if (f.group.value) p.set('group', f.group.value);
      if (f.sub.value) p.set('sub', f.sub.value);
      if (q) p.set('q', f.q.value.trim());
      if (f.history.checked) p.set('history', '1');
      var qs = p.toString();
      history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
    }

    load().then(function () {
      options(f.lift, data.lifts, 'All lifts');
      options(f.division, data.cfg.divisions, 'All divisions');
      options(f.group, data.cfg.groups, 'Everyone and Women');
      f.lift.value = params.get('lift') || '';
      f.division.value = params.get('division') || '';
      f.group.value = params.get('group') || '';
      fillSub();
      f.sub.value = params.get('sub') || '';
      f.q.value = params.get('q') || '';
      f.history.checked = params.get('history') === '1';
      [f.lift, f.sub, f.history].forEach(function (el) { el.addEventListener('change', render); });
      [f.division, f.group].forEach(function (el) { el.addEventListener('change', function () { fillSub(); render(); }); });
      f.q.addEventListener('input', render);
      $('#f-reset').addEventListener('click', function () {
        f.lift.value = f.division.value = f.group.value = f.q.value = '';
        f.history.checked = false;
        fillSub();
        render();
      });
      render();
    }).catch(function () { showLoadError(out); });
  }

  // ---------- record ----------
  function youtubeId(url) {
    try {
      var u = new URL(url);
      if (u.hostname === 'youtu.be') return u.pathname.slice(1).split('/')[0];
      if (/youtube\.com$/.test(u.hostname)) {
        if (u.searchParams.get('v')) return u.searchParams.get('v');
        var m = /^\/(shorts|embed|live)\/([^/?]+)/.exec(u.pathname);
        if (m) return m[2];
      }
    } catch (e) { /* not a URL */ }
    return null;
  }
  function videoHtml(r) {
    if (r.example) return '<div class="video"><div><span class="badge example">Example</span><p>This is an example record, so there is no video. Every real record has its video here.</p></div></div>';
    if (!r.video) return '<div class="video"><div><p class="muted">The video for this entry is no longer shown.</p></div></div>';
    var id = youtubeId(r.video);
    if (id && /^[A-Za-z0-9_-]{6,20}$/.test(id)) {
      return '<div class="video" id="video"><div><button class="btn" type="button" id="play" data-id="' + esc(id) + '">Play the video</button>' +
        '<p class="small muted">Plays from YouTube, which may set its own cookies. <a href="' + esc(r.video) + '" rel="noopener noreferrer">Open on YouTube instead</a></p></div></div>';
    }
    return '<div class="video"><div><a class="btn" href="' + esc(r.video) + '" rel="noopener noreferrer">Watch the video</a>' +
      '<p class="small muted">Opens on the site the lifter uploaded it to.</p></div></div>';
  }
  function initRecord() {
    var out = $('#record');
    var id = new URLSearchParams(location.search).get('id');
    load().then(function () {
      var r = byId(data.records, id || '');
      if (!r) {
        out.innerHTML = '<h1>Record not found</h1><p>There is no record with that address. It may have been removed at the lifter\'s request.</p><p><a class="btn" href="records.html">Browse the records</a></p>';
        return;
      }
      var lift = byId(data.lifts, r.lift);
      document.title = kg(r.weight_kg) + ' kg ' + liftName(r.lift) + ' | Strength Records Registry';

      var facts = [];
      facts.push(['Lifter', holder(r, true)]);
      facts.push(['Table', esc(tableLabel(r))]);
      facts.push(['Date of lift', esc(fmtDate(r.date))]);
      if (r.bodyweight_kg != null) {
        var proof = { 'same-take': 'weighed in on the same video', 'same-day': 'weighed in on video the same day', 'self-reported': 'self-reported' }[r.bodyweight_proof] || '';
        var bw = esc(kg(r.bodyweight_kg) + ' kg (' + lb(r.bodyweight_kg) + ' lb), ' + proof);
        if (r.weighin_video) bw += ' · <a href="' + esc(r.weighin_video) + '" rel="noopener noreferrer">weigh-in video</a>';
        facts.push(['Bodyweight', bw]);
      }
      if (r.adaptive && r.adaptive.description) facts.push(['Adaptation', esc(r.adaptive.description) + ' <span class="muted small">(in the lifter\'s words)</span>']);
      if (r.entered_as && r.entered_as.unit === 'lb') facts.push(['Entered as', esc(r.entered_as.value + ' lb')]);
      facts.push(['Verified', esc(fmtDate(r.approved))]);
      if (r.notes) facts.push([r._role === 'removed' ? 'Reason' : 'Note', esc(r.notes)]);

      var inTable = data.records.filter(function (x) { return x._key === r._key; });
      inTable.sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : b.weight_kg - a.weight_kg; });
      var byHolder = r._role === 'removed' ? [] : data.records.filter(function (x) { return x._role !== 'removed' && x.handle.toLowerCase() === r.handle.toLowerCase(); });
      byHolder.sort(function (a, b) { return a.date < b.date ? 1 : -1; });

      out.innerHTML =
        (r.example ? '<div class="notice example"><p><strong>Example record.</strong> This entry is made up to show how the site works. It is not a real lift.</p></div>' : '') +
        (r.status === 'under-review' ? '<div class="notice"><p><strong>Under review.</strong> This record has been disputed and is being checked. It keeps its place until that is decided.</p></div>' : '') +
        (r.status === 'evidence-unavailable' ? '<div class="notice"><p><strong>Evidence unavailable.</strong> The video is not currently viewable. If it is not restored within 30 days this record is removed.</p></div>' : '') +
        '<div class="record-head"><p>' + badges(r) + '</p>' +
        '<div class="weight">' + kg(r.weight_kg) + ' kg<small>' + lb(r.weight_kg) + ' lb</small></div>' +
        '<h1>' + esc(liftName(r.lift)) + '</h1></div>' +
        videoHtml(r) +
        '<dl class="facts">' + facts.map(function (f) { return '<dt>' + f[0] + '</dt><dd>' + f[1] + '</dd>'; }).join('') + '</dl>' +
        (lift ? '<div class="card"><h3>The standard for this lift</h3><p>' + esc(lift.movement) + ' ' + esc(lift.finish) + '</p><p><a href="rules.html#lift-' + esc(lift.id) + '">Read the full standard</a> · <a href="submit.html#dispute">Dispute this record</a></p></div>' : '') +
        '<h2>Record history in this table</h2><p class="muted small">' + esc(tableLabel(r)) + ' · ' + esc(liftName(r.lift)) + '</p>' +
        '<ul class="history">' + inTable.map(function (x) { return historyItem(x, false); }).join('') + '</ul>' +
        (byHolder.length ? '<h2>' + esc(r.handle) + '\'s history</h2><ul class="history">' + byHolder.map(function (x) { return historyItem(x, true); }).join('') + '</ul>' : '');

      var play = $('#play');
      if (play) play.addEventListener('click', function () {
        var frame = document.createElement('iframe');
        frame.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(play.getAttribute('data-id')) + '?autoplay=1&rel=0';
        frame.title = 'Video of the lift';
        frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
        frame.allowFullscreen = true;
        frame.referrerPolicy = 'strict-origin-when-cross-origin';
        var box = $('#video');
        box.innerHTML = '';
        box.appendChild(frame);
      });
    }).catch(function () { showLoadError(out); });
  }

  // ---------- rules ----------
  function initRules() {
    var out = $('#standards');
    load().then(function () {
      out.innerHTML = data.lifts.map(function (l) {
        return '<details class="standard" id="lift-' + esc(l.id) + '"><summary>' + esc(l.name) + '<span>' + esc(l.short) + '</span></summary><div class="body"><dl>' +
          '<dt>Equipment</dt><dd>' + esc(l.equipment) + '</dd>' +
          '<dt>Start</dt><dd>' + esc(l.start) + '</dd>' +
          '<dt>The lift</dt><dd>' + esc(l.movement) + '</dd>' +
          '<dt>Finish</dt><dd>' + esc(l.finish) + '</dd>' +
          '<dt>Straps</dt><dd>' + (l.straps ? 'Allowed.' : 'Not allowed.') + '</dd>' +
          '<dt>It is a fail if</dt><dd><ul>' + l.fails.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></dd>' +
          '<dt>Camera</dt><dd>' + esc(l.camera) + '</dd>' +
          '</dl><p class="small"><a href="records.html?lift=' + encodeURIComponent(l.id) + '">See the records for this lift</a></p></div></details>';
      }).join('');
      var classes = $('#classes');
      if (classes) classes.innerHTML = data.cfg.groups.map(function (g) {
        return '<li><strong>' + esc(g.name) + ':</strong> ' + (data.cfg.classes[g.id] || []).map(function (c) { return esc(c.name); }).join(', ') + '</li>';
      }).join('');
      var cats = $('#categories');
      if (cats) cats.innerHTML = data.cfg.adaptive_categories.map(function (c) { return '<li>' + esc(c.name) + '</li>'; }).join('');
      if (location.hash) {
        var target = document.getElementById(location.hash.slice(1));
        if (target) { if (target.tagName === 'DETAILS') target.open = true; target.scrollIntoView(); }
      }
    }).catch(function () { showLoadError(out); });
    fillContact();
  }

  // ---------- contact details ----------
  function fillContact() {
    var els = document.querySelectorAll('[data-contact]');
    for (var i = 0; i < els.length; i++) {
      var html = 'Message <a href="https://www.instagram.com/' + esc(CFG.instagram || 'hunchback_hercules') + '/" rel="noopener noreferrer">@' + esc(CFG.instagram || 'hunchback_hercules') + '</a> on Instagram';
      if (CFG.contactEmail) html += ', or email <a href="mailto:' + esc(CFG.contactEmail) + '">' + esc(CFG.contactEmail) + '</a>';
      els[i].innerHTML = html + '.';
    }
    var second = document.querySelectorAll('[data-second-moderator]');
    for (var j = 0; j < second.length; j++) {
      second[j].textContent = CFG.secondModerator ? CFG.secondModerator : 'a second moderator, who will be named here before launch';
    }
  }

  // ---------- submit ----------
  function formspreeUrl(id) { return id && id.indexOf('YOUR_') !== 0 ? 'https://formspree.io/f/' + encodeURIComponent(id) : null; }

  function wireForm(form, url, statusEl, beforeSend) {
    if (!url) {
      statusEl.innerHTML = '<div class="notice"><p><strong>This form is not connected yet.</strong> The registry has not launched. You can fill it in to see how it works, but it cannot be sent.</p></div>';
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var problem = beforeSend ? beforeSend() : null;
      if (problem) {
        statusEl.innerHTML = '<div class="notice error" role="alert"><p>' + esc(problem) + '</p></div>';
        statusEl.scrollIntoView({ block: 'center' });
        return;
      }
      if (!form.reportValidity()) return;
      if (!url) {
        statusEl.innerHTML = '<div class="notice error" role="alert"><p>This form is not connected yet, so nothing was sent.</p></div>';
        statusEl.scrollIntoView({ block: 'center' });
        return;
      }
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      fetch(url, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } }).then(function (r) {
        if (!r.ok) throw new Error('send failed');
        form.hidden = true;
        statusEl.innerHTML = '<div class="notice ok" role="status"><p><strong>Sent.</strong> Thank you. If you left an email you will hear back either way. Approved records appear on the site once the video has been checked.</p></div>';
        statusEl.scrollIntoView({ block: 'center' });
      }).catch(function () {
        btn.disabled = false;
        statusEl.innerHTML = '<div class="notice error" role="alert"><p>That did not send. Check your connection and try again. Nothing you typed has been lost.</p></div>';
        statusEl.scrollIntoView({ block: 'center' });
      });
    });
  }

  function initSubmit() {
    var form = $('#submit-form'), status = $('#submit-status');
    var el = function (name) { return form.elements[name]; };
    var adaptiveBox = $('#adaptive-fields'), weighBox = $('#weighin-fields'), weighVideoBox = $('#weighin-video-field');

    function sync() {
      var div = el('division').value;
      adaptiveBox.hidden = div !== 'adaptive';
      el('adaptive_category').required = div === 'adaptive';
      el('adaptive_description').required = div === 'adaptive';
      weighBox.hidden = div !== 'bodyweight';
      el('bodyweight').required = div === 'bodyweight';
      $('#bw-optional').hidden = div === 'bodyweight';
      var weigh = div === 'bodyweight' ? el('weighin').value : 'none';
      weighVideoBox.hidden = weigh !== 'same-day';
      el('weighin_video').required = weigh === 'same-day';
    }

    load().then(function () {
      el('lift').innerHTML = '<option value="">Choose a lift</option>' + data.lifts.map(function (l) { return '<option value="' + esc(l.id) + '">' + esc(l.name) + '</option>'; }).join('');
      el('adaptive_category').innerHTML = '<option value="">Choose a category</option>' + data.cfg.adaptive_categories.map(function (c) { return '<option value="' + esc(c.id) + '">' + esc(c.name) + '</option>'; }).join('');
      var want = new URLSearchParams(location.search).get('lift');
      if (want) el('lift').value = want;
      $('#dispute-record-list').innerHTML = data.records.filter(function (r) { return r._role !== 'removed' && !r.example; }).map(function (r) { return '<option value="' + esc(r.id) + '">'; }).join('');
    }).catch(function () { showLoadError(status); });

    el('date').max = new Date().toISOString().slice(0, 10);
    el('division').addEventListener('change', sync);
    el('weighin').addEventListener('change', sync);
    sync();

    wireForm(form, formspreeUrl(CFG.formspreeSubmit), status, function () {
      var div = el('division').value;
      var emailLike = /[^\s@]+@[^\s@]+\.[a-z]{2,}/i;
      var publicText = [el('handle').value, el('adaptive_description').value, el('video').value, el('weighin_video').value].join(' ');
      if (emailLike.test(publicText)) return 'One of the public fields looks like it contains an email address. Emails are never published, so please put it only in the email box.';
      // The approval block: the public fields only, as one line. The moderator pastes this to approve.
      var block = {
        handle: el('handle').value.trim(),
        lift: el('lift').value,
        weight: el('weight').value,
        weight_unit: el('weight_unit').value,
        division: div,
        group: el('group').value,
        date: el('date').value,
        video: el('video').value.trim()
      };
      if (el('bodyweight').value) {
        block.bodyweight = el('bodyweight').value;
        block.bodyweight_unit = el('bodyweight_unit').value;
      }
      if (div === 'bodyweight') {
        block.weighin = el('weighin').value;
        if (el('weighin').value === 'same-day') block.weighin_video = el('weighin_video').value.trim();
      }
      if (div === 'adaptive') {
        block.adaptive_category = el('adaptive_category').value;
        block.adaptive_description = el('adaptive_description').value.trim();
      }
      el('approval_block').value = JSON.stringify(block);
      el('_subject').value = 'Record submission: ' + block.weight + ' ' + block.weight_unit + ' ' + block.lift + ' (' + block.handle + ')';
      return null;
    });

    wireForm($('#dispute-form'), formspreeUrl(CFG.formspreeDispute), $('#dispute-status'));
    if (location.hash === '#dispute') { var d = $('#dispute'); if (d) d.open = true; }
    fillContact();
  }

  // ---------- start ----------
  var year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
  if (page === 'home') initHome();
  else if (page === 'records') initRecords();
  else if (page === 'record') initRecord();
  else if (page === 'rules') initRules();
  else if (page === 'submit') initSubmit();
  else fillContact();
})();
