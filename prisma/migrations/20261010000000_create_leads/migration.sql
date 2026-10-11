-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('new', 'contacted', 'qualified', 'won', 'lost', 'spam');

-- CreateTable
CREATE TABLE "leads" (
    "id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "company" TEXT,
    "service" TEXT NOT NULL,
    "budget" TEXT,
    "budget_currency" TEXT,
    "timeline" TEXT,
    "message" TEXT NOT NULL,
    "nda" BOOLEAN NOT NULL DEFAULT false,
    "heard_from" TEXT,
    "source_page" TEXT,
    "utm_source" TEXT,
    "utm_medium" TEXT,
    "utm_campaign" TEXT,
    "utm_term" TEXT,
    "utm_content" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'new',

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "leads_created_at_idx" ON "leads"("created_at");

-- CreateIndex
CREATE INDEX "leads_status_idx" ON "leads"("status");
