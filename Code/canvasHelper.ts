// Importing the Modules
import { createCanvas, loadImage, registerFont } from "canvas";
import { read } from "jimp";
import { join } from "path";
import _Util from "./_Util";
const { formatNumberK } = _Util;
import canvasUtil from "./canvasUtil";
const { wrapText, invertColor: invertColour, centerImagePart }  = canvasUtil;
import * as moment from "moment";
import * as GIFEncoder from "gifencoder";

// Constants
type baseImage = Buffer | string;
const BuffStringErr = "Image not provided or invalid Image type";
type stackTypes = "vertical" | "horizontal";

// Registering Fonts
registerFont(join(__dirname, "../Assets/Fonts/Noto-CJK.otf"), { family: "Noto" });
registerFont(join(__dirname, "../Assets/Fonts/Noto-Bold.ttf"), { family: "Noto", weight: "bold" });
registerFont(join(__dirname, "../Assets/Fonts/Noto-Emoji.ttf"), { family: "Noto" });
registerFont(join(__dirname, "../Assets/Fonts/Noto-Regular.ttf"), { family: "Noto" });
registerFont(join(__dirname, "../Assets/Fonts/FiraCode-Bold.ttf"), { family: "Fira Code", style: "Bold" })

// Exporting the Class
export default class CanvasHelper {
	private static _isBuffString(input: any): boolean {
		if(!input) return false;
		return Buffer.isBuffer(input) || typeof input === "string";
	}
	
	/**
	 * @param image The image you want to elongate
	 * @param size Size has to be less than 20
	 */
	public static async wideImage(image: baseImage, size: number = 2): Promise<Buffer> {
		if(!this._isBuffString(image)) throw new TypeError(BuffStringErr);

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
		if(!this._isBuffString(image)) throw new TypeError(BuffStringErr);
		if(!userName || !handle || !text) throw new Error("Some of the parameters have not been provided");
		if(typeof userName !== "string" || typeof handle !== "string" || typeof text !== "string") throw new Error("Expected string");

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
		if(!this._isBuffString(image)) throw new TypeError(BuffStringErr);

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
		if(!this._isBuffString(image)) throw new TypeError(BuffStringErr);

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
		if(!this._isBuffString(image)) throw new TypeError(BuffStringErr);

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
		if(!this._isBuffString(image)) throw new TypeError(BuffStringErr);
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
		if(!this._isBuffString(image)) throw new TypeError(BuffStringErr);
		
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
		if(!this._isBuffString(firstImage) || !this._isBuffString(secondImage)) throw new TypeError(BuffStringErr);

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

	/**
	 * @param colour Has to be a HTML5 Colour Code
	 * @param width Width of the returned Image
	 * @param height Height of the Returned image
	 * @param displayHex Whether you want to have the HTML Code written on the canvas
	 * @description Returns the image of a colour
	 */
	public static async color(colour: string = "#FF00FF", width: number = 1024, height: number = 1024, displayHex: boolean = false,): Promise<Buffer> {
		if(isNaN(height) || isNaN(width)) throw new Error("Wrong type provided");
		displayHex = !!displayHex;

		try {
			const canvas = createCanvas(width, height);
			const ctx = canvas.getContext("2d");

			ctx.beginPath();
			ctx.fillStyle = colour;
			ctx.fillRect(0, 0, width, height);
			ctx.closePath();

			if(displayHex) {
				const invertedColour = invertColour(colour);
				ctx.font = "bold 64px Fira Code";

				ctx.fillStyle = invertedColour;
				ctx.fillText(colour.toUpperCase(), canvas.width / 3, canvas.height / 2);
			}

			return canvas.toBuffer();
		}
		catch(err) {
			throw new Error(err.message);
		}
	}

	/**
	 * @param spanker The image which you want the spank the other
	 * @param spanked The image which you want to be spanked
	 * @description Makes an Image spank another Image
	 */
	public static async spank(spanker: baseImage, spanked: baseImage): Promise<Buffer> {
		if(!this._isBuffString(spanker) || !this._isBuffString(spanked)) throw new TypeError(BuffStringErr);

		try {
			const base = await loadImage(join(__dirname, "../Assets/Images/spank.png"));
			const canvas = createCanvas(500, 500);
			const ctx = canvas.getContext("2d");

			ctx.drawImage(base, 0, 0, canvas.height, canvas.width);

			const Spanker = await loadImage(spanker);
			const Spanked = await loadImage(spanked);

			ctx.drawImage(Spanked, 350, 220, 120, 120);
			ctx.drawImage(Spanker, 225, 5, 140, 140)

			return canvas.toBuffer();
		}
		catch(err) {
			throw new Error(err.message);
		}
	}

	/**
	 * @param advertisement The image you want to put as an Advertisement
	 * @description Puts an Image on the wall as a Advertisement
	 */
	public static async advertisement(advertisement: baseImage): Promise<Buffer> {
		if(!this._isBuffString(advertisement)) throw new TypeError(BuffStringErr);

		try {
			const base = await loadImage(join(__dirname, "../Assets/Images/advertisement.png"));
			const advert = await loadImage(advertisement);

			const canvas = createCanvas(550, 474);
			const ctx = canvas.getContext("2d");

			ctx.drawImage(base, 0, 0);
			ctx.drawImage(advert, 150, 75, 230, 230);

			return canvas.toBuffer();
		} catch (err) {
			throw new Error(err.message);
		}
	}

	/**
	 * @param {baseImage} affected The imiage you want to be "affected"
	 * @description "Affects" the image of the user
	 */
	public static async affect(affected): Promise<Buffer> {
		if(!this._isBuffString(affected)) throw new TypeError(BuffStringErr);

		try {
			const base = await read(join(__dirname, "../Assets/Images/affect.png"));
			const Affected = await read(affected);

			Affected.resize(200, 157);
			base.composite(Affected, 180, 383);

			const buffer = base.getBufferAsync("image/png");

			return buffer;
		}
		catch(err) {
			throw new Error(err.message);
		}
	}

	/**
	 * @param slapper The image you want to be the Slapper
	 * @param slapped The image you want to be the Slapped
	 * @description Makes one image slap another image
	 */
	public static async batslap(slapper, slapped): Promise<Buffer> {
		if(!this._isBuffString(slapper) || !this._isBuffString(slapped)) throw new TypeError(BuffStringErr);

		try {
			const base = await read(join(__dirname, "../Assets/Images/batslap.png"));
			const Slapper = await read(slapper);
			const Slapped = await read(slapped);

			Slapper.circle();
			Slapped.circle();

			base.resize(1000, 500);
			Slapper.resize(220, 220);
			Slapped.resize(200, 200);

			base.composite(Slapper, 350, 70);
			base.composite(Slapped, 580, 260);

			const buffer = await base.getBufferAsync("image/png");

			return buffer;
		}
		catch(err) {

		}
	}

	/**
	 * @description Returns a "There is a Monster under my Bed" meme
	 * @param upper The person sleeping on the upper bunk
	 * @param lower The person sleeping on the lower bunk
	 */
	public static async bed(upper, lower): Promise<Buffer> {
		if(!this._isBuffString(upper) || !this._isBuffString(lower)) throw new TypeError(BuffStringErr);

		try {
			const base = await read(join(__dirname, "../Assets/Images/bed.png"));
			const Upper = await read(upper);
			const Lower = await read(lower);

			Upper.circle();
			Lower.circle();

			Lower.resize(70, 70);
			Upper.resize(100, 100);
			const UpperClone = Upper.clone().resize(70, 70);

			base.composite(Upper, 25, 100);
			base.composite(Upper, 25, 300);
			base.composite(UpperClone, 53, 450);
			base.composite(Lower, 53, 575);

			const buffer = base.getBufferAsync("image/png");

			return buffer;
		}
		catch(err) {
			throw new Error(err.message);
		}
	}

	/**
	 * @description Makes your Image a Bob Ross's Painting
	 * @param painting The Image you want to transform into the painting
	 */
	public static async bobross(painting: baseImage): Promise<Buffer> {
		if(!this._isBuffString(painting)) throw new TypeError(BuffStringErr);

		try {
			const base = await loadImage(join(__dirname, "../Assets/Images/bobross.png"));
			const Painting = await loadImage(painting);

			const canvas = createCanvas(base.width, base.height);
			const ctx = canvas.getContext("2d");

			ctx.fillStyle = "white";
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			const { x, y, width, height } = centerImagePart(Painting, 440, 440, 15, 20);

			ctx.drawImage(Painting, x, y, width, height);
			ctx.drawImage(base, 0, 0);
			return canvas.toBuffer();
		}
		catch(err) {
			throw new Error(err.message);
		}
	}

	/**
	 * @param confused The image of the person to be confused
	 * @description Generates a confused stonk image
	 */
	public static async confusedStonk(confused: baseImage): Promise<Buffer> {
		if(!this._isBuffString(confused)) throw new TypeError(BuffStringErr);

		try {
			const base = await loadImage(join(__dirname, "../Assets/Images/confusedStonk.png"));
			const ConfusedStonkUser = await loadImage(confused);

			const canvas = createCanvas(1994, 1296);
			const ctx = canvas.getContext("2d");

			ctx.drawImage(base, 0, 0);
			ctx.drawImage(ConfusedStonkUser, 190, 70, 400, 400);
	
			return canvas.toBuffer();
		}
		catch(err) {
			throw new Error(err.message);
		}
	}

	/**
	 * @description Lets you add some images which returns a GIF of them with the effect of them blinking
	 * @param images The images which you want to be there to make a GIF
	 */
	public static async blink(images: baseImage[], delay: number = 1000): Promise<Buffer> {
		if(!Array.isArray(images) || !images) throw new TypeError("images have to be an Array");
		if(images.length <= 1) throw new RangeError("You need to provide at least 2 images for this method!");
		if(isNaN(delay)) throw new TypeError("Delay is not a Number!");

		try {
			const gif = new GIFEncoder(480, 480);

			gif.start();
			gif.setRepeat(0);
			gif.setDelay(delay);

			const canvas = createCanvas(480, 480);
			const ctx = canvas.getContext("2d");

			for(const image of images) {
				const base = await loadImage(image);
				ctx.clearRect(0, 0, 480, 480);
				ctx.drawImage(base, 0, 0, 480, 480);

				gif.addFrame(ctx);
			}

			gif.finish();
			//@ts-ignore
			return gif.out.getData();
		}
		catch(err) {
			throw new Error(err.message);
		}
	}

	/**
	 * @description Oh this image? This is beautiful!
	 * @param image The image you say is beautiful
	 */
	public static async beautiful(image: baseImage): Promise<Buffer> {
		if(!this._isBuffString(image)) throw new TypeError(BuffStringErr);

		try {
			const base = await loadImage(join(__dirname, "../Assets/Images/beautiful.png"));
			const UserImage = await loadImage(image);
			const canvas = createCanvas(376, 400);
			const ctx = canvas.getContext("2d");

			ctx.drawImage(base, 0, 0);
			ctx.drawImage(UserImage, 258, 28, 84, 95);
        	ctx.drawImage(UserImage, 258, 229, 84, 95);

			return canvas.toBuffer();
		}
		catch(err) {
			throw new Error(err.message);
		}
	}

	/**
	 * @description Applies the Rainbow filter on an Image
	 * @param image THe image you want to apply the filter to
	 */
	public static async rainbow(image: baseImage): Promise<Buffer> {
		if(!this._isBuffString(image)) throw new TypeError(BuffStringErr);

		try {
			const filter = await loadImage(join(__dirname, "../Assets/Images/rainbow.png"));
			const UserImage = await loadImage(image);

			const canvas = createCanvas(filter.width, filter.height);
			const ctx = canvas.getContext("2d");

			ctx.drawImage(UserImage, 0, 0);
			ctx.drawImage(filter, 0, 0);

			return canvas.toBuffer();
		}
		catch(err) {
			throw new Error(err.message);
		}
	}

	/**
	 * @description Generates a Worse than Hitler image for the image provided
	 * @param hitlerCandidate The image of the person who is WORSE than Hilter
	 */
	public static async hitler(hitlerCandidate: baseImage): Promise<Buffer> {
		if(!this._isBuffString(hitlerCandidate)) throw new TypeError(BuffStringErr);

		try {
			const base = await loadImage(join(__dirname, "../Assets/Images/hitler.png"))
			const HitlerCandidate = await loadImage(hitlerCandidate);

			const canvas = createCanvas(HitlerCandidate.width, HitlerCandidate.height);
			const ctx = canvas.getContext("2d");

			ctx.drawImage(base, 0, 0);
			ctx.drawImage(HitlerCandidate, 46, 43, 140, 140);

			return canvas.toBuffer();
		}
		catch(err) {
			throw new Error(err.message);
		}
	}

	/**
	 * @param toBeTinted The Image you want to tint
	 * @description Tints your Image Red
	 */
	public static async redTint(toBeTinted): Promise<Buffer> {
		if(!this._isBuffString(toBeTinted)) throw new TypeError(BuffStringErr);

		try {
			const image = await loadImage(toBeTinted);
			const canvas = createCanvas(image.width, image.height);
			const ctx = canvas.getContext("2d");
			ctx.drawImage(image, 0, 0);

			ctx.globalCompositeOperation = "color";
            ctx.fillStyle = "#ff0000";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

			return canvas.toBuffer();
		}
		catch(err) {
			throw new Error(err.message);
		}
	}

	public static async greenTint(toBeTinted: baseImage): Promise<Buffer> {
		if(!this._isBuffString(toBeTinted)) throw new TypeError(BuffStringErr);

		try {
			const image = await loadImage(toBeTinted);
			const canvas = createCanvas(image.width, image.height);
			const ctx = canvas.getContext("2d");
			ctx.drawImage(image, 0, 0);

			ctx.globalCompositeOperation = "color";
            ctx.fillStyle = "#00ff00";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

			return canvas.toBuffer();
		}
		catch(err) {
			throw new Error(err.message);
		}
	}
}