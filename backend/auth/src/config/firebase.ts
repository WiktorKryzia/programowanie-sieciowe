import { readFileSync } from 'node:fs';

import firebaseAdmin from 'firebase-admin';
import * as firebase from 'firebase/app';
import * as firebaseAuth from 'firebase/auth';

import env from './env';

firebase.initializeApp({
  apiKey: env.FIREBASE_API_KEY,
  authDomain: env.FIREBASE_AUTH_DOMAIN,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
  appId: env.FIREBASE_APP_ID,
});

firebaseAuth.getAuth().setPersistence(firebaseAuth.inMemoryPersistence);

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    JSON.parse(readFileSync(new URL('../../firebaseService.json', import.meta.url), 'utf8')),
  ),
});

export { firebase, firebaseAdmin, firebaseAuth };
