import { createContext, useCallback, useEffect } from "react";
import NavigationBar from "./Navbar";
import Container from "react-bootstrap/Container";
import { Outlet, useNavigate, useMatch } from "react-router-dom";
import SignIn from "../../pages/SignIn";
import useUser from "../../context/useUser";
import Footer from "./Footer";

const maxWidth: number = 900;
export const MaxWidthContext = createContext<number>(maxWidth);

export default function Layout() {
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
					minHeight: "100dvh",
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
