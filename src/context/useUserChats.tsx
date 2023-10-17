import { createContext, useContext, useState, useEffect } from "react";
import { firestore } from "../firebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import useUser from "./useUser";
import { UserChat } from "../interfaces";

const UserChatsContext = createContext<{
	userChats: UserChat[] | null;
}>({ userChats: null });

/**
 *
 * @returns user chats sorted by most recently updated
 */
export default function useUserChats() {
	const context = useContext(UserChatsContext);

	if (!context) {
		throw new Error(
			"useUserChats has to be used within <UserChatsContext.Provider>"
		);
	}

	return context;
}

interface UserChatsProviderProps {
	children: React.ReactNode;
}

export function UserChatsProvider({ children }: UserChatsProviderProps) {
	const { user } = useUser();
	const [userChats, setUserChats] = useState<UserChat[] | null>(null); // if not fetched or doc doesn't exist

	useEffect(() => {
		if (!user) return;

		const unsubscribe = onSnapshot(
			doc(firestore, `user-chats`, user.uid),
			(doc) => {
				if (doc.exists()) {
					const data = doc.data(); // {uid, chats}
					const chats = data.chats as UserChat[];
					const chatsSortedByUpdateTime = chats.sort(
						(a, b) => b.updatedAt - a.updatedAt
					);
					setUserChats(chatsSortedByUpdateTime);
				}
			}
		);

		return unsubscribe();
	}, [user]);

	useEffect(() => console.log({ userChats }), [userChats]);

	const value = {
		userChats,
	};

	return (
		<UserChatsContext.Provider value={value}>
			{children}
		</UserChatsContext.Provider>
	);
}
