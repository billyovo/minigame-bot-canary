import { scheduleJob } from "node-schedule";
import { eventSchedule, updateEventSchedule } from "../managers/eventScheduleManager.js";
import { checkTodayScheduleMessage, checkTomorrowScheduleMessage } from "../utils/discord/scheduledMessages/checkScheduledMessages.js";
import { annoucementChannel, client } from "../managers/discord/discordManager.js";
import { Guild, TextChannel } from "discord.js";
import { checkGuildScheduledEvents } from "../utils/discord/guildScheduledEvents/checkGuildScheduledEvents.js";
import { sendMazeTodayMessage, sendMazeTomorrowMessage } from "../utils/discord/scheduledMessages/mazeMessages.js";

// daily updates schedule and messages
scheduleJob("1 0 * * *", async () => {
	console.log("Updated Event Schedule!");
	updateEventSchedule();

	checkTodayScheduleMessage({
		annoucementChannel: annoucementChannel as TextChannel,
		todayEvents: eventSchedule.today,
	});

	checkTomorrowScheduleMessage({
		annoucementChannel: annoucementChannel as TextChannel,
		avatarURL: "",
		tomorrowEvents: eventSchedule.tomorrow,
	});

	await checkGuildScheduledEvents({
		guild: annoucementChannel?.guild as Guild,
		eventList: eventSchedule.list,
	});
});

scheduleJob("0 12 14 * *", () => {
	sendMazeTomorrowMessage({
		announcementChannel: annoucementChannel as TextChannel,
		avatar: client.user?.avatarURL() ?? "",
	});
});

scheduleJob("0 14 15 * *", () => {
	sendMazeTodayMessage({ annoucementChannel: annoucementChannel as TextChannel });
});