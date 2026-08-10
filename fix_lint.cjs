const fs = require('fs');

function fixFile(file) {
    if(fs.existsSync(file)) {
        let code = fs.readFileSync(file, 'utf8');
        code = code.replace(/, afterEach/g, "");
        code = code.replace(/const deleteSpy = vi\.spyOn\(db, 'delete'\)\.mockResolvedValue\(undefined\);\n    /g, "");
        fs.writeFileSync(file, code);
    }
}

fixFile('src/hooks/useSettings.test.ts');
fixFile('src/pages/Settings.test.tsx');
