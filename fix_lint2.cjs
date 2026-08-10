const fs = require('fs');

function fixFile(file) {
    if(fs.existsSync(file)) {
        let code = fs.readFileSync(file, 'utf8');
        code = code.replace(/, vi/g, "");
        fs.writeFileSync(file, code);
    }
}

fixFile('src/pages/Settings.test.tsx');
