import logo from "./icons/logo.svg";
import { Link, Outlet } from "react-router-dom";
import { auth } from "./firebaseConfig";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import useUser from "./context/useUser";
import { BsPersonCircle } from "react-icons/bs";

function App() {
	const { user } = useUser();

	async function signIn() {
		const provider = new GoogleAuthProvider();

		return signInWithPopup(auth, provider)
			.then(async (result) => {
				// This gives you a Google Access Token. You can use it to access the Google API.
				const credential = GoogleAuthProvider.credentialFromResult(result);
				const token = credential?.accessToken;
				// The signed-in user info.
				const user = result.user;
				// IdP data available using getAdditionalUserInfo(result)
				console.log({ user });
			})
			.catch((error) => {
				console.error(error);
				alert(error);
			});
	}

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				minHeight: "100vh",
			}}
		>
			<header
				style={{
					display: "flex",
					justifyContent: "space-between",
					// borderBottom: "0.5px solid black",
				}}
			>
				<h1 style={{ display: "flex" }}>
					<img src={logo} />
					<Link style={{ textDecoration: "none" }} to="/">
						VG Chat
					</Link>
				</h1>

				<div style={{ display: "flex" }}>
					{user && (
						<nav className="navbar">
							<ul style={{ listStyle: "none", display: "flex" }}>
								<li style={{ marginRight: "0.5em" }}>
									<Link to="/users">users</Link>
								</li>
								<li>
									<Link to="/chats">chats</Link>
								</li>
							</ul>
						</nav>
					)}
					{user && (
						<div>
							<span>{user.displayName}</span>
							{user.photoURL ? (
								<img
									height="auto"
									src={user.photoURL}
									style={{ borderRadius: "50%" }}
									alt={`${user.displayName} avatar`}
								/>
							) : (
								<BsPersonCircle />
							)}
						</div>
					)}
					<div>
						<button onClick={() => (user ? signOut(auth) : signIn())}>
							{user ? "log out" : "sign in"}
						</button>
					</div>
				</div>
			</header>

			<main style={{ flexGrow: 1 }}>
				<Outlet />
			</main>

			<footer
				style={{
					textAlign: "center",
					//paddingTop: "0.5em",
					marginBottom: "0.5em",
					//borderTop: "0.5px solid black",
				}}
			>
				created by Vadim Gierko 2023
			</footer>
		</div>
	);
}

export default App;
