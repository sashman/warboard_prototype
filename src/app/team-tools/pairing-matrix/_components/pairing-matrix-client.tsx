'use client';

import { ControlPanel } from "../../../_components/pairing-matrix-control-panel";
import { api } from "~/trpc/react";

interface TournamentFormData {
  name: string;
  own_team_id: number;
  team_name: string;
  players: Array<{ name: string; faction: string }>;
}

export function PairingMatrixClient() {
  const createTournamentMutation = api.pairingMatrix.createTournamentWithTeam.useMutation({
    onSuccess: (data) => {
      console.log('Tournament created successfully:', data);
      alert(`Tournament "${data.tournamentEvent.name}" created successfully with team "${data.team.name}"!`);
    },
    onError: (error) => {
      console.error('Error creating tournament:', error);
      alert(`Error creating tournament: ${error.message}`);
    },
  });

  const handleNewMatrix = async (data: TournamentFormData) => {
    console.log('Creating new tournament:', {
      tournamentName: data.name,
      teamName: data.team_name,
      players: data.players,
      totalPlayers: data.players.length
    });

    try {
      await createTournamentMutation.mutateAsync({
        name: data.name,
        team_name: data.team_name,
        players: data.players,
      });
    } catch (error) {
      // Error is handled by onError callback
      console.error('Failed to create tournament:', error);
    }
  };

  return (
    <ControlPanel 
      onNewMatrix={handleNewMatrix}
      onRefresh={() => console.log('Refresh clicked')}
      onFilter={() => console.log('Filter clicked')}
      onImport={() => console.log('Import clicked')}
      onExport={() => console.log('Export clicked')}
      onSettings={() => console.log('Settings clicked')}
      isCreating={createTournamentMutation.isPending}
    />
  );
}
