import useUserChats from "../../../../context/useUserChats";
import { BsPersonCircle, BsPlusSquare, BsSend } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { FirestoreUser } from "../../../../interfaces";
import { initChat, isUserOnline } from "../../../../lib";
import useUser from "../../../../context/useUser";
import { Badge } from "react-bootstrap";

export default function UserListItem({
	user,
	isInterlocutor,
}: {
	user: FirestoreUser;
	isInterlocutor: boolean;
}) {
	const { userChats, notSeenUpdatedChats } = useUserChats();
	const { user: loggedUser } = useUser();
	const navigate = useNavigate();

	const shouldNotifyVisually = notSeenUpdatedChats.find(
		(c) => c.interlocutorId === user.uid
	)
		? true
		: false;

	if (!userChats) return null;

	return (
		<li
			className={`p-2 mb-1 ${
				shouldNotifyVisually && "bg-dark text-light rounded"
			}`}
			style={{ display: "flex" }}
		>
			<div className="me-3">
				{user.photoURL ? (
					<img
						width={30}
						style={{ borderRadius: "50%" }}
						src={user.photoURL}
						alt={`${user.displayName} avatar`}
					/>
				) : (
					<BsPersonCircle size={30} />
				)}
				<div
					className={`bg-${isUserOnline(user) ? "success" : "secondary"}`}
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

			<span className="me-3">
				{user.displayName}
				<span className="text-secondary">
					{user.uid === loggedUser?.uid ? " (it's you)" : ""}
				</span>
			</span>

			{isInterlocutor && (
				<BsSend
					className="icon-btn"
					onClick={() =>
						navigate(
							`/chats/${
								userChats.filter((chat) => chat.interlocutorId === user.uid)[0]
									.id // there can be only one user's chat with the intelocutor !!!
							}`
						)
					}
				/>
			)}

			{!isInterlocutor &&
				loggedUser &&
				loggedUser.uid !== user.uid && ( // do not add btn for logged user !!!
					<BsPlusSquare
						className="icon-btn"
						onClick={async () => {
							const newChatId = await initChat(loggedUser.uid, user.uid);

							if (!newChatId)
								return alert("No new chat id was passed from initChat()...");

							navigate(`/chats/${newChatId}`);
						}}
					/>
				)}

			{shouldNotifyVisually && (
				<div style={{ flexGrow: 1, textAlign: "end" }}>
					<Badge bg={"success"}>new message/s</Badge>
				</div>
			)}
		</li>
	);
}
