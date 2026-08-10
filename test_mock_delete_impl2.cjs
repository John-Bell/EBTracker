const fs = require('fs');

function fixFile(file) {
    if(fs.existsSync(file)) {
        let code = fs.readFileSync(file, 'utf8');

        // Let's completely mock `db.delete()` in the test BEFORE rendering the component so the component can't call it.
        // Also wait for the effects before restoring the spy!
        if (code.includes('handles "Clear Local Cache" correctly by prompting user and clearing database')) {
            code = code.replace(
                "render(<Settings />);",
                "const deleteSpy = vi.spyOn(db, 'delete').mockResolvedValue(undefined);\n    render(<Settings />);"
            );
            code = code.replace(
                "deleteSpy.mockRestore();\n    confirmSpy.mockRestore();",
                ""
            );
            code = code.replace(
                "confirmSpy.mockRestore();\n    alertSpy.mockRestore();",
                "confirmSpy.mockRestore();\n    alertSpy.mockRestore();\n    deleteSpy.mockRestore();"
            );
        }

        fs.writeFileSync(file, code);
    }
}

fixFile('src/pages/Settings.test.tsx');
