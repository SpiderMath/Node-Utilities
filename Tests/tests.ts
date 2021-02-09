import Main from "../Code/index";
import { writeFileSync } from "fs";

const testURI: string = "https://cdn.discordapp.com/avatars/715196366321614908/40fe601ce2722ad7d333fbde06eba828.png?size=1024";

Main.CanvasHelper.blink([testURI, "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.aieabowl.com%2Fwp-content%2Fuploads%2F2018%2F02%2Fparty.png&f=1&nofb=1", "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.T9OXj8fpfO1X-FaplCSsQQHaHa%26pid%3DApi&f=1"])
	.then(res => {
		//@ts-ignore
		writeFileSync("blink.gif", res);
	});