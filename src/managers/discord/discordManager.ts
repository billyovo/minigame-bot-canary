import { Events, GatewayIntentBits, TextChannel } from "discord.js";
import { getAnnoucementChannel } from "../../utils/discord/startup/getAnnoucementChannel.js";
import { config } from "../../configs/config.js";
import { DiscordClient } from "../../@types/discord";
import { ExtendedDiscordClient } from "./client.js";
import { loadSlashCommands } from "../../utils/discord/startup/loadCommands.js";
import { handleInteraction } from "../../commands/handler/interactionHandler.js";
import { updateStatus } from "../../utils/discord/updateStatus.js";
import { eventSchedule } from "../eventScheduleManager.js";
import { checkTodayScheduleMessage, checkTomorrowScheduleMessage } from "../../utils/discord/scheduledMessages/checkScheduledMessages.js";
import { checkGuildScheduledEvents } from "../../utils/discord/guildScheduledEvents/checkGuildScheduledEvents.js";

export const client : DiscordClient = new ExtendedDiscordClient({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});
export let annoucementChannel : TextChannel | null = null;

client.login(process.env.DISCORD_TOKEN);

client.on(Events.InteractionCreate, handleInteraction);
client.on(Events.ClientReady, async () => {
	annoucementChannel = await getAnnoucementChannel(client, config.annoucementChannelID);
	client.commands = await loadSlashCommands();
	if (!annoucementChannel) {
		console.error("Annoucement channel not found! Aborting...");
		process.exit(1);
	}

	checkTomorrowScheduleMessage({
		annoucementChannel,
		avatarURL: client.user?.avatarURL() ?? "",
		tomorrowEvents: eventSchedule.tomorrow,
	});

	checkTodayScheduleMessage({
		annoucementChannel,
		todayEvents: eventSchedule.today,
	});

	await checkGuildScheduledEvents({
		guild: annoucementChannel.guild,
		eventList: eventSchedule.list,
	});
	updateStatus(client, eventSchedule.today);
	console.log(`Logged in as ${client.user?.displayName}`);
	console.log(`Found Annoucement Channel: ${annoucementChannel.name}`);
});

