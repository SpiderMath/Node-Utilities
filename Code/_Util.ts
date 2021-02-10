export default class _Util {
	public static formatNumberK(number) {
		return number > 999 ? `${(number / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}K` : number;
	}

	public static rgbToHex(r, g, b) {
		if (r > 255 || g > 255 || b > 255) return null;
		return ((r << 16) | (g << 8) | b).toString(16);
	}
};
