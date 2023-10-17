import { UserChat } from "../../../interfaces";
import ChatListItem from "./ChatListItem";

export default function ChatsList({ chats }: { chats: UserChat[] }) {
	return (
		<ul className="chats-list">
			{chats.map((chat) => (
				<ChatListItem chat={chat} key={chat.id} />
			))}
		</ul>
	);
}
