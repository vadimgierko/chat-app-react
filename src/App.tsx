import logo from "./icons/logo.svg";
import { Link, Outlet } from "react-router-dom";
import useUser from "./context/useUser";
import { BsPersonCircle } from "react-icons/bs";
import SignIn from "./pages/SignIn";
import { logOut, signIn } from "./lib";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseConfig";

const testUserEmail = "testuser@gmail.com";
const testUserPassword = "spss2020";

function App() {
	const { user } = useUser();

	return (
		<div className="layout">
			<header
				style={{
					display: "flex",
					justifyContent: "space-between",
					// borderBottom: "0.5px solid black",
				}}
			>
				<div style={{ display: "flex" }}>
					<img src={logo} alt="react logo" />
					<Link style={{ textDecoration: "none" }} to="/">
						VG Chat
					</Link>
				</div>

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
									width="40px"
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
						<button
							onClick={async () =>
								user
									? logOut()
									: signInWithEmailAndPassword(
											auth,
											testUserEmail,
											testUserPassword
									  )
							}
						>
							{user ? "log out test user" : "sign in as test user"}
						</button>
					</div>
					<div>
						<button onClick={() => (user ? logOut() : signIn())}>
							{user ? "log out" : "sign in"}
						</button>
					</div>
				</div>
			</header>

			<main>{user ? <Outlet /> : <SignIn />}</main>

			<footer>created by Vadim Gierko 2023</footer>
		</div>
	);
}

export default App;
