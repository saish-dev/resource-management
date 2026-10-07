# API Design (NestJS, REST)

Base path `/api/v1`. JSON. Auth: session cookie or `Authorization: Bearer`. OpenAPI served at `/api/docs`. Dates are ISO `YYYY-MM-DD`. Lists: `?page&pageSize&sort&order`, response `{ data, meta:{page,pageSize,total} }`.

Errors: `{ statusCode, error, message, details? }`; validation failures 422 with per-field `details`; rule violations 409 with `checks[]`.

Roles: A=Admin, RM=Resource manager, DM=Delivery manager, PL=Practice lead, E=Employee.

## Auth
| Method | Path | Notes |
|---|---|---|
| GET | `/auth/:provider/login` `/auth/:provider/callback` | `provider` = `microsoft` or `google` (OIDC code flow + PKCE); sets session cookie |
| GET | `/auth/providers` | enabled providers, for the login page |
| POST | `/auth/logout` | |
| GET | `/me` | user, role, linked person |

## People
| Method | Path | Roles |
|---|---|---|
| GET | `/people` | A,RM,DM,PL. Filters: `q,status,skill,team,band,location,pastBench,full` |
| GET | `/people/:id` | all (E: own only) |
| POST | `/people` | A,RM |
| PATCH | `/people/:id` | A,RM (HRIS fields rejected if linked) |
| GET | `/people/:id/load?weeks=24` | weekly utilisation series |
| GET | `/people/:id/matches` | top open demand matches with fit % |
| GET | `/people/:id/audit` | |
| GET/POST | `/people/:id/skills` | claim a skill `{skill}` |
| GET | `/skill-claims?status=PENDING` | PL,A verification queue |
| POST | `/skill-claims/:id/verify` · `/decline` | PL,A |

Person payload: `{ id, name, role, band, team, location, timezone, hoursPerDay, status, utilisationPct, skills[], benchSince?, benchDays?, hint, allocations[], leaveSummary }`.

## Leave & holidays
| GET | `/leave?person&month` | |
| POST | `/leave` `{personId,type,from,to}` | |
| PATCH | `/leave/:id` `{status}` | RM,A |
| GET | `/holidays?region&from&to` | |

## Projects & demand
| Method | Path | Roles |
|---|---|---|
| GET | `/projects` | fill %, priority, phase |
| POST | `/projects` | A,RM,DM — `code` unique else 409 |
| GET | `/projects/:code` | detail incl. demand lines, team, effort |
| PATCH | `/projects/:code` | |
| POST | `/projects/:code/demand-lines` `{role,skills[],headcount,start?,end?}` | DM,RM |
| GET | `/projects/:code/demand-lines/:id/candidates` | ranked candidates |
| POST | `/projects/:code/close` `{personIds[],releaseDate,reason}` | RM,A |
| GET | `/projects/:code/close-preview` | bench forecast |

## Allocations
| Method | Path | Notes |
|---|---|---|
| POST | `/allocations/validate` | body `{personId,projectId,pct,start,end,billable}` → `{ checks:[{level:error|warning|success|information,title,detail}], blocked, needsAck, currentPct, afterPct }` |
| POST | `/allocations` | body + `acknowledged:boolean`, optional `demandLineId`. 409 with `checks` if blocked or ack missing |
| POST | `/allocations/bulk` | `{personIds[],…}` → `{ created[], skipped:[{personId,checks}] }` |
| PATCH | `/allocations/:id` | |
| GET | `/allocations?person&project&from&to` | |

## Locks
| GET | `/locks` | sorted by expiry, `?type` |
| POST | `/locks` `{personId,projectId,type,expiresOn}` | RM,DM(request) |
| POST | `/locks/bulk` | `{personIds[],…}` |
| POST | `/locks/:id/promote` | RM,A |
| POST | `/locks/:id/override` | tentative: RM,A · confirmed: A only |
| DELETE | `/locks/:id` | release |

## Releases
| POST | `/releases/preview` | `{allocationId,type,effectiveDate,knowledgeTransfer,incomingPersonId}` → before/after status, effects |
| POST | `/releases` | commits; writes audit; raises open demand |
| GET | `/releases?from&to` | |

## Bench & planning
| GET | `/bench` | past-threshold people + suggested demand |
| POST | `/bench/:personId/escalate` | notifies practice lead |
| GET | `/planning/timeline?grain=week|month&from&to&team` | allocations + locks per person |
| GET | `/planning/capacity?grain&from&to` | per skill `{supply,demand,gap}` |
| GET | `/dashboard` | KPIs, team utilisation, alert counts |

## Reports
| GET | `/reports/:type?from&to&team&grain` | `type`: allocation, utilization, forecast-actual → `{ columns, rows, chart, note }` |
| GET | `/reports/:type/export?format=csv|xlsx` | |
| GET/POST/DELETE | `/saved-reports` | `{name,type,scope,schedule,recipients}` |

## Notifications & settings
| GET | `/notifications?kind&unread` · POST `/notifications/:id/read` | |
| GET/PUT | `/notification-rules` | A |
| GET/PUT | `/settings` | A — `benchThresholdDays`, `skillMismatchRule` |
| GET/PATCH | `/roles`, `/users/:id/role` | A |
| GET | `/search?q=` | people, projects |

## Integrations
- **HRIS inbound**: scheduled sync (`hris` module) upserting HRIS-owned person fields by `hris_id`; optional webhook `POST /integrations/hris/webhook` (signed).
- **IdP**: OIDC with Microsoft (Entra ID) and Google. Sign-in matches the provider's verified email to `users.email`; the (provider, subject) pair is stored in `user_identities`. Unmatched or unverified emails get 403, and the attempt is audited.
- **Email**: outbound via notifications module.
- **Actuals** for forecast-vs-actual: `POST /integrations/actuals` (CSV/JSON) *(TBD source)*.
