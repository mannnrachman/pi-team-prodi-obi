# Panduan Penggunaan Paket `pi-team-prodi-obe`

> Paket Pi extension untuk mengorkestrasi tim Program Studi berbasis **OBE (Outcome-Based Education)**.

---

## Daftar Isi

1. [Instalasi](#1-instalasi)
2. [Panggil Tools Langsung](#2-panggil-tools-langsung)
3. [Slash Commands](#3-slash-commands)
4. [Jalankan Tim & Workflow via pi-crew](#4-jalankan-tim--workflow-via-pi-crew)
5. [Daftar Agent](#5-daftar-agent)
6. [Daftar Team](#6-daftar-team)
7. [Daftar Workflow](#7-daftar-workflow)
8. [Skills](#8-skills)
9. [Contoh Skenario Lengkap](#9-contoh-skenario-lengkap)
10. [Siklus PPEPP & Alur Data OBE](#10-siklus-ppepp--alur-data-obe)

---

## 1. Instalasi

```bash
# Dari npm registry
pi install npm:pi-team-prodi-obe

# Atau lokal (development)
pi install ./pi-team-prodi-obe
```

### Prasyarat

- **Pi** — [Pi Coding Agent](https://pi.dev) ([earendil-works/pi](https://github.com/earendil-works/pi)) terinstall
- **pi-crew** — `pi install npm:pi-crew`

### Verifikasi Instalasi

```bash
pi list
```

Cari `pi-team-prodi-obe` dalam daftar paket terinstall.

---

## 2. Panggil Tools Langsung

Tools OBE dapat dipanggil dari percakapan dengan agent Pi menggunakan `@nama_tool`. Tools bersifat asistif/dinamis: memakai data yang tersedia di percakapan atau dokumen pengguna, bukan database akademik statis.

### 2.1 Evaluasi CPMK

Membantu evaluasi Course Learning Outcomes (CPMK) dari data nilai yang diberikan pengguna atau dokumen yang sedang dianalisis.

```
@evaluasi_cpmk Evaluasi CPMK untuk mata kuliah "Basis Data" semester "Ganjil 2025/2026"
```

**Parameter:**
| Parameter | Tipe | Wajib | Deskripsi |
|-----------|------|-------|-----------|
| `mata_kuliah` | string | ✅ | Nama atau kode mata kuliah |
| `semester` | string | ✅ | Semester/tahun akademik |
| `format` | string | ❌ | `ringkasan`, `detail`, atau `visual` |

**Contoh dengan format detail:**
```
@evaluasi_cpmk Evaluasi CPMK untuk "Pemrograman Web" semester "Genap 2025/2026" dalam format detail
```

### 2.2 Generate Laporan Akreditasi

Buat draft/template dokumen akreditasi (APS, LAM, SPM) yang dapat langsung dilengkapi.

```
@generate_laporan_akreditasi Buat template APS tahun 2026
```

**Parameter:**
| Parameter | Tipe | Wajib | Deskripsi |
|-----------|------|-------|-----------|
| `jenis` | string | ✅ | `aps`, `lam`, atau `spm` |
| `tahun` | string | ✅ | Tahun akreditasi |

**Contoh:**
```
@generate_laporan_akreditasi Buat template borang LAM untuk tahun 2026
@generate_laporan_akreditasi Siapkan dokumen SPM tahun 2025
```

### 2.3 Mapping CPL-CPMK

Bantu menyusun draft pemetaan Capaian Pembelajaran Lulusan (CPL) ke CPMK mata kuliah.

```
@mapping_cpl_cpmk Mapping CPL ke MK "PBO2025"
```

**Parameter:**
| Parameter | Tipe | Wajib | Deskripsi |
|-----------|------|-------|-----------|
| `kode_mk` | string | ✅ | Kode mata kuliah |
| `daftar_cpl` | array | ✅ | Daftar CPL yang dipetakan |

**Contoh:**
```
@mapping_cpl_cpmk Mapping CPL ke MK "SI202" dengan CPL: ["CPL1", "CPL2", "CPL3", "CPL4"]
@mapping_cpl_cpmk Petakan CPL Sikap dan Pengetahuan ke MK "AKD301"
```

### 2.4 Jadwal Akademik

Bantu menyusun, meninjau, atau memberi checklist jadwal perkuliahan, ujian, rapat, dan kegiatan akademik tanpa menyimpan data permanen.

```
@jadwal_akademik Bantu tinjau jadwal kuliah hari ini dari data yang saya berikan
```

**Parameter:**
| Parameter | Tipe | Wajib | Deskripsi |
|-----------|------|-------|-----------|
| `aksi` | string | ✅ | `tambah`, `lihat`, `ubah`, atau `hapus` |
| `tipe` | string | ❌ | `kuliah`, `ujian`, `rapat`, atau `kegiatan` |

**Contoh:**
```
@jadwal_akademik Bantu susun jadwal kuliah baru
@jadwal_akademik Bantu tinjau jadwal ujian semester ini dari tabel yang saya berikan
@jadwal_akademik Bantu revisi jadwal rapat prodi
@jadwal_akademik Bantu buat checklist pembatalan kegiatan seminar
```

---

## 3. Slash Commands

| Command | Deskripsi | Contoh |
|---------|-----------|--------|
| `/kaprodi` | Aktifkan agent Ketua Program Studi | `/kaprodi Saya ingin mengevaluasi kinerja dosen semester ini` |
| `/rapat` | Buat agenda/jadwal rapat prodi | `/rapat Rapat koordinasi kurikulum OBE` |
| `/laporan` | Generate laporan prodi | `/laporan Laporan mutu semester genap 2025/2026` |

**Contoh penggunaan:**

```
/kaprodi → "Tolong review RPS mata kuliah semester ini"
/rapat → "Buat agenda rapat tinjauan manajemen untuk pekan depan"
/laporan → "Siapkan laporan akreditasi prodi"
```

---

## 4. Jalankan Tim & Workflow via pi-crew

Gunakan tool `team` untuk mengorkestrasi beberapa agent secara bersamaan.

### 4.1 Jalankan Tim dengan Goal

```json
{
  "action": "run",
  "team": "akademik",
  "goal": "Evaluasi pencapaian CPMK semester ini dan berikan rekomendasi perbaikan"
}
```

### 4.2 Jalankan Tim dengan Workflow Tertentu

```json
{
  "action": "run",
  "team": "mutu",
  "workflow": "audit-mutu-internal",
  "goal": "Laksanakan audit mutu internal untuk standar pembelajaran dan standar penilaian"
}
```

### 4.3 Jalankan Tim Pimpinan untuk RTM

```json
{
  "action": "run",
  "team": "pimpinan",
  "workflow": "rapat-tinjauan-manajemen",
  "goal": "Laksanakan RTM semester genap 2025/2026. Bahas capaian CPMK, hasil AMI, dan tindak lanjut"
}
```

### 4.4 Lihat Status Run

```json
{
  "action": "status",
  "runId": "team_20260630_xxxxxxxxxxxxxxxx"
}
```

---

## 5. Daftar Agent

| # | Agent | Peran | File |
|---|-------|-------|------|
| 1 | **Kaprodi** | Ketua Program Studi — perencanaan strategis, kurikulum OBE, pengawasan mutu, evaluasi kinerja, keuangan prodi, akreditasi | `agents/kaprodi.md` |
| 2 | **Koordinator Program** | Operasional harian, jadwal akademik, komunikasi tim, monitoring kegiatan | `agents/koordinator-program.md` |
| 3 | **Supervisor** | Pengawasan tugas operasional harian staf, kontrol kualitas, laporan harian | `agents/supervisor.md` |
| 4 | **Dosen Pengampu** | Tridharma PT (Pendidikan, Penelitian, Pengabdian), RPS OBE, SCL, evaluasi CPMK | `agents/dosen-pengampu.md` |
| 5 | **Dosen PA** | Dosen Pembimbing Akademik — bimbingan akademik, monitoring KRS/IPK, peringatan dini | `agents/dosen-pa.md` |
| 6 | **Tim Kurikulum** | Penyusunan dan pengembangan kurikulum OBE, pemetaan CPL-CPMK, tracer study | `agents/tim-kurikulum.md` |
| 7 | **Staf Administrasi** | Surat-menyurat, verifikasi dokumen, laporan keuangan, arsip, dukungan akreditasi | `agents/staf-administrasi.md` |
| 8 | **Teknisi & Laboran** | Pengelolaan lab, dukungan praktikum, inventaris alat/bahan, K3 | `agents/teknisi-laboran.md` |
| 9 | **Gugus Mutu** | SPMI, Audit Mutu Internal (AMI), akreditasi, siklus PPEPP | `agents/gugus-mutu.md` |
| 10 | **Himaprodi** | Himpunan Mahasiswa Prodi — organisasi, kegiatan, aspirasi mahasiswa | `agents/himaprodi.md` |

### Tools per Agent

| Agent | Tools yang Digunakan |
|-------|---------------------|
| Kaprodi | `read`, `write`, `edit`, `bash`, `grep`, `find`, `ls` |
| Koordinator Program | `read`, `write`, `edit`, `bash`, `grep`, `find`, `ls` |
| Supervisor | `read`, `write`, `edit`, `grep`, `find`, `ls` |
| Dosen Pengampu | `read`, `write`, `edit`, `grep`, `find`, `ls`, `bash` |
| Dosen PA | `read`, `write`, `edit`, `grep`, `find`, `ls` |
| Tim Kurikulum | `read`, `write`, `edit`, `grep`, `find`, `ls` |
| Staf Administrasi | `read`, `write`, `edit`, `grep`, `find`, `ls` |
| Teknisi & Laboran | `read`, `bash`, `grep`, `find`, `ls` |
| Gugus Mutu | `read`, `write`, `edit`, `grep`, `find`, `ls` |
| Himaprodi | `read`, `write`, `edit`, `grep`, `find`, `ls` |

---

## 6. Daftar Team

| Team | Deskripsi | Anggota | Workflow Default |
|------|-----------|---------|------------------|
| **pimpinan** | Tim Kepemimpinan — pengambil keputusan strategis | kaprodi, koordinator-program, supervisor, gugus-mutu | `rapat-tinjauan-manajemen` |
| **akademik** | Tim Akademik & Pembinaan — tridharma, kurikulum | kaprodi, tim-kurikulum, dosen-pengampu, dosen-pa | `perencanaan-kurikulum` |
| **administrasi** | Tim Administrasi & Pendukung — operasional | staf-administrasi, teknisi-laboran, supervisor | `default` |
| **mutu** | Tim Jaminan Mutu — SPMI, AMI, akreditasi | gugus-mutu, kaprodi, dosen-pengampu, staf-administrasi | `audit-mutu-internal` |
| **kemahasiswaan** | Tim Kemahasiswaan — pembinaan mahasiswa | himaprodi, dosen-pa, kaprodi | `default` |

---

## 7. Daftar Workflow

| Workflow | Deskripsi | Steps |
|----------|-----------|-------|
| **perencanaan-kurikulum** | Siklus perencanaan dan pengembangan kurikulum OBE | analisis-kebutuhan → perumusan-cpl → pemetaan-mk → penyusunan-rps → review-kurikulum → finalisasi |
| **pelaksanaan-pembelajaran** | Siklus pembelajaran per semester berbasis OBE | persiapan-perkuliahan → pembukaan-kelas → pelaksanaan → assessment-tengah → assessment-akhir → input-nilai → evaluasi-pembelajaran |
| **evaluasi-cpmk-plo** | Evaluasi capaian CPMK dan agregasi ke CPL/PLO | kumpulkan-data → analisis-cpmk → agregasi-cpl → rekomendasi-perbaikan → laporan |
| **audit-mutu-internal** | AMI berbasis SPMI dengan siklus PPEPP | persiapan-ami → pelaksanaan-ami → temuan-audit → laporan-ami → tindak-lanjut → verifikasi |
| **rapat-tinjauan-manajemen** | RTM evaluasi berkala sistem mutu prodi | persiapan-rtm → rapat → keputusan → notulen |

### Detail Workflow

#### 7.1 Perencanaan Kurikulum

```json
{
  "action": "run",
  "team": "akademik",
  "workflow": "perencanaan-kurikulum",
  "goal": "Susun kurikulum OBE untuk prodi Sistem Informasi. Libatkan Tim Kurikulum dan Dosen Pengampu."
}
```

**Langkah:**
1. **analisis-kebutuhan** — tracer study, kuesioner stakeholders, masukan asosiasi profesi
2. **perumusan-cpl** — rumuskan CPL berdasarkan profil lulusan dan SN-Dikti
3. **pemetaan-mk** — petakan CPL ke mata kuliah, tentukan CPMK
4. **penyusunan-rps** — setiap dosen pengampu menyusun RPS OBE
5. **review-kurikulum** — Kaprodi review keselarasan CPL→CPMK→Sub-CPMK
6. **finalisasi** — finalisasi dokumen kurikulum dan buku kurikulum

#### 7.2 Pelaksanaan Pembelajaran

```json
{
  "action": "run",
  "team": "akademik",
  "workflow": "pelaksanaan-pembelajaran",
  "goal": "Jalankan siklus pembelajaran semester genap 2025/2026"
}
```

**Langkah:**
1. **persiapan-perkuliahan** — verifikasi RPS, jadwal, ruang, lab
2. **pembukaan-kelas** — sosialisasi RPS ke mahasiswa
3. **pelaksanaan** — perkuliahan dengan metode SCL
4. **assessment-tengah** — UTS, analisis pencapaian CPMK sementara
5. **assessment-akhir** — UAS, pengumpulan nilai
6. **input-nilai** — input nilai akhir dan analisis CPMK
7. **evaluasi-pembelajaran** — laporan pencapaian CPMK per mata kuliah

#### 7.3 Evaluasi CPMK/PLO

```json
{
  "action": "run",
  "team": "akademik",
  "workflow": "evaluasi-cpmk-plo",
  "goal": "Evaluasi capaian CPMK dan agregasi ke CPL untuk semester ganjil 2025/2026"
}
```

**Langkah:**
1. **kumpulkan-data** — kumpulkan nilai akhir semua mata kuliah
2. **analisis-cpmk** — gunakan `@evaluasi_cpmk` untuk setiap mata kuliah
3. **agregasi-cpl** — agregasi pencapaian CPMK ke tingkat CPL
4. **rekomendasi-perbaikan** — identifikasi CPMK bermasalah (di bawah 60%)
5. **laporan** — susun laporan evaluasi untuk RTM

#### 7.4 Audit Mutu Internal

```json
{
  "action": "run",
  "team": "mutu",
  "workflow": "audit-mutu-internal",
  "goal": "Laksanakan AMI untuk standar pembelajaran dan standar penilaian"
}
```

**Langkah:**
1. **persiapan-ami** — susun instrumen audit, jadwal, tim auditor
2. **pelaksanaan-ami** — audit dokumen dan lapangan
3. **temuan-audit** — kategorikan temuan (mayor/minor/observasi)
4. **laporan-ami** — susun laporan hasil audit
5. **tindak-lanjut** — tindakan korektif atas temuan
6. **verifikasi** — verifikasi efektivitas tindak lanjut

#### 7.5 Rapat Tinjauan Manajemen

```json
{
  "action": "run",
  "team": "pimpinan",
  "workflow": "rapat-tinjauan-manajemen",
  "goal": "Laksanakan RTM semester genap 2025/2026"
}
```

**Langkah:**
1. **persiapan-rtm** — kumpulkan data: laporan AMI, capaian CPMK/CPL, kinerja dosen, keuangan
2. **rapat** — bahas capaian, masalah, dan rencana perbaikan
3. **keputusan** — tetapkan keputusan dan tindak lanjut
4. **notulen** — dokumentasikan dan distribusikan

---

## 8. Skills

Skills diaktifkan otomatis sesuai konteks agent saat menjalankan tugas:

| Skill | Deskripsi | File |
|-------|-----------|------|
| **obe-kurikulum** | Prinsip OBE, constructive alignment, CPL-CPMK mapping | `skills/obe-kurikulum/SKILL.md` |
| **evaluasi-cpmk** | Analisis pencapaian CPMK, agregasi CPL, rekomendasi perbaikan | `skills/evaluasi-cpmk/SKILL.md` |
| **spmi** | Siklus PPEPP, standar mutu, audit mutu internal | `skills/spmi/SKILL.md` |

---

## 9. Contoh Skenario Lengkap

### Skenario 1: Perencanaan Kurikulum Baru

**Situasi:** Prodi akan merevisi kurikulum untuk tahun akademik 2026/2027.

**Langkah:**

```json
{
  "action": "run",
  "team": "akademik",
  "workflow": "perencanaan-kurikulum",
  "goal": "Susun kurikulum OBE baru untuk prodi Sistem Informasi tahun 2026/2027. Libatkan Tim Kurikulum, Dosen Pengampu, dan Koordinator Program."
}
```

**Atau manual:**
1. `/kaprodi` → "Bentuk Tim Kurikulum untuk revisi kurikulum 2026/2027"
2. `@mapping_cpl_cpmk` → Mapping CPL ke mata kuliah baru
3. Tim Kurikulum menyusun draft CPL dan CPMK
4. Dosen Pengampu menyusun RPS baru
5. Kaprodi review dan finalisasi

### Skenario 2: Evaluasi Tengah Semester

**Situasi:** Kaprodi ingin mengecek pencapaian CPMK setelah UTS.

**Langkah:**

```
@evaluasi_cpmk Evaluasi CPMK untuk "Basis Data" semester "Ganjil 2025/2026" dalam format detail
@evaluasi_cpmk Evaluasi CPMK untuk "Pemrograman Web" semester "Ganjil 2025/2026" dalam format ringkasan
```

```json
{
  "action": "run",
  "team": "akademik",
  "goal": "Kumpulkan hasil evaluasi CPMK semua mata kuliah dan identifikasi CPMK dengan pencapaian di bawah 60%"
}
```

### Skenario 3: Audit Mutu Internal

**Situasi:** Prodi akan menjalani akreditasi dan perlu AMI terlebih dahulu.

```json
{
  "action": "run",
  "team": "mutu",
  "workflow": "audit-mutu-internal",
  "goal": "Laksanakan AMI untuk standar pembelajaran, standar penilaian, dan standar pengelolaan"
}
```

**Atau manual:**
1. `/kaprodi` → "Instruksikan Gugus Mutu untuk menyiapkan AMI"
2. Gugus Mutu menyusun instrumen audit
3. Audit dilaksanakan ke seluruh standar SPMI
4. Laporan AMI disusun dan disampaikan ke Kaprodi
5. Tindak lanjut ditetapkan dalam RTM

### Skenario 4: Rapat Tinjauan Manajemen

**Situasi:** Akhir semester, Kaprodi perlu memimpin RTM.

```json
{
  "action": "run",
  "team": "pimpinan",
  "workflow": "rapat-tinjauan-manajemen",
  "goal": "Laksanakan RTM akhir semester genap 2025/2026. Bahas capaian CPMK, laporan AMI, kinerja dosen, dan rencana perbaikan"
}
```

**Atau manual:**
1. `/kaprodi` → "Persiapkan RTM akhir semester"
2. Gugus Mutu menyiapkan data mutu
3. Koordinator Program menyiapkan agenda
4. Rapat dilaksanakan, keputusan dicatat
5. Notulen didistribusikan

### Skenario 5: Pengelolaan Jadwal Kuliah

**Situasi:** Staf Administrasi perlu menyusun jadwal kuliah semester baru.

```
@jadwal_akademik Tambah jadwal kuliah semester genap 2025/2026
@jadwal_akademik Lihat jadwal hari ini
@jadwal_akademik Ubah jadwal "Basis Data" dari Senin ke Selasa
```

```json
{
  "action": "run",
  "team": "administrasi",
  "goal": "Susun jadwal perkuliahan semester genap 2025/2026, pastikan tidak ada bentrok ruang dan dosen"
}
```

### Skenario 6: Persiapan Akreditasi

**Situasi:** Prodi akan diakreditasi oleh LAM.

```
@generate_laporan_akreditasi Buat template borang LAM tahun 2026
@mapping_cpl_cpmk Mapping CPL ke semua mata kuliah untuk borang akreditasi
```

```json
{
  "action": "run",
  "team": "mutu",
  "goal": "Siapkan dokumen akreditasi LAM. Kumpulkan bukti untuk standar 1-9"
}
```

### Skenario 7: Penanganan Aspirasi Mahasiswa

**Situasi:** Himaprodi menyampaikan aspirasi tentang fasilitas laboratorium.

1. Himaprodi mengirim proposal aspirasi ke Staf Administrasi
2. Staf Administrasi meneruskan ke Kaprodi
3. Kaprodi menginstruksikan Teknisi Laboran untuk cek kondisi lab
4. Teknisi Laboran melaporkan kondisi lab
5. Kaprodi memutuskan tindakan (perbaikan/pengadaan)
6. Keputusan disampaikan ke Himaprodi

```json
{
  "action": "run",
  "team": "kemahasiswaan",
  "goal": "Tindak lanjuti aspirasi mahasiswa tentang fasilitas laboratorium dari Himaprodi"
}
```

### Skenario 8: Bimbingan Akademik Mahasiswa

**Situasi:** Dosen PA perlu memonitor IPK mahasiswa bimbingan.

1. `/kaprodi` → "Instruksikan Dosen PA untuk melakukan bimbingan akademik"
2. Dosen PA membaca data akademik mahasiswa bimbingan
3. Dosen PA mengidentifikasi mahasiswa dengan IPK < 2.00
4. Dosen PA memberikan peringatan dini dan rekomendasi
5. Dosen PA melaporkan hasil bimbingan ke Kaprodi

```json
{
  "action": "run",
  "team": "akademik",
  "goal": "Lakukan monitoring akademik mahasiswa: identifikasi IPK bermasalah dan berikan peringatan dini"
}
```

---

## 10. Siklus PPEPP & Alur Data OBE

### Siklus PPEPP (SPMI)

Sistem Penjaminan Mutu Internal mengikuti 5 langkah:

```
P¹ → P² → E → P³ → P⁴
│      │    │   │    │
▼      ▼    ▼   ▼    ▼
Set   Laks  Eval Kawal Tingkatkan
```

| Tahap | Kegiatan | Agent Terkait |
|-------|----------|---------------|
| **P**enetapan Standar | Menetapkan standar mutu prodi mengacu SN-Dikti | Gugus Mutu, Kaprodi |
| **P**elaksanaan Standar | Memonitor implementasi standar | Semua agent |
| **E**valuasi Standar | Audit Mutu Internal (AMI) | Gugus Mutu, Auditor |
| **P**engendalian Standar | Tindakan korektif atas temuan | Kaprodi, Gugus Mutu |
| **P**eningkatan Standar | Benchmark dan perbaikan berkelanjutan | Tim Kurikulum, Kaprodi |

### Alur Data OBE

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
Analisis Pencapaian CPMK per Mahasiswa ←─ Tool @evaluasi_cpmk
    │
    ▼
Agregasi ke CPL
    │
    ▼
Evaluasi Kurikulum & Perbaikan ←─ Siklus PPEPP SPMI
```

### Prinsip Utama

| Prinsip | Penjelasan |
|---------|------------|
| **Constructive Alignment** | Capaian pembelajaran, metode mengajar, dan assessment harus selaras |
| **SCL** | Student-Centered Learning — pembelajaran berpusat pada mahasiswa |
| **Continuous Improvement** | Perbaikan berkelanjutan berbasis data |
| **Evidence-Based** | Setiap keputusan harus didukung data dan dokumentasi |

---

## Referensi

- **SN-Dikti**: Standar Nasional Pendidikan Tinggi
- **SPMI**: Sistem Penjaminan Mutu Internal
- **PPEPP**: Penetapan-Pelaksanaan-Evaluasi-Pengendalian-Peningkatan
- **CPL/PLO**: Capaian Pembelajaran Lulusan / Program Learning Outcomes
- **CPMK**: Capaian Pembelajaran Mata Kuliah / Course Learning Outcomes
- **AMI**: Audit Mutu Internal
- **RTM**: Rapat Tinjauan Manajemen

---

> **Catatan:** Seluruh komunikasi dan dokumen menggunakan Bahasa Indonesia (konteks pendidikan tinggi Indonesia). Jika ada kendala, laporkan blocker dengan konteks yang jelas.
