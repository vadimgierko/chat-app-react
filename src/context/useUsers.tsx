import { createContext, useContext, useState, useEffect } from "react";
import { firestore } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
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
		async function fetchUsers() {
			const querySnapshot = await getDocs(collection(firestore, "users"));

			const fetchedUsers: FirestoreUser[] = [];

			querySnapshot.forEach((doc) => {
				// doc.data() is never undefined for query doc snapshots
				// console.log(doc.id, " => ", doc.data());
				fetchedUsers.push(doc.data() as FirestoreUser);
			});

			console.log({ fetchedUsers });
			setUsers(fetchedUsers);
		}

		if (user) {
			fetchUsers();
		} else {
			setUsers(null);
		}
	}, [user]);

	const value = {
		users,
	};

	return (
		<UsersContext.Provider value={value}>{children}</UsersContext.Provider>
	);
}