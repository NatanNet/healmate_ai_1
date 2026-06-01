import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ilustrationHero from '../assets/LogoHealmateAI.png';

export default function LandingPage() {
  const navigate = useNavigate();
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      id: 1,
      icon: 'fas fa-comments',
      title: 'Teman Curhat AI',
      description: 'Pendengar setia yang memahamimu. Dapatkan respon empatik kapan pun kamu butuhkan.'
    },
    {
      id: 2,
      icon: 'fas fa-chart-line',
      title: 'Grafik Emosi',
      description: 'Pantau perubahan suasana hatimu setiap hari secara visual di dalam Dasbor.'
    },
    {
      id: 3,
      icon: 'fas fa-hourglass-half',
      title: 'Kapsul Waktu',
      description: 'Tulis pesan untuk dirimu di masa depan, simpan, dan baca saat kamu sudah sepenuhnya bangkit.'
    },
    {
      id: 4,
      icon: 'fas fa-bullseye',
      title: 'Target Pemulihan',
      description: 'Susun langkah-langkah kecil untuk kembali bangkit dan produktif secara bertahap.'
    }
  ];

  const stats = [
    { icon: 'fas fa-shield-alt', text: '100% Anonim & Privat' },
    { icon: 'fas fa-brain', text: 'Berbasis Kecerdasan Buatan' },
    { icon: 'fas fa-hand-holding-heart', text: 'Mengurangi Risiko Stres' },
    { icon: 'fas fa-clock', text: 'Pendampingan 24 Jam' }
  ];

  return (
    <div className="min-h-screen bg-white font-['Poppins'] scroll-smooth">
      {/* Header Utama */}
      <header className="bg-white text-[#113C3A] shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-8 py-4 md:py-5 flex justify-between items-center">
          <Link to="/" className="text-xl md:text-2xl font-bold flex items-center gap-2 group flex-shrink-0">
            <i className="fas fa-heart-pulse text-[#22B2B0] group-hover:scale-110 transition-transform"></i>
            <span className="group-hover:text-[#22B2B0] transition-colors hidden sm:inline">HealMate AI</span>
            <span className="group-hover:text-[#22B2B0] transition-colors sm:hidden text-base">HealMate</span>
          </Link>
          
          {/* Navigasi Desktop */}
          <nav className="hidden md:flex gap-6 lg:gap-8 items-center">
            <a href="#fitur" className="text-gray-600 hover:text-[#22B2B0] transition-colors text-sm font-medium">Fitur</a>
            <a href="#keunggulan" className="text-gray-600 hover:text-[#22B2B0] transition-colors text-sm font-medium">Keunggulan</a>
            <button
              onClick={() => navigate('/login')}
              className="ml-4 px-6 py-2.5 bg-[#22B2B0] hover:bg-[#1E9E9D] text-white rounded-full font-bold text-sm shadow-md shadow-[#22B2B0]/20 transition-all duration-300"
            >
              Masuk
            </button>
          </nav>

          {/* Tombol Menu HP */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-xl text-[#22B2B0] hover:scale-110 transition-transform focus:outline-none"
          >
            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>

        {/* Menu Tampil di HP */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white px-4 py-4 space-y-3 border-t border-gray-100 absolute w-full left-0 shadow-xl z-50">
            <a
              href="#fitur"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-4 text-gray-700 hover:bg-[#E8F6F6] hover:text-[#22B2B0] rounded-lg text-sm font-medium transition-colors"
            >
              Fitur
            </a>
            <a
              href="#keunggulan"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-4 text-gray-700 hover:bg-[#E8F6F6] hover:text-[#22B2B0] rounded-lg text-sm font-medium transition-colors"
            >
              Keunggulan
            </a>
            <button
              onClick={() => {
                navigate('/login');
                setMobileMenuOpen(false);
              }}
              className="w-full px-4 py-3 bg-[#22B2B0] text-white rounded-xl font-bold text-sm shadow-md mt-2"
            >
              Masuk ke Akun
            </button>
          </div>
        )}
      </header>

      <main>
        {/* Bagian Hero (Tosca Gelap) */}
        <section className="bg-gradient-to-b from-[#20A4A0] via-[#1a8983] to-[#147A77] text-white py-16 md:py-32 px-4 md:px-8 relative overflow-hidden">
          {/* Hiasan Latar */}
          <div className="absolute top-10 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-[-10%] w-80 h-80 bg-white/5 rounded-full blur-[80px]"></div>

          <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center relative z-10">
            {/* Teks Hero */}
            <div className="order-2 lg:order-1 space-y-6 md:space-y-8 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Pulih Lebih Cepat,
                <br />
                <span className="text-[#FFEAA7] drop-shadow-md">Tumbuh Lebih Kuat</span>
              </h1>
              <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-lg mx-auto lg:mx-0 font-medium">
                Pendamping pemulihan emosional yang siap mendengarkan tanpa menghakimi. Privat, aman, dan dirancang khusus untuk menemanimu melewati masa sulit.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
                {/* Tombol Mulai Sekarang */}
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-3.5 bg-white text-[#147A77] font-bold rounded-full shadow-lg shadow-black/10 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 text-base hover:bg-gray-50"
                >
                  <i className="fas fa-robot"></i> Mulai Sekarang
                </button>
                {/* Tombol Pelajari Lanjut */}
                <a
                  href="#fitur"
                  className="px-8 py-3.5 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 text-base backdrop-blur-sm"
                >
                  <i className="fas fa-arrow-down"></i> Pelajari Lanjut
                </a>
              </div>
            </div>

            {/* Gambar Ilustrasi */}
            <div className="flex justify-center order-1 lg:order-2 relative">
              <div className="relative w-64 w-80">
                <div className="absolute inset-0 bg-[#0E3B3A]/30 rounded-full blur-3xl transform scale-110"></div>       
                <img
                  src={ilustrationHero} 
                  alt="Ilustrasi HealMate AI"
                  className="relative w-full drop-shadow-2xl hover:scale-105 transition-transform duration-500 rounded-3xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Kotak Fitur (Lebih Bersih) */}
        <section id="fitur" className="bg-white py-16 md:py-24 px-4 md:px-8">
          <div className="container mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#113C3A]">Fitur Utama HealMate</h2>
              <p className="text-gray-500">Dilengkapi dengan kecerdasan buatan untuk mendampingimu.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  onMouseEnter={() => setHoveredFeature(feature.id)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  className={`bg-white text-[#113C3A] p-6 md:p-8 rounded-3xl border border-gray-100 text-center transition-all duration-300 cursor-pointer ${
                    hoveredFeature === feature.id ? '-translate-y-2 shadow-xl border-[#22B2B0]/50' : 'hover:shadow-md'
                  }`}
                >
                  <div className={`w-16 h-16 mx-auto mb-5 flex items-center justify-center rounded-2xl transition-all duration-300 ${
                    hoveredFeature === feature.id ? 'bg-[#22B2B0] text-white shadow-lg shadow-[#22B2B0]/40' : 'bg-[#E8F6F6] text-[#22B2B0]'
                  }`}>
                    <i className={`${feature.icon} text-2xl`}></i>
                  </div>
                  <h4 className="text-lg font-bold mb-3">{feature.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bagian Keunggulan (Warna Tosca Cerah) */}
        <section id="keunggulan" className="bg-[#22B2B0] text-white py-16 md:py-20 px-4 md:px-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 right-20 w-72 h-72 bg-white rounded-full blur-[80px]"></div>
          </div>
          
          <div className="container mx-auto relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center group hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 flex items-center justify-center bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl text-xl md:text-2xl text-white group-hover:bg-white group-hover:text-[#22B2B0] transition-colors shadow-sm">
                    <i className={stat.icon}></i>
                  </div>
                  <p className="text-xs sm:text-sm md:text-base font-semibold text-white/95 leading-tight">
                    {stat.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Bagian Kaki (Footer - Gelap untuk kontras penutup) */}
      <footer className="bg-[#113C3A] text-white px-4 md:px-8 py-12 md:py-16">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">
            
            <div className="space-y-4">
              <div className="text-xl md:text-2xl font-bold flex items-center gap-2">
                <i className="fas fa-heart-pulse text-[#22B2B0]"></i>
                <span>HealMate AI</span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                Aplikasi pendampingan pemulihan emosional yang selalu hadir mendengarkan ceritamu, kapan pun kamu siap.
              </p>
            </div>

            <div className="space-y-4">
              <h6 className="text-base font-bold text-white">Navigasi</h6>
              <ul className="space-y-3">
                <li><a href="#fitur" className="text-white/70 hover:text-[#22B2B0] transition-colors text-sm">Fitur Utama</a></li>
                <li><a href="#keunggulan" className="text-white/70 hover:text-[#22B2B0] transition-colors text-sm">Keunggulan</a></li>
                <li><Link to="/login" className="text-white/70 hover:text-[#22B2B0] transition-colors text-sm">Masuk Akun</Link></li>
                <li><Link to="/register" className="text-white/70 hover:text-[#22B2B0] transition-colors text-sm">Daftar Akun</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h6 className="text-base font-bold text-white">Informasi Legal</h6>
              <ul className="space-y-3">
                <li><a href="#" className="text-white/70 hover:text-[#22B2B0] transition-colors text-sm">Kebijakan Privasi</a></li>
                <li><a href="#" className="text-white/70 hover:text-[#22B2B0] transition-colors text-sm">Syarat & Ketentuan</a></li>
              </ul>
            </div>
          </div>

          <div className="h-px bg-white/10 mb-8"></div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-white/60 text-xs md:text-sm">
            <p>&copy; 2026 HealMate AI. Seluruh hak cipta dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}