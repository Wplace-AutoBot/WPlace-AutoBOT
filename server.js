const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Cache for branch files
const branchCache = new Map();

// Get all branches and their files
function getBranchFiles(callback) {
    exec('git branch -r | cut -c 3- | sed "s/origin\\///g"', (error, stdout, stderr) => {
        if (error) {
            console.error('Error getting branches:', error);
            callback([]);
            return;
        }
        
        const branches = stdout.trim().split('\n').filter(branch => branch && branch !== 'HEAD');
        const branchData = [];
        
        let completed = 0;
        branches.forEach(branch => {
            exec(`git show ${branch.includes('origin/') ? branch : 'origin/' + branch}:Auto-Farm.js 2>/dev/null`, (err, farmJs) => {
                exec(`git show ${branch.includes('origin/') ? branch : 'origin/' + branch}:Auto-Image.js 2>/dev/null`, (err2, imageJs) => {
                    exec(`git ls-tree -r --name-only ${branch.includes('origin/') ? branch : 'origin/' + branch} | grep -E "\\.(js|css|html|json)$" 2>/dev/null`, (err3, files) => {
                        const branchFiles = {};
                        
                        if (!err && farmJs) branchFiles['Auto-Farm.js'] = farmJs;
                        if (!err2 && imageJs) branchFiles['Auto-Image.js'] = imageJs;
                        
                        // Get other files
                        if (!err3 && files) {
                            const fileList = files.trim().split('\n').filter(f => f);
                            let fileCount = fileList.length;
                            
                            if (fileCount === 0) {
                                branchData.push({ branch, files: branchFiles });
                                completed++;
                                if (completed === branches.length) callback(branchData);
                                return;
                            }
                            
                            fileList.forEach(filename => {
                                if (!branchFiles[path.basename(filename)]) {
                                    exec(`git show ${branch.includes('origin/') ? branch : 'origin/' + branch}:${filename} 2>/dev/null`, (err4, content) => {
                                        if (!err4 && content) {
                                            branchFiles[path.basename(filename)] = content;
                                        }
                                        fileCount--;
                                        if (fileCount === 0) {
                                            branchData.push({ branch, files: branchFiles });
                                            completed++;
                                            if (completed === branches.length) callback(branchData);
                                        }
                                    });
                                } else {
                                    fileCount--;
                                    if (fileCount === 0) {
                                        branchData.push({ branch, files: branchFiles });
                                        completed++;
                                        if (completed === branches.length) callback(branchData);
                                    }
                                }
                            });
                        } else {
                            branchData.push({ branch, files: branchFiles });
                            completed++;
                            if (completed === branches.length) callback(branchData);
                        }
                    });
                });
            });
        });
    });
}

// Serve files per branch
app.get('/:branch/:filename', (req, res) => {
    const { branch, filename } = req.params;
    
    getBranchFiles((branches) => {
        const branchData = branches.find(b => b.branch === branch || b.branch === `origin/${branch}`);
        
        if (!branchData || !branchData.files[filename]) {
            return res.status(404).send('File not found');
        }
        
        // Set appropriate content type
        if (filename.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        } else if (filename.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (filename.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html');
        } else if (filename.endsWith('.json')) {
            res.setHeader('Content-Type', 'application/json');
        }
        
        // Enable CORS for browser scripts
        res.setHeader('Access-Control-Allow-Origin', '*');
        
        res.send(branchData.files[filename]);
    });
});

// Serve index page
app.get('/', (req, res) => {
    getBranchFiles((branches) => {
        let html = `
<!DOCTYPE html>
<html>
<head>
    <title>WPlace AutoBOT - Local Server</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
        h1 { color: #333; text-align: center; }
        .branch { margin: 20px 0; padding: 15px; background: #f8f9fa; border-left: 4px solid #007bff; }
        .files a { display: inline-block; margin: 5px; padding: 8px 12px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; }
        .bookmarklet { background: #e9ecef; padding: 10px; margin: 10px 0; border-radius: 5px; font-family: monospace; word-break: break-all; }
        .copy-btn { background: #28a745; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 WPlace AutoBOT - Local Server</h1>
        <p><strong>Server URL:</strong> ${req.protocol}://${req.get('host')}</p>
        <p>Use ngrok to expose this server: <code>ngrok http 3000</code></p>
`;

        branches.forEach(branchData => {
            const branch = branchData.branch.replace('origin/', '');
            html += `
        <div class="branch">
            <h3>📁 Branch: ${branch}</h3>
            <div class="files">
`;
            Object.keys(branchData.files).forEach(filename => {
                const url = `${req.protocol}://${req.get('host')}/${branch}/${filename}`;
                html += `<a href="/${branch}/${filename}">${filename}</a>`;
                
                if (filename.endsWith('.js')) {
                    html += `
            </div>
            <div class="bookmarklet">
                <strong>Bookmarklet for ${filename}:</strong><br>
                <code>javascript:fetch("${url}").then(t=>t.text()).then(eval);</code>
                <button class="copy-btn" onclick="copyToClipboard(this)">Copy</button>
            </div>
            <div class="files">`;
                }
            });
            html += `</div></div>`;
        });

        html += `
        </div>
        <script>
            function copyToClipboard(btn) {
                const code = btn.previousElementSibling.textContent;
                navigator.clipboard.writeText(code).then(() => {
                    btn.textContent = 'Copied!';
                    setTimeout(() => btn.textContent = 'Copy', 2000);
                });
            }
        </script>
    </div>
</body>
</html>`;
        
        res.send(html);
    });
});

app.listen(port, () => {
    console.log(`🚀 WPlace AutoBOT server running at http://localhost:${port}`);
    console.log(`📡 Run 'ngrok http ${port}' to expose this server publicly`);
    console.log(`🔗 Then use URLs like: https://abc123.ngrok.io/main/Auto-Farm.js`);
});