import Main from "../Code/index";
import { writeFileSync } from "fs";

const testURI: string = "https://cdn.discordapp.com/avatars/715196366321614908/40fe601ce2722ad7d333fbde06eba828.png?size=1024";

Main.CanvasHelper.tweet(testURI, "SpiderBro", "SpiderBro", "https://github.com/SpiderMath")
	.then((res) => writeFileSync("./Tweet.png", res));

Main.CanvasHelper.invert(testURI)
	.then((res) => writeFileSync("./invert.png", res));

Main.CanvasHelper.sepia(testURI)
	.then((res) => writeFileSync("./sepia.png", res));

Main.CanvasHelper.wideImage(testURI)
	.then((res) => writeFileSync("./wideImage.png", res));