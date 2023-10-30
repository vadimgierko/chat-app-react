import useUsers from "../../context/useUsers";
import UsersList from "./UsersList";

export default function Users() {
	const { users } = useUsers();

	const NoUsers = () => (
		<p style={{ textAlign: "center", color: "red" }}>
			There are no users in the app yet... Invite your friends to be here!
		</p>
	);

	return (
		<div className="users-page">
			<h1 style={{ textAlign: "center" }}>
				Users{users && users.length ? ` (${users.length})` : null}
			</h1>
			<hr />
			{users ? <UsersList users={users} /> : <NoUsers />}
		</div>
	);
}
