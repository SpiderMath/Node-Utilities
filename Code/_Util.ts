export default class _Util {
	public static formatNumberK(number) {
		return number > 999 ? `${(number / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}K` : number;
	}

	public static rgbToHex(r, g, b) {
		if (r > 255 || g > 255 || b > 255) return null;
		return ((r << 16) | (g << 8) | b).toString(16);
	}

	public static shorten(text: string, len: number): string {
		if (typeof text !== "string") return "";
		if (text.length <= len) return text;
		return text.substr(0, len).trim() + "...";
	}
};
