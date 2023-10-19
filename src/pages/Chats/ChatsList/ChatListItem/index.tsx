import { BsPersonCircle } from "react-icons/bs";
import useUsers from "../../../../context/useUsers";
import { UserChat } from "../../../../interfaces";
import { getUserById } from "../../../../lib";
import { useNavigate } from "react-router-dom";
import { Badge } from "react-bootstrap";

export default function ChatListItem({ chat }: { chat: UserChat }) {
	const { users } = useUsers();
	const interlocutor = users ? getUserById(users, chat.interlocutorId) : null;

	const navigate = useNavigate();

	if (!interlocutor) return null;

	return (
		<li
			className={`p-2 rounded mb-1 ${
				chat.seenAt && chat.seenAt >= chat.updatedAt
					? "bg-dark"
					: "bg-secondary"
			}`}
			onClick={() => navigate(`/chats/${chat.id}`)}
			style={{
				cursor: "pointer",
				display: "flex",
				justifyContent: "space-between",
			}}
		>
			<div>
				<span className="me-3">
					{interlocutor.photoURL ? (
						<img
							width={30}
							style={{ borderRadius: "50%" }}
							src={interlocutor.photoURL}
							alt={`${interlocutor.displayName} avatar`}
						/>
					) : (
						<BsPersonCircle size={30} />
					)}
				</span>
				<span>{interlocutor.displayName}</span>
			</div>

			<div>
				{!(chat.seenAt && chat.seenAt >= chat.updatedAt) && (
					<Badge bg={"success"}>new message/s</Badge>
				)}
			</div>
		</li>
	);
}
