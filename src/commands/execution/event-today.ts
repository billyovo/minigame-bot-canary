import { ChatInputCommandInteraction, Collection } from "discord.js";
import { eventSchedule } from "../../managers/eventScheduleManager.js";
import { timeBetweenSurvivalAndSkyblockInMillisecond } from "../../constants/times.js";
import { getSingleEventTimeMessage } from "../../assets/messages/messages.js";
import { EventScheduleItem } from "../../@types/eventSchedule";

export async function execute(interaction: ChatInputCommandInteraction) {
	const targetEventCollection : Collection<string, EventScheduleItem> = eventSchedule.today;
	if (targetEventCollection.size === 0) return interaction.reply("今天沒有活動");

	const message = targetEventCollection.map((event : EventScheduleItem) => {
		return getSingleEventTimeMessage({
			event: event,
			timeBetweenEvent: timeBetweenSurvivalAndSkyblockInMillisecond,
		});
	}).join("\n\n");

	await interaction.reply(message);
}