import { useState } from "react";
import DropdownFilterIcon from "../Pages/images/dropdown-filter.svg";
import "./styles/NewsletterFilter.css";

const DropdownMenu = ({ data }) => {
	return (
		<div className="dropdown">
			{data.map((item, index) => (
				<label key={index}>
					<div
						className={`custom-checkbox ${item.value ? "checked" : ""}`}
						onClick={item.onChange}
					>
						<div className="checkbox-icon">
							{item.value && <div className="checkmark"></div>}
						</div>
						<div className="checkbox-label">{item.label}</div>
					</div>
				</label>
			))}
			<label>
				Limit:
				<input type="number" />
			</label>
		</div>
	);
};

const NewsletterFilter = ({ data }) => {
	const [showFilters, setShowFilters] = useState(false);

	const handleFilterDisplay = () => {
		setShowFilters(!showFilters);
	};

	return (
		<div className={`filter-dropdown`}>
			<button onClick={() => handleFilterDisplay()}>
				<img src={DropdownFilterIcon} alt="Dropdown filter icon" />
			</button>
			{showFilters ? <DropdownMenu data={data} /> : null}
		</div>
	);
};

export default NewsletterFilter;
