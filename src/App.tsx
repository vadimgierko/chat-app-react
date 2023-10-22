import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Users from "./pages/Users";
import Chats from "./pages/Chats";
import Chat from "./pages/Chat";
import Layout from "./components/Layout";

function App() {
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
			],
		},
	]);

	return <RouterProvider router={router} />;
}

export default App;
