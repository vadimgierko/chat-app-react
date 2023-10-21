import { signIn } from "../../lib";
import Button from "react-bootstrap/Button";

export default function SignIn() {
	return (
		<div className="text-center">
			<h1>Welcome to VG Chat!</h1>

			<Button variant="primary mt-3 mb-4" onClick={signIn}>
				Sign in with Google
			</Button>

			<section style={{ maxWidth: 375, margin: "auto" }}>
				<p>
					This app allows you to <strong>sign in/up with Google account</strong>{" "}
					and start a chat with registered users from the users list for{" "}
					<strong>free</strong>.
				</p>
				<p>
					You are able to see users' & interlocutors'{" "}
					<strong>online status</strong> & when they were{" "}
					<strong>last seen</strong>.
				</p>
				<p>
					You will also get a <strong>visual & sound notification</strong> about
					new/ unseen messages.
				</p>
				<p>
					The{" "}
					<strong>
						app can be optionally added to the desktop or phone screen
					</strong>{" "}
					& will <strong>automatically update</strong> to the newest version
					immediately when it will be available (no manual reloading or removing
					cookies needed).
				</p>
				<p>Enjoy & invite your friends!</p>
			</section>
		</div>
	);
}
