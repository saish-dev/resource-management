-- CreateIndex
CREATE UNIQUE INDEX "demand_lines_id_project_id_key" ON "demand_lines"("id", "project_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_person_id_key" ON "users"("person_id");

-- Rules Prisma cannot express ---------------------------------------------

-- An allocation may only link to a demand line of its own project.
-- MATCH SIMPLE: rows with a NULL demand_line_id are not checked.
ALTER TABLE "allocations"
  ADD CONSTRAINT "allocations_demand_line_same_project_fkey"
  FOREIGN KEY ("demand_line_id", "project_id") REFERENCES "demand_lines"("id", "project_id");

-- audit_log is append-only: also block TRUNCATE.
CREATE TRIGGER audit_log_no_truncate
  BEFORE TRUNCATE ON "audit_log"
  FOR EACH STATEMENT EXECUTE FUNCTION audit_log_immutable();
