# pi-team-prodi-obe

> **Pi extension untuk orkestrasi tim Program Studi berbasis OBE (Outcome-Based Education).**

Paket ini menyediakan 10 agent peran prodi, 5 tim kerja, 5 workflow OBE, 3 skill pendukung, dan 4 tools khusus — semuanya terintegrasi dengan [pi-crew](https://github.com/baphuongna/pi-crew) untuk mengorkestrasi tim Program Studi secara otonom.

```text
npm: pi-team-prodi-obe
```

---

## Fitur

- **Agent peran Prodi** — 10 agent dengan system prompt spesifik: Kaprodi, Koordinator Program, Supervisor, Dosen Pengampu, Dosen PA, Tim Kurikulum, Staf Administrasi, Teknisi & Laboran, Gugus Mutu, Himaprodi.
- **Tim** — 5 tim kerja siap pakai: Pimpinan, Akademik, Administrasi, Mutu, Kemahasiswaan.
- **Workflow OBE** — 5 workflow lengkap: Perencanaan Kurikulum, Pelaksanaan Pembelajaran, Evaluasi CPMK/PLO, Audit Mutu Internal, Rapat Tinjauan Manajemen.
- **Tools OBE dinamis** — 4 tools asistif: `evaluasi_cpmk`, `generate_laporan_akreditasi`, `mapping_cpl_cpmk`, `jadwal_akademik`.
- **Commands** — 3 slash command: `/kaprodi`, `/rapat`, `/laporan`.
- **Skills** — 3 skill pendukung: OBE Kurikulum, Evaluasi CPMK, SPMI.
- **SPMI PPEPP** — Mendukung siklus Penetapan-Pelaksanaan-Evaluasi-Pengendalian-Peningkatan Standar.

---

## Instalasi

```bash
pi install npm:pi-team-prodi-obe
```

Pengembangan lokal:

```bash
pi install ./pi-team-prodi-obe
```

### Prasyarat

- [Pi](https://pi.dev) ([earendil-works/pi](https://github.com/earendil-works/pi)) terinstall
- [pi-crew](https://github.com/baphuongna/pi-crew) terinstall (`pi install npm:pi-crew`) — wajib agar agents/teams/workflows ter-discover

---

## Struktur

```
pi-team-prodi-obe/
├── package.json              # Manifest paket Pi
├── index.ts                  # Titik masuk extension
├── AGENTS.md                 # File konteks prodi
├── README.md                 # Dokumentasi ini
├── tsconfig.json             # Konfigurasi TypeScript
├── agents/                   # 10 definisi agent peran prodi
├── teams/                    # 5 tim kerja
├── workflows/                # 5 workflow OBE
├── skills/                   # 3 skill pendukung
│   ├── obe-kurikulum/
│   ├── evaluasi-cpmk/
│   └── spmi/
└── src/                      # Kode sumber
    └── extension/
        └── register.ts       # Lifecycle & status extension
```

---

## Penggunaan

### Tools

Tools dapat dipanggil oleh agent Pi atau langsung dari percakapan. Tools bersifat asistif/dinamis: memakai konteks dan data yang diberikan pengguna, bukan basis data akademik statis.

```
@evaluasi_cpmk Bantu evaluasi CPMK mata kuliah "Basis Data" semester "Ganjil 2025/2026"
@generate_laporan_akreditasi Buat draft borang APS tahun 2026
@mapping_cpl_cpmk Susun draft mapping CPL ke MK "PBO2025"
@jadwal_akademik Bantu susun jadwal kuliah semester ini
```

### Commands

```
/kaprodi           # Akses agent Kaprodi
/rapat             # Buat agenda rapat
/laporan           # Susun laporan prodi
```

### Tim & Workflow

Gunakan pi-crew untuk menjalankan workflow:

```json
{
  "action": "run",
  "team": "akademik",
  "goal": "Evaluasi pencapaian CPMK semester ini dan berikan rekomendasi perbaikan"
}
```

```json
{
  "action": "run",
  "team": "mutu",
  "goal": "Laksanakan audit mutu internal untuk standar pembelajaran"
}
```

---

## Daftar Agent

| Agent | Peran | File |
|-------|-------|------|
| Kaprodi | Ketua Program Studi — perencanaan strategis, kurikulum, mutu | `agents/kaprodi.md` |
| Koordinator Program | Operasional harian, jadwal, komunikasi tim | `agents/koordinator-program.md` |
| Supervisor | Pengawasan tugas operasional harian staf | `agents/supervisor.md` |
| Dosen Pengampu | Tridharma, RPS, pembelajaran, evaluasi CPMK | `agents/dosen-pengampu.md` |
| Dosen PA | Bimbingan akademik, monitoring KRS/IPK | `agents/dosen-pa.md` |
| Tim Kurikulum | Pengembangan kurikulum OBE, pemetaan CPL-CPMK | `agents/tim-kurikulum.md` |
| Staf Administrasi | Surat-menyurat, verifikasi dokumen, laporan | `agents/staf-administrasi.md` |
| Teknisi & Laboran | Lab, praktikum, inventaris, K3 | `agents/teknisi-laboran.md` |
| Gugus Mutu | SPMI, audit mutu internal, akreditasi | `agents/gugus-mutu.md` |
| Himaprodi | Organisasi dan kegiatan kemahasiswaan | `agents/himaprodi.md` |

---

## Daftar Team

| Team | Deskripsi | Agent Anggota | Default Workflow |
|------|-----------|---------------|------------------|
| Pimpinan | Tim Kepemimpinan — pengambil keputusan strategis | kaprodi, koordinator-program, supervisor, gugus-mutu | `rapat-tinjauan-manajemen` |
| Akademik | Tim Akademik & Pembinaan — tridharma, kurikulum | kaprodi, tim-kurikulum, dosen-pengampu, dosen-pa | `perencanaan-kurikulum` |
| Administrasi | Tim Administrasi & Pendukung — operasional | staf-administrasi, teknisi-laboran, supervisor | `default` |
| Mutu | Tim Jaminan Mutu — SPMI, AMI, akreditasi | gugus-mutu, kaprodi, dosen-pengampu, staf-administrasi | `audit-mutu-internal` |
| Kemahasiswaan | Tim Kemahasiswaan — pembinaan mahasiswa | himaprodi, dosen-pa, kaprodi | `default` |

---

## Workflow

| Workflow | Deskripsi | Steps |
|----------|-----------|-------|
| Perencanaan Kurikulum | Siklus perencanaan kurikulum OBE | analisis-kebutuhan → perumusan-cpl → pemetaan-mk → penyusunan-rps → review-kurikulum → finalisasi |
| Pelaksanaan Pembelajaran | Siklus pembelajaran per semester | persiapan-perkuliahan → pembukaan-kelas → pelaksanaan → assessment-tengah → assessment-akhir → input-nilai → evaluasi-pembelajaran |
| Evaluasi CPMK/PLO | Evaluasi capaian CPMK dan CPL | kumpulkan-data → analisis-cpmk → agregasi-cpl → rekomendasi-perbaikan → laporan |
| Audit Mutu Internal | AMI berbasis SPMI (siklus PPEPP) | persiapan-ami → pelaksanaan-ami → temuan-audit → laporan-ami → tindak-lanjut → verifikasi |
| Rapat Tinjauan Manajemen | RTM evaluasi berkala sistem mutu | persiapan-rtm → rapat → keputusan → notulen |

---

## Lisensi

MIT. Lihat file [`LICENSE`](LICENSE).

## Kredit

Analisis dan rancangan awal dibuat oleh [agusbyna](https://github.com/agusbyna).

Pengembangan lanjutan, perapian logika, penyesuaian tools dinamis, dan dokumentasi dikelola oleh [mannnrachman](https://github.com/mannnrachman).

