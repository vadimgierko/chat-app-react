import { useEffect, useRef } from "react";
import useUser from "../../../../context/useUser";
import { Message as IMessage } from "../../../../interfaces";

export default function Message({
	message,
	isLast = false,
}: {
	message: IMessage;
	isLast: boolean;
}) {
	const messageRef = useRef<HTMLDivElement | null>(null);
	const { user } = useUser();

	// scroll to the last message:
	useEffect(() => {
		if (isLast) {
			if (messageRef.current) {
				messageRef.current.scrollIntoView();
			}
		}
	}, [isLast]);

	if (!user) return null;

	return (
		<div
			ref={messageRef}
			className="message-container"
			style={{
				width: "fit-content",
				maxWidth: "70%",
				marginLeft: message.senderId === user.uid ? "auto" : 0,
				marginRight: message.senderId === user.uid ? 0 : "auto",
				textAlign: message.senderId === user.uid ? "end" : "start",
				backgroundColor:
					message.senderId === user.uid
						? "rgb(29, 61, 107)"
						: "rgb(20, 24, 31)",
				borderRadius: "12px",
				marginBottom: "1em",
			}}
		>
			<p className="message-content" style={{ padding: "0.5em" }}>
				{message.content}
			</p>
		</div>
	);
}
