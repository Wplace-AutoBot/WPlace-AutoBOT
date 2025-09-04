#!/usr/bin/env node

/**
 * Automated Documentation Generator (enhanced)
 * - Mirrors src/ into docs/src with richer, more useful documentation
 * - Extracts classes, methods, key objects (CONFIG, Utils, state, etc.)
 * - Summarizes functions and builds a lightweight i18n usage report
 * - Improves CSS docs with @keyframes extraction
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.join(__dirname, '..', 'src');
const DOCS_SRC_DIR = path.join(__dirname, '..', 'docs', 'src');

// Helper: safe read file
function readFileSafe(p) {
    try {
        return fs.readFileSync(p, 'utf8');
    } catch (e) {
        return null;
    }
}

// Helper: pretty-print a list with optional cap
function formatList(items, cap = 30, bullet = '-') {
    if (!items || items.length === 0) return '*None*';
    const trimmed = items.slice(0, cap);
    const extra =
        items.length > cap
            ? `\n… (${items.length - cap} more omitted for brevity)`
            : '';
    return trimmed.map(i => `${bullet} ${i}`).join('\n') + extra;
}

// Helper: JSON loader with fallback
function readJSONSafe(p) {
    try {
        return JSON.parse(fs.readFileSync(p, 'utf8'));
    } catch {
        return null;
    }
}

/**
 * Extract richer information from JS modules without heavy parsing deps.
 * This favors signal over perfection, tuned to this repo (large IIFE in Auto-Image.js).
 */

// Balanced brace finder for object literal spans: returns end index of matching }
function findBalancedEnd(str, startIndex) {
    let depth = 0;
    for (let i = startIndex; i < str.length; i++) {
        const ch = str[i];
        if (ch === '{') depth++;
        else if (ch === '}') {
            depth--;
            if (depth === 0) return i;
        }
    }
    return -1;
}

function extractJSClasses(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const classRegex = /class\s+([A-Za-z_]\w*)\s*{([\s\S]*?)}/g;
        const classes = [];
        let m;
        while ((m = classRegex.exec(content)) !== null) {
            const name = m[1];
            const body = m[2] || '';
            const methods = new Set();
            const methodRegex =
                /(?:^|\n)\s*(?:async\s+)?([A-Za-z_]\w*)\s*\(/g;
            let mm;
            while ((mm = methodRegex.exec(body)) !== null) {
                const method = mm[1];
                if (method !== 'constructor') methods.add(method);
            }
            classes.push({
                name,
                methods: Array.from(methods).sort(),
            });
        }
        if (classes.length === 0) return '*No classes found*';

        const lines = [];
        for (const c of classes) {
            lines.push(`### class ${c.name}`);
            lines.push(
                c.methods.length
                    ? formatList(
                        c.methods.map(n => `.${n}()`),
                        50
                    )
                    : '*No methods detected*'
            );
            lines.push('');
        }
        return lines.join('\n');
    } catch (e) {
        return `*Error reading file: ${e.message}*`;
    }
}

function extractJSObjects(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');

        // Detect large object literals assigned to const NAME = {
        // This captures prominent objects like CONFIG, Utils, state, etc.
        const objRegex = /const\s+([A-Za-z_]\w*)\s*=\s*{/g;
        const objects = [];
        let m;
        while ((m = objRegex.exec(content)) !== null) {
            const name = m[1];
            const start = m.index + m[0].length - 1; // position at '{'
            const end = findBalancedEnd(content, start);
            if (end > start) {
                const body = content.substring(start + 1, end);
                // First-level property names (best-effort)
                const propRegex = /^\s*([A-Za-z_]\w*)\s*:/gm;
                const props = new Set();
                let pm;
                while ((pm = propRegex.exec(body)) !== null) {
                    props.add(pm[1]);
                }

                // Heuristic: only include sizeable objects (signal > noise)
                if (body.length >= 200 || props.size >= 5) {
                    objects.push({
                        name,
                        propCount: props.size,
                        props: Array.from(props).sort(),
                    });
                }
            }
        }
        if (objects.length === 0) return '*No key objects found*';

        const lines = [];
        for (const o of objects) {
            lines.push(`### ${o.name} (object)`);
            lines.push(`Properties detected: ${o.propCount}`);
            if (o.propCount > 0) {
                lines.push(formatList(o.props, 60));
            }
            lines.push('');
        }
        return lines.join('\n');
    } catch (e) {
        return `*Error reading file: ${e.message}*`;
    }
}

function extractJSFunctions(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const names = new Set();

        // function declarations
        const decl = /(?:^|\n)\s*(?:export\s+)?(?:async\s+)?function\s+([A-Za-z_]\w*)\s*\(/g;
        let m;
        while ((m = decl.exec(content)) !== null) names.add(m[1]);

        // const foo = (...) => or const foo = async (...) =>
        const arrows =
            /(?:^|\n)\s*const\s+([A-Za-z_]\w*)\s*=\s*(?:async\s*)?\([\s\S]*?\)\s*=>/g;
        while ((m = arrows.exec(content)) !== null) names.add(m[1]);

        if (names.size === 0) return '*No functions detected*';

        // Highlight a few common "flow" anchors if present
        const anchors = [
            'processImage',
            'flushPixelBatch',
            'sendPixelBatch',
            'sendBatchWithRetry',
            'generateCoordinates',
            'ensureToken',
            'handleCaptcha',
            'handleCaptchaFallback',
            'initializeTokenGenerator',
            'createUI',
        ];
        const present = anchors.filter(a => names.has(a));

        const lines = [];
        if (present.length) {
            lines.push('#### Flow anchors detected');
            lines.push(formatList(present.map(n => `\`${n}()\``), 100));
            lines.push('');
        }
        lines.push('#### All detected functions');
        lines.push(formatList(Array.from(names).sort().map(n => `\`${n}()\``), 120));
        return lines.join('\n');
    } catch (e) {
        return `*Error reading file: ${e.message}*`;
    }
}

function extractI18nReport(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');

        // Collect used keys via Utils.t('key', ...) calls
        const used = new Set();
        const tCall = /Utils\.t\(\s*['"]([^'"]+)['"]/g;
        let m;
        while ((m = tCall.exec(content)) !== null) used.add(m[1]);

        // Load English base as authoritative set
        const enPath = path.join(SRC_DIR, 'lang', 'en.json');
        const en = readJSONSafe(enPath) || {};
        const enKeys = new Set(Object.keys(en));

        const missing = [];
        for (const key of used) {
            if (!enKeys.has(key)) missing.push(key);
        }

        // Optionally: compute used-but-not-in-English only
        const lines = [];
        lines.push(`- Keys referenced via Utils.t(): ${used.size}`);
        lines.push(`- Keys present in en.json: ${Object.keys(en).length}`);
        if (missing.length) {
            lines.push(`- Missing in en.json (${missing.length}):`);
            lines.push(formatList(missing.sort().map(k => `\`${k}\``), 80));
        } else {
            lines.push('- Missing in en.json: 0 ✅');
        }
        return lines.join('\n');
    } catch (e) {
        return `*Error building i18n report: ${e.message}*`;
    }
}

/**
 * Existing basic extractors (kept and improved where helpful)
 */

// Extract JSDoc functions (kept as-is, supplements richer detection)
function extractJSDocFunctions(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const functions = [];

        const jsdocFunctionRegex =
            /\/\*\*[\s\S]*?\*\/\s*(?:export\s+)?(?:async\s+)?(?:function\s+(\w+)|const\s+(\w+)\s*=|let\s+(\w+)\s*=|var\s+(\w+)\s*=)/g;

        let match;
        while ((match = jsdocFunctionRegex.exec(content)) !== null) {
            const functionName = match[1] || match[2] || match[3] || match[4];
            if (functionName) {
                functions.push(`### \`${functionName}()\``);

                const jsdocStart = match.index;
                const jsdocEnd = match.index + match[0].indexOf('*/') + 2;
                const jsdocComment = content.substring(jsdocStart, jsdocEnd);

                const description = extractJSDocDescription(jsdocComment);
                const params = extractJSDocParams(jsdocComment);
                const returns = extractJSDocReturns(jsdocComment);

                if (description) functions.push(description);
                if (params.length > 0) {
                    functions.push('**Parameters:**');
                    params.forEach(param => functions.push(`- ${param}`));
                }
                if (returns) functions.push(`**Returns:** ${returns}`);
                functions.push('');
            }
        }

        return functions.length > 0
            ? functions.join('\n')
            : '*No documented functions found*';
    } catch (error) {
        return `*Error reading file: ${error.message}*`;
    }
}

function extractJSDocDescription(jsdoc) {
    const descMatch = jsdoc.match(/\/\*\*\s*\n\s*\*\s*(.+?)\s*\n/);
    return descMatch ? descMatch[1] : null;
}

function extractJSDocParams(jsdoc) {
    const paramRegex = /@param\s+\{([^}]+)\}\s+(\w+)\s*-?\s*(.+)/g;
    const params = [];
    let match;

    while ((match = paramRegex.exec(jsdoc)) !== null) {
        params.push(`\`${match[2]}\` (\`${match[1]}\`) - ${match[3]}`);
    }

    return params;
}

function extractJSDocReturns(jsdoc) {
    const returnMatch = jsdoc.match(/@returns?\s+\{([^}]+)\}\s*(.+)/);
    return returnMatch ? `\`${returnMatch[1]}\` - ${returnMatch[2]}` : null;
}

// Improved CSS component extractor remains similar
function extractCSSComponents(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const components = [];

        const classRegex =
            /\.([a-zA-Z][a-zA-Z0-9_-]*(?:-[a-zA-Z0-9_-]*)*)/g;
        const classes = new Set();

        let match;
        while ((match = classRegex.exec(content)) !== null) {
            classes.add(match[1]);
        }

        const sortedClasses = Array.from(classes).sort();
        const componentGroups = new Map();

        sortedClasses.forEach(className => {
            const baseComponent = className.split('-')[0] || 'other';
            if (!componentGroups.has(baseComponent)) {
                componentGroups.set(baseComponent, []);
            }
            componentGroups.get(baseComponent).push(className);
        });

        for (const [component, classNames] of componentGroups) {
            components.push(`### ${component} Components`);
            classNames.forEach(className => {
                components.push(`- \`.${className}\``);
            });
            components.push('');
        }

        return components.length > 0
            ? components.join('\n')
            : '*No CSS classes found*';
    } catch (error) {
        return `*Error reading file: ${error.message}*`;
    }
}

function extractCSSVariables(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const variables = [];

        const varRegex = /--([a-zA-Z][a-zA-Z0-9_-]*)/g;
        const vars = new Set();

        let match;
        while ((match = varRegex.exec(content)) !== null) {
            vars.add(match[1]);
        }

        const sortedVars = Array.from(vars).sort();
        const varGroups = new Map();

        sortedVars.forEach(varName => {
            let category = 'other';
            if (
                varName.includes('primary') ||
                varName.includes('secondary') ||
                varName.includes('accent') ||
                varName.includes('text') ||
                varName.includes('highlight')
            ) {
                category = 'colors';
            } else if (
                varName.includes('radius') ||
                varName.includes('border') ||
                varName.includes('shadow') ||
                varName.includes('backdrop')
            ) {
                category = 'layout';
            } else if (varName.includes('font') || varName.includes('size')) {
                category = 'typography';
            } else if (varName.includes('z-')) {
                category = 'z-index';
            } else if (varName.includes('icon')) {
                category = 'icons';
            }

            if (!varGroups.has(category)) {
                varGroups.set(category, []);
            }
            varGroups.get(category).push(varName);
        });

        for (const [category, varNames] of varGroups) {
            variables.push(
                `#### ${category.charAt(0).toUpperCase() + category.slice(1)}`
            );
            varNames.forEach(varName => {
                variables.push(`- \`--${varName}\``);
            });
            variables.push('');
        }

        return variables.length > 0
            ? variables.join('\n')
            : '*No CSS custom properties found*';
    } catch (error) {
        return `*Error reading file: ${error.message}*`;
    }
}

function extractMediaQueries(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const queries = [];

        const mediaRegex = /@media\s+([^{]+)/g;
        let match;

        while ((match = mediaRegex.exec(content)) !== null) {
            queries.push(`- \`@media ${match[1].trim()}\``);
        }

        return queries.length > 0
            ? queries.join('\n')
            : '*No media queries found*';
    } catch (error) {
        return `*Error reading file: ${error.message}*`;
    }
}

function extractKeyframes(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const frames = [];
        const re = /@keyframes\s+([A-Za-z_][\w-]*)/g;
        let m;
        while ((m = re.exec(content)) !== null) frames.push(m[1]);
        if (frames.length === 0) return '*No keyframes found*';
        return formatList(frames.sort().map(n => `- \`@keyframes ${n}\``), 80);
    } catch (e) {
        return `*Error reading file: ${e.message}*`;
    }
}

function extractJSONStructure(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(content);

        function formatObject(obj, indent = 0) {
            const spaces = '  '.repeat(indent);
            const result = [];

            if (Array.isArray(obj)) {
                result.push(`${spaces}- Array with ${obj.length} items`);
                if (obj.length > 0) {
                    result.push(formatObject(obj[0], indent + 1));
                }
            } else if (typeof obj === 'object' && obj !== null) {
                Object.keys(obj).forEach(key => {
                    const value = obj[key];
                    const type = Array.isArray(value) ? 'Array' : typeof value;
                    result.push(`${spaces}- \`${key}\` (${type})`);

                    if (typeof value === 'object' && value !== null) {
                        result.push(formatObject(value, indent + 1));
                    }
                });
            }

            return result.join('\n');
        }

        return `\`\`\`\n${formatObject(data)}\n\`\`\``;
    } catch (error) {
        return `*Error parsing JSON: ${error.message}*`;
    }
}

function getRelatedFiles(filePath) {
    const dir = path.dirname(filePath);
    const related = [];

    try {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            if (file !== path.basename(filePath)) {
                const ext = path.extname(file);
                if (['.js', '.css', '.json'].includes(ext)) {
                    const relativePath = path.relative(
                        SRC_DIR,
                        path.join(dir, file)
                    );
                    const docPath = relativePath + '.md';
                    related.push(`- [\`${relativePath}\`](${docPath})`);
                }
            }
        });
    } catch (error) {
        // Ignore directory read errors
    }

    return related.length > 0 ? related.join('\n') : '*No related files found*';
}

/**
 * Documentation templates
 * JS template now includes class/object/function analysis and i18n report.
 */
const TEMPLATES = {
    '.js': (filePath, fileName) => {
        const rel = path.relative(SRC_DIR, filePath);
        const content = readFileSafe(filePath) || '';
        const sizeKB = (content.length / 1024).toFixed(1);

        const classInfo = extractJSClasses(filePath);
        const objectInfo = extractJSObjects(filePath);
        const functionInfo = extractJSFunctions(filePath);
        const jsdocInfo = extractJSDocFunctions(filePath);
        const i18nInfo = extractI18nReport(filePath);

        return `# ${fileName} Documentation

> JavaScript module: \`src/${rel}\` • ~${sizeKB} KB

## Overview

This module is auto-documented. The extractor lists classes, key objects, and functions it can detect.
If you want richer docs for specific APIs, add JSDoc blocks (\`/** ... *\/\`) above declarations — those will be included under "JSDoc".

### Quick stats
- Lines: ${content.split('\n').length}
- Characters: ${content.length}

## Classes
${classInfo}

## Key Objects
${objectInfo}

## Functions (detected)
${functionInfo}

## JSDoc (if present)
${jsdocInfo}

## i18n usage report (Utils.t)
${i18nInfo}

## Related Files

${getRelatedFiles(filePath)}

---

*Auto-generated documentation — Last updated: ${new Date().toISOString()}*
`;
    },

    '.css': (filePath, fileName) => {
        return `# ${fileName} Documentation

> Stylesheet: \`src/${path.relative(SRC_DIR, filePath)}\`

## Overview

This documentation summarizes classes, CSS variables, media queries, and keyframes found in the stylesheet.

## CSS Components

${extractCSSComponents(filePath)}

## CSS Custom Properties

${extractCSSVariables(filePath)}

## Media Queries

${extractMediaQueries(filePath)}

## Keyframes

${extractKeyframes(filePath)}

---

*Auto-generated documentation — Last updated: ${new Date().toISOString()}*
`;
    },

    '.json': (filePath, fileName) => `# ${fileName} Documentation

> Data file: \`src/${path.relative(SRC_DIR, filePath)}\`

## Overview

This documentation summarizes structure of the JSON payload to help discover keys quickly.

## Structure

${extractJSONStructure(filePath)}

---

*Auto-generated documentation — Last updated: ${new Date().toISOString()}*
`,
};

/**
 * Recursively process directory structure
 */
function processDirectory(srcDir, docsDir) {
    if (!fs.existsSync(docsDir)) {
        fs.mkdirSync(docsDir, { recursive: true });
    }

    const items = fs.readdirSync(srcDir);

    items.forEach(item => {
        const srcPath = path.join(srcDir, item);
        const stats = fs.statSync(srcPath);

        if (stats.isDirectory()) {
            const docsSubDir = path.join(docsDir, item);
            processDirectory(srcPath, docsSubDir);
        } else if (stats.isFile()) {
            const ext = path.extname(item);
            const baseName = path.basename(item, ext);
            const docFileName = baseName + ext + '.md';
            const docPath = path.join(docsDir, docFileName);

            if (TEMPLATES[ext]) {
                const content = TEMPLATES[ext](srcPath, item);
                fs.writeFileSync(docPath, content);
                console.log(`Generated: ${path.relative(process.cwd(), docPath)}`);
            }
        }
    });
}

/**
 * Clean up orphaned documentation files
 */
function cleanOrphanedDocs(srcDir, docsDir) {
    if (!fs.existsSync(docsDir)) return;

    const docItems = fs.readdirSync(docsDir);

    docItems.forEach(item => {
        const docPath = path.join(docsDir, item);
        const stats = fs.statSync(docPath);

        if (stats.isDirectory()) {
            const srcSubDir = path.join(srcDir, item);
            if (fs.existsSync(srcSubDir)) {
                cleanOrphanedDocs(srcSubDir, docPath);
            } else {
                fs.rmSync(docPath, { recursive: true });
                console.log(
                    `Removed orphaned directory: ${path.relative(
                        process.cwd(),
                        docPath
                    )}`
                );
            }
        } else if (item.endsWith('.md')) {
            // Handle new naming convention: baseName.originalExt.md
            const withoutMd = path.basename(item, '.md');
            const lastDotIndex = withoutMd.lastIndexOf('.');
            
            let hasSource = false;
            
            if (lastDotIndex === -1) {
                // Old naming convention: baseName.md
                const baseName = withoutMd;
                const possibleExts = ['.js', '.css', '.json'];
                hasSource = possibleExts.some(ext => {
                    return fs.existsSync(path.join(srcDir, baseName + ext));
                });
            } else {
                // New naming convention: baseName.ext.md
                const originalExt = withoutMd.substring(lastDotIndex);
                const baseName = withoutMd.substring(0, lastDotIndex);
                hasSource = fs.existsSync(path.join(srcDir, baseName + originalExt));
            }

            if (!hasSource) {
                fs.unlinkSync(docPath);
                console.log(
                    `Removed orphaned doc: ${path.relative(
                        process.cwd(),
                        docPath
                    )}`
                );
            }
        }
    });
}

/**
 * Main execution
 */
function main() {
    console.log('🚀 Generating documentation structure...');
    console.log(`Source: ${SRC_DIR}`);
    console.log(`Docs:   ${DOCS_SRC_DIR}`);
    console.log();

    cleanOrphanedDocs(SRC_DIR, DOCS_SRC_DIR);
    processDirectory(SRC_DIR, DOCS_SRC_DIR);

    console.log();
    console.log('✅ Documentation generation complete!');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { main, processDirectory, cleanOrphanedDocs };