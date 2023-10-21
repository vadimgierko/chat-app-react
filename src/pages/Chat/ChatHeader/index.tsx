import { BsPersonCircle } from "react-icons/bs";
import { FirestoreUser } from "../../../interfaces";
import { getDateFromTimestamp, isUserOnline } from "../../../lib";

export default function ChatHeader({
	interlocutor,
	messagesNum,
}: {
	interlocutor: FirestoreUser;
	messagesNum: number;
}) {
	return (
		<>
			<div
				className="p-1 h2 d-flex"
				style={{ backgroundColor: "rgb(23, 24, 27)", justifyContent: "center" }}
			>
				<div className="me-2">
					{interlocutor.photoURL ? (
						<img
							width={30}
							style={{ borderRadius: "50%" }}
							src={interlocutor.photoURL}
							alt={`${interlocutor.displayName} avatar`}
						/>
					) : (
						<BsPersonCircle />
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
							marginTop: -7,
							marginLeft: 23,
						}}
					></div>
				</div>

				<div>
					<div>
						{interlocutor.displayName}{" "}
						{messagesNum > 0 && (
							<span className="text-secondary">({messagesNum})</span>
						)}
					</div>
					{!isUserOnline(interlocutor) && interlocutor.signedOutAt && (
						<div className="text-secondary" style={{ fontSize: 10 }}>
							Last seen at {getDateFromTimestamp(interlocutor.signedOutAt)}
						</div>
					)}
				</div>
			</div>
		</>
	);
}
