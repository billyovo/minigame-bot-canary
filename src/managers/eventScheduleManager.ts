import { generateSchedule, isScheduleValid } from "../utils/eventScheduleGenerator/eventScheduleGenerator.js";
import { events } from "../configs/events.js";
import { EventSchedule } from "../@types/eventSchedule";

export let eventSchedule: EventSchedule = generateSchedule(new Date(), events);

export function updateEventSchedule() {
	eventSchedule = generateSchedule(new Date(), events);
}

if (!isScheduleValid(eventSchedule)) {
	console.error("Event schedule is invalid");
	process.exit(1);
}

