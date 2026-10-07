// Dev/demo seed. Idempotent: people, projects, skills, holidays and rules are upserted by
// natural key; allocations, locks, leave and skill claims for seeded people are replaced.
// Never run against production. Volume people are deterministic (LCG seed 7, as in the
// prototype); set SEED_EXTRA_PEOPLE to change the count (default 238).
import { randomUUID } from 'node:crypto';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client.js';
import {
  DEMO_TODAY,
  HOLIDAYS,
  LEAVE,
  NAMED_PEOPLE,
  PROJECTS,
  RULES,
  SAVED_REPORTS,
  SKILL_REQS,
  type SeedAlloc,
  type SeedPerson,
} from './seed-data.js';

if (process.env.NODE_ENV === 'production') {
  throw new Error('Refusing to seed in production');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const day = (s: string) => new Date(`${s}T00:00:00.000Z`);
const EXTRA_PEOPLE = Number(process.env.SEED_EXTRA_PEOPLE ?? 238);

const TEAMS = [
  'Platform engineering',
  'Digital product',
  'Quality engineering',
  'Data and analytics',
];
const REGION_OF: Record<string, string> = {
  Bengaluru: 'India',
  Kochi: 'India',
  Pune: 'India',
  Seoul: 'South Korea',
  Berlin: 'Europe',
  Lisbon: 'Europe',
  Oslo: 'Europe',
  Lyon: 'Europe',
  Osaka: 'Japan',
};
const PHASE = {
  'Pipeline, not started': 'PIPELINE',
  Mobilising: 'MOBILISING',
  'In flight': 'IN_FLIGHT',
  'In flight, closing December': 'CLOSING',
} as const;
const LEAVE_TYPE = {
  'Annual leave': 'ANNUAL',
  'Sick leave': 'SICK',
  'Parental leave': 'PARENTAL',
} as const;
const CHANNEL = {
  'In app only': 'IN_APP',
  'Email only': 'EMAIL',
  'In app and email': 'BOTH',
} as const;
const FREQUENCY = {
  Immediately: 'IMMEDIATE',
  'Daily digest': 'DAILY',
  'Weekly digest': 'WEEKLY',
} as const;

// Volume people, same generator as the prototype so demos match.
function generatePeople(count: number): SeedPerson[] {
  let seed = 7;
  const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const pick = <T>(a: readonly T[]): T => a[Math.floor(r() * a.length)] as T;
  const first = [
    'Aarav',
    'Mei',
    'Lucas',
    'Sofia',
    'Kofi',
    'Hana',
    'Mateo',
    'Zara',
    'Ravi',
    'Elena',
    'Noah',
    'Priyanka',
    'Jonas',
    'Amara',
    'Diego',
    'Yuna',
    'Omar',
    'Ingrid',
    'Tariq',
    'Leila',
    'Felix',
    'Nadia',
    'Arjun',
    'Camila',
    'Sven',
    'Aisha',
    'Kenji',
    'Marta',
    'Dev',
    'Isla',
    'Tomas',
    'Farah',
    'Luca',
    'Anika',
    'Pablo',
    'Rhea',
  ];
  const last = [
    'Sharma',
    'Okafor',
    'Lindqvist',
    'Tanaka',
    'Moreau',
    'Costa',
    'Nguyen',
    'Haddad',
    'Petrov',
    'Iyer',
    'Weber',
    'Santos',
    'Kim',
    'Bauer',
    'Mensah',
    'Rossi',
    'Patel',
    'Kaya',
    'Fischer',
    'Reyes',
    'Joshi',
    'Larsen',
    'Duarte',
    'Singh',
    'Novak',
    'Abara',
    'Hoshino',
    'Verma',
    'Silva',
    'Berg',
    'Menon',
    'Khan',
    'Alvarez',
    'Roy',
    'Holm',
    'Dutta',
  ];
  const roles: [string, string, string[], string[]][] = [
    [
      'Developer',
      'B3',
      ['Java', 'React', 'Node', 'Python', 'TypeScript', 'AWS'],
      ['Platform engineering', 'Digital product'],
    ],
    [
      'Senior developer',
      'B4',
      ['Java', 'Spring', 'React', 'Node', 'AWS', 'Kafka'],
      ['Platform engineering', 'Digital product'],
    ],
    [
      'QA engineer',
      'B2',
      ['Cypress', 'Playwright', 'Selenium', 'API testing'],
      ['Quality engineering'],
    ],
    [
      'Data engineer',
      'B5',
      ['Python', 'Spark', 'Snowflake', 'SQL'],
      ['Data and analytics'],
    ],
    [
      'DevOps engineer',
      'B5',
      ['AWS', 'Terraform', 'Kubernetes', 'Azure'],
      ['Platform engineering'],
    ],
    [
      'UX engineer',
      'B4',
      ['React', 'CSS', 'Design systems', 'TypeScript'],
      ['Digital product'],
    ],
    [
      'Architect',
      'B6',
      ['Java', 'Kafka', 'AWS', 'Azure', 'Kubernetes'],
      ['Platform engineering'],
    ],
  ];
  const locs: [string, string][] = [
    ['Bengaluru', 'IST (UTC+5:30)'],
    ['Pune', 'IST (UTC+5:30)'],
    ['Kochi', 'IST (UTC+5:30)'],
    ['Berlin', 'CET (UTC+1)'],
    ['Lisbon', 'WET (UTC+0)'],
    ['Seoul', 'KST (UTC+9)'],
    ['Oslo', 'CET (UTC+1)'],
    ['Lyon', 'CET (UTC+1)'],
    ['Bogotá', 'COT (UTC-5)'],
    ['Accra', 'GMT (UTC+0)'],
    ['Dubai', 'GST (UTC+4)'],
    ['Osaka', 'JST (UTC+9)'],
  ];

  const people: SeedPerson[] = [];
  for (let i = 0; i < count; i++) {
    const [role, band, pool, teams] = pick(roles);
    const [loc, tz] = pick(locs);
    const skills: string[] = [];
    const want = 2 + Math.floor(r() * 2);
    while (skills.length < want) {
      const s = pick(pool);
      if (!skills.includes(s)) skills.push(s);
    }
    const roll = r();
    let status = 'Available';
    let allocs: SeedAlloc[] = [];
    let benchSince: string | undefined;
    if (roll < 0.62 || roll >= 0.94) {
      status = 'Allocated';
      const util = r() < 0.55 ? 100 : pick([40, 50, 60, 80]);
      allocs = [
        {
          code: pick(['P-101', 'P-102', 'P-103', 'P-104']),
          pct: util,
          billable: r() < 0.85,
          start: '2026-07-01',
          end: pick(['2026-12-18', '2027-02-27', '2027-03-31']),
        },
      ];
    } else if (roll < 0.76) {
      status = 'Available';
    } else if (roll < 0.84) {
      status = 'Bench';
      const days = 3 + Math.floor(r() * 38);
      benchSince = new Date(day(DEMO_TODAY).getTime() - days * 86400000)
        .toISOString()
        .slice(0, 10);
    } else if (roll < 0.9) {
      status = r() < 0.5 ? 'Locked-Tentative' : 'Locked-Confirmed';
    } else {
      status = 'On Leave';
    }
    people.push({
      id: `g${i}`,
      name: `${first[i % 36]} ${last[(i * 7 + Math.floor(i / 36)) % 36]}`,
      role,
      band,
      team: pick(teams),
      loc,
      tz,
      hours: 8,
      verifier: 'Practice lead',
      skills,
      status,
      allocs,
      benchSince,
    });
  }
  return people;
}

// Generated people carry the generic label "Practice lead"; Marcus Feld (e2) stands in so
// verified skills always have a verifier.
const PRACTICE_LEAD = 'e2';
const clamp = (a: Date, lo: Date, hi: Date) =>
  new Date(Math.min(Math.max(+a, +lo), +hi));

const splitSkills = (s: string) => s.split(',').map((x) => x.trim());
const hours = (s: string) => Number(s.replace(/[^0-9]/g, ''));

async function main() {
  const people = [...NAMED_PEOPLE, ...generatePeople(EXTRA_PEOPLE)];

  const skillNames = new Set<string>();
  people.forEach((p) => p.skills.forEach((s) => skillNames.add(s)));
  PROJECTS.forEach((p) => {
    p.skills.forEach((s) => skillNames.add(s));
    p.demand.forEach((d) =>
      splitSkills(d.skills).forEach((s) => skillNames.add(s)),
    );
  });
  SKILL_REQS.forEach((r) => skillNames.add(r.skill));

  // Reference data
  const teamId = new Map<string, string>();
  for (const name of TEAMS) {
    const t = await prisma.team.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    teamId.set(name, t.id);
  }
  const skillId = new Map<string, string>();
  for (const name of skillNames) {
    const s = await prisma.skill.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    skillId.set(name, s.id);
  }

  // People (HRIS-owned fields refreshed on re-seed)
  const personId = new Map<string, string>();
  for (const p of people) {
    const data = {
      name: p.name,
      roleTitle: p.role,
      band: p.band,
      teamId: teamId.get(p.team)!,
      location: p.loc,
      region: REGION_OF[p.loc] ?? null,
      timezone: p.tz,
      hoursPerDay: p.hours,
      benchSince: p.benchSince ? day(p.benchSince) : null,
    };
    const row = await prisma.person.upsert({
      where: { hrisId: p.id },
      update: data,
      create: { hrisId: p.id, ...data },
    });
    personId.set(p.id, row.id);
  }
  // Verifier: prototype uses "M. Feld"; resolve initial + surname among named people.
  const verifierOf = (label: string) =>
    label === 'Practice lead'
      ? NAMED_PEOPLE.find((n) => n.id === PRACTICE_LEAD)
      : NAMED_PEOPLE.find((n) => {
          const [f = '', ...rest] = n.name.split(' ');
          return `${f[0]}. ${rest.join(' ')}` === label;
        });
  for (const p of people) {
    const v = verifierOf(p.verifier);
    await prisma.person.update({
      where: { id: personId.get(p.id)! },
      data: { verifierId: v ? personId.get(v.id)! : null },
    });
  }
  const seeded = [...personId.values()];

  // Projects
  const projectId = new Map<string, string>();
  for (const p of PROJECTS) {
    const data = {
      name: p.name,
      client: p.client,
      priority: p.priority.toUpperCase() as 'HIGH' | 'MEDIUM' | 'LOW',
      phase: PHASE[p.phase as keyof typeof PHASE],
      startDate: day(p.start),
      endDate: day(p.end),
      leadName: p.lead,
      effortHours: hours(p.effort),
      effortUsedHours: hours(p.effortUsed),
      billablePct: Number.parseInt(p.billable, 10),
    };
    const row = await prisma.project.upsert({
      where: { code: p.code },
      update: data,
      create: { code: p.code, ...data },
    });
    projectId.set(p.code, row.id);
    await prisma.projectSkill.deleteMany({ where: { projectId: row.id } });
    await prisma.projectSkill.createMany({
      data: p.skills.map((s) => ({
        projectId: row.id,
        skillId: skillId.get(s)!,
      })),
    });
  }

  // Replace dependent rows for seeded people/projects.
  await prisma.release.deleteMany({
    where: { allocation: { personId: { in: seeded } } },
  });
  await prisma.allocation.deleteMany({ where: { personId: { in: seeded } } });
  await prisma.lock.deleteMany({ where: { personId: { in: seeded } } });
  await prisma.leaveRequest.deleteMany({ where: { personId: { in: seeded } } });
  await prisma.personSkill.deleteMany({ where: { personId: { in: seeded } } });
  await prisma.demandLine.deleteMany({
    where: { projectId: { in: [...projectId.values()] } },
  });

  // Skills: claimed skills are verified, skill requests stay pending.
  const claims = people.flatMap((p) => {
    // Labels that match no person (e.g. "M. Kulkarni") fall back to the practice lead.
    const verifier = verifierOf(p.verifier) ?? verifierOf('Practice lead');
    return p.skills.map((s) => ({
      personId: personId.get(p.id)!,
      skillId: skillId.get(s)!,
      status: 'VERIFIED' as const,
      verifiedBy: verifier ? personId.get(verifier.id)! : null,
      verifiedAt: day(DEMO_TODAY),
    }));
  });
  await prisma.personSkill.createMany({ data: claims });
  await prisma.personSkill.createMany({
    data: SKILL_REQS.map((r) => ({
      personId: personId.get(r.emp)!,
      skillId: skillId.get(r.skill)!,
      status: 'PENDING' as const,
    })),
    skipDuplicates: true,
  });

  // Allocations, built in memory so demand lines can be linked before insert.
  const window = new Map(
    PROJECTS.map((p) => [p.code, { start: day(p.start), end: day(p.end) }]),
  );
  const allocs = people.flatMap((p) =>
    p.allocs.map((a) => ({
      id: randomUUID(),
      personId: personId.get(p.id)!,
      projectId: projectId.get(a.code)!,
      role: p.role,
      code: a.code,
      pct: a.pct,
      billable: a.billable,
      // Keep allocations inside their project's dates (the prototype generator did not).
      startDate: clamp(
        day(a.start),
        window.get(a.code)!.start,
        window.get(a.code)!.end,
      ),
      endDate: clamp(
        day(a.end),
        window.get(a.code)!.start,
        window.get(a.code)!.end,
      ),
      demandLineId: null as string | null,
    })),
  );
  for (const p of PROJECTS) {
    for (const line of p.demand) {
      const lineRow = await prisma.demandLine.create({
        data: {
          projectId: projectId.get(p.code)!,
          roleTitle: line.role,
          headcountNeeded: line.need,
          startDate: day(p.start),
          endDate: day(p.end),
          skills: {
            create: splitSkills(line.skills).map((s) => ({
              skillId: skillId.get(s)!,
            })),
          },
        },
      });
      // "Filled" is derived from linked allocations: link up to the prototype's filled count.
      allocs
        .filter(
          (a) => a.code === p.code && !a.demandLineId && a.role === line.role,
        )
        .slice(0, line.filled)
        .forEach((a) => (a.demandLineId = lineRow.id));
    }
  }
  await prisma.allocation.createMany({
    data: allocs.map(({ role: _role, code: _code, ...a }) => a),
  });

  // Locks for people the prototype shows as locked (tentative expires 2026-10-31).
  const locked = people.filter((p) => p.status.startsWith('Locked'));
  await prisma.lock.createMany({
    data: locked.map((p, i) => {
      const confirmed = p.status === 'Locked-Confirmed';
      const code =
        p.id === 'e5'
          ? 'P-102'
          : (confirmed ? i % 2 === 0 : i % 2 === 1)
            ? 'P-102'
            : 'P-105';
      return {
        personId: personId.get(p.id)!,
        projectId: projectId.get(p.id === 'e12' ? 'P-105' : code)!,
        type: confirmed ? ('CONFIRMED' as const) : ('TENTATIVE' as const),
        startDate: day('2026-09-01'),
        expiresOn: day(confirmed ? '2026-11-30' : '2026-10-31'),
      };
    }),
  });

  // Leave: prototype requests, plus approved leave for generated people shown "On Leave".
  await prisma.leaveRequest.createMany({
    data: [
      ...LEAVE.map((l) => ({
        personId: personId.get(l.emp)!,
        type: LEAVE_TYPE[l.type as keyof typeof LEAVE_TYPE],
        fromDate: day(l.from),
        toDate: day(l.to),
        status: l.status.toUpperCase() as 'PENDING' | 'APPROVED',
      })),
      ...people
        .filter(
          (p) => p.status === 'On Leave' && !LEAVE.some((l) => l.emp === p.id),
        )
        .map((p) => ({
          personId: personId.get(p.id)!,
          type: 'ANNUAL' as const,
          fromDate: day('2026-09-01'),
          toDate: day('2026-09-25'),
          status: 'APPROVED' as const,
        })),
    ],
  });

  for (const h of HOLIDAYS) {
    await prisma.holiday.upsert({
      where: { date_region: { date: day(h.date), region: h.region } },
      update: { name: h.name },
      create: { date: day(h.date), name: h.name, region: h.region },
    });
  }

  for (const r of RULES) {
    const data = {
      triggerDesc: r.trigger,
      audience: r.audience.split(',').map((a) => a.trim()),
      enabled: r.on,
      channel: CHANNEL[r.channel as keyof typeof CHANNEL],
      frequency: FREQUENCY[r.frequency as keyof typeof FREQUENCY],
    };
    await prisma.notificationRule.upsert({
      where: { event: r.event },
      update: data,
      create: { event: r.event, ...data },
    });
  }

  for (const s of SAVED_REPORTS) {
    const exists = await prisma.savedReport.findFirst({
      where: { name: s.name, ownerId: null },
    });
    if (!exists) {
      await prisma.savedReport.create({
        data: {
          name: s.name,
          type: s.type,
          scope: { text: s.scope },
          schedule: s.schedule,
          recipients: [],
        },
      });
    }
  }

  await prisma.setting.upsert({
    where: { key: 'bench_threshold_days' },
    update: {},
    create: { key: 'bench_threshold_days', value: 14 },
  });
  await prisma.setting.upsert({
    where: { key: 'skill_mismatch_rule' },
    update: {},
    create: { key: 'skill_mismatch_rule', value: 'WARN_ACKNOWLEDGE' },
  });

  const [pc, ac, lc, lvc] = await Promise.all([
    prisma.person.count(),
    prisma.allocation.count(),
    prisma.lock.count(),
    prisma.leaveRequest.count(),
  ]);
  console.log(
    `Seeded: ${pc} people, ${ac} allocations, ${lc} locks, ${lvc} leave requests`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
