import useUser from "../../../context/useUser";
import useUserChats from "../../../context/useUserChats";
import { Message as IMessage } from "../../../interfaces";
import { getUserChatById } from "../../../lib";
import Message from "./Message";

export default function ChatMessages({
	chatId,
	messages,
}: {
	chatId: string;
	messages: IMessage[];
}) {
	const { user } = useUser();
	const { userChats } = useUserChats();
	const userChat = userChats ? getUserChatById(chatId, userChats) : null;

	if (!user) return null;

	return (
		<div style={{ flex: 1, overflowY: "auto" }}>
			{!messages.length &&
				"There are messages in chat! (but not implemented yet...)"}

			{messages.map((m, i) => (
				<Message
					message={m}
					key={m.content + i}
					isLast={i === messages.length - 1}
					lastlyNotifiedAt={userChat ? userChat.notifiedAt : null}
				/>
			))}
		</div>
	);
}
