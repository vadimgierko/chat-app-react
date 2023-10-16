import { useNavigate } from "react-router-dom";
import { UserChat } from "../../../interfaces/UserChat";
import { BsPersonCircle, BsSend } from "react-icons/bs";

export default function ChatsList({ chats }: { chats: UserChat[] }) {
	const navigate = useNavigate();

	return (
		<ul className="chats-list">
			{chats.map((chat) => (
				<li key={chat.chatId}>
					{chat.interlocutor.photoURL ? (
						<img
							width={30}
							style={{ borderRadius: "50%" }}
							src={chat.interlocutor.photoURL}
							alt={`${chat.interlocutor.displayName} avatar`}
						/>
					) : (
						<BsPersonCircle />
					)}
					{chat.interlocutor.displayName}{" "}
					<BsSend
						onClick={() => navigate(`/chats/${chat.chatId}`)}
						style={{ cursor: "pointer" }}
					/>
				</li>
			))}
		</ul>
	);
}
