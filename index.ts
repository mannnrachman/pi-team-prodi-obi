import { StringEnum } from "@earendil-works/pi-ai";
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { registerProdiTeams } from "./src/extension/register.ts";

export default function (pi: ExtensionAPI): void {
  // 1. Daftarkan semua team & agent prodi
  registerProdiTeams(pi);

  // 2. Daftarkan tools khusus OBE
  registerOBETools(pi);

  // 3. Daftarkan command khusus (/kaprodi, /rapat, /evaluasi)
  registerCommands(pi);
}

function registerOBETools(pi: ExtensionAPI) {
  // Tool: evaluasi pencapaian CPMK
  pi.registerTool({
    name: "evaluasi_cpmk",
    label: "Evaluasi CPMK",
    description: "Bantu evaluasi pencapaian CPMK secara dinamis dari data nilai yang tersedia di konteks percakapan atau dokumen pengguna",
    promptSnippet: "Bantu evaluasi CPMK/CPL dan susun rekomendasi perbaikan berbasis data yang diberikan",
    promptGuidelines: [
      "Gunakan evaluasi_cpmk untuk membantu analisis CPMK; jika data nilai belum tersedia, minta data komponen penilaian, bobot, dan target pencapaian terlebih dahulu.",
    ],
    parameters: Type.Object({
      mata_kuliah: Type.String({ description: "Nama atau kode mata kuliah" }),
      semester: Type.String({ description: "Semester/tahun akademik" }),
      format: Type.Optional(StringEnum(["ringkasan", "detail", "visual"] as const)),
    }),
    async execute(_toolCallId, params, _signal, onUpdate, _ctx) {
      onUpdate?.({
        content: [{ type: "text", text: `Menyiapkan evaluasi CPMK untuk ${params.mata_kuliah}...` }],
        details: { status: "preparing" },
      });

      const format = params.format ?? "ringkasan";
      const text = `# Evaluasi CPMK — ${params.mata_kuliah}

Semester: ${params.semester}
Format: ${format}

Tool ini bersifat dinamis: gunakan data nilai yang sudah diberikan pengguna atau dokumen yang sedang dibaca agent. Jika data belum tersedia, minta minimal:

1. Daftar CPMK dan target ketercapaian.
2. Komponen penilaian (tugas, kuis, UTS, UAS, proyek, rubrik).
3. Bobot setiap komponen.
4. Nilai mahasiswa per komponen.

Kerangka analisis:

| CPMK | Target | Capaian | Status | Rekomendasi |
|---|---:|---:|---|---|
| CPMK-1 | ... | ... | ... | ... |

Rekomendasi awal:
- Jika CPMK rendah: cek keselarasan materi, metode SCL, rubrik, dan bentuk assessment.
- Jika data belum lengkap: lengkapi mapping komponen penilaian → CPMK sebelum menyimpulkan.
- Arsipkan hasil untuk evaluasi pembelajaran, RTM, dan bukti SPMI.`;

      return {
        content: [{ type: "text", text }],
        details: {
          mata_kuliah: params.mata_kuliah,
          semester: params.semester,
          format,
          status: "needs_context_data",
        },
      };
    },
  });

  // Tool: generate laporan akreditasi
  pi.registerTool({
    name: "generate_laporan_akreditasi",
    label: "Laporan Akreditasi",
    description: "Buat draft/template dokumen akreditasi atau SPMI yang dapat langsung dilengkapi oleh agent bersama pengguna",
    promptSnippet: "Buat draft laporan akreditasi/SPMI dalam format markdown",
    promptGuidelines: [
      "Gunakan generate_laporan_akreditasi untuk membuat draft awal; lengkapi isinya dari konteks, dokumen, dan arahan pengguna.",
    ],
    parameters: Type.Object({
      jenis: StringEnum(["aps", "lam", "spm"] as const),
      tahun: Type.String({ description: "Tahun dokumen" }),
    }),
    async execute(_toolCallId, params) {
      const title = params.jenis.toUpperCase();
      const text = `# Template ${title} Program Studi Tahun ${params.tahun}

## 1. Identitas Program Studi
- Nama Prodi:
- Fakultas/UPPS:
- Perguruan Tinggi:
- Tahun Akademik:

## 2. Ringkasan Eksekutif
Tuliskan ringkasan kondisi prodi, capaian utama, isu strategis, dan prioritas perbaikan.

## 3. Data dan Bukti Utama
| Area | Data/Bukti | Status | Catatan |
|---|---|---|---|
| Kurikulum OBE | CPL, CPMK, RPS | ☐ | |
| Pembelajaran | RPS, presensi, nilai | ☐ | |
| Evaluasi CPMK/CPL | Laporan evaluasi | ☐ | |
| SPMI/PPEPP | Standar, AMI, RTM | ☐ | |
| SDM | Dosen, BKD, publikasi | ☐ | |
| Mahasiswa/Lulusan | Prestasi, tracer study | ☐ | |

## 4. Analisis Singkat
- Kekuatan:
- Kelemahan:
- Peluang perbaikan:
- Risiko utama:

## 5. Rencana Tindak Lanjut
| No | Tindakan | PIC | Target Waktu | Bukti |
|---:|---|---|---|---|
| 1 | | | | |

## 6. Catatan untuk Agent
Lengkapi template ini dari dokumen prodi yang tersedia. Jika data belum ada, tanyakan ke pengguna atau buat daftar kebutuhan data.`;

      return {
        content: [{ type: "text", text }],
        details: { jenis: params.jenis, tahun: params.tahun, status: "draft_ready" },
      };
    },
  });

  // Tool: mapping CPL-CPMK
  pi.registerTool({
    name: "mapping_cpl_cpmk",
    label: "Mapping CPL-CPMK",
    description: "Bantu menyusun draft mapping CPL ke CPMK secara fleksibel dari daftar CPL dan konteks mata kuliah",
    promptSnippet: "Susun draft matriks CPL-CPMK untuk mata kuliah",
    promptGuidelines: [
      "Gunakan mapping_cpl_cpmk untuk menyusun draft awal; minta daftar CPMK atau RPS jika belum tersedia.",
    ],
    parameters: Type.Object({
      kode_mk: Type.String({ description: "Kode mata kuliah" }),
      daftar_cpl: Type.Array(Type.String({ description: "Kode/deskripsi CPL" })),
    }),
    async execute(_toolCallId, params) {
      const rows = params.daftar_cpl
        .map((cpl) => `| ${cpl} | Perlu dipetakan | CPMK terkait belum diberikan | Validasi dengan RPS |`)
        .join("\n");

      const text = `# Draft Mapping CPL-CPMK — ${params.kode_mk}

| CPL | Status | CPMK Terkait | Catatan |
|---|---|---|---|
${rows || "| - | Belum ada CPL | - | Tambahkan daftar CPL terlebih dahulu |"}

Langkah lanjut:
1. Ambil CPMK dari RPS atau arahan dosen pengampu.
2. Cocokkan setiap CPMK ke CPL yang paling relevan.
3. Tandai bobot/kontribusi jika diperlukan.
4. Validasi constructive alignment: CPL → CPMK → Sub-CPMK → assessment.`;

      return {
        content: [{ type: "text", text }],
        details: { kode_mk: params.kode_mk, jumlah_cpl: params.daftar_cpl.length, status: "draft_mapping" },
      };
    },
  });

  // Tool: jadwal akademik
  pi.registerTool({
    name: "jadwal_akademik",
    label: "Jadwal Akademik",
    description: "Bantu menyusun, meninjau, atau memberi checklist jadwal akademik tanpa menyimpan data permanen",
    promptSnippet: "Bantu rancang atau cek jadwal kuliah, ujian, rapat, dan kegiatan akademik",
    promptGuidelines: [
      "Gunakan jadwal_akademik sebagai asisten penyusunan jadwal; jangan anggap jadwal tersimpan permanen kecuali pengguna memberi dokumen/file jadwal.",
    ],
    parameters: Type.Object({
      aksi: StringEnum(["tambah", "lihat", "ubah", "hapus"] as const),
      tipe: Type.Optional(StringEnum(["kuliah", "ujian", "rapat", "kegiatan"] as const)),
    }),
    async execute(_toolCallId, params) {
      const tipe = params.tipe ?? "akademik";
      const text = `# Bantuan Jadwal ${tipe}

Aksi diminta: ${params.aksi}

Tool ini tidak menyimpan data permanen. Gunakan sebagai panduan kerja dinamis bersama agent.

Data yang perlu tersedia untuk jadwal:
- Nama kegiatan / mata kuliah
- Hari/tanggal
- Jam mulai dan selesai
- Ruang/lokasi
- Dosen/PIC
- Kelas/peserta
- Catatan khusus

Checklist konflik:
- ☐ Dosen/PIC tidak bentrok
- ☐ Ruang/lokasi tidak bentrok
- ☐ Kelas/peserta tidak bentrok
- ☐ Waktu realistis dan sesuai kalender akademik
- ☐ Sudah siap dikonfirmasi ke pihak terkait

Jika pengguna memberi tabel/file jadwal, agent dapat membaca dan mengecek konflik berdasarkan data tersebut.`;

      return {
        content: [{ type: "text", text }],
        details: { aksi: params.aksi, tipe, status: "guidance_only" },
      };
    },
  });
}

function registerCommands(pi: ExtensionAPI) {
  // Command: /kaprodi — akses langsung ke agent Kaprodi
  pi.registerCommand("kaprodi", {
    description: "Aktifkan agent Ketua Program Studi",
    handler: async (_args, ctx) => {
      ctx.ui.notify("🧑‍🏫 Agent Kaprodi aktif. Silakan berikan perintah.", "info");
    },
  });

  // Command: /rapat — quick akses rapat
  pi.registerCommand("rapat", {
    description: "Buat agenda/jadwal rapat prodi",
    handler: async (args, ctx) => {
      ctx.ui.notify(`📋 Agenda rapat: ${args || "rapat koordinasi"}`, "info");
    },
  });

  // Command: /laporan — generate laporan prodi
  pi.registerCommand("laporan", {
    description: "Generate laporan prodi (mutu, akademik, keuangan)",
    handler: async (args, ctx) => {
      ctx.ui.notify(`📊 Membuat laporan: ${args || "laporan prodi"}`, "info");
    },
  });
}
