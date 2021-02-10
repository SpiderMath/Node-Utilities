import Main from "../Code/index";
import { writeFileSync } from "fs";

const testURI: string = "https://cdn.discordapp.com/avatars/715196366321614908/40fe601ce2722ad7d333fbde06eba828.png?size=1024";

Main.CanvasUtil.dominantColor(testURI)
	.then(res => writeFileSync("dominantColor.json", JSON.stringify(res)));