import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Users from "./pages/Users";
import { UserProvider } from "./context/useUser";
import { UsersProvider } from "./context/useUsers";
import Chat from "./pages/Chat";
import Chats from "./pages/Chats";
import { UserChatsProvider } from "./context/useUserChats";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
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

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(
	<React.StrictMode>
		<UserProvider>
			<UsersProvider>
				<UserChatsProvider>
					<RouterProvider router={router} />
				</UserChatsProvider>
			</UsersProvider>
		</UserProvider>
	</React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorkerRegistration.unregister();
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
