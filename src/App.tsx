import { Outlet } from "react-router-dom";
import useUser from "./context/useUser";
import SignIn from "./pages/SignIn";
import Footer from "./components/Layout/Footer";
import NavigationBar from "./components/Layout/Navbar";
import { Container } from "react-bootstrap";

function App() {
	const { user } = useUser();

	return (
		<div
			className="bg-dark text-light"
			style={{
				display: "flex",
				flexDirection: "column",
				minHeight: "100vh",
			}}
		>
			<NavigationBar />
			<Container
				fluid
				as="main"
				style={{
					marginTop: "70px",
					overflowY: "auto",
					display: "flex",
					flexDirection: "column",
				}}
			>
				{user ? <Outlet /> : <SignIn />}
			</Container>
			<Footer />
		</div>
	);
}

export default App;
