import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { FirestoreUser } from "../interfaces";

//==================== helpers ======================//

function getTimestamp() {
	const timestamp = Date.now();
	return timestamp;
}

function getUserById(users: FirestoreUser[], uid: string) {
	if (!users || !users.length) return null;

	const user = users.find((u) => u.uid === uid);

	if (!user) return null;

	return user;
}

//=================== firebase ======================//

async function signIn() {
	const provider = new GoogleAuthProvider();

	return signInWithPopup(auth, provider)
		.then(async (result) => {
			// This gives you a Google Access Token. You can use it to access the Google API.
			// const credential = GoogleAuthProvider.credentialFromResult(result);
			// const token = credential?.accessToken;
			// The signed-in user info.
			const user = result.user;
			// IdP data available using getAdditionalUserInfo(result)
			console.log({ user });
		})
		.catch((error) => {
			console.error(error);
			alert(error);
		});
}

async function logOut() {
	return signOut(auth);
}

//=================== exports =======================//

export { getTimestamp, getUserById, logOut, signIn };
