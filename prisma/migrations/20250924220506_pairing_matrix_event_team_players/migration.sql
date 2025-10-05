-- CreateTable
CREATE TABLE "PairingMatrixPlayer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "faction" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "PairingMatrixPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PairingMatrixTeam" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "pairingMatrixTournamentEventId" INTEGER,

    CONSTRAINT "PairingMatrixTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PairingMatrixTournamentEvent" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "own_team_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "PairingMatrixTournamentEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PairingMatrixPlayer_name_idx" ON "PairingMatrixPlayer"("name");

-- CreateIndex
CREATE INDEX "PairingMatrixPlayer_faction_idx" ON "PairingMatrixPlayer"("faction");

-- CreateIndex
CREATE INDEX "PairingMatrixTeam_name_idx" ON "PairingMatrixTeam"("name");

-- CreateIndex
CREATE INDEX "PairingMatrixTournamentEvent_name_idx" ON "PairingMatrixTournamentEvent"("name");

-- AddForeignKey
ALTER TABLE "PairingMatrixPlayer" ADD CONSTRAINT "PairingMatrixPlayer_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "PairingMatrixTeam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PairingMatrixPlayer" ADD CONSTRAINT "PairingMatrixPlayer_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PairingMatrixTeam" ADD CONSTRAINT "PairingMatrixTeam_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PairingMatrixTeam" ADD CONSTRAINT "PairingMatrixTeam_pairingMatrixTournamentEventId_fkey" FOREIGN KEY ("pairingMatrixTournamentEventId") REFERENCES "PairingMatrixTournamentEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PairingMatrixTournamentEvent" ADD CONSTRAINT "PairingMatrixTournamentEvent_own_team_id_fkey" FOREIGN KEY ("own_team_id") REFERENCES "PairingMatrixTeam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PairingMatrixTournamentEvent" ADD CONSTRAINT "PairingMatrixTournamentEvent_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
