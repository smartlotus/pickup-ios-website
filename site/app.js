(() => {
  'use strict';

  const lang = document.documentElement.lang && document.documentElement.lang.toLowerCase().startsWith('zh') ? 'zh' : 'en';
  const copy = (window.PICKUP_DATA && window.PICKUP_DATA[lang]) || null;
  if (!copy) return;

  const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const announcer = document.getElementById('live-announcer');

  function announce(message) {
    if (!announcer || !message) return;
    announcer.textContent = '';
    requestAnimationFrame(() => {
      announcer.textContent = message;
    });
  }

  function clearNode(node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  /* -------------------------------------------------------------
     1. View Transitions Helper (modern-web-guidance: same-document-transitions)
     ------------------------------------------------------------- */
  function runViewTransition(updateFn, cleanupTargets = [], focusTarget = null) {
    if (!document.startViewTransition || prefersReducedMotion()) {
      updateFn();
      if (focusTarget) focusTarget.focus({ preventScroll: true });
      return;
    }

    for (const item of cleanupTargets) {
      item.el?.classList.add(item.cls);
    }

    const transition = document.startViewTransition(() => {
      updateFn();
    });

    transition.finished.finally(() => {
      for (const item of cleanupTargets) {
        item.el?.classList.remove(item.cls);
      }
      if (focusTarget) focusTarget.focus({ preventScroll: true });
    });
  }

  /* -------------------------------------------------------------
     2. Theme Switcher (Purple Dark <-> Monochrome)
     ------------------------------------------------------------- */
  const themeBtn = document.getElementById('theme-toggle');
  const themeLabel = document.getElementById('theme-toggle-label');

  function applyTheme(theme, persist = false) {
    const valid = theme === 'mono' ? 'mono' : 'purple';
    document.documentElement.dataset.theme = valid;
    if (persist) {
      try {
        localStorage.setItem('pickup_theme', valid);
      } catch (_) {}
    }
    if (themeBtn) {
      themeBtn.setAttribute('aria-pressed', String(valid === 'mono'));
    }
    if (themeLabel) {
      themeLabel.textContent = valid === 'mono' ? copy.themeMono : copy.themePurple;
    }
  }

  applyTheme(document.documentElement.dataset.theme || 'purple', false);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = document.documentElement.dataset.theme === 'mono' ? 'purple' : 'mono';
      runViewTransition(() => {
        applyTheme(next, true);
        announce(next === 'mono' ? copy.themeSwitchedMono : copy.themeSwitchedPurple);
      });
    });
  }

  window.addEventListener('storage', (event) => {
    if (event.key === 'pickup_theme' && (event.newValue === 'mono' || event.newValue === 'purple')) {
      applyTheme(event.newValue, false);
    }
  });

  /* -------------------------------------------------------------
     3. Pointer Specular Lighting on Liquid Glass Panels
     ------------------------------------------------------------- */
  if (matchMedia('(pointer: fine)').matches && !prefersReducedMotion()) {
    const glassCards = document.querySelectorAll('.glass-interactive');
    for (const card of glassCards) {
      let rafId = 0;
      let nextX = 0;
      let nextY = 0;
      card.addEventListener('pointermove', (e) => {
        nextX = e.clientX;
        nextY = e.clientY;
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
          rafId = 0;
          const rect = card.getBoundingClientRect();
          card.style.setProperty('--px', `${Math.round(nextX - rect.left)}px`);
          card.style.setProperty('--py', `${Math.round(nextY - rect.top)}px`);
        });
      });
    }
  }

  /* -------------------------------------------------------------
     4. Scroll-Driven Animation Fallbacks (modern-web-guidance)
     ------------------------------------------------------------- */
  if (!CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)')) {
    const progressEl = document.getElementById('scroll-progress');
    const headerEl = document.getElementById('site-header');
    let ticking = false;

    const updateScrollFallback = () => {
      ticking = false;
      const scrollY = window.scrollY;
      if (headerEl) {
        headerEl.classList.toggle('is-scrolled', scrollY > 36);
      }
      if (progressEl && !prefersReducedMotion()) {
        const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const pct = Math.min(1, Math.max(0, scrollY / scrollable));
        progressEl.style.transform = `scaleX(${pct})`;
      }
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateScrollFallback);
      }
    }, { passive: true });
    updateScrollFallback();
  }

  /* -------------------------------------------------------------
     5. Top-Layer <dialog> Exit Animation + Fallbacks
        (dialog, light-dismiss-a-dialog, animate-to-from-top-layer)
     ------------------------------------------------------------- */
  let supportsDisplayTransition;
  function canTransitionDisplay() {
    if (supportsDisplayTransition !== undefined) return supportsDisplayTransition;
    if (!window.CSS?.supports?.('transition-behavior', 'allow-discrete') || !document.body) {
      return false;
    }
    const probe = document.createElement('div');
    probe.style.cssText = 'transition: display 1s allow-discrete !important; display: block;';
    document.body.appendChild(probe);
    getComputedStyle(probe).display;
    probe.style.display = 'none';
    supportsDisplayTransition = getComputedStyle(probe).display === 'block';
    probe.remove();
    return supportsDisplayTransition;
  }

  function supportsTopLayerExit() {
    return Boolean(window.CSS?.supports?.('overlay', 'auto') && canTransitionDisplay());
  }

  async function closeTopLayer(dialog) {
    if (!dialog || !dialog.open) return;
    if (!supportsTopLayerExit()) {
      dialog.setAttribute('data-closing', '');
      const animations = dialog.getAnimations({ subtree: true });
      if (animations.length > 0) {
        await Promise.race([
          Promise.allSettled(animations.map((a) => a.finished)),
          new Promise((r) => setTimeout(r, 450))
        ]);
      }
      if (!dialog.hasAttribute('data-closing')) return;
      dialog.removeAttribute('data-closing');
    }
    dialog.close();
  }

  const allDialogs = document.querySelectorAll('dialog');
  for (const dialog of allDialogs) {
    dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      closeTopLayer(dialog);
    });

    dialog.addEventListener('close', () => {
      dialog.removeAttribute('data-closing');
      dialog.returnValue = '';
      if (dialog.id === 'film-dialog') {
        const video = document.getElementById('intro-video');
        if (video) video.pause();
      }
    });
  }

  // Fallback for browsers lacking closedby="any"
  if (!('closedBy' in HTMLDialogElement.prototype)) {
    const isOutside = (e, dialog) => {
      const r = dialog.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };
    for (const dialog of document.querySelectorAll('dialog[closedby="any"]')) {
      let pressedOutside = false;
      dialog.addEventListener('pointerdown', (e) => {
        pressedOutside = isOutside(e, dialog);
      });
      dialog.addEventListener('pointerup', (e) => {
        if (pressedOutside && isOutside(e, dialog)) {
          closeTopLayer(dialog);
        }
      });
    }
  }

  // Fallback for browsers lacking Invoker Commands (command / commandfor)
  const hasNativeCommands = 'commandForElement' in HTMLButtonElement.prototype;
  for (const btn of document.querySelectorAll('button[command][commandfor]')) {
    const cmd = btn.getAttribute('command');
    const targetId = btn.getAttribute('commandfor');
    if (cmd === 'close') {
      // Intercept close command in browsers lacking native top-layer exit transitions
      btn.addEventListener('click', (e) => {
        const target = document.getElementById(targetId);
        if (!target) return;
        if (!hasNativeCommands || !supportsTopLayerExit()) {
          e.preventDefault();
          closeTopLayer(target);
        }
      });
    } else if (cmd === 'show-modal' && !hasNativeCommands) {
      btn.addEventListener('click', () => {
        const target = document.getElementById(targetId);
        if (target && !target.open) target.showModal();
      });
    }
  }

  /* -------------------------------------------------------------
     6. Cinema Modal Video & Lazy Media Fallback
        (lazy-load-video-and-audio)
     ------------------------------------------------------------- */
  const filmDialog = document.getElementById('film-dialog');
  const introVideo = document.getElementById('intro-video');

  if (!Object.hasOwn(HTMLMediaElement.prototype, 'loading') && introVideo) {
    const mediaObserver = new IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const media = entry.target;
        if (media.dataset.poster) {
          media.poster = media.dataset.poster;
          delete media.dataset.poster;
        }
        observer.unobserve(media);
      }
    }, { rootMargin: '200px 0px' });

    if (introVideo.hasAttribute('poster')) {
      introVideo.dataset.poster = introVideo.getAttribute('poster');
      introVideo.removeAttribute('poster');
    }
    mediaObserver.observe(introVideo);
  }

  function onFilmOpen() {
    if (!introVideo) return;
    if (introVideo.dataset.poster) {
      introVideo.poster = introVideo.dataset.poster;
      delete introVideo.dataset.poster;
    }
    introVideo.preload = 'metadata';
    introVideo.muted = false;
    introVideo.play().catch(() => {});
  }

  if (filmDialog) {
    const openObserver = new MutationObserver(() => {
      if (filmDialog.open) onFilmOpen();
    });
    openObserver.observe(filmDialog, { attributes: true, attributeFilter: ['open'] });

    for (const chBtn of filmDialog.querySelectorAll('[data-chapter-time]')) {
      chBtn.addEventListener('click', () => {
        if (!introVideo) return;
        const sec = Number(chBtn.getAttribute('data-chapter-time') || 0);
        introVideo.currentTime = sec;
        introVideo.play().catch(() => {});
      });
    }
  }

  // Screenshot Lightbox Modal
  const lightboxDialog = document.getElementById('lightbox-dialog');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');

  for (const trigger of document.querySelectorAll('[data-lightbox-src]')) {
    trigger.addEventListener('click', () => {
      if (!lightboxDialog || !lightboxImg || !lightboxTitle) return;
      const src = trigger.getAttribute('data-lightbox-src');
      const title = trigger.getAttribute('data-lightbox-title') || '';
      const imgChild = trigger.querySelector('img');
      lightboxImg.src = src;
      if (imgChild) {
        lightboxImg.alt = imgChild.alt;
        lightboxImg.width = imgChild.naturalWidth || imgChild.width || 588;
        lightboxImg.height = imgChild.naturalHeight || imgChild.height || 1278;
      } else {
        lightboxImg.alt = title;
      }
      lightboxTitle.textContent = title;
      lightboxDialog.showModal();
    });
  }

  /* -------------------------------------------------------------
     7. Simulator State & Interactive Engine
     ------------------------------------------------------------- */
  const initialEntries = JSON.parse(JSON.stringify(copy.entries));

  const state = {
    device: 'iphone',
    activeTab: 'journal',
    journalFilter: 'all',
    searchQuery: '',
    entries: initialEntries,
    expandedReplies: new Set(['demo-1']),
    playingLiveId: null,
    selectedDay: 17,
    revisitId: 'demo-last-year',
    aiScope: 'intelligent',
    aiPromptKey: 'calm',
    aiShowAnswer: true,
    vaultFreq: 'daily',
    vaultRetention: '7',
    vaultFormat: 'zip',
    vaultActiveSlice: 'images',
    vaultSimCount: 2,
    lastBackupHash: '9f82c1e4a07b'
  };

  const stage = document.getElementById('simulator-stage');
  const panelsStack = document.querySelector('.sim-panels-stack');
  const deviceTabs = Array.from(document.querySelectorAll('.device-tablist [role="tab"]'));
  const dockTabs = Array.from(document.querySelectorAll('.sim-iphone-dock [role="tab"]'));
  const ipadTabs = Array.from(document.querySelectorAll('.ipad-sidebar-nav [role="tab"]'));
  const simPanels = {
    journal: document.getElementById('sim-panel-journal'),
    timeline: document.getElementById('sim-panel-timeline'),
    revisit: document.getElementById('sim-panel-revisit'),
    ai: document.getElementById('sim-panel-ai'),
    vault: document.getElementById('sim-panel-vault')
  };

  function setupFocusgroupArrowFallback(tabButtons, activateFn, vertical = false) {
    if (Object.hasOwn(HTMLElement.prototype, 'focusGroup')) return;
    tabButtons.forEach((btn, idx) => {
      btn.setAttribute('tabindex', btn.getAttribute('aria-selected') === 'true' ? '0' : '-1');
      btn.addEventListener('keydown', (e) => {
        const prevKey = vertical ? 'ArrowUp' : 'ArrowLeft';
        const nextKey = vertical ? 'ArrowDown' : 'ArrowRight';
        let nextIdx = -1;
        if (e.key === nextKey) nextIdx = (idx + 1) % tabButtons.length;
        else if (e.key === prevKey) nextIdx = (idx - 1 + tabButtons.length) % tabButtons.length;
        else if (e.key === 'Home') nextIdx = 0;
        else if (e.key === 'End') nextIdx = tabButtons.length - 1;
        if (nextIdx === -1) return;
        e.preventDefault();
        const target = tabButtons[nextIdx];
        activateFn(target);
        target.focus();
      });
    });
  }

  function syncTabGroupAttributes(buttons, activeKey, attrName) {
    for (const btn of buttons) {
      const isSelected = btn.getAttribute(attrName) === activeKey;
      btn.setAttribute('aria-selected', String(isSelected));
      btn.toggleAttribute('focusgroupstart', isSelected);
      if (!Object.hasOwn(HTMLElement.prototype, 'focusGroup')) {
        btn.setAttribute('tabindex', isSelected ? '0' : '-1');
      }
    }
  }

  function switchDevice(nextDevice) {
    if (!stage || state.device === nextDevice) return;
    runViewTransition(() => {
      state.device = nextDevice;
      stage.dataset.device = nextDevice;
      syncTabGroupAttributes(deviceTabs, nextDevice, 'data-device');
      syncPanelLabelledBy();
      renderInspector();
      announce(nextDevice === 'ipad' ? copy.deviceSwitchedIpad : copy.deviceSwitchedIphone);
    }, [{ el: stage, cls: 'is-vt-stage' }]);
  }

  function syncPanelLabelledBy() {
    const prefix = state.device === 'ipad' ? 'ipad-tab-' : 'dock-tab-';
    for (const [key, panel] of Object.entries(simPanels)) {
      if (panel) panel.setAttribute('aria-labelledby', `${prefix}${key}`);
    }
  }

  function switchSimTab(nextTab, withTransition = true) {
    if (!simPanels[nextTab]) return;
    const apply = () => {
      state.activeTab = nextTab;
      syncTabGroupAttributes(dockTabs, nextTab, 'data-sim-tab');
      syncTabGroupAttributes(ipadTabs, nextTab, 'data-sim-tab');
      for (const [key, panel] of Object.entries(simPanels)) {
        if (!panel) continue;
        const active = key === nextTab;
        if (active) {
          panel.removeAttribute('hidden');
        } else {
          panel.setAttribute('hidden', 'until-found');
          panel.removeAttribute('tabindex');
        }
      }
      renderInspector();
    };

    if (withTransition && state.activeTab !== nextTab) {
      runViewTransition(apply, [{ el: panelsStack, cls: 'is-vt-screen' }]);
    } else {
      apply();
    }
  }

  for (const btn of deviceTabs) {
    btn.addEventListener('click', () => switchDevice(btn.getAttribute('data-device')));
  }
  setupFocusgroupArrowFallback(deviceTabs, (b) => switchDevice(b.getAttribute('data-device')), false);

  for (const btn of dockTabs) {
    btn.addEventListener('click', () => {
      switchSimTab(btn.getAttribute('data-sim-tab'));
      btn.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    });
  }
  setupFocusgroupArrowFallback(dockTabs, (b) => switchSimTab(b.getAttribute('data-sim-tab')), false);

  for (const btn of ipadTabs) {
    btn.addEventListener('click', () => switchSimTab(btn.getAttribute('data-sim-tab')));
  }
  setupFocusgroupArrowFallback(ipadTabs, (b) => switchSimTab(b.getAttribute('data-sim-tab')), true);

  for (const [key, panel] of Object.entries(simPanels)) {
    if (!panel) continue;
    panel.addEventListener('beforematch', () => {
      switchSimTab(key, false);
    });
  }

  /* --- Tab 1: Journal Capture --- */
  const searchInput = document.getElementById('sim-search-input');
  const journalList = document.getElementById('sim-journal-list');
  const filterBtns = Array.from(document.querySelectorAll('[data-journal-filter]'));

  function getFilteredEntries() {
    const q = state.searchQuery.trim().toLowerCase();
    return state.entries.filter((entry) => {
      if (state.journalFilter === 'today' && !entry.isToday) return false;
      if (state.journalFilter === 'photos' && !entry.hasPhoto) return false;
      if (state.journalFilter === 'reflections' && entry.comments.length === 0) return false;
      if (state.journalFilter === 'pinned' && !entry.isPinned) return false;
      if (!q) return true;
      const hay = [
        entry.content,
        entry.song || '',
        entry.mood || '',
        entry.weather || '',
        (entry.tags || []).join(' '),
        entry.comments.map((c) => c.text).join(' ')
      ].join(' ').toLowerCase();
      return hay.includes(q);
    });
  }

  function renderJournal() {
    if (!journalList) return;
    clearNode(journalList);
    const items = getFilteredEntries();
    if (items.length === 0) {
      journalList.appendChild(el('p', 'sim-entry-card', copy.searchEmpty));
      return;
    }

    for (const entry of items) {
      const card = el('article', 'sim-entry-card');

      const metaRow = el('div', 'entry-meta-row');
      metaRow.appendChild(el('span', null, entry.dateLabel));

      const rightMeta = el('div', 'entry-badges');
      if (entry.mood) rightMeta.appendChild(el('span', 'badge-tag', entry.mood));
      if (entry.weather) rightMeta.appendChild(el('span', 'badge-tag', entry.weather));

      const pinBtn = el('button', 'pin-toggle-btn', entry.isPinned ? '★' : '☆');
      pinBtn.type = 'button';
      pinBtn.setAttribute('aria-pressed', String(entry.isPinned));
      pinBtn.setAttribute('aria-label', entry.isPinned ? copy.pinRemoved : copy.pinAdded);
      pinBtn.addEventListener('click', () => {
        entry.isPinned = !entry.isPinned;
        announce(entry.isPinned ? copy.pinAdded : copy.pinRemoved);
        renderJournal();
        renderInspector();
      });
      rightMeta.appendChild(pinBtn);
      metaRow.appendChild(rightMeta);
      card.appendChild(metaRow);

      if (entry.hasPhoto) {
        const photoBox = el('div', 'entry-photo-preview');
        photoBox.style.background = entry.photoGradient || 'linear-gradient(135deg, #2B213A, #7C4DFF)';
        if (state.playingLiveId === entry.id) photoBox.classList.add('is-playing');
        photoBox.appendChild(el('span', 'entry-photo-title', entry.photoTitle || 'Photo'));
        if (entry.isLivePhoto) {
          const liveBtn = el('button', 'badge-tag badge-live', copy.liveBadge);
          liveBtn.type = 'button';
          liveBtn.addEventListener('click', () => {
            state.playingLiveId = entry.id;
            announce(copy.livePlaying);
            renderJournal();
            setTimeout(() => {
              if (state.playingLiveId === entry.id) {
                state.playingLiveId = null;
                renderJournal();
              }
            }, 1250);
          });
          photoBox.appendChild(liveBtn);
        }
        card.appendChild(photoBox);
      }

      card.appendChild(el('p', 'entry-prose', entry.content));

      if (entry.song) {
        card.appendChild(el('span', 'soundtrack-pill', `♪ ${entry.song}`));
      }

      const actionsRow = el('div', 'entry-actions-row');
      const tagsWrap = el('div', 'entry-badges');
      for (const tag of entry.tags || []) {
        tagsWrap.appendChild(el('span', 'badge-tag', `#${tag}`));
      }
      actionsRow.appendChild(tagsWrap);

      const isExpanded = state.expandedReplies.has(entry.id);
      const replyBtn = el(
        'button',
        'reply-expand-btn',
        `${copy.repliesLabel} (${entry.comments.length})`
      );
      replyBtn.type = 'button';
      replyBtn.setAttribute('aria-expanded', String(isExpanded));
      replyBtn.addEventListener('click', () => {
        if (state.expandedReplies.has(entry.id)) state.expandedReplies.delete(entry.id);
        else state.expandedReplies.add(entry.id);
        renderJournal();
      });
      actionsRow.appendChild(replyBtn);
      card.appendChild(actionsRow);

      if (isExpanded) {
        const thread = el('div', 'reply-thread');
        for (const comment of entry.comments) {
          const item = el('div', 'reply-item');
          const t = el('time', null, comment.time);
          item.appendChild(t);
          item.appendChild(document.createTextNode(comment.text));
          thread.appendChild(item);
        }

        const quickForm = el('form', 'revisit-reply-form');
        const inputId = `quick-reply-${entry.id}`;
        const label = el('label', 'visually-hidden', copy.replyPlaceholder);
        label.setAttribute('for', inputId);
        const input = document.createElement('input');
        input.id = inputId;
        input.type = 'text';
        input.placeholder = copy.replyPlaceholder;
        input.required = true;
        const submit = el('button', null, copy.replyButton);
        submit.type = 'submit';
        quickForm.appendChild(label);
        quickForm.appendChild(input);
        quickForm.appendChild(submit);

        quickForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const val = input.value.trim();
          if (!val) return;
          entry.comments.push({ time: lang === 'zh' ? '刚刚' : 'Just now', text: val });
          announce(copy.replyAdded);
          renderJournal();
          renderRevisit();
          renderInspector();
        });
        thread.appendChild(quickForm);
        card.appendChild(thread);
      }

      journalList.appendChild(card);
    }
  }

  for (const btn of filterBtns) {
    btn.addEventListener('click', () => {
      state.journalFilter = btn.getAttribute('data-journal-filter') || 'all';
      for (const b of filterBtns) {
        b.setAttribute('aria-pressed', String(b === btn));
      }
      renderJournal();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      state.searchQuery = searchInput.value;
      renderJournal();
    });
  }

  /* --- Tab 2: Timeline Calendar --- */
  const calGrid = document.getElementById('sim-calendar-days');
  const timelineSelected = document.getElementById('sim-timeline-selected');
  const onThisDayBox = document.getElementById('sim-on-this-day');

  function makeRedPenSvg() {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 60 60');
    svg.setAttribute('class', 'cal-redpen-ring');
    svg.setAttribute('aria-hidden', 'true');
    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', 'M48 16 C35 4, 8 9, 7 28 C6 45, 22 55, 39 51 C53 47, 56 27, 45 14');
    svg.appendChild(path);
    return svg;
  }

  function renderTimeline() {
    if (!calGrid || !timelineSelected) return;
    clearNode(calGrid);
    const recordedSet = new Set(copy.recordedDays);
    // Nov 2026 starts on Sunday (offset 0); show days 1..30
    for (let day = 1; day <= 30; day++) {
      const hasEntry = recordedSet.has(day);
      const btn = el('button', hasEntry ? 'cal-day-btn has-entry' : 'cal-day-btn', String(day));
      btn.type = 'button';
      btn.setAttribute('aria-pressed', String(state.selectedDay === day));
      if (hasEntry) {
        btn.appendChild(makeRedPenSvg());
      }
      btn.addEventListener('click', () => {
        state.selectedDay = day;
        renderTimeline();
        renderInspector();
      });
      calGrid.appendChild(btn);
    }

    clearNode(timelineSelected);
    const dayMatches = state.entries.filter((e) => e.day === state.selectedDay);
    if (dayMatches.length === 0) {
      timelineSelected.appendChild(el('p', 'sim-entry-card', copy.noDayEntries));
    } else {
      for (const entry of dayMatches) {
        const card = el('article', 'sim-entry-card');
        card.appendChild(el('span', 'gold-kicker', `${copy.selectedDayLabel} · ${entry.dateLabel}`));
        card.appendChild(el('p', 'entry-prose', entry.content));
        if (entry.song) card.appendChild(el('span', 'soundtrack-pill', `♪ ${entry.song}`));
        timelineSelected.appendChild(card);
      }
    }

    if (onThisDayBox) {
      clearNode(onThisDayBox);
      const echo = state.entries.find((e) => e.isOnThisDay) || state.entries[state.entries.length - 1];
      onThisDayBox.appendChild(el('span', 'gold-kicker', copy.onThisDayBadge));
      onThisDayBox.appendChild(el('p', 'entry-prose', echo.content));
    }
  }

  /* --- Tab 3: Revisit --- */
  const revisitShuffleBtn = document.getElementById('sim-revisit-shuffle');
  const revisitCard = document.getElementById('sim-revisit-card');
  const revisitForm = document.getElementById('sim-revisit-form');
  const revisitInput = document.getElementById('sim-revisit-input');

  function renderRevisit() {
    if (!revisitCard) return;
    clearNode(revisitCard);
    const entry = state.entries.find((e) => e.id === state.revisitId) || state.entries[0];

    const head = el('div', 'entry-meta-row');
    head.appendChild(el('span', 'gold-kicker', entry.dateLabel));
    const tags = el('div', 'entry-badges');
    if (entry.mood) tags.appendChild(el('span', 'badge-tag', entry.mood));
    if (entry.weather) tags.appendChild(el('span', 'badge-tag', entry.weather));
    head.appendChild(tags);
    revisitCard.appendChild(head);

    revisitCard.appendChild(el('p', 'entry-prose', entry.content));

    if (entry.song) {
      revisitCard.appendChild(el('span', 'soundtrack-pill', `♪ ${entry.song}`));
    }

    const thread = el('div', 'reply-thread');
    if (entry.comments.length === 0) {
      thread.appendChild(el('span', 'entry-meta-row', copy.replyPlaceholder));
    } else {
      for (const c of entry.comments) {
        const item = el('div', 'reply-item');
        item.appendChild(el('time', null, c.time));
        item.appendChild(document.createTextNode(c.text));
        thread.appendChild(item);
      }
    }
    revisitCard.appendChild(thread);
  }

  if (revisitShuffleBtn) {
    revisitShuffleBtn.addEventListener('click', () => {
      const pool = state.entries.filter((e) => e.id !== state.revisitId);
      const next = pool[Math.floor(Math.random() * pool.length)] || state.entries[0];
      state.revisitId = next.id;
      announce(copy.revisitShuffled);
      renderRevisit();
      renderInspector();
    });
  }

  if (revisitForm && revisitInput) {
    revisitForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = revisitInput.value.trim();
      if (!val) return;
      const entry = state.entries.find((item) => item.id === state.revisitId) || state.entries[0];
      entry.comments.push({ time: lang === 'zh' ? '刚刚' : 'Just now', text: val });
      revisitInput.value = '';
      announce(copy.replyAdded);
      renderRevisit();
      renderJournal();
      renderInspector();
    });
  }

  /* --- Tab 4: AI Hub --- */
  const aiScopeBtns = Array.from(document.querySelectorAll('[data-ai-scope]'));
  const aiPromptBtns = Array.from(document.querySelectorAll('[data-ai-prompt]'));
  const aiDisclosureBox = document.getElementById('sim-ai-disclosure');
  const aiAnswerBox = document.getElementById('sim-ai-answer');

  function getAiMatchedPool() {
    if (state.aiScope === 'all') return state.entries;
    if (state.aiScope === 'custom') return state.entries.slice(0, 2);
    return state.entries.slice(0, 3);
  }

  function renderAiHub() {
    if (!aiDisclosureBox || !aiAnswerBox) return;
    clearNode(aiDisclosureBox);
    const pool = getAiMatchedPool();
    const textPayload = pool.map((e) => `[${e.isoDate}] ${e.content}`).join('\n');

    aiDisclosureBox.appendChild(el('span', 'gold-kicker', copy.aiPreviewHeader));
    aiDisclosureBox.appendChild(el('div', 'ai-zero-badge', copy.aiMediaZero));

    const metaGrid = el('div', 'ai-meta-grid');
    const b1 = el('div', 'ai-meta-box');
    b1.appendChild(el('span', null, lang === 'zh' ? '匹配范围' : 'Scope'));
    b1.appendChild(el('strong', null, copy.aiScopeLabels[state.aiScope]));
    const b2 = el('div', 'ai-meta-box');
    b2.appendChild(el('span', null, lang === 'zh' ? '发送字符 / 条数' : 'Payload Size'));
    b2.appendChild(el('strong', null, `${pool.length} ${lang === 'zh' ? '条' : 'entries'} · ${textPayload.length} chars`));
    metaGrid.appendChild(b1);
    metaGrid.appendChild(b2);
    aiDisclosureBox.appendChild(metaGrid);

    const preview = el('pre', 'vault-format-pre', textPayload.slice(0, 175) + (textPayload.length > 175 ? '…' : ''));
    aiDisclosureBox.appendChild(preview);

    aiAnswerBox.textContent = copy.aiSimulatedAnswers[state.aiPromptKey] || copy.aiSimulatedAnswers.calm;
  }

  for (const btn of aiScopeBtns) {
    btn.addEventListener('click', () => {
      state.aiScope = btn.getAttribute('data-ai-scope') || 'intelligent';
      for (const b of aiScopeBtns) b.setAttribute('aria-pressed', String(b === btn));
      renderAiHub();
      renderInspector();
    });
  }

  for (const btn of aiPromptBtns) {
    btn.addEventListener('click', () => {
      state.aiPromptKey = btn.getAttribute('data-ai-prompt') || 'calm';
      for (const b of aiPromptBtns) b.setAttribute('aria-pressed', String(b === btn));
      renderAiHub();
    });
  }

  /* --- Tab 5: Data Vault --- */
  const storageRingSvg = document.getElementById('sim-storage-ring');
  const storageLegend = document.getElementById('sim-storage-legend');
  const vaultFreqBtns = Array.from(document.querySelectorAll('[data-vault-freq]'));
  const vaultRetBtns = Array.from(document.querySelectorAll('[data-vault-ret]'));
  const vaultFormatBtns = Array.from(document.querySelectorAll('[data-vault-format]'));
  const vaultBackupBtn = document.getElementById('sim-vault-backup-btn');
  const vaultToast = document.getElementById('sim-vault-toast');
  const vaultPreview = document.getElementById('sim-vault-preview');

  function renderDataVault() {
    if (storageRingSvg && storageLegend) {
      clearNode(storageRingSvg);
      clearNode(storageLegend);

      const ns = 'http://www.w3.org/2000/svg';
      const title = document.createElementNS(ns, 'title');
      title.id = 'ring-title';
      title.textContent = lang === 'zh' ? '本地存储分布环状图' : 'Local Storage Breakdown Ring';
      storageRingSvg.appendChild(title);

      const radius = 44;
      const circumference = 2 * Math.PI * radius;
      let offset = 0;

      for (const item of copy.vaultStorageItems) {
        const dash = (item.pct / 100) * circumference;
        const circle = document.createElementNS(ns, 'circle');
        circle.setAttribute('cx', '60');
        circle.setAttribute('cy', '60');
        circle.setAttribute('r', String(radius));
        circle.setAttribute('stroke', item.color);
        circle.setAttribute('stroke-dasharray', `${dash} ${circumference - dash}`);
        circle.setAttribute('stroke-dashoffset', String(-offset));
        circle.setAttribute('transform', 'rotate(-90 60 60)');
        circle.setAttribute('class', state.vaultActiveSlice === item.key ? 'ring-segment is-active' : 'ring-segment');
        circle.addEventListener('click', () => {
          state.vaultActiveSlice = item.key;
          renderDataVault();
        });
        storageRingSvg.appendChild(circle);
        offset += dash;

        const li = document.createElement('li');
        const legBtn = el('button', state.vaultActiveSlice === item.key ? 'is-active' : '');
        legBtn.type = 'button';
        const leftSpan = el('span');
        const dot = el('span', 'legend-dot');
        dot.style.background = item.color;
        leftSpan.appendChild(dot);
        leftSpan.appendChild(document.createTextNode(item.label));
        legBtn.appendChild(leftSpan);
        legBtn.appendChild(el('strong', null, item.bytesLabel));
        legBtn.addEventListener('click', () => {
          state.vaultActiveSlice = item.key;
          renderDataVault();
        });
        li.appendChild(legBtn);
        storageLegend.appendChild(li);
      }

      const centerText = document.createElementNS(ns, 'text');
      centerText.setAttribute('x', '60');
      centerText.setAttribute('y', '64');
      centerText.setAttribute('text-anchor', 'middle');
      centerText.setAttribute('fill', '#F4F3ED');
      centerText.setAttribute('font-size', '14');
      centerText.setAttribute('font-weight', '700');
      centerText.textContent = '40 MB';
      storageRingSvg.appendChild(centerText);
    }

    if (vaultPreview) {
      const fmt = copy.vaultFormats[state.vaultFormat] || copy.vaultFormats.zip;
      vaultPreview.textContent = [
        `${fmt.title} · [${fmt.badge}]`,
        `${copy.vaultFreqLabels[state.vaultFreq]} · ${copy.vaultRetentionLabels[state.vaultRetention]}`,
        ...fmt.lines
      ].join('\n');
    }
  }

  for (const btn of vaultFreqBtns) {
    btn.addEventListener('click', () => {
      state.vaultFreq = btn.getAttribute('data-vault-freq') || 'daily';
      for (const b of vaultFreqBtns) b.setAttribute('aria-pressed', String(b === btn));
      renderDataVault();
      renderInspector();
    });
  }

  for (const btn of vaultRetBtns) {
    btn.addEventListener('click', () => {
      state.vaultRetention = btn.getAttribute('data-vault-ret') || '7';
      for (const b of vaultRetBtns) b.setAttribute('aria-pressed', String(b === btn));
      renderDataVault();
      renderInspector();
    });
  }

  for (const btn of vaultFormatBtns) {
    btn.addEventListener('click', () => {
      state.vaultFormat = btn.getAttribute('data-vault-format') || 'zip';
      for (const b of vaultFormatBtns) b.setAttribute('aria-pressed', String(b === btn));
      renderDataVault();
      renderInspector();
    });
  }

  if (vaultBackupBtn && vaultToast) {
    vaultBackupBtn.addEventListener('click', () => {
      state.vaultSimCount += 1;
      state.lastBackupHash = Math.random().toString(16).slice(2, 14);
      const fmt = copy.vaultFormats[state.vaultFormat] || copy.vaultFormats.zip;
      const prefix = copy.vaultSnapPrefix || 'pickup-manual-20261117';
      vaultToast.textContent = `${copy.vaultSimulatedToast} · #${state.vaultSimCount} (${prefix}${fmt.ext} · sha256:${state.lastBackupHash})`;
      vaultToast.hidden = false;
      announce(vaultToast.textContent);
      renderInspector();
    });
  }

  /* --- iPad Right Inspector Rail --- */
  const inspectorContent = document.getElementById('sim-inspector-content');

  function renderInspector() {
    if (!inspectorContent) return;
    clearNode(inspectorContent);

    const card1 = el('div', 'inspector-box');
    card1.appendChild(el('span', 'gold-kicker', lang === 'zh' ? '实时状态检查器' : 'LIVE INSPECTOR'));
    if (state.activeTab === 'journal') {
      const top = getFilteredEntries()[0] || state.entries[0];
      card1.appendChild(el('h3', null, top.photoTitle || top.dateLabel));
      card1.appendChild(el('p', null, top.content));
    } else if (state.activeTab === 'timeline') {
      card1.appendChild(el('h3', null, `${lang === 'zh' ? '11月' : 'Nov '}${state.selectedDay}`));
      card1.appendChild(el('p', null, lang === 'zh' ? '红笔圆圈代表该日有记忆封存，支持随时写下跨时空回看。' : 'Red-pen rings mark recorded dates with instant On-This-Day echoes.'));
    } else if (state.activeTab === 'revisit') {
      const r = state.entries.find((e) => e.id === state.revisitId) || state.entries[0];
      card1.appendChild(el('h3', null, r.dateLabel));
      card1.appendChild(el('p', null, `${r.comments.length} ${copy.repliesLabel}`));
    } else if (state.activeTab === 'ai') {
      card1.appendChild(el('h3', null, copy.aiScopeLabels[state.aiScope]));
      card1.appendChild(el('p', null, copy.aiMediaZero));
    } else {
      card1.appendChild(el('h3', null, `${copy.vaultFreqLabels[state.vaultFreq]} · ${copy.vaultRetentionLabels[state.vaultRetention]}`));
      card1.appendChild(el('p', null, `SHA-256: ${state.lastBackupHash} · Snapshots: ${state.vaultSimCount}`));
    }

    const card2 = el('div', 'inspector-box');
    card2.appendChild(el('span', 'gold-kicker', lang === 'zh' ? '本地主权指标' : 'SOVEREIGNTY'));
    card2.appendChild(el('p', null, lang === 'zh'
      ? '支持 ⌘1–⌘5 快捷切换视图、AES-256-GCM 加密保险箱及 Android v2 ZIP 双向无损迁移。'
      : 'Supports ⌘1–⌘5 view switching, AES-256-GCM encrypted vault, and lossless Android v2 ZIP sync.'));

    inspectorContent.appendChild(card1);
    inspectorContent.appendChild(card2);
  }

  const resetBtn = document.getElementById('sim-reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state.entries = JSON.parse(JSON.stringify(copy.entries));
      state.journalFilter = 'all';
      state.searchQuery = '';
      if (searchInput) searchInput.value = '';
      for (const b of filterBtns) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-journal-filter') === 'all'));
      }
      state.selectedDay = 17;
      state.revisitId = 'demo-last-year';
      if (vaultToast) vaultToast.hidden = true;
      renderJournal();
      renderTimeline();
      renderRevisit();
      renderAiHub();
      renderDataVault();
      renderInspector();
    });
  }

  // Initial Simulator Hydration
  renderJournal();
  renderTimeline();
  renderRevisit();
  renderAiHub();
  renderDataVault();
  renderInspector();
  syncPanelLabelledBy();

  /* -------------------------------------------------------------
     8. Install Hub 3-Tab Switcher & Copy Command Buttons
     ------------------------------------------------------------- */
  const installTabs = Array.from(document.querySelectorAll('.install-tablist [role="tab"]'));
  const installPanels = Array.from(document.querySelectorAll('.install-panels [role="tabpanel"]'));

  function switchInstallTab(tabBtn) {
    const key = tabBtn.getAttribute('data-install-target');
    for (const b of installTabs) {
      const sel = b === tabBtn;
      b.setAttribute('aria-selected', String(sel));
      b.toggleAttribute('focusgroupstart', sel);
      if (!Object.hasOwn(HTMLElement.prototype, 'focusGroup')) {
        b.setAttribute('tabindex', sel ? '0' : '-1');
      }
    }
    for (const panel of installPanels) {
      const isMatch = panel.id === `inst-panel-${key}`;
      if (isMatch) {
        panel.removeAttribute('hidden');
      } else {
        panel.setAttribute('hidden', 'until-found');
        panel.removeAttribute('tabindex');
      }
    }
  }

  for (const btn of installTabs) {
    btn.addEventListener('click', () => {
      runViewTransition(() => {
        switchInstallTab(btn);
        btn.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      });
    });
  }
  setupFocusgroupArrowFallback(installTabs, (b) => switchInstallTab(b), false);

  for (const panel of installPanels) {
    panel.addEventListener('beforematch', () => {
      const key = panel.id.replace('inst-panel-', '');
      const matchingBtn = installTabs.find((b) => b.getAttribute('data-install-target') === key);
      if (matchingBtn) switchInstallTab(matchingBtn);
    });
  }

  for (const copyBtn of document.querySelectorAll('[data-copy-target]')) {
    copyBtn.addEventListener('click', async () => {
      const targetId = copyBtn.getAttribute('data-copy-target');
      const codeEl = document.getElementById(targetId);
      const statusEl = copyBtn.parentElement?.querySelector('.copy-status');
      if (!codeEl) return;
      const text = codeEl.textContent || '';
      let ok = false;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
          ok = true;
        }
      } catch (_) {}
      if (!ok) {
        try {
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.setAttribute('readonly', '');
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          ok = document.execCommand('copy');
          ta.remove();
        } catch (_) {}
      }
      const msg = ok ? copy.copied : copy.copyFailed;
      if (statusEl) {
        statusEl.textContent = msg;
        setTimeout(() => {
          statusEl.textContent = '';
        }, 2400);
      }
      announce(msg);
    });
  }

  /* -------------------------------------------------------------
     9. FAQ Accessible Accordions
     ------------------------------------------------------------- */
  for (const faqBtn of document.querySelectorAll('.faq-trigger')) {
    faqBtn.addEventListener('click', () => {
      const panelId = faqBtn.getAttribute('aria-controls');
      const panel = panelId ? document.getElementById(panelId) : null;
      if (!panel) return;
      const expanded = faqBtn.getAttribute('aria-expanded') === 'true';
      faqBtn.setAttribute('aria-expanded', String(!expanded));
      panel.hidden = expanded;
    });
  }
})();
