import { BsPersonCircle } from "react-icons/bs";
import useUsers from "../../../../context/useUsers";
import { UserChat } from "../../../../interfaces";
import { getUserById, isUserOnline, notifyWithAsound } from "../../../../lib";
import { useNavigate } from "react-router-dom";
import { Badge } from "react-bootstrap";
import { useEffect } from "react";
import useUser from "../../../../context/useUser";

export default function ChatListItem({ chat }: { chat: UserChat }) {
	const { user } = useUser();
	const { users } = useUsers();
	const interlocutor = users ? getUserById(users, chat.interlocutorId) : null;

	const navigate = useNavigate();

	useEffect(() => {
		if (!user) return;

		if (chat.seenAt && chat.seenAt / 1000 >= chat.updatedAt / 1000) {
			// do nothing
		} else {
			if (chat.notifiedAt && chat.notifiedAt / 1000 >= chat.updatedAt / 1000) {
				// do nothing
			} else {
				notifyWithAsound(user.uid, chat.id, "chats");
			}
		}
	}, [chat, user]);

	if (!interlocutor) return null;

	return (
		<li
			className={`p-2 mb-1 ${
				chat.seenAt && chat.seenAt / 1000 >= chat.updatedAt / 1000
					? ""
					: "bg-dark rounded"
			}`}
			onClick={() => navigate(`/chats/${chat.id}`)}
			style={{
				cursor: "pointer",
				display: "flex",
				justifyContent: "space-between",
			}}
		>
			<div className="d-flex">
				<div>
					<div className="me-3">
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
					</div>
					<div
						className={`bg-${
							isUserOnline(interlocutor) ? "success" : "secondary"
						}`}
						style={{
							minWidth: 15,
							minHeight: 15,
							maxWidth: 15,
							maxHeight: 15,
							borderRadius: "50%",
							marginTop: "-0.5em",
							marginLeft: "1.5em",
						}}
					></div>
				</div>
				<span>{interlocutor.displayName}</span>
			</div>

			<div>
				{!(chat.seenAt && chat.seenAt / 1000 >= chat.updatedAt / 1000) && (
					<Badge bg={"success"}>new message/s</Badge>
				)}
			</div>
		</li>
	);
}
