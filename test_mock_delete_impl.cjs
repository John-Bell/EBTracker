const fs = require('fs');

function fixFile(file) {
    if(fs.existsSync(file)) {
        let code = fs.readFileSync(file, 'utf8');

        // Mock db.delete() inside the specific test that triggers it, so it doesn't actually delete the db and break fake-indexeddb cleanup routines or subsequent queries.
        if (code.includes('handles "Clear Local Cache" correctly by prompting user and clearing database')) {
            code = code.replace(
                "const clearCacheBtn = screen.getByText('Clear Local Cache');",
                "const deleteSpy = vi.spyOn(db, 'delete').mockImplementation(async () => { /* no-op to prevent destroying db while test runner cleans up */ });\n    const clearCacheBtn = screen.getByText('Clear Local Cache');"
            );
            code = code.replace(
                "confirmSpy.mockRestore();",
                "deleteSpy.mockRestore();\n    confirmSpy.mockRestore();"
            );
        }

        fs.writeFileSync(file, code);
    }
}

fixFile('src/pages/Settings.test.tsx');
