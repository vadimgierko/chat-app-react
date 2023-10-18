import { useState } from "react";
import { BsSend } from "react-icons/bs";

export default function ChatInput({
	onSend,
}: {
	onSend: (input: string) => Promise<void>;
}) {
	const [input, setInput] = useState("");

	return (
		<div className="chat-input">
			<textarea
				value={input}
				onChange={(e) => setInput(e.target.value)}
				placeholder="type something..."
			/>
			<button
				onClick={async () => {
					if (!input.trim().length)
						return alert("You cannot send empty message! Type something!");

					await onSend(input);

					// clear state:
					setInput("");
				}}
			>
				<BsSend />
			</button>
		</div>
	);
}
