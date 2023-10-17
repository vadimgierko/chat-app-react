import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth, firestore } from "../firebaseConfig";
import { Chat, FirestoreUser, UserChat } from "../interfaces";
import { arrayUnion, collection, doc, writeBatch } from "firebase/firestore";

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

//====================== auth =======================//

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

//====================== other ======================//

/**
 * initialize/ create new chat, add it to logged user & interlocutor user-chats & return chat id
 */
async function initChat(userId: string, interlocutorId: string) {
	let id: string | null = null;

	// get new chat id
	const newChatRef = doc(collection(firestore, "chats"));
	id = newChatRef.id;

	if (!id) return null;

	const timestamp = getTimestamp();

	try {
		const batch = writeBatch(firestore);

		// add new chat to /chats:
		const newChat: Chat = {
			createdAt: timestamp,
			createdBy: userId,
			id,
			membersIds: [userId, interlocutorId],
			messages: [],
			updatedAt: timestamp,
		};

		batch.set(newChatRef, newChat);

		// add new chat to logged user /user-chats:
		const loggedUserChat: UserChat = {
			id,
			interlocutorId,
			createdAt: timestamp,
			seenAt: null,
			updatedAt: timestamp,
		};

		const loggedUserChatsRef = doc(firestore, "user-chats", userId);
		batch.update(loggedUserChatsRef, { chats: arrayUnion(loggedUserChat) });

		// add new chat to interlocutor /user-chats:
		const interlocutorUserChat: UserChat = {
			id,
			interlocutorId: userId,
			createdAt: timestamp,
			seenAt: null,
			updatedAt: timestamp,
		};

		const interlocutorUserChatsRef = doc(
			firestore,
			"user-chats",
			interlocutorId
		);

		batch.update(interlocutorUserChatsRef, {
			chats: arrayUnion(interlocutorUserChat),
		});

		await batch.commit();
	} catch (error) {
		console.log(error);
		alert(error);
	}

	return id;
}

//===================== exports =====================//

export { getTimestamp, getUserById, initChat, logOut, signIn };
