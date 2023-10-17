import { BsPersonCircle, BsSend } from "react-icons/bs";
import useUsers from "../../../../context/useUsers";
import { UserChat } from "../../../../interfaces";
import { getUserById } from "../../../../lib";
import { useNavigate } from "react-router-dom";

export default function ChatListItem({ chat }: { chat: UserChat }) {
	const { users } = useUsers();
	const interlocutor = users ? getUserById(users, chat.interlocutorId) : null;

	const navigate = useNavigate();

	if (!interlocutor) return null;

	return (
		<li
			style={{
				backgroundColor:
					chat.seenAt && chat.seenAt >= chat.updatedAt ? "" : "green",
			}}
		>
			{interlocutor.photoURL ? (
				<img
					width={30}
					style={{ borderRadius: "50%" }}
					src={interlocutor.photoURL}
					alt={`${interlocutor.displayName} avatar`}
				/>
			) : (
				<BsPersonCircle />
			)}{" "}
			{interlocutor.displayName}{" "}
			<BsSend
				onClick={() => navigate(`/chats/${chat.id}`)}
				style={{ cursor: "pointer" }}
			/>
		</li>
	);
}
