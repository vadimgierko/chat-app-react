import { useContext } from "react";
import { Container } from "react-bootstrap";
import { BsGithub, BsGlobe } from "react-icons/bs";
import { AiOutlineGithub } from "react-icons/ai";
import { MaxWidthContext } from "..";

export default function Footer() {
	const maxWidth = useContext(MaxWidthContext);

	const creationYear = 2023;
	const currentYear = new Date().getFullYear();

	return (
		<Container
			as="footer"
			className="text-center text-secondary p-1"
			style={{ maxWidth: maxWidth }}
		>
			&copy;{" "}
			{creationYear
				? creationYear === currentYear
					? creationYear.toString()
					: creationYear.toString() + currentYear.toString()
				: currentYear.toString()}{" "}
			Vadim Gierko{" "}
			<a
				className="footer-icon-link mx-1"
				href="https://vadimgierko.com"
				target="_blank"
				rel="noreferrer"
			>
				<BsGlobe className="mb-1" />
			</a>{" "}
			|{" "}
			<a
				className="footer-icon-link mx-1"
				href="https://github.com/vadimgierko"
				target="_blank"
				rel="noreferrer"
			>
				<BsGithub className="mb-1" />
			</a>{" "}
			|{" "}
			<a
				style={{ textDecoration: "none" }}
				className="footer-icon-link ms-1"
				href="https://github.com/vadimgierko/chat-app-react"
				target="_blank"
				rel="noreferrer"
			>
				{`<code/>`}
			</a>
		</Container>
	);
}
