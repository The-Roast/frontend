import "./styles/NewsletterCard.css";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { simpleCrypto, BACKEND_URL } from "../HTTP";
import Ticker, { FinancialTicker, NewsTicker } from "nice-react-ticker";

const NewsletterCard = (data) => {
	const navigate = useNavigate();
	const newsletter = data.newsletter;
	const digest = data.digest;

	const handleCardClick = () => {
		console.log("clicked!");
		const path = `/newsletter/${newsletter.uuid}`;
		navigate(path, { state: { newsletter: newsletter } });
	};

	return (
		<div className={`newsletter-card`} onClick={() => handleCardClick()}>
			<div className="newsletter-container">
				<div className="newsletter-header">
					<div className="newsletter-title-wrapper">
						<span>{digest.name}</span>
					</div>
				</div>
				<hr />

				<div className="newsletter-info">
					<div
						className="newsletter-circle"
						style={{ backgroundColor: `${digest.color}` }}
					></div>
					<p>{newsletter.date ? newsletter.date : "08-13-2023"}</p>
				</div>
				<hr />
				<div className="newsletter-title">{newsletter.title}</div>
				<div className="newsletter-body">
					{newsletter.body.map((data, index) => (
						<p>{data.title}</p>
					))}
				</div>
			</div>
		</div>
	);
};

export default NewsletterCard;
