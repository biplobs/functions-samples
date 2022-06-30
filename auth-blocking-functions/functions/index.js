/**
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const {functions} = require("firebase-functions");
const {admin} = require("firebase-admin");

admin.initializeApp();
const store = admin.firestore();

// [START v1BlockCreate]
// [START v1beforeCreateFunctionTrigger]
// Block account creation with any non-gmail email address.
exports.blockCreate = functions.auth.user().beforeCreate((user, context) => {
  // [END v1beforeCreateFunctionTrigger]
  // [START v1readEmailData]
  // Email passed from the User object.
  const email = user.email || "";
  // [END v1readEmailData]

  // [START v1domainHttpsError]
  // Checking that the email is a 'gmail' domain.
  if (!email?.includes("gmail.com")) {
    // Throwing an HttpsError so that the Auth service rejects the account creation.
    throw new HttpsError('invalid-argument', `Unauthorized email ${email}. Only 'gmail' accounts are valid for registration.`);
  }
  // [END v1domainHttpsError]
});
// [END v1BlockCreate]

// [START v1BlockSignIn]
// [START v1beforeSignInFunctionTrigger]
// Block account sign in with any banned account.
exports.blockSignIn = functions.auth.user().beforeSignIn(async (user, context) => {
  // [END v1beforeSignInFunctionTrigger]
  // [START v1readEmailData]
  // Email passed from the User object.
  const email = user.email || "";
  // [END v1readEmailData]

  // [START v1documentGet]
  // Obtain a document in Firestore of the banned email address.
  const doc = await store.collection("banned").doc(email).get();
  // [END v1documentGet]

  // [START v1bannedHttpsError]
  // Checking that the document exists for the email address.
  if (doc.exists) {
    // Throwing an HttpsError so that the Auth service rejects the account sign in.
    throw new HttpsError('invalid-argument', `Unauthorized email ${email}. Email has been banned and is no longer authorized for sign-in.`);
  }
  // [END v1bannedHttpsError]
});
// [START v1BlockSignIn]
