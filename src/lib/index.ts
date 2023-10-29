import {
	GoogleAuthProvider,
	User,
	signInWithPopup,
	signOut,
} from "firebase/auth";
import { auth, firestore } from "../firebaseConfig";
import { Chat, FirestoreUser, Message, UserChat } from "../interfaces";
import {
	arrayUnion,
	collection,
	doc,
	updateDoc,
	writeBatch,
} from "firebase/firestore";

import newMessageSound from "../assets/audio/notification-sound-vibraphone-pixabay.mp3";

//==================== helpers ======================//

function getTimestamp() {
	const timestamp = Date.now();
	return timestamp;
}

function getDateFromTimestamp(timestamp: number) {
	const date = new Date(timestamp);

	const day = date.getDate();
	const month = date.getMonth() + 1; // Months are zero-based, so add 1
	const year = date.getFullYear();
	const hours = date.getHours();
	const minutes = date.getMinutes();

	// Ensure the single-digit day, month, hours, and minutes have leading zeros
	const dayStr = day < 10 ? `0${day}` : day.toString();
	const monthStr = month < 10 ? `0${month}` : month.toString();
	const hoursStr = hours < 10 ? `0${hours}` : hours.toString();
	const minutesStr = minutes < 10 ? `0${minutes}` : minutes.toString();

	const formattedDate = `${dayStr}.${monthStr}.${year} ${hoursStr}:${minutesStr}`;

	return formattedDate;
}

function isUserOnline(user: FirestoreUser) {
	if (user.signedInAt) {
		if (user.signedOutAt) {
			return user.signedInAt > user.signedOutAt;
		} else {
			return true;
		}
	} else {
		return false;
	}
}

function getUserById(users: FirestoreUser[], uid: string) {
	if (!users || !users.length) return null;

	const user = users.find((u) => u.uid === uid);

	if (!user) return null;

	return user;
}

function getUserChatById(chatId: string, userChats: UserChat[]) {
	const userChat = userChats.find((chat) => chat.id === chatId);

	if (!userChat) return null;

	return userChat;
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

async function logOut(user: User) {
	try {
		console.log(
			`User is logging out... Updating ${user.uid} user signOutAt timestamp...`
		);
		// set user signOutAt timestamp:
		const firestoreUserRef = doc(firestore, "users", user.uid);
		await updateDoc(firestoreUserRef, { signedOutAt: getTimestamp() });

		console.log(`Log out user ${user.uid}.`);

		await signOut(auth);

		console.log("user logged out...");
	} catch (error) {
		console.error(error);
	}
}

//================ notifications ===================//

async function notifyWithAsound(userId: string, chatIds: string[]) {
	if (!chatIds.length) return;

	// Play the notification sound:
	const audio = new Audio(newMessageSound);

	const volumeLevel = 0.2; // Set the volume level (0.0 to 1.0)
	audio.volume = volumeLevel;

	audio.play();
	//=============================//

	const userChatRef = doc(firestore, "user-chats", userId);

	const timestamp = getTimestamp() + 1000;

	try {
		const userChatsUpdates = chatIds.reduce(
			(updates, id) => ({ ...updates, [`${id}.notifiedAt`]: timestamp }),
			{}
		);
		await updateDoc(userChatRef, userChatsUpdates);
	} catch (error) {
		console.error(error);
	}
}

//====================== CRUD ======================//

async function updateChatSeenAt(user: User, chatId: string) {
	console.log("Updating chat's seenAt prop...");

	const timestamp = getTimestamp();

	try {
		const userChatRef = doc(firestore, "user-chats", user.uid);

		await updateDoc(userChatRef, {
			[`${chatId}.seenAt`]: timestamp,
		});
	} catch (error) {
		console.log(error);
		alert(error);
	}
}

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
			seenAt: timestamp, // it should be to prevent notifying the user about new empty chat
			updatedAt: timestamp,
			notifiedAt: timestamp, // user creates chat, so he doesn't need to be notified about this
		};

		const loggedUserChatsRef = doc(firestore, "user-chats", userId);
		batch.update(loggedUserChatsRef, { [id]: loggedUserChat });

		// add new chat to interlocutor /user-chats:
		const interlocutorUserChat: UserChat = {
			id,
			interlocutorId: userId,
			createdAt: timestamp,
			seenAt: timestamp, // it should be to prevent notifying the user about new empty chat
			updatedAt: timestamp,
			notifiedAt: timestamp, // it should be to prevent notifying the user about new empty chat
		};

		const interlocutorUserChatsRef = doc(
			firestore,
			"user-chats",
			interlocutorId
		);

		batch.update(interlocutorUserChatsRef, {
			[id]: interlocutorUserChat,
		});

		await batch.commit();
	} catch (error) {
		console.log(error);
		alert(error);
	}

	return id;
}

async function sendMessage(
	content: string,
	senderId: string,
	receiverId: string,
	chatId: string
) {
	const timestamp = getTimestamp();

	try {
		const batch = writeBatch(firestore);

		// add new message to chat & update chat's updatedAt:
		const newMessage: Message = {
			createdAt: timestamp,
			chatId,
			content,
			senderId,
			receiverId,
		};

		const chatRef = doc(firestore, "chats", chatId);

		batch.update(chatRef, {
			messages: arrayUnion(newMessage),
			updatedAt: timestamp,
		});

		// update logged user /user-chats:
		const loggedUserChatsRef = doc(firestore, "user-chats", senderId);
		batch.update(loggedUserChatsRef, {
			[`${chatId}.updatedAt`]: timestamp,
			[`${chatId}.seenAt`]: timestamp, // user sends msg, so he already saw this msg
			[`${chatId}.notifiedAt`]: timestamp, // user sends msg, so he doesn't need to be notified about this msg
		});

		// update interlocutor /user-chats:
		const interlocutorUserChatsRef = doc(firestore, "user-chats", receiverId);

		batch.update(interlocutorUserChatsRef, {
			[`${chatId}.updatedAt`]: timestamp,
		});

		await batch.commit();
	} catch (error) {
		console.log(error);
		alert(error);
	}
}

//===================== exports =====================//

export {
	getDateFromTimestamp,
	getTimestamp,
	getUserById,
	getUserChatById,
	initChat,
	isUserOnline,
	logOut,
	notifyWithAsound,
	sendMessage,
	signIn,
	updateChatSeenAt,
};
