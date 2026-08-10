const fs = require('fs');

function fixFile(file) {
    if(fs.existsSync(file)) {
        let code = fs.readFileSync(file, 'utf8');

        // Instead of trying to clean up, which causes dexie to fail because the db is closed or deleted,
        // we should just let the beforeEach handle making a new test DB!
        // We will just remove the afterEach block altogether.
        code = code.replace(/afterEach\(async \(\) => \{\n\s*if \(db\.isOpen\(\)\) \{\n\s*await db\.logs\.clear\(\);\n\s*await db\.foodDictionary\.clear\(\);\n\s*await db\.settings\.clear\(\);\n\s*await db\.deletedRows\.clear\(\);\n\s*db\.close\(\);\n\s*\}\n\s*\}\);/g, "");

        fs.writeFileSync(file, code);
    }
}

fixFile('src/pages/Settings.test.tsx');
fixFile('src/hooks/useSettings.test.ts');
