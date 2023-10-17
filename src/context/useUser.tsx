import { createContext, useContext, useState, useEffect } from "react";
import { auth, firestore } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, writeBatch } from "firebase/firestore";
import { User } from "firebase/auth";
import { FirestoreUser, UserChat } from "../interfaces";
import { getTimestamp } from "../lib";

const UserContext = createContext<{
	user: User | null;
}>({ user: null });

export default function useUser() {
	const context = useContext(UserContext);

	if (!context) {
		throw new Error("useUser has to be used within <UserContext.Provider>");
	}

	return context;
}

interface UserProviderProps {
	children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		async function addUserIfDoesntExist(loggedUser: User) {
			// check if there is user data in /user collection,
			// if not => add newly created user to firestore:
			const docRef = doc(firestore, "users", loggedUser.uid);
			const docSnap = await getDoc(docRef);

			// USER EXISTS IN DB => RETURN:
			if (docSnap.exists())
				return console.log("User data in Firestore:", docSnap.data());

			// USER DOESN'T EXIST IN DB => ADD:
			console.log("There is no such User data in Firestore... Create one!");
			// add user to /users collection:
			const { displayName, photoURL, uid } = loggedUser;
			const timestamp = getTimestamp();

			const newUser: FirestoreUser = {
				displayName,
				photoURL,
				uid,
				createdAt: timestamp,
				updatedAt: timestamp,
			};

			const newUserChats: {
				uid: string;
				chats: UserChat[];
			} = {
				uid,
				chats: [],
			};

			const batch = writeBatch(firestore);

			const newUserRef = doc(firestore, "users", uid);
			batch.set(newUserRef, newUser);

			const newUserChatsRef = doc(firestore, "user-chats", uid);
			batch.set(newUserChatsRef, newUserChats);

			await batch.commit();
		}

		const unsubscribe = onAuthStateChanged(auth, (u) => {
			if (u) {
				setUser(u);
				addUserIfDoesntExist(u);
			} else {
				setUser(null);
			}
		});

		return () => unsubscribe();
	}, []);

	useEffect(() => console.log({ user }), [user]);

	const value = {
		user,
	};

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
