const fs = require('fs');

function fixFile(file) {
    if(fs.existsSync(file)) {
        let code = fs.readFileSync(file, 'utf8');
        code = code.replace(/} catch \(_error: any\) {/g, "} catch (error: any) {");

        // Actually, if we just use the variable we don't get unused error!
        // `throw new Error('Decryption failed. Incorrect passphrase or corrupted data.', { cause: error });`
        code = code.replace(/throw new Error\('Decryption failed. Incorrect passphrase or corrupted data.'\);/g, "throw new Error('Decryption failed. Incorrect passphrase or corrupted data.', { cause: error });");

        // `console.error('Failed to clean graveyard', error);` <- wait, error was actually used but since it was renamed to `_error` it became undeclared in my last sed!

        fs.writeFileSync(file, code);
    }
}

fixFile('src/db/syncService.ts');
