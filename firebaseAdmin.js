import admin from "firebase-admin";
import { readFileSync } from "fs";

const serviceAccount = JSON.parse(
  readFileSync(`${process.env.FIREBASE_CONFIG_JSON_FILE_URL}`, "utf8"),
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

export const db = admin.database();
export const auth = admin.auth();

export default admin;
