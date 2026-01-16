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
  requestedBy: number;

  requestedAt: Date;
}

export interface ICreateEvent extends Omit<Event, "id" | "organizedBy"> {}

// export const EVENTS: Event[] = [
//   {
//     id: 1,
//     title: "Sunday Cricket League",
//     description: "Friendly cricket match for all skill levels.",
//     bannerUrl: "https://images.unsplash.com/photo-1502877338535-766e1452684a",
//     eventType: EventType.CRICKET,
//     startDate: new Date("2026-02-02T08:00:00"),
//     endDate: new Date("2026-02-02T12:00:00"),
//     maxParticipants: 22,
//     organizedBy: 101,
//     participants: [1, 2, 3, 4, 5],
//   },
//   {
//     id: 2,
//     title: "City Football Knockout",
//     description: "5v5 football tournament with knockout rounds.",
//     bannerUrl: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d",
//     eventType: EventType.FOOTBALL,
//     startDate: new Date("2026-02-05T17:00:00"),
//     endDate: new Date("2026-02-05T20:00:00"),
//     maxParticipants: 10,
//     organizedBy: 102,
//     participants: [1, 2, 3, 4],
//   },
//   {
//     id: 3,
//     title: "Badminton Open",
//     description: "Singles badminton open event.",
//     bannerUrl: "https://images.unsplash.com/photo-1521412644187-c49fa049e84d",
//     eventType: EventType.BADMINTON,
//     startDate: new Date("2026-02-10T07:00:00"),
//     endDate: new Date("2026-02-10T10:00:00"),
//     maxParticipants: 2,
//     organizedBy: 103,
//     participants: [1, 2],
//   },
// ];
