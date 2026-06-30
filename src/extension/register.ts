import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export function registerProdiTeams(pi: ExtensionAPI) {
  // CATATAN: Pi core (pi.dev) TIDAK mengenal direktori agents/, teams/, atau
  // workflows/. Manifest Pi hanya mendukung: extensions, skills, prompts, themes.
  // Resource agents/teams/workflows didiscover dan dijalankan oleh paket pihak
  // ketiga `pi-crew` (lihat prasyarat di README), bukan oleh Pi core.
  //
  // Skills sudah dideklarasikan di manifest `pi.skills` pada package.json,
  // sehingga Pi memuatnya otomatis. Tidak perlu mendaftarkannya lagi via
  // resources_discover (berisiko duplikasi).

  // Hook lifecycle untuk inisialisasi data prodi
  pi.on("session_start", async (_event, ctx) => {
    ctx.ui.setWidget("prodi", ["🏫 Sistem Prodi OBE siap"]);
    ctx.ui.setStatus("prodi", "Program Studi | OBE Ready");
  });
}
