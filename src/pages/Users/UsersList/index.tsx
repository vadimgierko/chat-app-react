import { useNavigate } from "react-router-dom";
import { BsPersonCircle, BsPlusSquare, BsSend } from "react-icons/bs";
import useUserChats from "../../../context/useUserChats";
import { useEffect } from "react";
import useUser from "../../../context/useUser";
import { FirestoreUser } from "../../../interfaces";

export default function UsersList({ users }: { users: FirestoreUser[] }) {
	const navigate = useNavigate();
	const { user } = useUser();
	const { userChats } = useUserChats();

	const interlocutorsIds =
		userChats && userChats.length
			? userChats.map((chat) => chat.interlocutorId)
			: [];

	const interlocutors = users.filter((u) =>
		interlocutorsIds.find((id) => u.uid === id)
	);

	const noninterlocutors = users.filter(
		(u) => !interlocutorsIds.find((id) => u.uid === id)
	);

	useEffect(() => console.log({ interlocutors }));

	return (
		<ul className="users-list">
			{userChats &&
				interlocutors.map((u) => (
					<li key={u.uid}>
						{u.photoURL ? (
							<img
								width={30}
								style={{ borderRadius: "50%" }}
								src={u.photoURL}
								alt={`${u.displayName} avatar`}
							/>
						) : (
							<BsPersonCircle />
						)}
						{u.displayName}{" "}
						<BsSend
							onClick={() =>
								navigate(
									`/chats/${
										userChats.filter((chat) => chat.interlocutorId === u.uid)[0]
											.id // there can be only one user's chat with the intelocutor !!!
									}`
								)
							}
							style={{ cursor: "pointer" }}
						/>
					</li>
				))}
			{noninterlocutors.map((u) => (
				<li key={u.uid}>
					{u.photoURL ? (
						<img
							width={30}
							style={{ borderRadius: "50%" }}
							src={u.photoURL}
							alt={`${u.displayName} avatar`}
						/>
					) : (
						<BsPersonCircle />
					)}
					{u.displayName}{" "}
					{user &&
						u.uid !== user.uid && ( // do not add btn for logged user !!!
							<BsPlusSquare
								onClick={() => {
									// TODO:
									// 1. CREATE NEW CHAT & GET CHAT ID
									// 2. NAVIGATE TO NEW CHAT
								}}
								style={{ cursor: "pointer" }}
							/>
						)}
				</li>
			))}
		</ul>
	);
}
