import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./Read.scss";
import APIURL from "./APIURL";
import { Buffer } from "buffer";
import { useUser, useAuth } from "@clerk/clerk-react";

const Read = () => {
	const [post, setPost] = useState();
	// 31 Get the ID from the URL
	const { id } = useParams();
	const navigateTo = useNavigate();
	const { user } = useUser();
	const { getToken } = useAuth();

	// console.log(timestamp);

	const makeAPICall = async () => {
		//33 When the page loads make an API call to get the specific ID from the DB
		const response = await fetch(`${APIURL}/post/${id}`);
		// 35 Parses data from #34 on backend
		const data = await response.json();
		//36 Sets into state
		setPost(data.post);

		console.log(data.post);
	};

	useEffect(() => {
		makeAPICall();
	}, [id]);

	const deletePost = async () => {
		if (window.confirm("Are you sure you want to delete?")) {
			await fetch(`${APIURL}/post/${id}`, { method: "DELETE" });
			navigateTo("/");
		}
	};

	const postComment = async (event) => {
		event.preventDefault();

		const token = await getToken();

		const response = await fetch(`${APIURL}/comment`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({
				author: event.target.elements.author.value,
				content: event.target.elements.content.value,
				postID: id,
			}),
		});

		const data = await response.json();
		console.log(data);
		setPost({ ...post, comments: data.comments });
	};

	if (!post) {
		return <h1>Hold your 🐴</h1>;
	}

	//37 Show the info in state from the DB
	return (
		<div id="read">
			<h2>{post.title}</h2>
			<h5>{post.author}</h5>
			<h6>{new Date(post.updatedAt).toLocaleString()}</h6>
			<hr />
			{post.image ? (
				<img
					src={`data:${post.imageType};base64,${Buffer.from(
						post.image.data
					).toString("base64")}`}
					style={{ maxWidth: "100%" }}
				/>
			) : null}
			<p>{post.content}</p>
			<Link to="/">Return to Home</Link>
			<button className="btn btn-danger" onClick={deletePost}>
				Delete Post
			</button>

			<hr />
			{user && (
				<form onSubmit={postComment}>
					<label>Comment text:</label>
					<textarea id="content" className="form-control"></textarea>

					<label>Name:</label>
					<input type="text" id="author" className="form-control" />

					<button type="submit" className="btn btn-success">
						Post
					</button>
				</form>
			)}
			<hr />
			{post.comments.map((comment) => {
				console.log(comment);
				return (
					<div key={comment.id}>
						<h6>{comment.author}</h6>
						<img
							src={`/images/${comment.commentPicturePath}`}
							style={{ height: 100 }}
						/>
						<p>{comment.content}</p>
						<ul>
							{comment.commentReplies.map((reply) => {
								return (
									<li key={reply.id}>
										{reply.content}{" "}
										<span
											style={{
												color: "red",
												textDecoration: "underline",
												cursor: "pointer",
											}}
											onClick={async () => {
												await fetch(
													`${APIURL}/commentReply/${reply.id}`,
													{
														method: "DELETE",
													}
												);

												makeAPICall();
											}}
										>
											Delete
										</span>
									</li>
								);
							})}
						</ul>
						<form
							onSubmit={async (event) => {
								event.preventDefault();
								const response = await fetch(
									`${APIURL}/commentReply/${comment.id}`,
									{
										headers: {
											"Content-Type": "application/json",
										},
										method: "POST",
										body: JSON.stringify({
											text: event.target.elements
												.replyText.value,
										}),
									}
								);

								makeAPICall();
							}}
						>
							<input type="text" id="replyText" />
							<button className="btn btn-primary" type="submit">
								Reply
							</button>
						</form>
						<hr />
					</div>
				);
			})}
		</div>
	);
};

export default Read;
