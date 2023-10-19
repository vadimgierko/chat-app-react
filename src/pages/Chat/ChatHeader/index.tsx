import { BsPersonCircle } from "react-icons/bs";
import { FirestoreUser } from "../../../interfaces";

export default function ChatHeader({
	interlocutor,
}: {
	interlocutor: FirestoreUser;
}) {
	return (
		<h1 className="bg-dark p-1">
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
	);
}
