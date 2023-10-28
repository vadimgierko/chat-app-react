export interface FirestoreUser {
	createdAt: number;
	displayName: string | null;
	photoURL: string | null;
	signedInAt: number | null;
	signedOutAt: number | null;
	uid: string;
	updatedAt: number;
	/**
	 * If the user is deleted,
	 * his data remains to show up in chats he was a member of,
	 * but doesn't show up in users you can start the chat.
	 */
	// deleted: boolean;
}

export interface UserChat {
	createdAt: number;
	id: string;
	interlocutorId: string;
	notifiedAt: number; // if notifiedAt < updatedAt, notify user & set notifiedAt => this will prevent from multiply sound notifications
	seenAt: number; // compare with updatedAt to notify about not seen chat updates OR rename to "last/VisitedAt" ???
	updatedAt: number; // update when new messages come or chat is initiated
}

export interface Message {
	chatId: string;
	content: string;
	createdAt: number;
	senderId: string;
	receiverId: string;
}

export interface Chat {
	createdAt: number;
	createdBy: string;
	id: string;
	membersIds: string[];
	messages: Message[];
	updatedAt: number;
}
