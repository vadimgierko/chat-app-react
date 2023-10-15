import { useNavigate } from "react-router-dom";
import useUsers from "../../context/useUsers";
import { BsSend, BsPersonCircle } from "react-icons/bs";

export default function Users() {
	const { users } = useUsers();
	const navigate = useNavigate();

	return (
		<>
			<h1 style={{ textAlign: "center" }}>Users</h1>
			{users && (
				<ul>
					{users.map((u) => (
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
								onClick={() => navigate(`/chats/${u.uid}`)}
								style={{ cursor: "pointer" }}
							/>
						</li>
					))}
				</ul>
			)}
		</>
	);
}
