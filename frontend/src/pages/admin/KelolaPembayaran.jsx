import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle, Clock, MessageCircle, RefreshCw, Search, Wallet, XCircle } from "lucide-react";
import pembayaranService from "../../services/pembayaranService";

const BULAN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const rupiah = (nilai) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(nilai);

const STATUS = {
  LUNAS: { label: "Lunas", className: "bg-green-100 text-green-800", icon: CheckCircle },
  MENUNGGU_VERIFIKASI: { label: "Menunggu verifikasi", className: "bg-yellow-100 text-yellow-800", icon: Clock },
  BELUM_BAYAR: { label: "Belum bayar", className: "bg-red-100 text-red-800", icon: XCircle },
  DITOLAK: { label: "Ditolak", className: "bg-orange-100 text-orange-800", icon: AlertCircle },
};

export default function KelolaPembayaran() {
  const [pembayaran, setPembayaran] = useState([]);
  const [pencarian, setPencarian] = useState("");
  const [status, setStatus] = useState("SEMUA");
  const [memuat, setMemuat] = useState(true);
  const [memprosesId, setMemprosesId] = useState(null);
  const [pesan, setPesan] = useState(null);

  const muatData = async () => {
    setMemuat(true);
    try {
      const response = await pembayaranService.getAll();
      setPembayaran(response.data.data || []);
    } catch (err) {
      setPesan({ type: "error", text: err.response?.data?.message || "Data pembayaran gagal dimuat." });
    } finally {
      setMemuat(false);
    }
  };

  useEffect(() => { muatData(); }, []);

  const dataTampil = useMemo(() => pembayaran.filter((item) => {
    const kataKunci = pencarian.toLowerCase();
    const cocokCari = [item.siswa?.nama, item.siswa?.nis, item.siswa?.kelas?.nama]
      .some((nilai) => nilai?.toLowerCase().includes(kataKunci));
    return cocokCari && (status === "SEMUA" || item.status === status);
  }), [pembayaran, pencarian, status]);

  const statistik = [
    ["Total tagihan", pembayaran.length, Wallet, "bg-blue-50 text-blue-600"],
    ["Lunas", pembayaran.filter((p) => p.status === "LUNAS").length, CheckCircle, "bg-green-50 text-green-600"],
    ["Menunggu", pembayaran.filter((p) => p.status === "MENUNGGU_VERIFIKASI").length, Clock, "bg-yellow-50 text-yellow-600"],
    ["Belum bayar", pembayaran.filter((p) => p.status === "BELUM_BAYAR").length, XCircle, "bg-red-50 text-red-600"],
  ];

  const kirimPengingat = async (id) => {
    setMemprosesId(id);
    setPesan(null);
    try {
      const response = await pembayaranService.buatPengingatWhatsApp(id);
      const { whatsappUrl, namaOrangTua } = response.data.data;
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      setPesan({ type: "success", text: `Pesan untuk ${namaOrangTua} telah dibuka di WhatsApp. Tinjau lalu kirimkan.` });
    } catch (err) {
      setPesan({ type: "error", text: err.response?.data?.message || "Pengingat WhatsApp gagal dibuat." });
    } finally {
      setMemprosesId(null);
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-gray-800"><Wallet className="w-7 h-7 text-blue-600" /> Pembayaran SPP</h1>
          <p className="mt-1 text-sm text-gray-600">Kelola tagihan dan kirim pengingat WhatsApp kepada orang tua.</p>
        </div>
        <button onClick={muatData} disabled={memuat} className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60">
          <RefreshCw className={`w-4 h-4 ${memuat ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {pesan && <div className={`mb-5 rounded-lg px-4 py-3 text-sm ${pesan.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>{pesan.text}</div>}

      <div className="grid grid-cols-2 gap-4 mb-6 lg:grid-cols-4">
        {statistik.map(([label, nilai, Icon, warna]) => <div key={label} className="p-4 bg-white rounded-xl shadow-sm"><div className="flex items-center gap-3"><div className={`flex items-center justify-center w-10 h-10 rounded-lg ${warna}`}><Icon className="w-5 h-5" /></div><div><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold text-gray-800">{nilai}</p></div></div></div>)}
      </div>

      <div className="flex flex-wrap gap-3 p-4 mb-6 bg-white rounded-xl shadow-sm">
        <div className="relative flex-1 min-w-56"><Search className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" /><input value={pencarian} onChange={(e) => setPencarian(e.target.value)} placeholder="Cari nama, NIS, atau kelas..." className="w-full py-2 pl-9 pr-3 text-sm border border-gray-300 rounded-lg" /></div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg"><option value="SEMUA">Semua status</option>{Object.entries(STATUS).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select>
      </div>

      <div className="overflow-hidden bg-white rounded-xl shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-210"><thead className="text-xs text-left text-gray-500 uppercase bg-gray-50"><tr><th className="px-4 py-3">Siswa</th><th className="px-4 py-3">Periode</th><th className="px-4 py-3">Nominal</th><th className="px-4 py-3">Orang tua</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Aksi</th></tr></thead><tbody className="divide-y divide-gray-200">
        {memuat ? <tr><td colSpan="6" className="px-4 py-10 text-sm text-center text-gray-500">Memuat data pembayaran...</td></tr> : dataTampil.length === 0 ? <tr><td colSpan="6" className="px-4 py-10 text-sm text-center text-gray-500">Tidak ada data pembayaran.</td></tr> : dataTampil.map((item) => {
          const infoStatus = STATUS[item.status] || STATUS.BELUM_BAYAR; const Icon = infoStatus.icon; const dapatDiingatkan = item.status !== "LUNAS";
          return <tr key={item.id} className="text-sm hover:bg-gray-50"><td className="px-4 py-3"><p className="font-medium text-gray-800">{item.siswa?.nama}</p><p className="text-xs text-gray-500">NIS: {item.siswa?.nis} · {item.siswa?.kelas?.nama || "Belum ada kelas"}</p></td><td className="px-4 py-3 text-gray-600">{BULAN[item.bulan - 1]} {item.tahun}</td><td className="px-4 py-3 font-medium text-gray-800">{rupiah(item.jumlah)}</td><td className="px-4 py-3"><p className="text-gray-800">{item.siswa?.orangTua?.nama || "Belum terhubung"}</p><p className="text-xs text-gray-500">{item.siswa?.orangTua?.noTelepon || "Nomor belum tersedia"}</p></td><td className="px-4 py-3"><span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${infoStatus.className}`}><Icon className="w-3 h-3" />{infoStatus.label}</span></td><td className="px-4 py-3 text-right"><button onClick={() => kirimPengingat(item.id)} disabled={!dapatDiingatkan || memprosesId === item.id} title={dapatDiingatkan ? "Kirim pengingat WhatsApp" : "Tagihan sudah lunas"} className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-green-700 bg-green-100 rounded-lg hover:bg-green-200 disabled:cursor-not-allowed disabled:opacity-50"><MessageCircle className="w-4 h-4" />{memprosesId === item.id ? "Membuka..." : "Ingatkan WA"}</button></td></tr>;
        })}
      </tbody></table></div></div>
    </div>
  );
}
