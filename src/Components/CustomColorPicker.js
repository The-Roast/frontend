import React, { useState, useRef, useEffect } from "react";
import { hexToHSL, hslToHex } from "./ColorUtils";
import "./styles/CustomColorPicker.css";

const CustomColorPicker = ({ currentColor, onChange }) => {
	const pickerRef = useRef(null);
	const [showPicker, setShowPicker] = useState(false);
	const [hue, setHue] = useState(0);
	const [saturationX, setSaturationX] = useState(100);
	const [saturationY, setSaturationY] = useState(100);
	const [hexValue, setHexValue] = useState(currentColor);
	const [isDragging, setIsDragging] = useState(false);

	useEffect(() => {
		if (currentColor) {
			const { h, s, l } = hexToHSL(currentColor);
			setHue(h);
			setSaturationX(s * 100);
			setSaturationY(100 - l * 100);
		}
	}, []);

	useEffect(() => {
		updateColorFromHSL();
	}, [hue, saturationX, saturationY]);

	const updateColorFromHSL = () => {
		const newColor = hslToHex(hue, saturationX / 100, 1 - saturationY / 100);
		if (onChange) {
			onChange(newColor);
		}
		setHexValue(newColor);
	};

	const handleMouseDown = (event) => {
		setIsDragging(true);
		handleMouseMove(event); // Update position immediately when clicked
	};

	const handleMouseMove = (event) => {
		if (!isDragging) return;

		const rect = pickerRef.current.getBoundingClientRect();
		const offsetX = event.clientX - rect.left;
		const offsetY = event.clientY - rect.top;

		const percentX = Math.max(0, Math.min(100, (offsetX / rect.width) * 100));
		const percentY = Math.max(0, Math.min(100, (offsetY / rect.height) * 100));

		setSaturationX(percentX);
		setSaturationY(percentY);
	};

	const handleMouseUp = () => {
		if (isDragging) {
			setIsDragging(false);
			updateColorFromHSL(); // Update color when drag is done
		}
	};

	const handleHexChange = (event) => {
		const newHexValue = event.target.value;
		setHexValue(newHexValue);
		if (/^#([0-9A-F]{6}|[0-9A-F]{3})$/i.test(newHexValue)) {
			const { h, s, l } = hexToHSL(newHexValue);
			setHue(h);
			setSaturationX(s * 100);
			setSaturationY(100 - l * 100);
		}
	};

	return (
		<div className="color-picker-container">
			<div className="color-info">
				<input
					type="text"
					value={hexValue}
					onChange={handleHexChange}
					style={{ width: "100px" }}
				/>
			</div>
			<div
				className="color-circle"
				style={{
					backgroundColor: hexValue,
				}}
				onClick={() => setShowPicker(!showPicker)}
			></div>
			{showPicker && (
				<div className="color-picker-popup" ref={pickerRef}>
					<div className="color-controls">
						<label>{hexValue}</label>
						<div className="custom-slider">
							<input
								type="range"
								min="0"
								max="360"
								value={hue}
								onChange={(event) => setHue(event.target.value)}
								style={{
									backgroundImage: `linear-gradient(to right, 
                    hsl(0, 100%, 50%), 
                    hsl(60, 100%, 50%), 
                    hsl(120, 100%, 50%), 
                    hsl(180, 100%, 50%), 
                    hsl(240, 100%, 50%), 
                    hsl(300, 100%, 50%), 
                    hsl(360, 100%, 50%))`,
								}}
							/>
						</div>
					</div>
					<div
						className="color-gradient"
						onMouseMove={handleMouseMove}
						onMouseUp={handleMouseUp}
					>
						<div
							className="gradient-square"
							style={{
								background: `linear-gradient(to bottom, transparent, black), linear-gradient(to right, transparent, hsl(${hue}, 100%, 50%))`,
							}}
						></div>
						<div
							className="gradient-circle"
							style={{
								left: `${saturationX}%`,
								top: `${saturationY}%`,
								backgroundColor: `hsl(${hue}, 100%, ${100 - saturationY / 2}%)`,
							}}
							onMouseDown={handleMouseDown}
						></div>
					</div>
				</div>
			)}
		</div>
	);
};

export default CustomColorPicker;
