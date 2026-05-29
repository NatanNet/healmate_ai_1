import { useState, useEffect } from 'react';
import api from '../services/api';
import MainLayout from '../components/MainLayout';
import PopUp from '../components/PopUp'; // Menggunakan PopUp buatanmu

export default function TimeCapsulePage() {
  const [judul, setJudul] = useState('');
  const [pesan, setPesan] = useState('');
  const [tanggalBuka, setTanggalBuka] = useState('');
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // State untuk mengontrol PopUp isi surat yang sukses dibuka
  const [activeCapsule, setActiveCapsule] = useState(null);
  const [showOpenModal, setShowOpenModal] = useState(false);

  useEffect(() => {
    fetchCapsules();
  }, []);

  // ambil dari database
  const fetchCapsules = async () => {
    try {
      // Endpoint 
      const response = await api.get('/timecapsule/'); 
      
      if (response.data && Array.isArray(response.data.timecapsules)) {
        setCapsules(response.data.timecapsules);
      } else {
        setCapsules([]);
      }
    } catch (err) {
      console.error('Gagal mengambil data dari database:', err);
    }
  };

  const handleCreateCapsule = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!judul.trim() || !pesan.trim() || !tanggalBuka) {
      setError('Harap isi semua baris formulir terlebih dahulu.');
      return;
    }

    const selectedDate = new Date(tanggalBuka);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      setError('Tanggal buka harus di masa depan (minimal esok hari).');
      return;
    }

    setLoading(true);
    try {
      // Payload 
      const payload = {
        title: judul,
        content: pesan,
        openDate: selectedDate.toISOString(), 
        tags: ["personal"] 
      };

      // Endpoint 
      const response = await api.post('/timecapsule/create', payload);
      
      if (response.data.status === "success") {
        setSuccess('Kapsul waktumu berhasil dikunci ke Database! 🔒');
        setJudul('');
        setPesan('');
        setTanggalBuka('');
        fetchCapsules(); // Segarkan layar
      }
    } catch (err) {
      console.error('Gagal menyimpan ke database:', err);
      setError('Gagal mengunci kapsul. Cek koneksi backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCapsule = (capsule) => {
    setActiveCapsule(capsule);
    setShowOpenModal(true);
  };

  // Fungsi pengecekan apakah kapsul sudah siap dibuka atau masih terkunci
  const isReadyToOpen = (dateString) => {
    const openDate = new Date(dateString);
    const today = new Date();
    return today >= openDate;
  };

  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* FORM MEMBUAT KAPSUL WAKTU */}
        <div className="lg:col-span-1 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#E8F6F6] text-[#22B2B0] w-10 h-10 rounded-xl flex items-center justify-center">
              <i className="fas fa-pen-fancy text-lg"></i>
            </div>
            <h3 className="font-bold text-gray-800 text-lg">Tulis Surat Masa Depan</h3>
          </div>
          
          <p className="text-gray-500 text-xs leading-relaxed mb-6">
            Tumpahkan perasaan, kecemasan, atau target hidupmu saat ini. Kapsul ini akan dikunci rapat dan tidak akan bisa dibuka sampai tanggal yang kamu tentukan.
          </p>

          {error && <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs rounded-r-lg">{error}</div>}
          {success && <div className="mb-4 p-3 bg-[#E8F6F6] border-l-4 border-[#22B2B0] text-[#113C3A] text-xs rounded-r-lg">{success}</div>}

          <form onSubmit={handleCreateCapsule} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">Judul Kapsul / Nama Surat</label>
              <input
                type="text"
                placeholder="Misal: Untuk Diriku yang Sudah Sembuh"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22B2B0]/30 bg-[#F9FAFA] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">Isi Pesan Rahasia</label>
              <textarea
                rows="5"
                placeholder="Tuliskan semua keluh kesahmu, harapanmu, atau pesan hangat untuk dirimu di hari esok..."
                value={pesan}
                onChange={(e) => setPesan(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22B2B0]/30 bg-[#F9FAFA] text-sm resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">Tanggal Buka Otomatis</label>
              <input
                type="date"
                value={tanggalBuka}
                onChange={(e) => setTanggalBuka(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22B2B0]/30 bg-[#F9FAFA] text-sm cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#113C3A] hover:bg-[#0A2625] text-white py-3 rounded-xl font-bold text-sm shadow-md transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2"
            >
              {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-lock"></i>}
              Kunci Kapsul Waktu
            </button>
          </form>
        </div>

        {/* DAFTAR KAPSUL WAKTU YANG TERSEDIA */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm min-h-[450px] flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#E8F6F6] text-[#22B2B0] w-10 h-10 rounded-xl flex items-center justify-center">
              <i className="fas fa-vault text-lg"></i>
            </div>
            <h3 className="font-bold text-gray-800 text-lg">Brankas Kapsul Waktumu</h3>
          </div>

          {capsules.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
              <div className="w-16 h-16 bg-[#E8F6F6] text-[#22B2B0] rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-hourglass-start text-2xl"></i>
              </div>
              <p className="text-[#113C3A] font-medium">Belum ada kapsul waktu</p>
              <p className="text-xs text-gray-500 mt-1 max-w-xs">Kamu belum mengunci surat apa pun. Buat satu surat di panel kiri!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto max-h-[500px] pr-1">
              {capsules.map((cap, idx) => {
                const ready = isReadyToOpen(cap.tanggalBuka || cap.openDate);
                const rawDate = cap.tanggalBuka || cap.openDate;
                const formattedDate = rawDate ? new Date(rawDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-';

                return (
                  <div key={idx} className={`border p-5 rounded-2xl flex flex-col justify-between shadow-sm transition-all relative overflow-hidden ${ready ? 'border-[#22B2B0]/30 bg-gradient-to-br from-white to-[#F0FDFD]' : 'border-gray-100 bg-[#F9FAFA]'}`}>
                    
                    {/* Indikator Status Pita Pojok */}
                    <span className={`absolute top-2 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${ready ? 'bg-[#22B2B0] text-white' : 'bg-gray-200 text-gray-500'}`}>
                      {ready ? 'Siap Dibuka' : 'Terkunci'}
                    </span>

                    <div className="mb-4">
                      <h4 className="font-bold text-[#113C3A] text-sm pr-12 truncate">"{cap.judul || cap.title}"</h4>
                      <p className="text-[11px] text-gray-400 mt-1">
                        <i className="fas fa-calendar-alt mr-1"></i> Jadwal Buka: {formattedDate}
                      </p>
                    </div>

                    {ready ? (
                      <button
                        onClick={() => handleOpenCapsule(cap)}
                        className="w-full bg-[#22B2B0] hover:bg-[#1E9E9D] text-white py-2 rounded-xl text-xs font-bold shadow-sm shadow-[#22B2B0]/20 flex items-center justify-center gap-2 transition-colors"
                      >
                        <i className="fas fa-envelope-open-text"></i> Baca Surat Sekarang
                      </button>
                    ) : (
                      <button
                        disabled
                        className="w-full bg-gray-200 text-gray-400 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-not-allowed"
                      >
                        <i className="fas fa-lock"></i> Belum Waktunya
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* POPUP KEJUTAN UNTUK MEMBACA SURAT YANG SUDAH SIAP DIBUKA */}
      <PopUp
        isOpen={showOpenModal}
        title="🎉 Kapsul Waktumu Terbuka!"
        onClose={() => setShowOpenModal(false)}
        confirmText="Selesai Membaca"
        onConfirm={() => setShowOpenModal(false)}
        cancelText="Tutup"
      >
        <div className="space-y-4">
          <div className="bg-[#E8F6F6] p-4 rounded-xl text-center">
            <h4 className="font-bold text-[#113C3A]">Halo, Dirimu yang di Masa Depan! ❤️</h4>
            <p className="text-xs text-gray-500 mt-1">
              Surat ini dikunci pada tanggal:{' '}
              {activeCapsule?.createdAt ? new Date(activeCapsule.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Masa Lalu'}
            </p>
          </div>
          
          <div className="border border-dashed border-[#22B2B0] p-4 rounded-xl bg-amber-50/40 text-sm italic text-gray-700 max-h-[200px] overflow-y-auto whitespace-pre-line leading-relaxed">
            "{activeCapsule?.pesan || activeCapsule?.content || activeCapsule?.isi}"
          </div>

          <div className="text-xs text-[#22B2B0] font-semibold text-center mt-2 animate-pulse">
            ✨ Hebat! Kamu berhasil melewati hari-hari berat itu dan bertahan sampai hari ini! ✨
          </div>
        </div>
      </PopUp>
    </MainLayout>
  );
}