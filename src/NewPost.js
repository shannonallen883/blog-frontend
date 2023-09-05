import { useNavigate } from "react-router-dom";
import {
	RedirectToSignIn,
	SignedIn,
	SignedOut,
	useAuth,
	useUser,
} from "@clerk/clerk-react";
import { useEffect } from "react";
const NewPost = () => {
	const navigateTo = useNavigate();
	const { getToken } = useAuth();
	const { user } = useUser();

	useEffect(() => {
		if (!user || !user.publicMetadata.admin) {
			navigateTo("/");
		}
	}, []);

	//38 When the form is submitted to make a new post
	const createPost = async (event) => {
		event.preventDefault();

		const token = await getToken();
		console.log(token);

		const formData = new FormData(event.target);

		//40 Send the form values to the backend via a post request
		const response = await fetch(`http://localhost:3011/newPost`, {
			method: "POST",
			body: formData,
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		const data = await response.json();

		if (data.error) {
			alert(response.error);
		}
		//43 After the values are saved into the DB,
		//navigate back to the homepage
		navigateTo("/");
	};

	return (
		<div className="container">
			<SignedOut>
				<RedirectToSignIn />
			</SignedOut>
			<SignedIn>
				<h1>New Post</h1>
				<hr />
				<form onSubmit={createPost}>
					<div className="mb-3">
						<label htmlFor="title" className="form-label">
							Title
						</label>
						<input
							type="text"
							className="form-control"
							name="title"
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="content" className="form-label">
							Content
						</label>
						<textarea
							className="form-control"
							name="content"
							rows="3"
						></textarea>
					</div>
					<div className="mb-3">
						<label htmlFor="tagline" className="form-label">
							Tagline
						</label>
						<input
							type="text"
							className="form-control"
							name="tagline"
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="image" className="form-label">
							Image
						</label>
						<input type="file" name="photo" />
					</div>
					<button type="submit" className="btn btn-success">
						Create Post
					</button>
				</form>
			</SignedIn>
		</div>
	);
};

export default NewPost;
