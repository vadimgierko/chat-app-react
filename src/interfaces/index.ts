export interface FirestoreUser {
	createdAt: number;
	displayName: string | null;
	photoURL: string | null;
	uid: string;
	updatedAt: number;
}

export interface UserChat {
	id: string;
	interlocutorId: string;
	createdAt: number;
	updatedAt: number;
}

export interface Message {
	chatId: string;
	content: string;
	createdAt: number;
	senderId: string;
	seenAt: number | null; // compare with createdAt to notify about not seen message
	receiverId: string;
}

export interface Chat {
	createdAt: number;
	id: string;
	membersIds: string[];
	messages: [];
	seenAt: number | null; // compare with updatedAt to notify about not seen chat updates
	updatedAt: number;
}
