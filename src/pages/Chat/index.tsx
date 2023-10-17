import { useParams } from "react-router-dom";
import useUsers from "../../context/useUsers";
import { BsPersonCircle } from "react-icons/bs";
import { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { firestore } from "../../firebaseConfig";
import useUser from "../../context/useUser";
import { getTimestamp } from "../../lib";
import useUserChats from "../../context/useUserChats";
import { Chat as IChat } from "../../interfaces";

export default function Chat() {
	const { id: chatId } = useParams();
	const [chat, setChat] = useState<IChat | null>(null);

	const { user } = useUser();
	const { users } = useUsers();
	const { userChats } = useUserChats();

	const userChat = userChats?.find((c) => c.id === chatId);
	const interlocutor = users?.find((u) => u.uid === userChat?.interlocutorId);

	// fetch chat & listen to updates:
	useEffect(() => {
		let unsubscribe;

		if (chatId) {
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
				const userChatRef = doc(firestore, "user-chats", `${user.uid}`);
				await updateDoc(userChatRef, {
					[chatId]: { ...userChat, seenAt: timestamp },
				});
			} catch (error) {
				console.log(error);
				alert(error);
			}
		}

		updateChatSeenAt();
	}, []);

	useEffect(() => console.log({ chat }), [chat]);

	if (!chat) return <p style={{ color: "red" }}>There is no such chat...</p>;
	if (!interlocutor)
		return <p style={{ color: "red" }}>There is no such interlocutor...</p>;

	return (
		<div>
			<h1>
				{interlocutor.photoURL ? (
					<img
						width={30}
						style={{ borderRadius: "50%" }}
						src={interlocutor.photoURL}
						alt={`${interlocutor.displayName} avatar`}
					/>
				) : (
					<BsPersonCircle />
				)}{" "}
				{interlocutor.displayName}
			</h1>
			<div className="chat-messages" style={{ height: "200px" }}>
				{chat.messages.length
					? "There are messages in chat! (but not implemented yet...)"
					: "There are no messages yet..."}
			</div>
			<textarea placeholder="type something..." />
		</div>
	);
}
