import useUser from "../../../context/useUser";
import { Message as IMessage } from "../../../interfaces";
import Message from "./Message";

export default function ChatMessages({
	messages,
	interlocutorSeenAt,
}: {
	messages: IMessage[];
	interlocutorSeenAt: number | null;
}) {
	const { user } = useUser();

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
					interlocutorSeenAt={interlocutorSeenAt}
				/>
			))}
		</div>
	);
}
