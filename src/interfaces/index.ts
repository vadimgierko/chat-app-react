export interface FirestoreUser {
	/**
	 * Is user online right now.
	 * TODO: figure out how to check that...
	 */
	// active: boolean;
	createdAt: number;
	/**
	 * If the user is deleted,
	 * his data remains to show up in chats he was a member of,
	 * but doesn't show up in users you can start the chat.
	 */
	// deleted: boolean;
	displayName: string | null;
	photoURL: string | null;
	uid: string;
	updatedAt: number;
}

export interface UserChat {
	id: string;
	interlocutorId: string;
	createdAt: number;
	seenAt: number | null; // compare with updatedAt to notify about not seen chat updates OR rename to "last/VisitedAt" ???
	updatedAt: number; // update when new messages come or chat is initiated
}

export interface Message {
	chatId: string;
	content: string;
	createdAt: number;
	senderId: string;
	seenByReceiverAt: number | null; // compare with createdAt to notify about not seen message
	receiverId: string;
}

export interface Chat {
	createdAt: number;
	createdBy: string;
	id: string;
	membersIds: string[];
	messages: [];
	updatedAt: number;
}
