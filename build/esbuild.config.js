import esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';

// Plugin to embed CSS files as template literals
const cssEmbedPlugin = {
    name: 'css-embed',
    setup(build) {
        build.onResolve({ filter: /\.css$/ }, args => {
            return {
                path: path.resolve(args.resolveDir, args.path),
                namespace: 'css-embed',
            };
        });

        build.onLoad({ filter: /.*/, namespace: 'css-embed' }, args => {
            const css = fs.readFileSync(args.path, 'utf8');
            // Escape backticks and ${} for template literal safety
            const escapedCss = css
                .replace(/\\/g, '\\\\')
                .replace(/`/g, '\\`')
                .replace(/\$\{/g, '\\${');

            return {
                contents: `export default \`${escapedCss}\`;`,
                loader: 'js',
            };
        });
    },
};

// Plugin to embed JSON files as JavaScript objects
const jsonEmbedPlugin = {
    name: 'json-embed',
    setup(build) {
        build.onResolve({ filter: /\.json$/ }, args => {
            // Only embed local JSON files, not node_modules
            if (!args.path.startsWith('.')) return;

            return {
                path: path.resolve(args.resolveDir, args.path),
                namespace: 'json-embed',
            };
        });

        build.onLoad({ filter: /.*/, namespace: 'json-embed' }, args => {
            const json = fs.readFileSync(args.path, 'utf8');
            return {
                contents: `export default ${json};`,
                loader: 'js',
            };
        });
    },
};

// Get all theme CSS files and create embeddings
function getEmbeddedThemes() {
    const themesDir = path.resolve('./src/themes');
    const themeFiles = fs
        .readdirSync(themesDir)
        .filter(f => f.endsWith('.css'));

    const themes = {};
    themeFiles.forEach(file => {
        const name = path.basename(file, '.css');
        const css = fs.readFileSync(path.join(themesDir, file), 'utf8');
        const escapedCss = css
            .replace(/\\/g, '\\\\')
            .replace(/`/g, '\\`')
            .replace(/\$\{/g, '\\${');
        themes[name] = escapedCss;
    });

    return themes;
}

// Get all language JSON files and create embeddings
function getEmbeddedLanguages() {
    const langDir = path.resolve('./src/lang');
    const langFiles = fs.readdirSync(langDir).filter(f => f.endsWith('.json'));

    const languages = {};
    langFiles.forEach(file => {
        const name = path.basename(file, '.json');
        const json = JSON.parse(
            fs.readFileSync(path.join(langDir, file), 'utf8')
        );
        languages[name] = json;
    });

    return languages;
}

// Plugin to inject embedded assets
const assetInjectPlugin = {
    name: 'asset-inject',
    setup(build) {
        build.onResolve({ filter: /^embedded-assets$/ }, () => ({
            path: 'embedded-assets',
            namespace: 'asset-inject',
        }));

        build.onLoad({ filter: /.*/, namespace: 'asset-inject' }, () => {
            const themes = getEmbeddedThemes();
            const languages = getEmbeddedLanguages();
            const mainCss = fs
                .readFileSync('./src/auto-image-styles.css', 'utf8')
                .replace(/\\/g, '\\\\')
                .replace(/`/g, '\\`')
                .replace(/\$\{/g, '\\${');

            return {
                contents: `
          export const EMBEDDED_CSS = \`${mainCss}\`;
          export const EMBEDDED_THEMES = ${JSON.stringify(themes, null, 2)};
          export const EMBEDDED_LANGUAGES = ${JSON.stringify(languages, null, 2)};
        `,
                loader: 'js',
            };
        });
    },
};

// Generate userscript header
function getUserscriptHeader() {
    return `// ==UserScript==
// @name         WPlace Auto-Image
// @namespace    https://github.com/Wplace-AutoBot/WPlace-AutoBOT
// @version      1.0.0
// @description  Automated image painting for WPlace
// @author       WPlace AutoBot Team
// @match        https://wplace.live/*
// @grant        none
// @license      MIT
// @homepageURL  https://github.com/Wplace-AutoBot/WPlace-AutoBOT
// @supportURL   https://github.com/Wplace-AutoBot/WPlace-AutoBOT/issues
// ==/UserScript==

`;
}

// Build configuration
const baseConfig = {
    entryPoints: ['./src/Auto-Image.js'],
    bundle: true,
    target: ['chrome89', 'firefox88', 'safari14'],
    format: 'iife',
    plugins: [cssEmbedPlugin, jsonEmbedPlugin, assetInjectPlugin],
    define: {
        'process.env.NODE_ENV': '"production"',
    },
};

// Build targets
const targets = {
    standalone: {
        ...baseConfig,
        outfile: './dist/auto-image.standalone.js',
        minify: false,
        sourcemap: false,
    },

    userscript: {
        ...baseConfig,
        outfile: './dist/auto-image.userscript.js',
        minify: true,
        sourcemap: false,
        banner: {
            js: getUserscriptHeader(),
        },
    },

    bookmarklet: {
        ...baseConfig,
        outfile: './dist/auto-image.bookmarklet.js',
        minify: true,
        sourcemap: false,
        globalName: 'WPlaceAutoBot',
    },
};

// Main build function
async function build(targetName = 'all') {
    console.log('🔨 Building WPlace AutoBot...');

    if (targetName === 'all') {
        for (const [name, config] of Object.entries(targets)) {
            console.log(`📦 Building ${name}...`);
            await esbuild.build(config);
        }

        // Create bookmarklet file with javascript: prefix
        const bookmarkletContent = fs.readFileSync(
            './dist/auto-image.bookmarklet.js',
            'utf8'
        );
        const bookmarkletWrapped = `javascript:(function(){${bookmarkletContent}})();`;
        fs.writeFileSync(
            './dist/auto-image.bookmarklet.txt',
            bookmarkletWrapped
        );
    } else if (targets[targetName]) {
        console.log(`📦 Building ${targetName}...`);
        await esbuild.build(targets[targetName]);

        if (targetName === 'bookmarklet') {
            const bookmarkletContent = fs.readFileSync(
                './dist/auto-image.bookmarklet.js',
                'utf8'
            );
            const bookmarkletWrapped = `javascript:(function(){${bookmarkletContent}})();`;
            fs.writeFileSync(
                './dist/auto-image.bookmarklet.txt',
                bookmarkletWrapped
            );
        }
    } else {
        console.error('❌ Unknown target:', targetName);
        process.exit(1);
    }

    console.log('✅ Build complete!');
}

// Parse command line arguments
const args = process.argv.slice(2);
const targetArg = args.find(arg => arg.startsWith('--target='));
const target = targetArg ? targetArg.split('=')[1] : 'all';

build(target).catch(err => {
    console.error('❌ Build failed:', err);
    process.exit(1);
});
