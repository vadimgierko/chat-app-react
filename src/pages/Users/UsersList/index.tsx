import useUserChats from "../../../context/useUserChats";
import { useEffect } from "react";
import { FirestoreUser } from "../../../interfaces";
import UserListItem from "./UserListItem";
import useUser from "../../../context/useUser";

export default function UsersList({ users }: { users: FirestoreUser[] }) {
	const { user } = useUser();
	const { userChats } = useUserChats();

	const interlocutorsIds =
		userChats && userChats.length
			? userChats.map((chat) => chat.interlocutorId)
			: [];

	const interlocutors = interlocutorsIds
		.map((id) => users.find((u) => u.uid === id))
		.filter((i) => i !== undefined) as FirestoreUser[];

	const noninterlocutors = users.filter(
		(u) => !interlocutorsIds.find((id) => u.uid === id) && u.uid !== user?.uid
	);

	useEffect(() => console.log({ interlocutors }));

	return (
		<ul style={{ listStyle: "none", paddingLeft: 0 }}>
			{userChats && (
				<>
					<h2 className="text-center">Users you chatted with</h2>
					{interlocutors.map((u) => (
						<UserListItem key={u.uid} user={u} isInterlocutor={true} />
					))}
				</>
			)}
			<hr />
			<h2 className="text-center">Users you can start chatting with</h2>
			{noninterlocutors.map((u) => (
				<UserListItem key={u.uid} user={u} isInterlocutor={false} />
			))}
		</ul>
	);
}
