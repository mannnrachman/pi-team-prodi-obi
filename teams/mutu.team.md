---
name: mutu
description: Tim Jaminan Mutu - SPMI, audit mutu internal, akreditasi
defaultWorkflow: audit-mutu-internal
workspaceMode: single
maxConcurrency: 2
---

- gugus-mutu: agent=gugus-mutu pelaksana SPMI
- kaprodi: agent=kaprodi penanggung jawab mutu
- auditor: agent=dosen-pengampu auditor mutu (dosen yang ditunjuk)
- staf: agent=staf-administrasi pendukung dokumentasi
