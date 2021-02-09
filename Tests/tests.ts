import Main from "../Code/index";
import { writeFileSync } from "fs";

const testURI: string = "https://cdn.discordapp.com/avatars/715196366321614908/40fe601ce2722ad7d333fbde06eba828.png?size=1024";

Main.CanvasHelper.spank(testURI, "https://www.nicepng.com/png/detail/25-255613_discord-bot-logo-black-discord-logo-png.png")
	.then(res => writeFileSync("colour.png", res));