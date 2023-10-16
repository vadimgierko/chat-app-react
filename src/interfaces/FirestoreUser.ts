export interface FirestoreUser {
	createdAt: number;
	displayName: string | null;
	// email: string | null; // THIS MUST BE PRIVATE !!!
	photoURL: string | null;
	uid: string;
	updatedAt: number;
}
