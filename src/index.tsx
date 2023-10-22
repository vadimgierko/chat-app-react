import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import { UserProvider } from "./context/useUser";
import { UsersProvider } from "./context/useUsers";
import { UserChatsProvider } from "./context/useUserChats";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(
	<React.StrictMode>
		<UserProvider>
			<UsersProvider>
				<UserChatsProvider>
					<App />
				</UserChatsProvider>
			</UsersProvider>
		</UserProvider>
	</React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorkerRegistration.unregister();

// serviceWorkerRegistration.register(); // this does not ensure auto updates without reloading the app or closing tabs...

serviceWorkerRegistration.register({
	onUpdate: (registration) => {
		const { waiting } = registration;

		if (waiting) {
			// Display an alert to inform the user about the update and force the update
			alert(
				"A new version of the app is available, so the app will be reloaded now to install updates."
			);
			// Send a message to the waiting service worker to skip waiting
			waiting.postMessage({ type: "SKIP_WAITING" });
			// Reload the page to use the new version
			waiting.addEventListener("statechange", (e) => {
				const serviceWorker = e.target as ServiceWorker;
				if (serviceWorker.state === "activated") {
					window.location.reload();
				}
			});
		}
	},
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
