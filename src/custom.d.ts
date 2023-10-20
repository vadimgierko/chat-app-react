declare module "react-router-bootstrap";

// This declaration tells TS how to handle .mp3 files and allows to import them as modules.
declare module "*.mp3" {
	const src: string;
	export default src;
}
