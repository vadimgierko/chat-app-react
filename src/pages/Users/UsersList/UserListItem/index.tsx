import useUserChats from "../../../../context/useUserChats";
import { BsPersonCircle, BsPlusSquare, BsSend } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { FirestoreUser } from "../../../../interfaces";
import { initChat } from "../../../../lib";
import useUser from "../../../../context/useUser";

export default function UserListItem({
	user,
	isInterlocutor,
}: {
	user: FirestoreUser;
	isInterlocutor: boolean;
}) {
	const { userChats } = useUserChats();
	const { user: loggedUser } = useUser();
	const navigate = useNavigate();

	if (!userChats) return null;

	return (
		<li className="p-2 mb-1">
			<span className="me-3">
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
			</span>
			<span className="me-3">{user.displayName}</span>

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
		</li>
	);
}
