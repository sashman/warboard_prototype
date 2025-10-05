import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const pairingMatrixRouter = createTRPCRouter({
  // Create a new tournament event with team and players
  createTournamentWithTeam: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        team_name: z.string().min(1),
        players: z.array(
          z.object({
            name: z.string().min(1),
            faction: z.string().min(1),
          })
        ).min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Create everything in a transaction
      const result = await ctx.db.$transaction(async (tx) => {
        // First create the team with players
        const team = await tx.pairingMatrixTeam.create({
          data: {
            name: input.team_name,
            createdById: ctx.session.user.id,
            players: {
              create: input.players.map(player => ({
                name: player.name,
                faction: player.faction,
                createdById: ctx.session.user.id,
              })),
            },
          },
          include: {
            players: true,
          },
        });

        // Then create the tournament event
        const tournamentEvent = await tx.pairingMatrixTournamentEvent.create({
          data: {
            name: input.name,
            own_team_id: team.id,
            createdById: ctx.session.user.id,
          },
          include: {
            own_team: {
              include: {
                players: true,
              },
            },
            opponent_teams: {
              include: {
                players: true,
              },
            },
          },
        });

        return { team, tournamentEvent };
      });

      return result;
    }),

  // Create a new tournament event
  createTournamentEvent: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        own_team_id: z.number().positive(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const tournamentEvent = await ctx.db.pairingMatrixTournamentEvent.create({
        data: {
          name: input.name,
          own_team_id: input.own_team_id,
          createdById: ctx.session.user.id,
        },
        include: {
          own_team: {
            include: {
              players: true,
            },
          },
          opponent_teams: {
            include: {
              players: true,
            },
          },
        },
      });

      return tournamentEvent;
    }),

  // Get tournament events for the current user
  getTournamentEvents: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.pairingMatrixTournamentEvent.findMany({
      where: {
        createdById: ctx.session.user.id,
      },
      include: {
        own_team: {
          include: {
            players: true,
          },
        },
        opponent_teams: {
          include: {
            players: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  // Get a specific tournament event
  getTournamentEvent: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.pairingMatrixTournamentEvent.findUnique({
        where: {
          id: input.id,
          createdById: ctx.session.user.id,
        },
        include: {
          own_team: {
            include: {
              players: true,
            },
          },
          opponent_teams: {
            include: {
              players: true,
            },
          },
        },
      });
    }),

  // Get teams for the current user
  getUserTeams: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.pairingMatrixTeam.findMany({
      where: {
        createdById: ctx.session.user.id,
      },
      include: {
        players: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }),
});
