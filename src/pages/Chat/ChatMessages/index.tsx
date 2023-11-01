import useUser from "../../../context/useUser";
import { FirestoreUser, Message as IMessage } from "../../../interfaces";
import Message from "./Message";

export default function ChatMessages({
	messages,
	interlocutorSeenAt,
	interlocutor,
}: {
	messages: IMessage[];
	interlocutorSeenAt: number | null;
	interlocutor: FirestoreUser;
}) {
	const { user } = useUser();

	const seenMessages = messages.filter((m) =>
		interlocutorSeenAt && user && m.senderId === user.uid
			? m.createdAt < interlocutorSeenAt
			: false
	);
	const lastSeenMessage = seenMessages.length
		? seenMessages[seenMessages.length - 1]
		: null;

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
					isLastSeen={
						lastSeenMessage
							? lastSeenMessage.content === m.content &&
							  lastSeenMessage.createdAt === m.createdAt
							: false
					}
					interlocutor={interlocutor}
				/>
			))}
		</div>
	);
}
