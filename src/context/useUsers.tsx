import { createContext, useContext, useState, useEffect } from "react";
import { firestore } from "../firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import { FirestoreUser } from "../interfaces";
import useUser from "./useUser";

const UsersContext = createContext<{
	users: FirestoreUser[] | null; // null means that there was no try to fetch users yet...
}>({ users: null });

export default function useUsers() {
	const context = useContext(UsersContext);

	if (!context) {
		throw new Error("useUsers has to be used within <UsersContext.Provider>");
	}

	return context;
}

interface UsersProviderProps {
	children: React.ReactNode;
}

export function UsersProvider({ children }: UsersProviderProps) {
	const { user } = useUser(); // only when user is logged we fetch users
	const [users, setUsers] = useState<FirestoreUser[] | null>(null); // null means that there was no try to fetch users yet...

	useEffect(() => {
		let unsubscribe = () => {};

		if (user) {
			// FETCH USERS & LISTEN TO CHANGES:
			const usersRef = collection(firestore, "users");

			// Add a real-time listener
			unsubscribe = onSnapshot(usersRef, (querySnapshot) => {
				const updatedUsers: FirestoreUser[] = [];

				querySnapshot.forEach((doc) => {
					updatedUsers.push(doc.data() as FirestoreUser);
				});

				setUsers(updatedUsers);
			});
		} else {
			setUsers(null);
		}

		return () => {
			// Unsubscribe from the listener when the component unmounts
			unsubscribe();
		};
	}, [user]);

	// useEffect(() => console.log({ users }), [users]);

	const value = {
		users,
	};

	return (
		<UsersContext.Provider value={value}>{children}</UsersContext.Provider>
	);
}
