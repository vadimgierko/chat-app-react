import useUser from "../../../context/useUser";
// react-bootstrap components:
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import NavDropdown from "react-bootstrap/NavDropdown";
// react-router-bootstrap for link container:
import { LinkContainer } from "react-router-bootstrap";
//=============== ICONS =====================//
import { AiOutlineLogout, AiOutlinePlusSquare } from "react-icons/ai";
//=====================================================
import logo from "../../../icons/logo.svg";
import { BsPersonCircle } from "react-icons/bs";
import { logOut, signIn } from "../../../lib/index";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "../../../firebaseConfig";
import useUsers from "../../../context/useUsers";
import useUserChats from "../../../context/useUserChats";
import { useNavigate } from "react-router-dom";
import { Badge, Button } from "react-bootstrap";
import { useContext } from "react";
import { MaxWidthContext } from "..";

const testUserEmail = "testuser@gmail.com";
const testUserPassword = "";

export default function NavigationBar() {
	const { user } = useUser();
	const { users } = useUsers();
	const { userChats, notSeenUpdatedChats } = useUserChats();

	const maxWidth = useContext(MaxWidthContext);

	const navigate = useNavigate();

	const iconSize = 40;
	const avatarSize = 30;

	return (
		<Navbar collapseOnSelect expand="sm" bg="dark" variant="dark" fixed="top">
			<Container style={{ maxWidth: maxWidth }}>
				<LinkContainer to="/">
					<Navbar.Brand>
						<img
							src={logo}
							alt="react logo"
							width={iconSize}
							height={iconSize}
						/>{" "}
						VG Chat
					</Navbar.Brand>
				</LinkContainer>

				{user && <Navbar.Toggle />}

				<Navbar.Collapse>
					<Nav className="me-auto">
						{/* <hr />
						<LinkContainer to="/about">
							<Nav.Link>About</Nav.Link>
						</LinkContainer> */}
					</Nav>

					{/* <hr /> */}

					<Nav>
						{user && (
							<>
								<hr />

								<LinkContainer to="/users">
									<Nav.Link>users {users ? `(${users.length})` : ""}</Nav.Link>
								</LinkContainer>

								<LinkContainer to="/chats">
									<Nav.Link>
										chats {userChats ? `(${userChats.length})` : ""}
										{notSeenUpdatedChats.length ? (
											<Badge className="bg-success ms-1">new</Badge>
										) : null}
									</Nav.Link>
								</LinkContainer>

								<NavDropdown
									title={
										<>
											{user.displayName
												? user.displayName
												: user.email
												? user.email
												: "Anonimus"}{" "}
											{user.photoURL ? (
												<img
													width={avatarSize}
													height={avatarSize}
													src={user.photoURL}
													style={{ borderRadius: "50%" }}
													alt={`${user.displayName} avatar`}
												/>
											) : (
												<BsPersonCircle />
											)}
										</>
									}
									menuVariant="dark"
									drop="down-centered"
								>
									<LinkContainer
										to="/"
										onClick={async () => {
											await logOut(user);
											navigate("/");
										}}
									>
										<NavDropdown.Item>
											<AiOutlineLogout /> Log out
										</NavDropdown.Item>
									</LinkContainer>
								</NavDropdown>
							</>
						)}

						{/* {!user && (
							<Button
								variant="outline-secondary"
								onClick={() =>
									signInWithEmailAndPassword(
										auth,
										testUserEmail,
										testUserPassword
									)
								}
							>
								sign in as test user
							</Button>
						)} */}
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}
