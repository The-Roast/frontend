import React from "react";
import { SliderPicker } from "react-color";
import CustomColorPicker from "./CustomColorPicker";
import "./styles/SettingsGrid.css";

const SettingsGrid = ({ data }) => {
	return (
		<table className="settings-grid">
			<thead>
				<tr>
					<th className="filler-cell"></th>
					<th>Preference</th>
					<th>Value</th>
				</tr>
			</thead>
			<tbody>
				{data.map((item, index) => (
					<tr key={index} className="data-row">
						<td className="filler-cell"></td>
						<td>{item.preference}</td>
						<td>
							{item.preference === "Color" ? (
								<div className="color-picker">
									{/* <input
										type="text"
										value={item.value}
										onChange={item.onChange}
										className="color-info"
									/> */}
									<CustomColorPicker
										currentColor={item.value}
										onChange={item.onChange}
									/>
								</div>
							) : (
								<input
									type="text"
									value={item.value}
									onChange={item.onChange}
									style={{ width: "100%" }}
								/>
							)}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default SettingsGrid;
