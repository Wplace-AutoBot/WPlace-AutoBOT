// ==UserScript==
// @name         WPlace Bot Manager
// @namespace    https://github.com/Wplace-AutoBot/WPlace-AutoBOT
// @version      1.0.0
// @description  Script launcher and manager for WPlace automation bots - Press Ctrl+Shift+M to open
// @author       Staninna
// @match        https://wplace.live/*
// @grant        none
// @run-at       document-end
// @updateURL    https://raw.githubusercontent.com/Wplace-AutoBot/WPlace-AutoBOT/refs/heads/main/wplace-bot-manager.user.js
// @downloadURL  https://raw.githubusercontent.com/Wplace-AutoBot/WPlace-AutoBOT/refs/heads/main/wplace-bot-manager.user.js
// ==/UserScript==

(function () {
    'use strict';

    const DEFAULT_URL =
        'https://raw.githubusercontent.com/Wplace-AutoBot/WPlace-AutoBOT/refs/heads/main/Auto-Image.js';
    const STORAGE_KEY = 'wplace-bot-scripts-v1';
    const BASE_URL_KEY = 'wplace-bot-base-url';
    const HOST_ID = 'wplace-bot-launcher-host';
    const TARGET_NAME_KEY = 'wplace-target-name';

    // Add hotkey to open manager (Ctrl+Shift+M)
    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'M') {
            e.preventDefault();
            loadManager();
        }
    });

    // Auto-load check
    const shouldAutoLoad =
        localStorage.getItem('wplace-auto-load-manager') === 'true';
    if (shouldAutoLoad) {
        localStorage.removeItem('wplace-auto-load-manager');
        loadManager();
    }

    function loadManager() {
        // If already open, close/toggle (unless auto-loading)
        const existing = document.getElementById(HOST_ID);
        if (existing && !shouldAutoLoad) {
            existing.remove();
            return;
        } else if (existing && shouldAutoLoad) {
            // Manager already open and we're auto-loading, keep it open
            return;
        }

        // Utilities
        const uid = () =>
            's_' +
            Date.now().toString(36) +
            '_' +
            Math.random().toString(36).slice(2, 8);

        const escapeJs = s =>
            String(s)
                .replace(/\\/g, '\\\\')
                .replace(/'/g, "\\'")
                .replace(/\r?\n/g, ' ');

        function safeParse(json, fallback) {
            try {
                const v = JSON.parse(json);
                return v ?? fallback;
            } catch {
                return fallback;
            }
        }

        function loadScripts() {
            const raw = localStorage.getItem(STORAGE_KEY);
            const arr = safeParse(raw, []);
            if (!Array.isArray(arr)) return [];
            return arr
                .filter(
                    x =>
                        x &&
                        typeof x === 'object' &&
                        typeof x.url === 'string' &&
                        typeof x.title === 'string'
                )
                .map(x => ({
                    id: String(x.id || uid()),
                    url: String(x.url),
                    title: String(x.title || 'Untitled'),
                    note: String(x.note || ''),
                    createdAt: Number(x.createdAt || Date.now()),
                    lastUsedAt: Number(x.lastUsedAt || 0),
                }));
        }

        function saveScripts(list) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        }

        function deriveBaseUrl(input) {
            try {
                const u = new URL(input, location.href);
                const path = u.pathname;
                const seg = path.split('/');
                if (
                    seg.length > 0 &&
                    seg[seg.length - 1] &&
                    seg[seg.length - 1].includes('.')
                ) {
                    seg.pop();
                }
                return (u.origin + seg.join('/')).replace(/\/+$/, '');
            } catch {
                const noHash = input.split('#')[0].split('?')[0];
                return noHash.replace(/\/[^/]*$/, '').replace(/\/+$/, '');
            }
        }

        // Build a javascript: URL that runs your blob-loader in target window
        function makeJsBlobLoaderUrl(scriptUrl, baseUrl) {
            const u = escapeJs(scriptUrl);
            const b = escapeJs(baseUrl || '');
            const snippet =
                "(async()=>{try{if('" +
                b +
                "'){try{localStorage.setItem('" +
                BASE_URL_KEY +
                "','" +
                b +
                "')}catch{}}const u='" +
                u +
                "';const t=await (await fetch(u,{cache:'no-store'})).text();" +
                "const o=URL.createObjectURL(new Blob([t],{type:'application/javascript'}));" +
                "var s=document.createElement('script');s.src=o;s.async=true;" +
                's.onload=()=>URL.revokeObjectURL(o);' +
                '(document.body||document.head||document.documentElement).appendChild(s);' +
                "}catch(e){alert('Failed to load script: '+(e&&e.message||e))}})();";
            return 'javascript:' + encodeURIComponent(snippet);
        }

        function ensureTargetName() {
            // Persist a stable window.name for this tab so popup can reacquire it
            let name = '';
            try {
                name = localStorage.getItem(TARGET_NAME_KEY) || '';
            } catch {}
            if (name && window.name === name) return name;

            if (!window.name || !/^wplace-target-/.test(window.name)) {
                name =
                    'wplace-target-' + Math.random().toString(36).slice(2, 8);
                try {
                    window.name = name;
                } catch {}
            } else {
                name = window.name;
            }
            try {
                localStorage.setItem(TARGET_NAME_KEY, name);
            } catch {}
            return name;
        }

        // State
        let scripts = loadScripts();
        let hasRunScript = false; // Track if a script has been executed

        if (!scripts.length) {
            scripts.push({
                id: uid(),
                url: DEFAULT_URL,
                title: 'WPlace Auto-Image',
                note: 'Fetches and runs Auto-Image.js from GitHub (trusted only).',
                createdAt: Date.now(),
                lastUsedAt: 0,
            });
            saveScripts(scripts);
        }

        // Host + Shadow (inline panel)
        const host = document.createElement('div');
        host.id = HOST_ID;
        host.style.position = 'fixed';
        host.style.top = '16px';
        host.style.right = '16px';
        host.style.zIndex = '2147483647';
        document.documentElement.appendChild(host);

        const shadow = host.attachShadow({ mode: 'open' });

        const style = document.createElement('style');
        style.textContent = `
        :host { all: initial; }
        * { box-sizing: border-box; }
        .panel {
          width: 460px;
          background: #101010;
          color: #eee;
          border: 1px solid #333;
          border-radius: 10px;
          box-shadow: 0 12px 30px rgba(0,0,0,.5);
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto,
            Arial, "Noto Sans", "Liberation Sans", sans-serif;
          overflow: hidden;
        }
        .header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          background: #1a1a1a;
          border-bottom: 1px solid #2a2a2a;
        }
        .title { font-weight: 600; font-size: 14px; }
        .spacer { flex: 1; }
        .icon-btn {
          background: transparent; color: #aaa; border: none;
          cursor: pointer; font-size: 16px; padding: 2px 6px;
        }
        .icon-btn:hover { color: #fff; }
        .body { padding: 10px 12px 12px 12px; }
        .actions { display: flex; gap: 8px; margin-bottom: 8px; flex-wrap: wrap; }
        .btn {
          background: #2b2b2b; color: #eee; border: 1px solid #3a3a3a;
          padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 12px;
        }
        .btn:hover { background: #343434; }
        .hotkey-hint { font-size: 11px; color: #aaa; margin-bottom: 8px; }
        .nav {
          display: grid;
          grid-template-columns: 1fr auto auto auto;
          gap: 6px;
          margin: 6px 0 10px;
        }
        .input, .textarea {
          width: 100%; background: #121212; color: #eaeaea;
          border: 1px solid #2a2a2a; border-radius: 6px;
          padding: 6px 8px; font-size: 13px;
        }
        .list {
          list-style: none; display: flex; flex-direction: column;
          gap: 8px; padding: 0; margin: 0 0 8px 0; max-height: 44vh; overflow: auto;
        }
        .item {
          display: grid;
          grid-template-columns: auto 1fr auto;
          grid-template-areas:
            "hk title actions"
            "hk note  actions";
          column-gap: 8px; row-gap: 2px; padding: 8px;
          border: 1px solid #2a2a2a; border-radius: 8px; background: #151515;
        }
        .hk {
          grid-area: hk; align-self: start; background: #2a2a2a; color: #fff;
          border-radius: 6px; font-weight: 700; font-size: 12px;
          min-width: 22px; text-align: center; padding: 2px 4px;
        }
        .titleBtn {
          grid-area: title; text-align: left; background: transparent; border: none;
          color: #e6e6e6; font-weight: 600; font-size: 13px; cursor: pointer; padding: 0;
        }
        .titleBtn:hover { text-decoration: underline; }
        .note { grid-area: note; font-size: 12px; color: #bdbdbd;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .actionsRow { grid-area: actions; display: flex; gap: 6px; align-items: start; }
        .small { font-size: 10px; color: #9aa; }
        details.add {
          border: 1px dashed #2d2d2d; border-radius: 8px; padding: 6px 8px;
        }
        details.add > summary { cursor: pointer; color: #cfd8ff; outline: none; list-style: none; }
        details.add[open] { background: #141414; }
        .form { display: grid; gap: 8px; margin-top: 6px; }
        .formRow { display: grid; gap: 6px; }
        .textarea { min-height: 60px; }
        footer {
          display: flex; justify-content: space-between; align-items: center;
          font-size: 11px; color: #9aa; border-top: 1px solid #222;
          padding: 8px 12px; background: #121212;
        }
        kbd {
          background: #222; border: 1px solid #333; border-bottom-color: #222;
          border-radius: 4px; padding: 1px 4px; font-size: 11px;
        }
        .toast {
          position: fixed; bottom: 16px; right: 16px; background: #0b8f44; color: #fff;
          padding: 8px 12px; border-radius: 8px; font-size: 12px;
          box-shadow: 0 6px 20px rgba(0,0,0,.35);
        }
        .danger { background: #b91c1c; }
      `;

        const wrap = document.createElement('div');
        wrap.innerHTML = `
        <div class="panel" role="dialog" aria-label="Script Launcher">
          <div class="header">
            <div class="title">WPlace Bot Manager</div>
            <div class="spacer"></div>
            <button class="icon-btn" id="exportBtn" title="Export">⤴</button>
            <button class="icon-btn" id="importBtn" title="Import">⤵</button>
            <button class="icon-btn" id="closeBtn" title="Close">×</button>
          </div>
          <div class="body">
            <div class="nav">
              <input class="input" id="navUrl" placeholder="https://example.com" />
              <button class="btn" id="navGo">Go</button>
              <button class="btn" id="navReload">Reload</button>
            </div>
            <div class="actions">
              <button class="btn" id="addOpenBtn">Add new</button>
              <span class="small">Press <kbd>1</kbd>–<kbd>9</kbd> or <kbd>0</kbd>
                to run | <kbd>Ctrl+Shift+M</kbd> to open/close</span>
            </div>
            <div class="hotkey-hint" id="hintText">
              Top 10 are hotkeyed. Click any item to run. ESC closes.
              <br><strong>Note:</strong> Click "Reload" button above after running script to run another (dev-mode bypasses this).
            </div>
            <ul class="list" id="list"></ul>
            <details class="add" id="addDetails">
              <summary id="addSummary">Add / Edit script</summary>
              <form class="form" id="form">
                <input type="hidden" id="editingId" />
                <div class="formRow">
                  <label>Title</label>
                  <input class="input" id="fTitle" required
                    placeholder="e.g. WPlace Auto-Image" />
                </div>
                <div class="formRow">
                  <label>URL</label>
                  <input class="input" id="fUrl" required
                    placeholder="https://example.com/script.js" />
                </div>
                <div class="formRow">
                  <label>Note (optional)</label>
                  <textarea class="textarea" id="fNote"
                    placeholder="What does this script do?"></textarea>
                </div>
                <div class="formActions" style="display:flex;gap:8px;justify-content:flex-end">
                  <button type="button" class="btn" id="cancelEditBtn">Cancel</button>
                  <button type="submit" class="btn" id="saveBtn">Save</button>
                  <button type="button" class="btn" id="saveRunBtn">Save & Run</button>
                </div>
              </form>
            </details>
          </div>
          <footer>
            <span>Userscript v1.0.0 | Stored in localStorage</span>
            <span class="small">Run trusted code only</span>
          </footer>
        </div>
      `;

        shadow.appendChild(style);
        shadow.appendChild(wrap);

        // Inline UI refs
        const listEl = shadow.getElementById('list');
        const addDetails = shadow.getElementById('addDetails');
        const addSummary = shadow.getElementById('addSummary');
        const fTitle = shadow.getElementById('fTitle');
        const fUrl = shadow.getElementById('fUrl');
        const fNote = shadow.getElementById('fNote');
        const editingIdInput = shadow.getElementById('editingId');
        const closeBtn = shadow.getElementById('closeBtn');
        const exportBtn = shadow.getElementById('exportBtn');
        const importBtn = shadow.getElementById('importBtn');
        const addOpenBtn = shadow.getElementById('addOpenBtn');
        const formEl = shadow.getElementById('form');
        const cancelEditBtn = shadow.getElementById('cancelEditBtn');
        const saveRunBtn = shadow.getElementById('saveRunBtn');
        const navUrlEl = shadow.getElementById('navUrl');
        const navGoBtn = shadow.getElementById('navGo');
        const navReloadBtn = shadow.getElementById('navReload');
        const hintTextEl = shadow.getElementById('hintText');

        function toast(msg, opts = {}) {
            const t = document.createElement('div');
            t.className = 'toast' + (opts.danger ? ' danger' : '');
            t.textContent = msg;
            shadow.appendChild(t);
            setTimeout(() => t.remove(), opts.ms || 1600);
        }

        function updateUIState() {
            const devMode = localStorage.getItem('dev-mode') === 'true';

            if (hasRunScript && !devMode) {
                // Script has been run and not in dev mode - show reload required state
                hintTextEl.innerHTML = `
                    <strong style="color: #ffa500;">⚠ Script executed!</strong>
                    <br>Click the <strong>"Reload"</strong> button above to run another script.
                `;
            } else if (hasRunScript && devMode) {
                // Script has been run but in dev mode - show dev mode state
                hintTextEl.innerHTML = `
                    <strong style="color: #8de48d;">✓ Dev Mode Active</strong>
                    <br>Scripts can be run multiple times without reload. ESC closes.
                    <br><small>Remove localStorage['dev-mode'] to restore normal behavior.</small>
                `;
            } else {
                // Initial state - no script run yet
                hintTextEl.innerHTML = `
                    Top 10 are hotkeyed. Click any item to run. ESC closes.
                    <br><strong>Note:</strong> Click "Reload" button above after running script to run another (dev-mode bypasses this).
                `;
            }
        }

        function sortedScripts() {
            return [...scripts].sort((a, b) => {
                const la = a.lastUsedAt || 0;
                const lb = b.lastUsedAt || 0;
                if (lb !== la) return lb - la;
                return (b.createdAt || 0) - (a.createdAt || 0);
            });
        }

        function resetForm() {
            editingIdInput.value = '';
            fTitle.value = '';
            fUrl.value = '';
            fNote.value = '';
            addSummary.textContent = 'Add / Edit script';
        }

        function openAdd(prefill) {
            if (prefill) {
                editingIdInput.value = prefill.id || '';
                fTitle.value = prefill.title || '';
                fUrl.value = prefill.url || '';
                fNote.value = prefill.note || '';
                addSummary.textContent = prefill.id
                    ? 'Edit script'
                    : 'Add script';
            } else {
                resetForm();
                fUrl.value = DEFAULT_URL;
                fTitle.value = 'WPlace Auto-Image';
            }
            addDetails.open = true;
            setTimeout(() => fTitle.focus(), 0);
        }

        function render() {
            const items = sortedScripts();
            listEl.innerHTML = '';

            if (!items.length) {
                const empty = document.createElement('div');
                empty.className = 'small';
                empty.style.padding = '6px';
                empty.textContent = 'No scripts yet. Add one below.';
                listEl.appendChild(empty);
                return;
            }

            const hotCap = 10;
            items.forEach((s, i) => {
                const li = document.createElement('li');
                li.className = 'item';
                li.dataset.id = s.id;

                const hk = document.createElement('div');
                hk.className = 'hk';
                hk.textContent =
                    i < hotCap ? (i === 9 ? '0' : String(i + 1)) : '•';

                const titleBtn = document.createElement('button');
                titleBtn.className = 'titleBtn';
                titleBtn.title = s.url;
                titleBtn.textContent = s.title || '(Untitled)';
                titleBtn.addEventListener('click', () => runScriptInline(s.id));

                const note = document.createElement('div');
                note.className = 'note';
                note.textContent = s.note || s.url;

                const actions = document.createElement('div');
                actions.className = 'actionsRow';

                const runB = document.createElement('button');
                runB.className = 'btn';
                runB.textContent = 'Run';
                runB.addEventListener('click', () => runScriptInline(s.id));

                const editB = document.createElement('button');
                editB.className = 'btn';
                editB.textContent = 'Edit';
                editB.addEventListener('click', () => openAdd(s));

                const delB = document.createElement('button');
                delB.className = 'btn';
                delB.textContent = 'Delete';
                delB.addEventListener('click', () => {
                    const ok = confirm(`Delete "${s.title}"?`);
                    if (!ok) return;
                    scripts = scripts.filter(x => x.id !== s.id);
                    saveScripts(scripts);
                    render();
                });

                actions.appendChild(runB);
                actions.appendChild(editB);
                actions.appendChild(delB);

                li.appendChild(hk);
                li.appendChild(titleBtn);
                li.appendChild(actions);
                li.appendChild(note);
                listEl.appendChild(li);
            });
        }

        // Inline runner (current page): fetch + blob + <script>
        async function runScriptInline(id) {
            const s = scripts.find(x => x.id === id);
            if (!s) return;

            // Check if dev-mode is enabled to bypass reload requirement
            const devMode = localStorage.getItem('dev-mode') === 'true';

            // Prevent multiple script execution without reload (unless dev-mode)
            if (hasRunScript && !devMode) {
                toast("Click 'Reload' button first to run another script", {
                    danger: true,
                    ms: 4000,
                });
                return;
            }

            const baseUrl = deriveBaseUrl(s.url);
            try {
                localStorage.setItem(BASE_URL_KEY, baseUrl);
            } catch {}

            try {
                const res = await fetch(s.url, { cache: 'no-store' });
                if (!res.ok)
                    throw new Error(`HTTP ${res.status} ${res.statusText}`);
                const code = await res.text();

                const blob = new Blob([code], {
                    type: 'application/javascript',
                });
                const blobUrl = URL.createObjectURL(blob);
                const scriptEl = document.createElement('script');
                scriptEl.src = blobUrl;
                scriptEl.async = true;

                scriptEl.addEventListener('load', () => {
                    URL.revokeObjectURL(blobUrl);
                    setTimeout(() => scriptEl.remove(), 0);
                    s.lastUsedAt = Date.now();
                    saveScripts(scripts);
                    render();
                    toast(`Ran: ${s.title}`);

                    // Mark that a script has been executed and update UI
                    hasRunScript = true;
                    updateUIState();

                    // Check if dev-mode is enabled to bypass reload requirement
                    const devMode = localStorage.getItem('dev-mode') === 'true';
                    if (!devMode) {
                        // Inform user that reload is needed for next script
                        setTimeout(() => {
                            toast('Reload page to run another script', {
                                ms: 5000,
                                danger: false,
                            });
                        }, 1500); // Show after initial success message
                    } else {
                        toast('Dev mode: Reload not required', { ms: 3000 });
                    }
                });

                scriptEl.addEventListener('error', ev => {
                    URL.revokeObjectURL(blobUrl);
                    const msg =
                        (ev && ev.message) ||
                        'Script failed to load or was blocked (CSP?).';
                    alert(`Failed to execute script via blob URL: ${msg}`);
                });

                (
                    document.body ||
                    document.head ||
                    document.documentElement
                ).appendChild(scriptEl);
            } catch (err) {
                alert(`Failed to load script: ${err.message || err}`);
            }
        }

        // Keyboard for inline panel
        function onKeyDown(e) {
            // Check if we're dealing with shadow DOM retargeting
            const actualTarget = e.composedPath
                ? e.composedPath()[0]
                : e.target;
            const actualTag = (
                (actualTarget && actualTarget.tagName) ||
                ''
            ).toUpperCase();

            // Always allow ESC to close
            if (e.key === 'Escape') {
                close();
                e.preventDefault();
                return;
            }

            // Don't trigger hotkeys when typing in input fields anywhere
            // Use actualTag to check the real target element
            if (
                actualTag === 'INPUT' ||
                actualTag === 'TEXTAREA' ||
                (actualTarget && actualTarget.isContentEditable)
            ) {
                return;
            }

            // Only handle numeric hotkeys when not in an input field
            if (e.key >= '0' && e.key <= '9') {
                const items = sortedScripts();
                const idx = e.key === '0' ? 9 : Number(e.key) - 1;
                if (idx >= 0 && idx < items.length && idx < 10) {
                    runScriptInline(items[idx].id);
                    e.preventDefault();
                }
            }
        }

        function close() {
            window.removeEventListener('keydown', onKeyDown, true);
            host.remove();
        }

        // Wire inline UI controls
        closeBtn.addEventListener('click', close);
        addOpenBtn.addEventListener('click', () => openAdd());
        cancelEditBtn.addEventListener('click', () => {
            resetForm();
            addDetails.open = false;
        });
        formEl.addEventListener('submit', e => {
            e.preventDefault();
            submitForm(false);
        });
        saveRunBtn.addEventListener('click', () => submitForm(true));
        navGoBtn.addEventListener('click', () => {
            const u = navUrlEl.value.trim();
            if (!u) return;
            try {
                window.location.assign(u);
            } catch (e) {
                alert('Navigation failed: ' + (e.message || e));
            }
        });
        navReloadBtn.addEventListener('click', () => {
            // Set flag to auto-load manager after reload
            localStorage.setItem('wplace-auto-load-manager', 'true');
            window.location.reload();
        });

        function submitForm(runAfter) {
            const id = editingIdInput.value.trim();
            const title = fTitle.value.trim();
            const url = fUrl.value.trim();
            const note = fNote.value.trim();

            if (!title || !url) {
                alert('Title and URL are required.');
                return;
            }
            try {
                new URL(url, location.href);
            } catch {
                alert('Please enter a valid URL.');
                return;
            }

            if (id) {
                const idx = scripts.findIndex(x => x.id === id);
                if (idx >= 0) {
                    scripts[idx] = { ...scripts[idx], title, url, note };
                }
            } else {
                scripts.push({
                    id: uid(),
                    title,
                    url,
                    note,
                    createdAt: Date.now(),
                    lastUsedAt: 0,
                });
            }
            saveScripts(scripts);
            render();
            if (runAfter) {
                const actualId = id || scripts[scripts.length - 1].id;
                runScriptInline(actualId);
            }
            resetForm();
            addDetails.open = false;
        }

        exportBtn.addEventListener('click', async () => {
            try {
                const data = JSON.stringify(scripts, null, 2);
                await navigator.clipboard.writeText(data);
                toast('Exported to clipboard');
            } catch {
                prompt('Copy your scripts JSON:', JSON.stringify(scripts));
            }
        });

        importBtn.addEventListener('click', () => {
            const txt = prompt(
                'Paste scripts JSON (array of {title,url,note,...}):',
                '[]'
            );
            if (!txt) return;
            const arr = safeParse(txt, null);
            if (!Array.isArray(arr)) {
                alert('Invalid JSON (expected an array).');
                return;
            }
            const mapped = arr
                .filter(x => x && typeof x.url === 'string')
                .map(x => ({
                    id: String(x.id || uid()),
                    url: String(x.url),
                    title: String(x.title || 'Untitled'),
                    note: String(x.note || ''),
                    createdAt: Number(x.createdAt || Date.now()),
                    lastUsedAt: Number(x.lastUsedAt || 0),
                }));
            if (!mapped.length) {
                alert('No valid items found.');
                return;
            }
            const merge = confirm(
                'Merge into existing list?\nOK = Merge\nCancel = Replace'
            );
            scripts = merge ? [...scripts, ...mapped] : mapped;
            saveScripts(scripts);
            render();
            toast('Import complete');
        });

        window.addEventListener('keydown', onKeyDown, true);
        render();
        updateUIState(); // Set initial UI state

        // Show welcome message for first-time users
        if (shouldAutoLoad) {
            toast('WPlace Bot Manager reloaded!', { ms: 2000 });
        } else {
            setTimeout(() => {
                toast('Press Ctrl+Shift+M to open/close manager', { ms: 3000 });
            }, 1000);
        }
    }
})();
