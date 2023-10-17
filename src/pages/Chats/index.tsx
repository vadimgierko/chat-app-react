import { Link } from "react-router-dom";
import useUserChats from "../../context/useUserChats";
import ChatsList from "./ChatsList";

export default function Chats() {
	const { userChats } = useUserChats();

	const NoChats = () => (
		<p style={{ textAlign: "center", color: "red" }}>
			You have no chats yet... Invite someone to chat{" "}
			<Link to="/users">here</Link>!
		</p>
	);

	return (
		<div className="user-chats-page">
			<h1>Your chats</h1>
			<hr />
			{!userChats || !userChats.length ? (
				<NoChats />
			) : (
				<ChatsList chats={userChats} />
			)}
		</div>
	);
}