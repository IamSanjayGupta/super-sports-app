import { EventType } from "../enum/event.enum";

export interface Event {
  id: number;

  title: string;
  description: string;
  bannerUrl: string;

  eventType: EventType;

  startDate: Date;
  endDate: Date;
  maxParticipants: number;
  organizedBy: number;

  participants: number[];
}

export interface EventRequest {
  id: number;

  eventId: number;
  requesterId: number;
  status: "pending" | "approved" | "rejected";

  requestedAt: Date;

  event?: Event;
}

export interface ICreateEvent extends Omit<Event, "id" | "organizedBy"> {}
