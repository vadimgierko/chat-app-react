import { useParams } from "react-router-dom";
import useUsers from "../../context/useUsers";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "../../firebaseConfig";
import useUser from "../../context/useUser";
import { sendMessage } from "../../lib";
import useUserChats from "../../context/useUserChats";
import { Chat as IChat, UserChat } from "../../interfaces";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import ChatHeader from "./ChatHeader";

export default function Chat() {
	const { id: chatId } = useParams();
	const [chat, setChat] = useState<IChat | null>(null);

	const [interlocutorSeenAt, setInterlocutorSeenAt] = useState<number | null>(
		null
	); // when interlocutor seen chat

	const { user } = useUser();
	const { users } = useUsers();
	const { userChats } = useUserChats();

	const userChat = userChats?.find((c) => c.id === chatId);
	const interlocutor = users?.find((u) => u.uid === userChat?.interlocutorId);

	async function handleSendMessage(content: string) {
		if (!user) return alert("No logged user... Cannot send the message...");
		if (!interlocutor)
			return alert("No interlocutor provided... Cannot send the message...");
		if (!chat)
			return alert("No chat data provided... Cannot send the message...");

		console.log("Sending message...");
		await sendMessage(content, user.uid, interlocutor.uid, chat.id);
	}

	// fetch chat & listen to updates:
	useEffect(() => {
		let unsubscribe;

		if (chatId) {
			console.log("fetching chat messages...");
			unsubscribe = onSnapshot(doc(firestore, "chats", chatId), (doc) => {
				const maxDocumentSize = 1048576; // 1 MiB in bytes

				if (doc.exists()) {
					const data = doc.data() as IChat;

					// check the aproximate size of doc & % of max size taken:
					const dataSize = JSON.stringify(data).length * 2; // Assuming 2 bytes per character (but remember that special chars, like emoji can be 4 bytes per char!!!)
					const percentageUsed = (dataSize / maxDocumentSize) * 100;
					console.log("Document size in bytes:", dataSize);
					console.log(
						"Percentage of maximum doc size:",
						percentageUsed.toFixed(2) + "%"
					);
					//================================================================================//

					setChat(data);
				} else {
					console.error("There is no such chat doc...");
				}
			});
		} else {
			setChat(null);
		}

		return unsubscribe;
	}, [chatId]);

	// fetch & listen to intelocutor's seenAt:
	useEffect(() => {
		let unsubscribe;

		if (interlocutor && chatId) {
			console.log("fetching interlocutor's seenAt...");
			unsubscribe = onSnapshot(
				doc(firestore, "user-chats", interlocutor.uid),
				(doc) => {
					if (doc.exists()) {
						const data = doc.data();
						const interlocutorChat = data[chatId] as UserChat;

						setInterlocutorSeenAt(interlocutorChat.seenAt);
					} else {
						console.error("There is no interlocutor user chat doc...");
					}
				}
			);
		} else {
			setInterlocutorSeenAt(null);
		}

		return unsubscribe;
	}, [chatId, interlocutor]);

	if (!chat) return <p style={{ color: "red" }}>There is no such chat...</p>;
	if (!interlocutor)
		return <p style={{ color: "red" }}>There is no such interlocutor...</p>;
	if (!user) return <p style={{ color: "red" }}>You need to be logged...</p>;

	return (
		<div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
			<ChatHeader
				interlocutor={interlocutor}
				messagesNum={chat.messages.length}
			/>

			<ChatMessages
				messages={chat.messages}
				interlocutorSeenAt={interlocutorSeenAt}
				interlocutor={interlocutor}
			/>

			<ChatInput onSend={handleSendMessage} />
		</div>
	);
}
