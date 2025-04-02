import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Users from "./pages/Users";
import Chats from "./pages/Chats";
import Chat from "./pages/Chat";
import Layout from "./components/Layout";
import SignIn from "./pages/SignIn";

export default function App() {
	const router = createBrowserRouter([
		{
			path: "/",
			element: <Layout />,
			children: [
				{
					path: "users",
					element: <Users />,
				},
				{
					path: "chats",
					element: <Chats />,
				},
				{
					path: "chats/:id",
					element: <Chat />,
				},
				{
					path: "about",
					element: <SignIn />,
				},
			],
		},
	]);

	return <RouterProvider router={router} />;
}
