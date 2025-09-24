"use client";

import { AgGridReact } from "ag-grid-react";
import { type ColDef } from "ag-grid-community";

import { useState } from "react";
import { api } from "~/trpc/react";
import { BCPTournamentEvent } from "@prisma/client";
import { theme } from "./ag-grid-theme";

import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

export function TournamentEventsTab() {
  const [events] = api.tournamentEvent.getTournamentEvent.useSuspenseQuery({
    search: {},
  });

  // if (!events) {
  //   return <div>Loading...</div>;
  // }

  const [rowData, setRowData] = useState<BCPTournamentEvent[]>(events);

  // Column Definitions: Defines & controls grid columns.
  const [colDefs, setColDefs] = useState<ColDef<BCPTournamentEvent>[]>([
    {
      headerName: "Event ID",
      field: "eventId",
      cellDataType: "string",
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Event Name",
      field: "name",
      cellDataType: "string",
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Event Date",
      field: "eventDate",
      cellDataType: "date",
      filter: "agDateColumnFilter",
    },
    {
      headerName: "Total Players",
      field: "totalPlayers",
      cellDataType: false,
      filter: "agNumberColumnFilter",
    },
    {
      headerName: "Number of Rounds",
      field: "numberOfRounds",
      cellDataType: "number",
      filter: "agNumberColumnFilter",
    },
    {
      headerName: "Game System Name",
      field: "gameSystemName",
      cellDataType: "string",
    },
    {
      headerName: "Team Event",
      field: "teamEvent",
      cellDataType: "boolean",
      filter: true,
    }
  ]);

  const defaultColDef: ColDef = {
    flex: 1,
  };

  // Container: Defines the grid's theme & dimensions.
  return (
    <AgGridReact
      theme={theme}
      rowHeight={50}
      rowData={rowData}
      columnDefs={colDefs}
      defaultColDef={defaultColDef}
      onFilterChanged={(event) => {
        console.log(event);

        let count = 0;
        event.api.forEachNodeAfterFilter((node) => {
          count++;
        });
        console.log("Number of rows after filter: ", count);
        

      }}
    />
  );
}
