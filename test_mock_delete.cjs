const fs = require('fs');

function fixFile(file) {
    if(fs.existsSync(file)) {
        let code = fs.readFileSync(file, 'utf8');

        // It seems mocking db.delete isn't enough, let's look at `Settings.tsx` to see what happens when it's clicked.
        // Or wait... the tests are failing at the end of the file.
        // It says `The latest test that might've caused the error is "handles 'Clear Local Cache' correctly...". It might mean the error was thrown AFTER the test had been completed.`
        // This is exactly because `db.delete()` is asynchronous but `fireEvent.click()` might trigger something that continues executing and accessing `db.logs` after the test is technically finished and the db is deleted!
        // To fix this, we should mock `db.delete()` globally in the test file before ALL tests, or just mock it to do nothing!
        code = code.replace(/setTestDb\(testDbName\);\n\s*vi\.spyOn\(db, 'delete'\).mockImplementation\(async \(\) => \{\n\s*await db\.logs\.clear\(\);\n\s*await db\.foodDictionary\.clear\(\);\n\s*await db\.settings\.clear\(\);\n\s*await db\.deletedRows\.clear\(\);\n\s*\}\);/g, "setTestDb(testDbName);");

        fs.writeFileSync(file, code);
    }
}

fixFile('src/pages/Settings.test.tsx');
fixFile('src/hooks/useSettings.test.ts');
