import { createCanvas, loadImage } from "canvas";
import { join } from "path";

type baseImage = Buffer | string;

export class CanvasHelper {
	private static isBuffString(input: any): boolean {
		if(!input) return false;
		return Buffer.isBuffer(input) || typeof input === "string";
	}
	
	/**
	 * @param image The image you want to elongate
	 * @param size Size has to be less than 20
	 */
	public static async wideImage(image: baseImage, size: number = 2): Promise<Buffer> {
		if(!this.isBuffString(image)) throw new Error("Image not provided or invalid Image type");

		try {
			const base = await loadImage(image);

			const canvas = createCanvas(base.width * size, base.height);

			const ctx = canvas.getContext("2d");

			ctx.drawImage(base, 0, 0, base.width * size, base.height);

			return canvas.toBuffer();
		}
		catch(err) {
			throw new Error(err.message);
		}
	}
}