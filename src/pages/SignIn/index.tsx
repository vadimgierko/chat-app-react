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
					<strong>Sign in/up with Google account</strong> and start a chat with
					registered users for <strong>free</strong>.
				</p>
				<p>
					You are able to see users' & interlocutors'{" "}
					<strong>online status</strong>, when they were{" "}
					<strong>last seen</strong> & <strong>last seen message</strong>.
				</p>
				<p>
					You'll get <strong>visual & sound notifications</strong>.
				</p>
				<p>
					You can send <strong>multiline messages</strong> & add{" "}
					<strong>clickable links</strong> to your messages, which will be
					opened in a different tab.
				</p>
				<p>
					The <strong>app can be added to the desktop/ phone screen</strong> &
					will <strong>notify about updates</strong> when app will be reloaded
					or tab will be closed.
				</p>
				<p>Enjoy & invite your friends!</p>

				<hr className="text-secondary" />

				<p className="text-secondary">
					If you don't know any user in the app, feel free to start the chat
					with me (Vadim Gierko) to test the app & talk to the creator 😉
				</p>
			</section>
		</div>
	);
}
