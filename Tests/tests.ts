import Main from "../Code/index";
import { writeFileSync } from "fs";

const testURI: string = "https://cdn.discordapp.com/avatars/715196366321614908/40fe601ce2722ad7d333fbde06eba828.png?size=1024";

Main.CanvasHelper.batslap("https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fvignette2.wikia.nocookie.net%2Fsonicpokemon%2Fimages%2F7%2F77%2FPikachu.png%2Frevision%2Flatest%3Fcb%3D20120603213349&f=1&nofb=1", testURI)
	.then(res => writeFileSync("batslap.png", res));