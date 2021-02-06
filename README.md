# Node-Utilities

> # Canvas Helper  
Do complicated canvas functions easily! This package may be used in a variety of environments, even though its main focus is for Discord Bots <br/>

```ts
import { Main } from "package_name";
const canvas = Main.canvasHelper;

// Do your login stuff and what not
client.on("message", async (message: object): Promise<void> => {
	if(message.author.bot) return;

	const args: string[] = message.content.slice(prefix.length).trim().split(/ +/g);
	const commandName: string = args.shift().toLowerCase();

	if(commandName === "tweet") {
		const image = getDataSomehow();
		const userName = getDataSomehow();
		const tag = getDataSomehow();
		const text = getDataSomehow();

		const buffer = await canvas.tweet(image, userName, tag, text);

		const attachment = new Discord.MessageAttachment(buffer, "tweet.png");

		message.channel.send(attachment);
	}
});
```