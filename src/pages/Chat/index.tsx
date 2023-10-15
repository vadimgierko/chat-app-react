import { useParams } from "react-router-dom";
import useUsers from "../../context/useUsers";
import { BsPersonCircle } from "react-icons/bs";

export default function Chat() {
	const { uid } = useParams(); // this is the uid of the user logged user is chatting with
	const { users } = useUsers();
	const interlocutor = users?.find((u) => u.uid === uid);

	if (!interlocutor) return <p>There is no such interlocutor...</p>;

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
			<textarea placeholder="type something..." />
		</div>
	);
}
