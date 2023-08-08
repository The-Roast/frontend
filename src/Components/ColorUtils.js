// Convert hex color to HSL
export const hexToHSL = (hex) => {
	const sanitizedHex = hex.startsWith("#") ? hex.slice(1) : hex;
	const r = parseInt(sanitizedHex.slice(0, 2), 16) / 255;
	const g = parseInt(sanitizedHex.slice(2, 4), 16) / 255;
	const b = parseInt(sanitizedHex.slice(4, 6), 16) / 255;

	const min = Math.min(r, g, b);
	const max = Math.max(r, g, b);
	const delta = max - min;

	const l = (min + max) / 2;
	const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

	let h = 0;
	if (delta !== 0) {
		if (max === r) {
			h = (g - b) / delta + (g < b ? 6 : 0);
		} else if (max === g) {
			h = (b - r) / delta + 2;
		} else {
			h = (r - g) / delta + 4;
		}
		h *= 60;
	}

	return { h, s, l };
};

// Convert HSL color to hex
export const hslToHex = (h, s, l) => {
	h = ((h % 360) + 360) % 360; // Normalize hue

	const c = (1 - Math.abs(2 * l - 1)) * s;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = l - c / 2;

	let r, g, b;
	if (0 <= h && h < 60) {
		r = c;
		g = x;
		b = 0;
	} else if (60 <= h && h < 120) {
		r = x;
		g = c;
		b = 0;
	} else if (120 <= h && h < 180) {
		r = 0;
		g = c;
		b = x;
	} else if (180 <= h && h < 240) {
		r = 0;
		g = x;
		b = c;
	} else if (240 <= h && h < 300) {
		r = x;
		g = 0;
		b = c;
	} else {
		r = c;
		g = 0;
		b = x;
	}

	const toHex = (value) =>
		Math.round(value * 255)
			.toString(16)
			.padStart(2, "0");
	const hex = `#${toHex(r + m)}${toHex(g + m)}${toHex(b + m)}`;
	return hex;
};
