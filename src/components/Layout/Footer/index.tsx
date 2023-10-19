import { useContext } from "react";
import { MaxWidthContext } from "../../../App";
import { Container } from "react-bootstrap";

export default function Footer() {
	const maxWidth = useContext(MaxWidthContext);

	return (
		<Container
			as="footer"
			className="text-center text-secondary p-1"
			style={{ maxWidth: maxWidth }}
		>
			&copy; Vadim Gierko 2023
		</Container>
	);
}
