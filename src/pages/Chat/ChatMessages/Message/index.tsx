import { useEffect, useRef } from "react";
import useUser from "../../../../context/useUser";
import { Message as IMessage } from "../../../../interfaces";
import {
	getDateFromTimestamp,
	getUserById,
	isUserOnline,
	updateChatSeenAt,
} from "../../../../lib";
import useUsers from "../../../../context/useUsers";
import { BsPersonCircle } from "react-icons/bs";
import dompurify from "dompurify";

export default function Message({
	message,
	isLast = false,
	interlocutorSeenAt,
}: {
	message: IMessage;
	isLast: boolean;
	interlocutorSeenAt: number | null;
}) {
	const messageRef = useRef<HTMLDivElement | null>(null);
	const { user } = useUser();
	const { users } = useUsers();
	const interlocutor = getUserById(users!, message.senderId);

	function convertTextWithClickableLinks(text: string) {
		const urlRegex = /(https?:\/\/[^\s]+)/g;
		const linkifiedText = text.replace(
			urlRegex,
			'<a href="$1" target="_blank">$1</a>'
		);
		// console.log({ linkifiedText });
		return linkifiedText;
	}

	function sanitizeHTML(html: string) {
		const sanitized = dompurify.sanitize(html, {
			ALLOWED_TAGS: ["a"],
			ALLOWED_ATTR: ["href", "target"], // Allow the "target" attribute for _blank
		});
		return sanitized;
	}

	// 1. scroll to the last message;
	// 2. if this is interlocutor message => update seenAt
	useEffect(() => {
		if (!user) return;
		// 1. scroll to the last message:
		if (isLast) {
			// 2. if the last message was sent by interlocutor => update seenAt:
			if (message.receiverId === user.uid) {
				updateChatSeenAt(user, message.chatId);
			}

			if (messageRef.current) {
				messageRef.current.scrollIntoView();
			}
		}
	}, [isLast, message, user]);

	if (!user) return null;

	return (
		<div
			className="message-container"
			style={{
				textAlign: message.senderId === user.uid ? "end" : "start",
				marginBottom: "1em",
			}}
		>
			<span className="mb-1 d-block text-secondary">
				{getDateFromTimestamp(message.createdAt)}
			</span>
			<div
				style={{
					display: "flex",
				}}
			>
				{interlocutor && interlocutor.uid !== user.uid && (
					<div style={{ width: 30, height: 30, marginRight: "0.5em" }}>
						{interlocutor.photoURL ? (
							<img
								src={interlocutor.photoURL}
								alt="interlocutor avatar"
								width="100%"
								style={{
									borderRadius: "50%",
									marginTop: "0.5em",
								}}
							/>
						) : (
							<BsPersonCircle
								size={30}
								style={{
									borderRadius: "50%",
									marginTop: "0.5em",
								}}
							/>
						)}
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
				)}

				<div
					style={{
						width: "fit-content",
						maxWidth: "70%",
						marginLeft: message.senderId === user.uid ? "auto" : "0.5em",
						marginRight: message.senderId === user.uid ? 0 : "auto",
						// textAlign: message.senderId === user.uid ? "end" : "start",
						backgroundColor:
							message.senderId === user.uid
								? "rgb(29, 61, 107)"
								: "rgb(38, 41, 48)",
						borderRadius: "12px",
						marginBottom: "1em",
					}}
				>
					<pre
						className="custom-pre text-start"
						style={{
							paddingTop: "0.5em",
							paddingLeft: "0.5em",
							paddingRight: "0.5em",
							// THIS BELOW IS NEEDED TO STYLE PRE TEXT AS NORMAL BOOTSTRAP TEXT:
							fontFamily: "inherit",
							fontSize: "inherit",
							// THIS BELOW IS NEEDED TO WRAP THE REALLY LONG LINES, BUT PRESERVE MULTILINE TEXT:
							// THIS IS IN CSS FILE !!! :
							// whiteSpace: "pre-wrap",
							// wordWrap: "break-word", // Add this line to enable word wrapping => only in case of <a>
						}}
						dangerouslySetInnerHTML={{
							__html: sanitizeHTML(
								convertTextWithClickableLinks(message.content)
							),
						}}
					></pre>

					<span ref={messageRef} />
				</div>
			</div>
			{message.senderId === user.uid &&
				interlocutorSeenAt &&
				interlocutorSeenAt > message.createdAt && (
					<span className="text-end text-secondary">seen</span>
				)}
		</div>
	);
}
