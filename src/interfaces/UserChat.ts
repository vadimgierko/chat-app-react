import { FirestoreUser } from "./FirestoreUser";

export interface UserChat {
	chatId: string;
	interlocutor: FirestoreUser;
	createdAt: number;
	updatedAt: number;
}
