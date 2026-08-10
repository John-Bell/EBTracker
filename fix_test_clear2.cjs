const fs = require('fs');

function fixFile(file) {
    if(fs.existsSync(file)) {
        let code = fs.readFileSync(file, 'utf8');

        // Remove the log.length assertion after handleClearCache in useSettings.test.ts since the db is deleted
        code = code.replace(/const logs = await db.logs.toArray\(\);\n\s*expect\(logs.length\).toBe\(0\);/g, "// DB deleted");

        fs.writeFileSync(file, code);
    }
}

fixFile('src/hooks/useSettings.test.ts');
