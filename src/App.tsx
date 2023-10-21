import { Outlet, useMatch, useNavigate } from "react-router-dom";
import useUser from "./context/useUser";
import SignIn from "./pages/SignIn";
import Footer from "./components/Layout/Footer";
import NavigationBar from "./components/Layout/Navbar";
import { Container } from "react-bootstrap";
import { createContext, useCallback, useEffect } from "react";

const maxWidth: number = 900;
export const MaxWidthContext = createContext<number>(maxWidth);

function App() {
	const { user } = useUser();
	const navigate = useNavigate();
	const isRootRoute = useMatch("/");

	const redirectToChats = useCallback(() => navigate("/chats"), [navigate]);

	useEffect(() => {
		if (user && isRootRoute) {
			redirectToChats();
		}
	}, [isRootRoute, redirectToChats, user]);

	return (
		<MaxWidthContext.Provider value={maxWidth}>
			<div
				className="text-light"
				style={{
					backgroundColor: "rgb(23, 24, 27)",
					display: "flex",
					flexDirection: "column",
					minHeight: "100vh",
				}}
			>
				<NavigationBar />
				<Container
					as="main"
					style={{
						maxWidth: maxWidth,
						marginTop: "80px",
						overflowY: "auto",
						display: "flex",
						flexDirection: "column",
					}}
				>
					{user ? <Outlet /> : <SignIn />}
				</Container>
				<Footer />
			</div>
		</MaxWidthContext.Provider>
	);
}

export default App;
