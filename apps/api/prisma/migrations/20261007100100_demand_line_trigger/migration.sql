-- Prisma drops the composite FK from the previous migration on the next diff because it
-- cannot model it, so enforce "same project" with a trigger instead.
ALTER TABLE "allocations" DROP CONSTRAINT "allocations_demand_line_same_project_fkey";

CREATE FUNCTION allocations_demand_line_same_project() RETURNS trigger AS $$
BEGIN
  IF NEW."demand_line_id" IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM "demand_lines"
    WHERE "id" = NEW."demand_line_id" AND "project_id" = NEW."project_id"
  ) THEN
    RAISE EXCEPTION 'demand line % does not belong to project %', NEW."demand_line_id", NEW."project_id"
      USING ERRCODE = 'foreign_key_violation';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER allocations_demand_line_same_project
  BEFORE INSERT OR UPDATE OF "demand_line_id", "project_id" ON "allocations"
  FOR EACH ROW EXECUTE FUNCTION allocations_demand_line_same_project();
