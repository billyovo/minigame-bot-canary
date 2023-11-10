import { ChatInputCommandInteraction } from "discord.js";
import { eventSchedule } from "../../managers/eventScheduleManager.js";
import { timeBetweenSurvivalAndSkyblockInMillisecond } from "../../constants/times.js";
import { getSingleEventTimeMessage } from "../../assets/messages/messages.js";
import { EventScheduleItem } from "../../@types/eventSchedule";

export async function execute(interaction: ChatInputCommandInteraction) {
	const targetEvent : EventScheduleItem = eventSchedule.list.get(interaction.options.getString("event") || "") as EventScheduleItem;
	if (!targetEvent?.nextOccurrence) return interaction.reply("目前沒有活動");

	const message = getSingleEventTimeMessage({
		event: targetEvent,
		timeBetweenEvent: timeBetweenSurvivalAndSkyblockInMillisecond,
	});
	await interaction.reply(message);
}