import { useState } from "react";
import { BsSend } from "react-icons/bs";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

export default function ChatInput({
	onSend,
}: {
	onSend: (input: string) => Promise<void>;
}) {
	const [input, setInput] = useState("");

	return (
		<div className="bg-dark">
			<InputGroup>
				<Form.Control
					as="textarea"
					className="bg-dark text-light"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="type something..."
				/>
				<Button
					variant="primary"
					style={{ width: "3em" }}
					onClick={async () => {
						if (!input.trim().length)
							return alert("You cannot send empty message! Type something!");

						await onSend(input);

						// clear state:
						setInput("");
					}}
				>
					<BsSend />
				</Button>
			</InputGroup>
		</div>
	);
}
