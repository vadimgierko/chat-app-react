import { useParams } from "react-router-dom";
import useUsers from "../../context/useUsers";
import { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { firestore } from "../../firebaseConfig";
import useUser from "../../context/useUser";
import { getTimestamp, sendMessage } from "../../lib";
import useUserChats from "../../context/useUserChats";
import { Chat as IChat } from "../../interfaces";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import ChatHeader from "./ChatHeader";
import Container from "react-bootstrap/Container";

export default function Chat() {
	const { id: chatId } = useParams();
	const [chat, setChat] = useState<IChat | null>(null);

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
				if (doc.exists()) {
					const data = doc.data() as IChat;
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

	// when user visits chat,
	// update chat.seenAt:
	useEffect(() => {
		async function updateChatSeenAt() {
			if (!user || !chatId) return;

			console.log("Updating chat's seenAt prop...");

			const timestamp = getTimestamp();

			try {
				const userChatRef = doc(firestore, "user-chats", user.uid);

				await updateDoc(userChatRef, {
					[`${chatId}.seenAt`]: timestamp,
				});
			} catch (error) {
				console.log(error);
				alert(error);
			}
		}

		if (user && chatId) {
			// if it's set, than it will not change, so it runs once:
			updateChatSeenAt();
		}
	}, [chatId, user]);

	useEffect(() => console.log({ chat }), [chat]);

	if (!chat) return <p style={{ color: "red" }}>There is no such chat...</p>;
	if (!interlocutor)
		return <p style={{ color: "red" }}>There is no such interlocutor...</p>;
	if (!user) return <p style={{ color: "red" }}>You need to be logged...</p>;

	return (
		<div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
			<ChatHeader interlocutor={interlocutor} />

			<ChatMessages chatId={chat.id} messages={chat.messages} />

			<ChatInput onSend={handleSendMessage} />
		</div>
	);
}
