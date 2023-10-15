import { createContext, useContext, useState, useEffect } from "react";
import { auth, firestore } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { User } from "firebase/auth";

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
		async function addUserIfNotExists(loggedUser: User) {
			// check if there is user data in /user collection,
			// if not => add newly created user to firestore:
			const docRef = doc(firestore, "users", loggedUser.uid);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				console.log("User Document data:", docSnap.data());
			} else {
				// docSnap.data() will be undefined in this case
				console.log("There is no such User document... Create one!");
				// add user to /users collection:
				const { displayName, email, photoURL, uid } = loggedUser;
				await setDoc(doc(firestore, "users", loggedUser.uid), {
					displayName,
					email,
					photoURL,
					uid,
				});
			}
		}

		const unsubscribe = onAuthStateChanged(auth, (u) => {
			if (u) {
				setUser(u);
				addUserIfNotExists(u);
			} else {
				console.log("User logged out.");
				setUser(null);
			}
		});

		return () => unsubscribe();
	}, []);

	const value = {
		user,
	};

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
