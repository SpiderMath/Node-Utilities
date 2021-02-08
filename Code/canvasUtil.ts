import { CanvasRenderingContext2D } from "canvas";

class canvasUtil {
	static wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): Promise<Array<string>> {
		if(typeof text !== "string" || isNaN(maxWidth)) throw new Error("Either the text inputted is not a string or maxWidth is NaN");

		return new Promise(resolve => {
			if (ctx.measureText(text).width < maxWidth) return resolve([text]);
			if (ctx.measureText('W').width > maxWidth) return resolve(null);
			const words = text.split(' ');
			const lines = [];
			let line = '';
			while (words.length > 0) {
				let split = false;
				while (ctx.measureText(words[0]).width >= maxWidth) {
					const temp = words[0];
					words[0] = temp.slice(0, -1);
					if (split) {
						words[1] = `${temp.slice(-1)}${words[1]}`;
					} else {
						split = true;
						words.splice(1, 0, temp.slice(-1));
					}
				}
				if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
					line += `${words.shift()} `;
				} else {
					lines.push(line.trim());
					line = '';
				}
				if (words.length === 0) lines.push(line.trim());
			}
			return resolve(lines);
		});
	}

	static invertColor(hex: string): string {
		if (!hex || typeof hex !== "string") return "#FFFFFF";
		hex = hex.replace("#", "");

		if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
		if (hex.length !== 6) return "#FFFFFF";

		const r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16);
		const g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16);
		const b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);

		const pad = (txt, length = 2) => {
			let arr = [length].join("0");
			return (arr + txt).slice(-length);
		};

		const finalHex = `#${pad(r)}${pad(g)}${pad(b)}`;
		return finalHex;
	}

}

export { canvasUtil };