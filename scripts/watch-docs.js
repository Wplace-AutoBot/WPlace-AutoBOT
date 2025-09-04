#!/usr/bin/env node

/**
 * Documentation File Watcher (cross‑platform, low overhead)
 *
 * Strategy (best → fallback):
 *   1) Linux + inotifywait (if available): true recursive kernel watcher, very light
 *   2) chokidar (dev dep): robust recursive watcher across platforms
 *   3) fs.watch fallback: per-directory watchers with debounce
 *
 * Notes:
 * - Only reacts to .js, .css, .json changes under src/
 * - Debounced regeneration to avoid thrash on save/rename sequences
 */

import fs from 'fs';
import path from 'path';
import { spawn, spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { main as generateDocs } from './generate-docs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.join(__dirname, '..', 'src');
const EXT_FILTER = new Set(['.js', '.css', '.json']);

// Debounce timer for doc generation
let regenTimer = null;
function regenerateDocsDebounced(delay = 300) {
    if (regenTimer) clearTimeout(regenTimer);
    regenTimer = setTimeout(() => {
        console.log('\n🔄 Files changed, regenerating documentation...');
        try {
            generateDocs();
        } catch (error) {
            console.error('❌ Error generating docs:', error.message);
        }
    }, delay);
}

function isRelevant(filePath) {
    const ext = path.extname(filePath || '').toLowerCase();
    return EXT_FILTER.has(ext);
}

function hasBinary(bin) {
    try {
        const res = spawnSync('which', [bin], { stdio: 'ignore' });
        return res.status === 0;
    } catch {
        return false;
    }
}

/**
 * 1) Linux inotifywait watcher (preferred on Linux)
 *    Requires: inotifywait (inotify-tools)
 */
function startInotifyRecursive(dir) {
    if (process.platform !== 'linux') return null;
    if (!hasBinary('inotifywait')) return null;

    // Monitor recursive + relevant events, print: "<fullpath> <EVENTS>"
    const args = [
        '-m',
        '-r',
        '-e',
        'close_write,create,delete,move,modify',
        '--format',
        '%w%f %e',
        dir,
    ];
    const proc = spawn('inotifywait', args, {
        stdio: ['ignore', 'pipe', 'pipe'],
    });

    proc.stdout.setEncoding('utf8');
    proc.stdout.on('data', chunk => {
        const lines = chunk.split('\n').filter(Boolean);
        for (const line of lines) {
            // Example: /path/to/file.js CLOSE_WRITE,CLOSE
            const [fullPath] = line.split(' ');
            if (isRelevant(fullPath)) {
                const rel = path.relative(SRC_DIR, fullPath);
                console.log(`📝 inotify: ${rel}`);
                regenerateDocsDebounced();
            }
        }
    });

    proc.stderr.setEncoding('utf8');
    proc.stderr.on('data', data => {
        const msg = data.toString().trim();
        if (msg) console.warn('inotifywait:', msg);
    });

    proc.on('close', code => {
        console.warn(`⚠️  inotifywait exited with code ${code}`);
    });

    console.log(`👁️  Watching ${dir} via inotifywait (recursive)...`);
    return {
        close() {
            try {
                proc.kill();
            } catch {}
        },
    };
}

/**
 * 2) chokidar watcher (cross-platform, optional)
 *    Lazily imported to keep startup fast if not installed.
 */
async function startChokidarRecursive(dir) {
    try {
        const { default: chokidar } = await import('chokidar');

        const watcher = chokidar.watch(dir, {
            persistent: true,
            ignoreInitial: true,
            depth: Infinity,
            awaitWriteFinish: {
                stabilityThreshold: 200,
                pollInterval: 50,
            },
            // Ignore files we don't care about; keep dirs so recursion works
            ignored: p => {
                // Ignore dotfiles/directories like .git just in case
                const base = path.basename(p);
                if (base === '.git' || base === '.DS_Store') return true;

                // For files, only allow desired extensions
                const st = fs.existsSync(p) ? fs.statSync(p) : null;
                if (st && st.isDirectory()) return false;
                return !isRelevant(p);
            },
        });

        watcher.on('all', (event, changedPath) => {
            if (!isRelevant(changedPath)) return;
            const rel = path.relative(SRC_DIR, changedPath);
            console.log(`📝 ${event}: ${rel}`);
            regenerateDocsDebounced();
        });

        console.log(`👁️  Watching ${dir} via chokidar (recursive)...`);
        return {
            async close() {
                try {
                    await watcher.close();
                } catch {}
            },
        };
    } catch (e) {
        // chokidar not installed or failed to load
        return null;
    }
}

/**
 * 3) fs.watch fallback (non-recursive per-directory watchers)
 *    Keeps memory usage reasonable for small trees; debounced regeneration.
 */
const fallbackWatchers = new Map();

function walkDirsSync(root) {
    const out = [];
    const stack = [root];
    while (stack.length) {
        const d = stack.pop();
        out.push(d);
        let entries = [];
        try {
            entries = fs.readdirSync(d, { withFileTypes: true });
        } catch {
            continue;
        }
        for (const ent of entries) {
            if (ent.isDirectory()) stack.push(path.join(d, ent.name));
        }
    }
    return out;
}

function statSafe(p) {
    try {
        return fs.statSync(p);
    } catch {
        return null;
    }
}

function ensureFallbackTree(dir) {
    const dirs = walkDirsSync(dir);
    for (const d of dirs) {
        if (fallbackWatchers.has(d)) continue;
        const w = fs.watch(d, (eventType, filename) => {
            if (!filename) return;
            const full = path.join(d, filename);
            const st = statSafe(full);
            if (st && st.isDirectory() && eventType === 'rename') {
                // New dir appeared; ensure it is watched
                ensureFallbackTree(full);
            }
            if (isRelevant(full)) {
                const rel = path.relative(SRC_DIR, full);
                console.log(`📝 ${eventType}: ${rel}`);
                regenerateDocsDebounced();
            }
        });
        fallbackWatchers.set(d, w);
    }
    // Prune watchers that no longer exist
    for (const [watchedDir, watcher] of fallbackWatchers.entries()) {
        const st = statSafe(watchedDir);
        if (!st || !st.isDirectory()) {
            try {
                watcher.close();
            } catch {}
            fallbackWatchers.delete(watchedDir);
        }
    }
}

function startFsWatchFallback(dir) {
    ensureFallbackTree(dir);
    console.log(`👁️  Watching ${dir} (non-recursive fs.watch fallback)...`);
    return {
        close() {
            for (const [, w] of fallbackWatchers) {
                try {
                    w.close();
                } catch {}
            }
            fallbackWatchers.clear();
        },
    };
}

/**
 * Main execution
 */
async function main() {
    console.log('🚀 Starting documentation file watcher...');
    console.log(`Source: ${SRC_DIR}`);
    console.log('Press Ctrl+C to stop\n');

    // Initial generation
    try {
        generateDocs();
        console.log('✅ Initial documentation generated.');
    } catch (error) {
        console.error('❌ Initial doc generation failed:', error.message);
    }

    // Preferred strategies
    let controller =
        startInotifyRecursive(SRC_DIR) ||
        (await startChokidarRecursive(SRC_DIR)) ||
        startFsWatchFallback(SRC_DIR);

    if (!controller) {
        console.error('❌ Failed to start file watcher');
        process.exit(1);
    }

    // Graceful shutdown
    process.on('SIGINT', async () => {
        console.log('\n🛑 Stopping file watcher...');
        try {
            await controller.close();
        } catch {}
        process.exit(0);
    });

    // Keep process alive for non-TTY contexts
    process.stdin.resume();
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { main };
