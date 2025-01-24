import { readFileSync } from 'node:fs';

import firebaseAdmin from 'firebase-admin';

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    JSON.parse(readFileSync(new URL('../../firebaseService.json', import.meta.url), 'utf8')),
  ),
});

export { firebaseAdmin };

