import "./styles/NewsletterCard.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NewsletterCard = (data) => {
	const navigate = useNavigate();
	const newsletter = data.newsletter;
	const digest = data.digest;

	const index = data.index;

	const [animationProps, setAnimationProps] = useState({});
	const [isHovered, setIsHovered] = useState(false);
	const notAnimatedProps = { animationPlayState: "paused" };

	useEffect(() => {
		const multiplier = Math.round(Math.random()) * 2 - 1;
		const randomDuration = 5 + Math.random() * 2 * multiplier;

		setAnimationProps({
			animationName: "ticker-slide",
			animationDuration: `${randomDuration}s`,
			animationTimingFunction: "linear",
			animationIterationCount: "infinite",
			transform: `translateX(${Math.random() * 200 - 100}%)`,
		});
	}, []);

	const handleCardClick = () => {
		console.log("clicked!");
		const path = `/newsletter/${newsletter.uuid}`;
		navigate(path, { state: { newsletter: newsletter } });
	};

	return (
		<div
			className={`newsletter-card`}
			style={{ backgroundColor: index % 5 === 0 ? "#FCF9E1" : "#F9F9F6" }}
			onClick={() => handleCardClick()}
		>
			<div className="newsletter-container">
				<div className="newsletter-header">
					<div
						className={"newsletter-title-wrapper"}
						style={{
							...animationProps,
							...(isHovered ? notAnimatedProps : {}),
						}}
						onMouseEnter={() => setIsHovered(true)}
						onMouseLeave={() => setIsHovered(false)}
					>
						{digest.name}
					</div>
				</div>
				<hr />

				<div className="newsletter-info">
					<p>{newsletter.date ? newsletter.date : "08-13-2023"}</p>

					<div
						className="newsletter-circle"
						style={{ backgroundColor: `${digest.color}` }}
					></div>
				</div>
				<hr />
				<div className="newsletter-title">{newsletter.title}</div>
				<div className="newsletter-body">
					<ul>
						{newsletter.body.map((data, index) => (
							<li key={index}>
								<p>{data.title}</p>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default NewsletterCard;
