import { useNavigate } from "react-router-dom";
import { signIn } from "../../lib";
import Button from "react-bootstrap/Button";

export default function SignIn() {
	const navigate = useNavigate();

	async function handleSignIn() {
		await signIn();
		navigate("/chats", { replace: true });
	}

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				flexGrow: 1,
			}}
		>
			<Button variant="outline-light" onClick={handleSignIn}>
				Sign in with Google
			</Button>
		</div>
	);
}
