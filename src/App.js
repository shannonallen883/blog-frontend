import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Home";
import NewPost from "./NewPost";
import Read from "./Read.js";
import Layout from "./Layout";
import {
	ClerkProvider,
	SignedIn,
	SignedOut,
	RedirectToSignIn,
	SignIn,
	SignUp,
	UserButton,
	useUser,
	useAuth,
} from "@clerk/clerk-react";

const myRoutes = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			{
				path: "/",
				element: <Home />,
			},
			{
				path: "/newPost",
				element: <NewPost />,
			},
			{
				path: "/read/:id",
				element: <Read />,
			},
			// Clerk specific routes
			{
				path: "/sign-in/*",
				element: <SignIn routing="path" path="/sign-in" />,
			},
			{
				path: "/sign-up/*",
				element: <SignUp routing="path" path="/sign-up" />,
			},
		],
	},
	// {
	// 	path: "/admin",
	// 	element: <AdminLayout />,
	// 	children: [
	// 		{ path: "/setPassword", element: <SetPassword /> },
	// 		{ path: "/profile", element: <Profile /> },
	// 	],
	// },
]);

function App() {
	return (
		<ClerkProvider
			publishableKey="pk_test_Z3VpZGVkLWhlZGdlaG9nLTQuY2xlcmsuYWNjb3VudHMuZGV2JA"
			navigate={(to) => myRoutes.navigate(to)}
		>
			<div className="App">
				<RouterProvider router={myRoutes} />
			</div>
		</ClerkProvider>
	);
}

export default App;
