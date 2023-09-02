import React, { useState, useRef, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import "./styles/CustomColorPicker.css";

const CustomColorPicker = (data) => {
	const { currentColor, onChange } = data;
	const [showPicker, setShowPicker] = useState(false);
	console.log(currentColor);
	return (
		<div className="color-picker-container">
			<div
				className="color-circle"
				style={{
					backgroundColor: `${currentColor}`,
				}}
				onClick={() => setShowPicker(!showPicker)}
			></div>
			{showPicker ? (
				<div className="color-picker-popup">
					<HexColorPicker color={currentColor} onChange={onChange} />
					<div className="color-info">{currentColor}</div>
				</div>
			) : (
				<input
					className="color-info"
					type="text"
					value={currentColor}
					onChange={(e) => onChange(e.target.value)}
				/>
			)}
		</div>
	);
};

export default CustomColorPicker;
