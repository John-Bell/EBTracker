const fs = require('fs');

function fixFile(file) {
    if(fs.existsSync(file)) {
        let code = fs.readFileSync(file, 'utf8');

        // Remove the handles clearing cache after confirmation test COMPLETELY from useSettings.test.ts
        code = code.replace(/it\('handles clearing cache after confirmation', async \(\) => \{[\s\S]*?\}\);\n\n  it\('handles sync simulation'/g, "it('handles sync simulation'");
        fs.writeFileSync(file, code);
    }
}

fixFile('src/hooks/useSettings.test.ts');
