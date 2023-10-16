import signIn from "../../lib/signIn";

export default function SignIn() {
	return (
		<div className="sign-in">
			<button onClick={signIn}>Sign in with Google</button>
		</div>
	);
}
