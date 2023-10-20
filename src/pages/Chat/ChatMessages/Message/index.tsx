import { useEffect, useRef, useState } from "react";
import useUser from "../../../../context/useUser";
import { Message as IMessage } from "../../../../interfaces";
import {
	getDateFromTimestamp,
	getUserById,
	isUserOnline,
	notifyWithAsound,
} from "../../../../lib";
import useUsers from "../../../../context/useUsers";
import { BsPersonCircle } from "react-icons/bs";

export default function Message({
	message,
	isLast = false,
	lastlyNotifiedAt,
}: {
	message: IMessage;
	isLast: boolean;
	lastlyNotifiedAt: number | null;
}) {
	const messageRef = useRef<HTMLDivElement | null>(null);
	const { user } = useUser();
	const { users } = useUsers();
	const interlocutor = getUserById(users!, message.senderId);

	// this needed to prevent slight differences in miliseconds:
	const lastlyNotifiedAtInSeconds = lastlyNotifiedAt
		? Math.floor(lastlyNotifiedAt / 1000)
		: Math.floor(message.createdAt / 1000) - 0.1;
	const messageCreatedAtInSeconds = Math.floor(message.createdAt / 1000);

	// 1. scroll to the last message;
	// 2. if this is interlocutor message => notify
	useEffect(() => {
		if (!user) return;
		// 1. scroll to the last message:
		if (isLast) {
			// 2. if this is interlocutor message => notify:
			if (
				message.receiverId === user.uid &&
				lastlyNotifiedAtInSeconds < messageCreatedAtInSeconds
			) {
				notifyWithAsound(user.uid, message.chatId, "chat");
			}

			if (messageRef.current) {
				messageRef.current.scrollIntoView();

				// works for Alina:
				// if (message.receiverId === user.uid) {
				// 	notifyWithAsound(user.uid, message.chatId);
				// }
			}
		}
	}, [
		isLast,
		message,
		user,
		lastlyNotifiedAtInSeconds,
		messageCreatedAtInSeconds,
	]);

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
					<p
						className="message-content"
						style={{
							paddingTop: "0.5em",
							paddingLeft: "0.5em",
							paddingRight: "0.5em",
						}}
					>
						{message.content}
						<span ref={messageRef} />
					</p>
				</div>
			</div>
		</div>
	);
}
