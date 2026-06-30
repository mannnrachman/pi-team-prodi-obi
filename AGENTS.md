# pi-team-prodi-obe — Agent Context

This package is a Pi extension for orchestrating **Program Studi (Department)** teams based on **OBE (Outcome-Based Education)** principles.

## Source of Truth

Read in this order:

1. This file (`AGENTS.md`) for operating rules and package structure.
2. `README.md` for package overview, installation, and usage.
3. `agents/*.md` for per-agent definitions (10 roles).
4. `teams/*.team.md` for team compositions (5 teams).
5. `workflows/*.workflow.md` for OBE workflows (5 workflows).
6. `skills/` for skill definitions (OBE curriculum, CPMK evaluation, SPMI).

## Directory Structure

```
pi-team-prodi-obe/
├── package.json            # Pi package manifest
├── index.ts                # Extension entry point
├── AGENTS.md               # This file
├── README.md               # Package documentation
├── tsconfig.json           # TypeScript config
├── agents/                 # Agent definitions (10 roles)
│   ├── kaprodi.md
│   ├── koordinator-program.md
│   ├── supervisor.md
│   ├── dosen-pengampu.md
│   ├── dosen-pa.md
│   ├── tim-kurikulum.md
│   ├── staf-administrasi.md
│   ├── teknisi-laboran.md
│   ├── gugus-mutu.md
│   └── himaprodi.md
├── teams/                  # Team compositions (5 teams)
│   ├── pimpinan.team.md
│   ├── akademik.team.md
│   ├── administrasi.team.md
│   ├── mutu.team.md
│   └── kemahasiswaan.team.md
├── workflows/              # OBE workflows (5 workflows)
│   ├── perencanaan-kurikulum.workflow.md
│   ├── pelaksanaan-pembelajaran.workflow.md
│   ├── evaluasi-cpmk-plo.workflow.md
│   ├── audit-mutu-internal.workflow.md
│   └── rapat-tinjauan-manajemen.workflow.md
├── skills/                 # Skill definitions
│   ├── obe-kurikulum/SKILL.md
│   ├── evaluasi-cpmk/SKILL.md
│   └── spmi/SKILL.md
└── src/                    # Source code
    └── extension/register.ts
```

## Operating Rules

- Keep changes minimal. `index.ts` is the extension entry point and currently registers OBE tools and slash commands; `src/extension/register.ts` handles lifecycle/status hooks.
- Agents, teams, and workflows are auto-discovered by **pi-crew** from their respective directories; Pi core itself only loads extensions, skills, prompts, and themes.
- Tools are registered via `pi.registerTool()` with TypeBox parameter validation and `StringEnum` for string enum parameters.
- Commands are registered via `pi.registerCommand()` for quick access.
- Use Bahasa Indonesia for system prompts and user-facing content (context: Indonesian higher education).
- Prefer pi-crew conventions for resource files (YAML frontmatter + markdown body).

## OBE-Focused Tools

The package registers 4 tools via `registerOBETools()`:

### `evaluasi_cpmk`
Assist dynamic CPMK evaluation from data already provided by the user or documents currently being analyzed. This tool does not assume a fixed grade database.
- Parameters: `mata_kuliah` (string), `semester` (string), `format` (optional: ringkasan/detail/visual)
- Returns: an evaluation framework, required data checklist, and recommendation structure

### `generate_laporan_akreditasi`
Generate a draft accreditation/SPMI document template (APS, LAM, SPM) that agents can complete with context and user-provided evidence.
- Parameters: `jenis` (aps/lam/spm), `tahun` (string)
- Returns: markdown draft/template with evidence checklist and follow-up table

### `mapping_cpl_cpmk`
Assist draft mapping from CPL to CPMK based on provided CPL list and available course context/RPS.
- Parameters: `kode_mk` (string), `daftar_cpl` (array of strings)
- Returns: draft CPL-CPMK mapping table and next-step checklist

### `jadwal_akademik`
Assist schedule planning/review for lectures, exams, meetings, or activities. This tool does not persist schedule data; use user-provided tables/files as context.
- Parameters: `aksi` (tambah/lihat/ubah/hapus), `tipe` (optional: kuliah/ujian/rapat/kegiatan)
- Returns: schedule guidance, required-data checklist, and conflict-check checklist

## Commands

Three slash commands are registered via `registerCommands()`:

| Command | Description |
|---------|-------------|
| `/kaprodi` | Activate Ketua Program Studi agent |
| `/rapat` | Create meeting agenda/schedule |
| `/laporan` | Generate prodi report (mutu, akademik, keuangan) |

## Task Loop

For every task:

1. Understand the context: which prodi role/team is involved?
2. Identify the relevant OBE workflow step.
3. Use the appropriate tool for dynamic analysis, drafting, guidance, or document generation.
4. If blocked, report the blocker with context.
5. Apply the PPEPP cycle mindset (Plan-Do-Check-Act).

## PPEPP and OBE Concepts

### PPEPP Cycle (SPMI)
The internal quality assurance system follows a 5-step cycle:

1. **P**enetapan Standar (Standards Setting)
2. **P**elaksanaan Standar (Standards Implementation)
3. **E**valuasi Pelaksanaan Standar (Evaluation of Implementation)
4. **P**engendalian Pelaksanaan Standar (Control of Implementation)
5. **P**eningkatan Standar (Standards Improvement)

### OBE Workflow
The Outcome-Based Education data flow:

```
CPL (Program Learning Outcomes)
    │
    ▼
CPMK (Course Learning Outcomes) ←─ Ditetapkan Tim Kurikulum
    │
    ▼
Sub-CPMK ←─ Disusun Dosen Pengampu (di RPS)
    │
    ▼
Materi & Metode Pembelajaran SCL
    │
    ▼
Assessment (Tugas, Kuis, UTS, UAS)
    │
    ▼
Analisis Pencapaian CPMK per Mahasiswa ←─ Dibantu tool evaluasi_cpmk dari data yang tersedia
    │
    ▼
Agregasi ke CPL
    │
    ▼
Evaluasi Kurikulum & Perbaikan ←─ Siklus PPEPP SPMI
```

### Key Principles
- **Constructive Alignment**: Learning outcomes, teaching methods, and assessment must align.
- **SCL (Student-Centered Learning)**: Active learning approaches.
- **Continuous Improvement**: Data-driven curriculum and process improvement.
- **Evidence-Based**: All decisions must be supported by data and documentation.
