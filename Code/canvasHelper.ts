// Importing the Modules
import { createCanvas, loadImage, registerFont } from "canvas";
import { join } from "path";
import { _Util } from "./_Util";
const { formatNumberK } = _Util;
import { canvasUtil } from "./canvasUtil";
const { wrapText }  = canvasUtil;
import * as moment from "moment";

// Constants
type baseImage = Buffer | string;
const BuffStringErr = "Image not provided or invalid Image type";
type stackTypes = "vertical" | "horizontal";

// Registering Fonts
registerFont(join(__dirname, "../Assets/Fonts/Noto-CJK.otf"), { family: "Noto" });
registerFont(join(__dirname, "../Assets/Fonts/Noto-Bold.ttf"), { family: "Noto", weight: "bold" });
registerFont(join(__dirname, "../Assets/Fonts/Noto-Emoji.ttf"), { family: "Noto" });
registerFont(join(__dirname, "../Assets/Fonts/Noto-Regular.ttf"), { family: "Noto" });

// Exporting the Class
export default class CanvasHelper {
	private static isBuffString(input: any): boolean {
		if(!input) return false;
		return Buffer.isBuffer(input) || typeof input === "string";
	}
	
	/**
	 * @param image The image you want to elongate
	 * @param size Size has to be less than 20
	 */
	public static async wideImage(image: baseImage, size: number = 2): Promise<Buffer> {
		if(!this.isBuffString(image)) throw new Error(BuffStringErr);

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

	/**
	 * @param image The twitter profile picture of the user 
	 * @param userName The REAL NAME of the User Max: 30
	 * @param handle the handle of the User, (the @ stuff) Max: 15
	 * @param text The text you want the user to say, Max: 280
	 * @description Draws an Image such that it looks as if the user has tweeted some text
	 */
	public static async tweet(image: baseImage, userName: string, handle: string, text: string): Promise<Buffer> {
		if(!this.isBuffString(image)) throw new Error(BuffStringErr);
		if(!userName || !handle || !text) throw new Error("Some of the parameters have not been provided");
	
		try {
			const base1 = await loadImage(join(__dirname, "../Assets/Images/Tweet/bg-1.png"));
			const base2 = await loadImage(join(__dirname, "../Assets/Images/Tweet/bg-2.png"));
			const inputImage = await loadImage(image);

			const canvas = createCanvas(base1.width, (base1.height + base2.height));

			const ctx = canvas.getContext("2d");

			ctx.font = '23px Noto';

			const lines = await wrapText(ctx, text, 710);
			const lineBreakLen = text.split('\n').length;
			const linesLen = (23 * lines.length) + (23 * (lineBreakLen - 1)) + (9 * (lines.length - 1)) + (9 * (lineBreakLen - 1));

			canvas.height += linesLen;

			const likes = Math.floor(Math.random() * 100000) + 1;
			const retweets = Math.floor(Math.random() * 100000) + 1;
			const quoteTweets = Math.floor(Math.random() * 100000) + 1;
			const replies = Math.floor(Math.random() * 100000) + 1;

			ctx.fillStyle = '#15202b';
			ctx.fillRect(0, base1.height, canvas.width, linesLen);
			ctx.drawImage(base1, 0, 0);

			const base2StartY = base1.height + linesLen;

			ctx.drawImage(base2, 0, base2StartY);

			ctx.textBaseline = 'top';
			ctx.font = 'normal bold 18px Noto';
			ctx.fillStyle = 'white';

			ctx.fillText(userName, 105, 84);

			const verified = await loadImage(join(__dirname, "../Assets/Images/Tweet/verified.png"));
			const nameLen = ctx.measureText(userName).width;

			ctx.drawImage(verified, 105 + nameLen + 4, 88, 18, 18);

			ctx.font = '17px Noto';
			ctx.fillStyle = '#8899a6';

			ctx.fillText(`@${handle}`, 106, 111);
			ctx.fillStyle = 'white';
			ctx.font = '23px Noto';

			ctx.fillText(lines.join('\n'), 32, 164);
			ctx.fillStyle = '#8899a6';
			ctx.font = '18px Noto';

			const time = moment().format('h:mm A ∙ MMMM D, YYYY ∙');
			ctx.fillText(time, 31, base2StartY + 16);

			const timeLen = ctx.measureText(time).width;
			ctx.fillStyle = '#1b95e0';

			ctx.fillText('Twitter', 31 + timeLen + 6, base2StartY + 16);

			ctx.fillStyle = '#8899a6';
			ctx.font = '16px Noto';
			
			ctx.fillText(formatNumberK(replies), 87, base2StartY + 139);
			ctx.fillText(formatNumberK(likes), 509, base2StartY + 139);
			ctx.fillText(formatNumberK(retweets + quoteTweets), 300, base2StartY + 139);
			
			let currentLen = 31;
			
			ctx.fillStyle = 'white';
			ctx.font = 'normal bold 18px Noto';
			
			ctx.fillText(formatNumberK(retweets), currentLen, base2StartY + 77);
			
			currentLen += ctx.measureText(formatNumberK(retweets)).width;
			currentLen += 5;
			
			ctx.fillStyle = '#8899a6';
			ctx.font = '18px Noto';
			
			ctx.fillText('Retweets', currentLen, base2StartY + 77);
			
			currentLen += ctx.measureText('Retweets').width;
			currentLen += 10;
			
			ctx.fillStyle = 'white';
			ctx.font = 'normal bold 18px Noto';
			
			ctx.fillText(formatNumberK(quoteTweets), currentLen, base2StartY + 77);
			
			currentLen += ctx.measureText(formatNumberK(quoteTweets)).width;
			currentLen += 5;
			
			ctx.fillStyle = '#8899a6';
			ctx.font = '18px Noto';
			
			ctx.fillText('Quote Tweets', currentLen, base2StartY + 77);
			
			currentLen += ctx.measureText('Quote Tweets').width;
			currentLen += 10;
			
			ctx.fillStyle = 'white';
			ctx.font = 'normal bold 18px Noto';
			
			ctx.fillText(formatNumberK(likes), currentLen, base2StartY + 77);
			
			currentLen += ctx.measureText(formatNumberK(likes)).width;
			currentLen += 5;
			
			ctx.fillStyle = '#8899a6';
			ctx.font = '18px Noto';
			
			ctx.fillText('Likes', currentLen, base2StartY + 77);
			
			ctx.beginPath();
			ctx.arc(30 + 32, 84 + 32, 32, 0, Math.PI * 2);
			ctx.closePath();
			ctx.clip();
			ctx.drawImage(inputImage, 30, 84, 64, 64);

			return canvas.toBuffer();
		}
		catch(err) {
			throw new Error(err.message);
		}
	}

	/**
	 * @param image The Image you want to apply the Tint to
	 * @description Applies Sepia Tint to the image
	 */
	public static async sepia(image: baseImage): Promise<Buffer> {
		if(!this.isBuffString(image)) throw new Error(BuffStringErr);

		try {
			const base = await loadImage(image);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext("2d");

			ctx.drawImage(base, 0, 0);

			const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

			for (let i = 0; i < imgData.data.length; i += 4) {
				imgData.data[i] = imgData.data[i] * 0.393 + imgData.data[i + 1] * 0.769 + imgData.data[i + 2] * 0.189;
				imgData.data[i + 1] = imgData.data[i] * 0.349 + imgData.data[i + 1] * 0.686 + imgData.data[i + 2] * 0.168;
				imgData.data[i + 2] = imgData.data[i] * 0.272 + imgData.data[i + 1] * 0.534 + imgData.data[i + 2] * 0.131;
			}

			ctx.putImageData(imgData, 0, 0);

			return canvas.toBuffer();
		}
		catch(err) {
			throw new Error(err.message);
		}
	}

	/**
	 * @param image The image for which you want to invert the colours
	 * @description Inverts the colour scheme of the image provided
	 */
	public static async invert(image: baseImage): Promise<Buffer> {
		if(!this.isBuffString(image)) throw new Error(BuffStringErr);

		try {
			const base = await loadImage(image);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext("2d");

			ctx.drawImage(base, 0, 0);

			const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

			for (let i = 0; i < imgData.data.length; i += 4) {
				imgData.data[i] = 255 - imgData.data[i];
				imgData.data[i + 1] = 255 - imgData.data[i + 1];
				imgData.data[i + 2] = 255 - imgData.data[i + 2];
				imgData.data[i + 3] = 255;
			}

			ctx.putImageData(imgData, 0, 0);


			return canvas.toBuffer();
		}
		catch (err) {
			throw new Error(err.message);
		}
	}

	/**
	 * @param image Image which you want to apply the filter
	 * @description Applies the greyscale filter on the Image
	 */
	public static async greyscale(image: baseImage): Promise<Buffer> {
		if(!this.isBuffString(image)) throw new Error(BuffStringErr);

		try {
			const base = await loadImage(image);
			const canvas = createCanvas(base.width, base.height);
			const ctx =canvas.getContext("2d");

			ctx.drawImage(base, 0, 0);

			const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

			for (let i = 0; i < imgData.data.length; i += 4) {
				const brightness = 0.34 * imgData.data[i] + 0.5 * imgData.data[i + 1] + 0.16 * imgData.data[i + 2];
				imgData.data[i] = brightness;
				imgData.data[i + 1] = brightness;
				imgData.data[i + 2] = brightness;
			}

			ctx.putImageData(imgData, 0, 0);

			return canvas.toBuffer();
		}
		catch (err) {
			throw new Error(err.message);
		}
	}

	/**
	 * @param image The image you want to pixelate
	 * @param pixels The co-efficient for pixelation
	 * @description Pixelates an Image for you
	 */
	public static async pixelate(image: baseImage, pixels: number = 5): Promise<Buffer> {
		if(!this.isBuffString(image)) throw new Error(BuffStringErr);
		if(isNaN(pixels)) throw new Error("Pixelation Co-efficient is not a Number");
		if (pixels < 1) pixels = 100;
        if (pixels > 100) pixels = 100;

		try {
			const base = await loadImage(image);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext("2d");

			const pixel = pixels / 100;

			ctx.drawImage(base, 0, 0, canvas.width * pixel, canvas.height * pixel);

			ctx.imageSmoothingEnabled = false;

			ctx.drawImage(canvas, 0, 0, canvas.width * pixel, canvas.height * pixel, 0, 0, canvas.width + 5, canvas.height + 5);

			return canvas.toBuffer();
		}
		catch (err) {
			throw new Error(err.message);	
		}
	}

	/**
	 * @param image Image which you want to be "circled"
	 * @description Draws your Image as a Circle
	 */
	public static async circle(image: baseImage): Promise<Buffer> {
		if(!this.isBuffString(image)) throw new Error(BuffStringErr);
		
		try {
			const base = await loadImage(image);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext("2d");

			ctx.drawImage(base, 0, 0);
			ctx.globalCompositeOperation = "destination-in";
			ctx.beginPath();
			ctx.arc(canvas.width / 2, canvas.height / 2, canvas.height / 2, 0, Math.PI * 2);
			ctx.closePath();
			ctx.fill();

			return canvas.toBuffer();
		}
		catch (err) {
			throw new Error(err.message);
		}
	}

	/**
	 * @description Fuses two images together
	 * @param firstImage The Image you want as base
	 * @param secondImage The Image you want as overlay
	 */
	public static async fuse(firstImage: baseImage, secondImage: baseImage): Promise<Buffer> {
		if(!this.isBuffString(firstImage) || !this.isBuffString(secondImage)) throw new Error(BuffStringErr);

		try {
			const base = await loadImage(firstImage);
			const overlay = await loadImage(secondImage);
			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext("2d");

			ctx.globalAlpha = 0.5;
			ctx.drawImage(base, 0, 0);
			ctx.drawImage(overlay, 0, 0, base.width, base.height);

			return canvas.toBuffer();
		}
		catch (err) {
			throw new Error(err.message);
		}
	}
}