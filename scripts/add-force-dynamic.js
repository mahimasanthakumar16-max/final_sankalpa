const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('route.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const apiDir = path.join(__dirname, '../src/app/api');
const routes = walk(apiDir);

for (const route of routes) {
    let content = fs.readFileSync(route, 'utf8');
    if (!content.includes("export const dynamic = 'force-dynamic';")) {
        const importEndIndex = content.lastIndexOf("import ");
        if (importEndIndex !== -1) {
            const nextNewLine = content.indexOf('\n', importEndIndex);
            if (nextNewLine !== -1) {
                content = content.slice(0, nextNewLine + 1) + "\nexport const dynamic = 'force-dynamic';\n" + content.slice(nextNewLine + 1);
            } else {
                content = "export const dynamic = 'force-dynamic';\n\n" + content;
            }
        } else {
            content = "export const dynamic = 'force-dynamic';\n\n" + content;
        }
        fs.writeFileSync(route, content, 'utf8');
        console.log(`Updated ${route}`);
    }
}
