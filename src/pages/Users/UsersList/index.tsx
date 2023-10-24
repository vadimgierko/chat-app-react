import useUserChats from "../../../context/useUserChats";
import { useEffect } from "react";
import { FirestoreUser } from "../../../interfaces";
import UserListItem from "./UserListItem";

export default function UsersList({ users }: { users: FirestoreUser[] }) {
	const { userChats } = useUserChats();

	const interlocutorsIds =
		userChats && userChats.length
			? userChats.map((chat) => chat.interlocutorId)
			: [];

	const interlocutors = users.filter((u) =>
		interlocutorsIds.find((id) => u.uid === id)
	);

	const noninterlocutors = users.filter(
		(u) => !interlocutorsIds.find((id) => u.uid === id)
	);

	useEffect(() => console.log({ interlocutors }));

	return (
		<ul style={{ listStyle: "none", paddingLeft: 0 }}>
			{userChats &&
				interlocutors.map((u) => (
					<UserListItem key={u.uid} user={u} isInterlocutor={true} />
				))}
			{noninterlocutors.map((u) => (
				<UserListItem key={u.uid} user={u} isInterlocutor={false} />
			))}
		</ul>
	);
}
