const fs = require('fs');

// We need to re-add syncService.ts because `git checkout -- src/db/syncService.ts`
// failed since it wasn't committed, and effectively deleted the unstaged file!
// Wait, is it completely gone? Let me check.
