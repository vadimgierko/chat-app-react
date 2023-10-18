import useUser from "../../../../context/useUser";
import { Message as IMessage } from "../../../../interfaces";

export default function Message({ message }: { message: IMessage }) {
	const { user } = useUser();

	if (!user) return null;

	return (
		<div
			className="message-container"
			style={{
				width: "fit-content",
				maxWidth: "70%",
				marginLeft: message.senderId === user.uid ? "auto" : "1em",
				marginRight: message.senderId === user.uid ? "1em" : "auto",
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
