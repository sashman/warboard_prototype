import { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";
import { zfd } from "zod-form-data";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const uploadFileSchema = zfd.formData({
  data: zfd.file(),
});

const prisma = new PrismaClient();

export const tournamentEventRouter = createTRPCRouter({
  uploadTournamentEventJson: publicProcedure
    .input(uploadFileSchema)
    .mutation(async ({ ctx, input }) => {
      const { data } = input;
      const parsedEvents = JSON.parse(await data.text());
      const totalEvents = parsedEvents.length;

      const errors: Error[] = [];

      parsedEvents.forEach(async (event: any) => {
        const remmapedEvent = remapEventData(event);

        try {
          const tournamentEvent = await ctx.db.bCPTournamentEvent.upsert({
            where: { eventId: remmapedEvent.eventId },
            create: remmapedEvent,
            update: remmapedEvent,
            select: { id: true },
          });

          if (!tournamentEvent.id) {
            errors.push(
              new Error(
                `Failed to upsert event with id: ${remmapedEvent.eventId}`,
              ),
            );
          }
        } catch (error) {
          errors.push(error as Error);
        }
      });

      return {
        data: {
          totalEvents,
          totalErrors: errors.length,
        },
      };
    }),

  getTournamentEvent: publicProcedure
    .input(
      z.object({
        search: z.object({
          from: z.date().optional(),
          to: z.date().optional(),
        }),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { from, to } = input.search;

      const events = await prisma.bCPTournamentEvent.findMany({
        where: {
          eventDate: {
            gte: from,
            lte: to,
          },
        },
      });

      return events;
    }),
});

function remapEventData(event: any) {
  return {
    eventId: event.id,
    active: event.active,
    checkedInPlayers: event.checkedInPlayers,
    country: event.country,
    droppedPlayers: event.droppedPlayers,
    ended: event.ended,
    eventDate: event.eventDate ? new Date(event.eventDate) : undefined,
    eventEndDate: event.eventEndDate ? new Date(event.eventEndDate) : undefined,
    formatted_address: event.formatted_address,
    gameSystemManufacturer: event.gameSystemManufacturer,
    gameSystemName: event.gameSystemName,
    gameType: event.gameType,
    isOnlineEvent: event.isOnlineEvent,
    locationName: event.locationName,
    name: event.name,
    notCheckedInPlayers: event.notCheckedInPlayers,
    numTickets: event.numTickets,
    numberOfRounds: event.numberOfRounds,
    placingMetrics: event.placingMetrics,
    pointsValue: event.pointsValue,
    queryNumPlayers: event.queryNumPlayers,
    started: event.started,
    state: event.state,
    teamEvent: event.teamEvent,
    ticketPrice: event.ticketPrice,
    timeZone: event.timeZone,
    totalPlayers: event.totalPlayers,
    url: event.url,
    BCPCreatedAt: event.created_at ? new Date(event.created_at) : undefined,
    BCPUpdatedAt: event.updated_at ? new Date(event.updated_at) : undefined,
    gameSystemId: event.gameSystemId,
  } as Prisma.BCPTournamentEventCreateInput;
}
