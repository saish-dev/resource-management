-- CreateEnum
CREATE TYPE "lock_type" AS ENUM ('TENTATIVE', 'CONFIRMED');

-- CreateEnum
CREATE TYPE "priority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "project_phase" AS ENUM ('PIPELINE', 'MOBILISING', 'IN_FLIGHT', 'CLOSING');

-- CreateEnum
CREATE TYPE "leave_status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "leave_type" AS ENUM ('ANNUAL', 'SICK', 'PARENTAL', 'OTHER');

-- CreateEnum
CREATE TYPE "skill_claim_status" AS ENUM ('PENDING', 'VERIFIED', 'DECLINED');

-- CreateEnum
CREATE TYPE "release_type" AS ENUM ('IMMEDIATE', 'PLANNED');

-- CreateEnum
CREATE TYPE "app_role" AS ENUM ('ADMIN', 'RESOURCE_MANAGER', 'DELIVERY_MANAGER', 'PRACTICE_LEAD', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "auth_provider" AS ENUM ('MICROSOFT', 'GOOGLE');

-- CreateEnum
CREATE TYPE "notification_channel" AS ENUM ('IN_APP', 'EMAIL', 'BOTH');

-- CreateEnum
CREATE TYPE "notification_frequency" AS ENUM ('IMMEDIATE', 'DAILY', 'WEEKLY');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "app_role" NOT NULL DEFAULT 'EMPLOYEE',
    "person_id" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_identities" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "provider" "auth_provider" NOT NULL,
    "subject" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login_at" TIMESTAMPTZ,

    CONSTRAINT "user_identities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "people" (
    "id" UUID NOT NULL,
    "hris_id" TEXT,
    "name" TEXT NOT NULL,
    "role_title" TEXT NOT NULL,
    "band" VARCHAR(2) NOT NULL,
    "team_id" UUID NOT NULL,
    "location" TEXT NOT NULL,
    "region" TEXT,
    "timezone" TEXT NOT NULL,
    "hours_per_day" INTEGER NOT NULL DEFAULT 8,
    "employment_start" DATE,
    "employment_end" DATE,
    "verifier_id" UUID,
    "bench_since" DATE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "people_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "person_skills" (
    "person_id" UUID NOT NULL,
    "skill_id" UUID NOT NULL,
    "status" "skill_claim_status" NOT NULL DEFAULT 'PENDING',
    "evidence" TEXT,
    "verified_by" UUID,
    "verified_at" TIMESTAMPTZ,

    CONSTRAINT "person_skills_pkey" PRIMARY KEY ("person_id","skill_id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "client" TEXT NOT NULL,
    "priority" "priority" NOT NULL,
    "phase" "project_phase" NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "lead_id" UUID,
    "lead_name" TEXT,
    "effort_hours" INTEGER NOT NULL,
    "effort_used_hours" INTEGER NOT NULL DEFAULT 0,
    "billable_pct" INTEGER NOT NULL,
    "closed_at" DATE,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_skills" (
    "project_id" UUID NOT NULL,
    "skill_id" UUID NOT NULL,

    CONSTRAINT "project_skills_pkey" PRIMARY KEY ("project_id","skill_id")
);

-- CreateTable
CREATE TABLE "demand_lines" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "role_title" TEXT NOT NULL,
    "headcount_needed" INTEGER NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,

    CONSTRAINT "demand_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demand_line_skills" (
    "demand_line_id" UUID NOT NULL,
    "skill_id" UUID NOT NULL,

    CONSTRAINT "demand_line_skills_pkey" PRIMARY KEY ("demand_line_id","skill_id")
);

-- CreateTable
CREATE TABLE "allocations" (
    "id" UUID NOT NULL,
    "person_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "demand_line_id" UUID,
    "pct" INTEGER NOT NULL,
    "billable" BOOLEAN NOT NULL DEFAULT true,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "released_at" DATE,
    "created_by" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "allocations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locks" (
    "id" UUID NOT NULL,
    "person_id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "type" "lock_type" NOT NULL,
    "pct" INTEGER,
    "start_date" DATE NOT NULL,
    "expires_on" DATE NOT NULL,
    "created_by" UUID,
    "promoted_at" TIMESTAMPTZ,
    "released_at" TIMESTAMPTZ,
    "release_reason" TEXT,

    CONSTRAINT "locks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "releases" (
    "id" UUID NOT NULL,
    "allocation_id" UUID NOT NULL,
    "type" "release_type" NOT NULL,
    "effective_date" DATE NOT NULL,
    "reason" TEXT NOT NULL,
    "knowledge_transfer" BOOLEAN NOT NULL DEFAULT false,
    "incoming_person_id" UUID,
    "kt_start" DATE,
    "kt_end" DATE,
    "created_by" UUID,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "releases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_requests" (
    "id" UUID NOT NULL,
    "person_id" UUID NOT NULL,
    "type" "leave_type" NOT NULL,
    "from_date" DATE NOT NULL,
    "to_date" DATE NOT NULL,
    "status" "leave_status" NOT NULL DEFAULT 'PENDING',
    "decided_by" UUID,

    CONSTRAINT "leave_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "holidays" (
    "id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "name" TEXT NOT NULL,
    "region" TEXT NOT NULL,

    CONSTRAINT "holidays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_rules" (
    "id" UUID NOT NULL,
    "event" TEXT NOT NULL,
    "trigger_desc" TEXT NOT NULL,
    "audience" TEXT[],
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "channel" "notification_channel" NOT NULL,
    "frequency" "notification_frequency" NOT NULL,

    CONSTRAINT "notification_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "kind" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "detail" TEXT,
    "link" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read_at" TIMESTAMPTZ,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_reports" (
    "id" UUID NOT NULL,
    "owner_id" UUID,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "scope" JSONB NOT NULL,
    "schedule" TEXT,
    "recipients" TEXT[],

    CONSTRAINT "saved_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" UUID NOT NULL,
    "actor_id" UUID,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "before" JSONB,
    "after" JSONB,
    "reason" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "user_identities_user_id_idx" ON "user_identities"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_identities_provider_subject_key" ON "user_identities"("provider", "subject");

-- CreateIndex
CREATE UNIQUE INDEX "teams_name_key" ON "teams"("name");

-- CreateIndex
CREATE UNIQUE INDEX "people_hris_id_key" ON "people"("hris_id");

-- CreateIndex
CREATE INDEX "people_team_id_idx" ON "people"("team_id");

-- CreateIndex
CREATE INDEX "people_bench_since_idx" ON "people"("bench_since");

-- CreateIndex
CREATE UNIQUE INDEX "skills_name_key" ON "skills"("name");

-- CreateIndex
CREATE INDEX "person_skills_skill_id_idx" ON "person_skills"("skill_id");

-- CreateIndex
CREATE UNIQUE INDEX "projects_code_key" ON "projects"("code");

-- CreateIndex
CREATE INDEX "demand_lines_project_id_idx" ON "demand_lines"("project_id");

-- CreateIndex
CREATE INDEX "allocations_person_id_start_date_end_date_idx" ON "allocations"("person_id", "start_date", "end_date");

-- CreateIndex
CREATE INDEX "allocations_project_id_idx" ON "allocations"("project_id");

-- CreateIndex
CREATE INDEX "allocations_demand_line_id_idx" ON "allocations"("demand_line_id");

-- CreateIndex
CREATE INDEX "locks_person_id_idx" ON "locks"("person_id");

-- CreateIndex
CREATE INDEX "locks_project_id_idx" ON "locks"("project_id");

-- CreateIndex
CREATE INDEX "locks_expires_on_idx" ON "locks"("expires_on");

-- CreateIndex
CREATE UNIQUE INDEX "releases_allocation_id_key" ON "releases"("allocation_id");

-- CreateIndex
CREATE INDEX "leave_requests_person_id_from_date_to_date_idx" ON "leave_requests"("person_id", "from_date", "to_date");

-- CreateIndex
CREATE UNIQUE INDEX "holidays_date_region_key" ON "holidays"("date", "region");

-- CreateIndex
CREATE UNIQUE INDEX "notification_rules_event_key" ON "notification_rules"("event");

-- CreateIndex
CREATE INDEX "notifications_user_id_read_at_idx" ON "notifications"("user_id", "read_at");

-- CreateIndex
CREATE INDEX "audit_log_entity_type_entity_id_idx" ON "audit_log"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "audit_log_created_at_idx" ON "audit_log"("created_at");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_identities" ADD CONSTRAINT "user_identities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "people" ADD CONSTRAINT "people_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "people" ADD CONSTRAINT "people_verifier_id_fkey" FOREIGN KEY ("verifier_id") REFERENCES "people"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person_skills" ADD CONSTRAINT "person_skills_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person_skills" ADD CONSTRAINT "person_skills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "person_skills" ADD CONSTRAINT "person_skills_verified_by_fkey" FOREIGN KEY ("verified_by") REFERENCES "people"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "people"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_skills" ADD CONSTRAINT "project_skills_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_skills" ADD CONSTRAINT "project_skills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demand_lines" ADD CONSTRAINT "demand_lines_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demand_line_skills" ADD CONSTRAINT "demand_line_skills_demand_line_id_fkey" FOREIGN KEY ("demand_line_id") REFERENCES "demand_lines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demand_line_skills" ADD CONSTRAINT "demand_line_skills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "allocations" ADD CONSTRAINT "allocations_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "allocations" ADD CONSTRAINT "allocations_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "allocations" ADD CONSTRAINT "allocations_demand_line_id_fkey" FOREIGN KEY ("demand_line_id") REFERENCES "demand_lines"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locks" ADD CONSTRAINT "locks_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locks" ADD CONSTRAINT "locks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "releases" ADD CONSTRAINT "releases_allocation_id_fkey" FOREIGN KEY ("allocation_id") REFERENCES "allocations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "releases" ADD CONSTRAINT "releases_incoming_person_id_fkey" FOREIGN KEY ("incoming_person_id") REFERENCES "people"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_decided_by_fkey" FOREIGN KEY ("decided_by") REFERENCES "people"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_reports" ADD CONSTRAINT "saved_reports_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Rules Prisma cannot express ---------------------------------------------

CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "people"
  ADD CONSTRAINT "people_band_check" CHECK ("band" IN ('B2', 'B3', 'B4', 'B5', 'B6')),
  ADD CONSTRAINT "people_hours_per_day_check" CHECK ("hours_per_day" BETWEEN 1 AND 24);

ALTER TABLE "projects"
  ADD CONSTRAINT "projects_dates_check" CHECK ("end_date" >= "start_date"),
  ADD CONSTRAINT "projects_billable_pct_check" CHECK ("billable_pct" BETWEEN 0 AND 100);

ALTER TABLE "demand_lines"
  ADD CONSTRAINT "demand_lines_headcount_check" CHECK ("headcount_needed" >= 1),
  ADD CONSTRAINT "demand_lines_dates_check" CHECK ("end_date" >= "start_date");

ALTER TABLE "allocations"
  ADD CONSTRAINT "allocations_pct_check" CHECK ("pct" BETWEEN 1 AND 100),
  ADD CONSTRAINT "allocations_dates_check" CHECK ("end_date" >= "start_date"),
  -- No overlapping live rows for the same person and project (end date inclusive).
  ADD CONSTRAINT "allocations_no_overlap" EXCLUDE USING gist (
    "person_id" WITH =,
    "project_id" WITH =,
    daterange("start_date", "end_date", '[]') WITH &&
  ) WHERE ("released_at" IS NULL);

ALTER TABLE "locks"
  ADD CONSTRAINT "locks_pct_check" CHECK ("pct" IS NULL OR "pct" BETWEEN 1 AND 100),
  ADD CONSTRAINT "locks_dates_check" CHECK ("expires_on" >= "start_date");

ALTER TABLE "leave_requests"
  ADD CONSTRAINT "leave_requests_dates_check" CHECK ("to_date" >= "from_date");

-- audit_log is append-only.
CREATE FUNCTION audit_log_immutable() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'audit_log is append-only';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_log_no_update_delete
  BEFORE UPDATE OR DELETE ON "audit_log"
  FOR EACH ROW EXECUTE FUNCTION audit_log_immutable();
