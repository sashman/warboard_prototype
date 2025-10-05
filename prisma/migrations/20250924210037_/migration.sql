-- CreateTable
CREATE TABLE "BCPTournamentEvent" (
    "id" SERIAL NOT NULL,
    "eventId" VARCHAR(255) NOT NULL,
    "active" BOOLEAN,
    "checkedInPlayers" INTEGER NOT NULL DEFAULT 0,
    "country" TEXT NOT NULL,
    "droppedPlayers" INTEGER NOT NULL DEFAULT 0,
    "ended" BOOLEAN,
    "eventDate" TIMESTAMP(3),
    "eventEndDate" TIMESTAMP(3),
    "formatted_address" TEXT NOT NULL DEFAULT 'N/A',
    "gameSystemManufacturer" TEXT NOT NULL,
    "gameSystemName" TEXT NOT NULL,
    "gameType" INTEGER,
    "isOnlineEvent" BOOLEAN,
    "locationName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "notCheckedInPlayers" INTEGER NOT NULL DEFAULT 0,
    "numTickets" INTEGER NOT NULL DEFAULT 0,
    "numberOfRounds" INTEGER NOT NULL DEFAULT 0,
    "placingMetrics" JSONB NOT NULL,
    "pointsValue" INTEGER NOT NULL DEFAULT 0,
    "queryNumPlayers" INTEGER NOT NULL DEFAULT 0,
    "started" BOOLEAN,
    "state" TEXT NOT NULL DEFAULT 'N/A',
    "teamEvent" BOOLEAN,
    "ticketPrice" INTEGER NOT NULL DEFAULT 0,
    "timeZone" TEXT NOT NULL,
    "totalPlayers" INTEGER NOT NULL DEFAULT 0,
    "url" TEXT,
    "BCPCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "BCPUpdatedAt" TIMESTAMP(3) NOT NULL,
    "gameSystemId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BCPTournamentEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "refresh_token_expires_in" INTEGER,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "BCPTournamentEvent_eventId_key" ON "BCPTournamentEvent"("eventId");

-- CreateIndex
CREATE INDEX "BCPTournamentEvent_eventId_idx" ON "BCPTournamentEvent"("eventId");

-- CreateIndex
CREATE INDEX "BCPTournamentEvent_name_idx" ON "BCPTournamentEvent"("name");

-- CreateIndex
CREATE INDEX "Post_name_idx" ON "Post"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
