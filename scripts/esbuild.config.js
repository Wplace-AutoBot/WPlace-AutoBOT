import esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

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

// Plugin to replace build info placeholders
const buildInfoPlugin = buildTarget => ({
    name: 'build-info',
    setup(build) {
        build.onLoad({ filter: /Auto-Image\.js$/ }, async args => {
            let contents = fs.readFileSync(args.path, 'utf8');

            // Get build date
            const buildDate = new Date()
                .toISOString()
                .replace('T', ' ')
                .substring(0, 19);

            // Get commit hash
            let commitHash = 'unknown';
            try {
                commitHash = execSync('git rev-parse --short HEAD', {
                    encoding: 'utf8',
                }).trim();
            } catch (error) {
                console.warn('Could not get git commit hash:', error.message);
            }

            // Get branch name
            let branchName = 'unknown';
            try {
                branchName = execSync('git rev-parse --abbrev-ref HEAD', {
                    encoding: 'utf8',
                }).trim();
            } catch (error) {
                console.warn('Could not get git branch name:', error.message);
            }

            // Get git status (clean/dirty)
            let gitStatus = 'clean';
            let gitStatusColor = '#28a745'; // green
            try {
                const statusOutput = execSync('git status --porcelain', {
                    encoding: 'utf8',
                });
                if (statusOutput.trim().length > 0) {
                    gitStatus = 'dirty';
                    gitStatusColor = '#dc3545'; // red
                }
            } catch (error) {
                gitStatus = 'unknown';
                gitStatusColor = '#6c757d'; // gray
            }

            // Get last commit message
            let lastCommitMessage = 'unknown';
            try {
                lastCommitMessage = execSync('git log -1 --pretty=%s', {
                    encoding: 'utf8',
                }).trim();
                // Escape backticks for template literal safety
                lastCommitMessage = lastCommitMessage.replace(/`/g, '\\`');
                // Truncate long commit messages
                if (lastCommitMessage.length > 50) {
                    lastCommitMessage =
                        lastCommitMessage.substring(0, 47) + '...';
                }
            } catch (error) {
                console.warn(
                    'Could not get last commit message:',
                    error.message
                );
            }

            // Get environment
            const environment = process.env.NODE_ENV || 'development';
            const envColor =
                environment === 'production' ? '#28a745' : '#fd7e14'; // green for prod, orange for dev

            // Get Node.js version
            const nodeVersion = process.version;

            // Replace placeholders
            contents = contents
                .replace(/__BUILD_DATE__/g, buildDate)
                .replace(/__COMMIT_HASH__/g, commitHash)
                .replace(/__BRANCH_NAME__/g, branchName)
                .replace(/__BUILD_TARGET__/g, buildTarget)
                .replace(/__GIT_STATUS__/g, gitStatus)
                .replace(/__GIT_STATUS_COLOR__/g, gitStatusColor)
                .replace(/__LAST_COMMIT_MESSAGE__/g, lastCommitMessage)
                .replace(/__ENVIRONMENT__/g, environment)
                .replace(/__ENVIRONMENT_COLOR__/g, envColor)
                .replace(/__NODE_VERSION__/g, nodeVersion);

            return {
                contents,
                loader: 'js',
            };
        });
    },
});

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
    plugins: [
        buildInfoPlugin,
        cssEmbedPlugin,
        jsonEmbedPlugin,
        assetInjectPlugin,
    ],
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
        plugins: [
            buildInfoPlugin('standalone'),
            cssEmbedPlugin,
            jsonEmbedPlugin,
            assetInjectPlugin,
        ],
    },

    userscript: {
        ...baseConfig,
        outfile: './dist/auto-image.userscript.js',
        minify: true,
        sourcemap: false,
        banner: {
            js: getUserscriptHeader(),
        },
        plugins: [
            buildInfoPlugin('userscript'),
            cssEmbedPlugin,
            jsonEmbedPlugin,
            assetInjectPlugin,
        ],
    },

    bookmarklet: {
        ...baseConfig,
        outfile: './dist/auto-image.bookmarklet.js',
        minify: true,
        sourcemap: false,
        globalName: 'WPlaceAutoBot',
        plugins: [
            buildInfoPlugin('bookmarklet'),
            cssEmbedPlugin,
            jsonEmbedPlugin,
            assetInjectPlugin,
        ],
    },
};

// Helper to build or watch a single target
async function buildOrWatchOne(name, config) {
    const startTime = Date.now();

    if (!watch) {
        console.log(`📦 Building ${name}...`);
        const result = await esbuild.build({ ...config, metafile: true });
        const elapsed = Date.now() - startTime;

        // Log build metrics
        console.log(`✨ Built ${name} in ${elapsed}ms`);

        // Log bundle size
        if (config.outfile && fs.existsSync(config.outfile)) {
            const stats = fs.statSync(config.outfile);
            const sizeKB = (stats.size / 1024).toFixed(2);
            console.log(`📊 Bundle size: ${sizeKB} KB`);
        }

        // Save metafile for analysis
        if (result.metafile) {
            const metaPath = './dist/meta.json';
            fs.writeFileSync(
                metaPath,
                JSON.stringify(result.metafile, null, 2)
            );
        }

        // Save build stats
        const buildStats = {
            target: name,
            timestamp: new Date().toISOString(),
            buildTime: elapsed,
            bundleSize:
                config.outfile && fs.existsSync(config.outfile)
                    ? fs.statSync(config.outfile).size
                    : 0,
        };

        // Append to build stats file
        const statsPath = './dist/build-stats.json';
        let allStats = [];
        if (fs.existsSync(statsPath)) {
            try {
                allStats = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
            } catch (e) {
                allStats = [];
            }
        }
        allStats.push(buildStats);
        fs.writeFileSync(statsPath, JSON.stringify(allStats, null, 2));

        return;
    }
    const ctx = await esbuild.context({ ...config, metafile: true });
    await ctx.watch();
    console.log(`👀 Watching target "${name}"...`);
}

// Main build function
async function build(targetName = 'all') {
    console.log('🔨 Building WPlace AutoBot...');

    if (watch && targetName === 'all') {
        console.error(
            '❌ Watch mode requires a specific target. Use --target=userscript or --target=standalone'
        );
        process.exit(1);
    }

    if (targetName === 'all') {
        for (const [name, config] of Object.entries(targets)) {
            await buildOrWatchOne(name, config);
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
        await buildOrWatchOne(targetName, targets[targetName]);

        if (!watch && targetName === 'bookmarklet') {
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

    if (!watch) {
        console.log('✅ Build complete!');
    }
}

// Parse command line arguments
const args = process.argv.slice(2);
const targetArg = args.find(arg => arg.startsWith('--target='));
const target = targetArg ? targetArg.split('=')[1] : 'all';
const watch = args.includes('--watch');

build(target).catch(err => {
    console.error('❌ Build failed:', err);
    process.exit(1);
});
