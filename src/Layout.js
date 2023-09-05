import { Outlet } from "react-router-dom";

const Layout = () => {
	return (
		<div className="container">
			<h1>Max's Blog</h1>
			<hr />
			<Outlet />
			{/* <Navbar /> */}
		</div>
	);
};

// const Navbar = () => {
// 	return (
// 		<div>
// 			<a href="https://google.com">Google</a>
// 		</div>
// 	);
// };

export default Layout;
