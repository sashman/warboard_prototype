"use client";

import { useState } from "react";
import { 
  Box, 
  Button, 
  ButtonGroup, 
  Paper, 
  Modal,
  Typography,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Card,
  CardContent,
  Divider
} from "@mui/material";
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  FilterList as FilterIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";

interface TournamentFormData {
  name: string;
  own_team_id: number;
  team_name: string;
  players: Array<{ name: string; faction: string }>;
}

interface ControlPanelProps {
  onNewMatrix?: (data: TournamentFormData) => Promise<void>;
  onRefresh?: () => void;
  onFilter?: () => void;
  onImport?: () => void;
  onExport?: () => void;
  onSettings?: () => void;
  isCreating?: boolean;
}

export function ControlPanel({
  onNewMatrix,
  onRefresh,
  onFilter,
  onImport,
  onExport,
  onSettings,
  isCreating = false,
}: ControlPanelProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<TournamentFormData>({
    name: "",
    own_team_id: 0,
    team_name: "",
    players: [{ name: "", faction: "" }],
  });

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => {
    setModalOpen(false);
    setFormData({
      name: "",
      own_team_id: 0,
      team_name: "",
      players: [{ name: "", faction: "" }],
    });
  };

  const handleFormChange = <K extends keyof TournamentFormData>(
    field: K, 
    value: TournamentFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePlayerChange = (index: number, field: 'name' | 'faction', value: string) => {
    setFormData(prev => ({
      ...prev,
      players: prev.players.map((player, i) => 
        i === index ? { ...player, [field]: value } : player
      )
    }));
  };

  const addPlayer = () => {
    setFormData(prev => ({
      ...prev,
      players: [...prev.players, { name: "", faction: "" }]
    }));
  };

  const removePlayer = (index: number) => {
    if (formData.players.length > 1) {
      setFormData(prev => ({
        ...prev,
        players: prev.players.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async () => {
    if (formData.name.trim() && formData.team_name.trim() && 
        formData.players.some(player => player.name.trim() && player.faction.trim())) {
      setIsSubmitting(true);
      try {
        await onNewMatrix?.(formData);
        handleCloseModal();
      } catch (error) {
        console.error('Error creating tournament:', error);
        // Keep modal open on error
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  return (
    <>
      <Paper
        elevation={3}
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          borderRadius: 2,
          p: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "center",
          }}
        >
          <ButtonGroup variant="contained" size="large">
            <Button
              startIcon={<AddIcon />}
              sx={{ color: "white", borderColor: "white" }}
              onClick={handleOpenModal}
            >
              New Matrix
            </Button>

            <Button
              startIcon={<AddIcon />}
              sx={{ color: "white", borderColor: "white" }}
              onClick={() => console.log('New Team clicked')}
            >
              New Team
            </Button>
          </ButtonGroup>

          <ButtonGroup variant="outlined" size="large">
            <Button
              startIcon={<UploadIcon />}
              sx={{ color: "white", borderColor: "white" }}
              onClick={onImport}
            >
              Import
            </Button>
            <Button
              startIcon={<DownloadIcon />}
              sx={{ color: "white", borderColor: "white" }}
              onClick={onExport}
            >
              Export
            </Button>
            <Button
              startIcon={<SettingsIcon />}
              sx={{ color: "white", borderColor: "white" }}
              onClick={onSettings}
            >
              Settings
            </Button>
          </ButtonGroup>
        </Box>
      </Paper>

    {/* New Tournament Modal */}
    <Modal
      open={modalOpen}
      onClose={handleCloseModal}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          width: 500,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2">
            Create New Pairing Matrix Tournament
          </Typography>
          <Button onClick={handleCloseModal} sx={{ minWidth: 'auto', p: 1 }}>
            <CloseIcon />
          </Button>
        </Box>

        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Tournament Name"
            value={formData.name}
            onChange={(e) => handleFormChange('name', e.target.value)}
            required
            variant="outlined"
          />

          <TextField
            fullWidth
            label="Team Name"
            value={formData.team_name}
            onChange={(e) => handleFormChange('team_name', e.target.value)}
            required
            variant="outlined"
          />

          <Divider />

          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Team Players</Typography>
              <Button
                startIcon={<PersonAddIcon />}
                onClick={addPlayer}
                variant="outlined"
                size="small"
              >
                Add Player
              </Button>
            </Box>

            {formData.players.map((player, index) => (
              <Card key={index} sx={{ mb: 2, p: 2 }}>
                <CardContent sx={{ pt: 0, pb: '16px !important' }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField
                      label="Player Name"
                      value={player.name}
                      onChange={(e) => handlePlayerChange(index, 'name', e.target.value)}
                      required
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      label="Faction"
                      value={player.faction}
                      onChange={(e) => handlePlayerChange(index, 'faction', e.target.value)}
                      required
                      sx={{ flex: 1 }}
                    />
                    {formData.players.length > 1 && (
                      <IconButton
                        onClick={() => removePlayer(index)}
                        color="error"
                        sx={{ ml: 1 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
            <Button variant="outlined" onClick={handleCloseModal} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                !formData.name.trim() || 
                !formData.team_name.trim() || 
                !formData.players.some(player => player.name.trim() && player.faction.trim())
              }
            >
              {isSubmitting ? 'Creating...' : 'Create Tournament'}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Modal>
    </>
  );
}
