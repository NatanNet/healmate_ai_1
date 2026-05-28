import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      id: 1,
      icon: 'fas fa-comments',
      title: 'AI Chatbot',
      description: 'Teman Curhat Virtualmu. Dapat memberikan respon yang menyenangkan.'
    },
    {
      id: 2,
      icon: 'fas fa-chart-line',
      title: 'Grafik Mood',
      description: 'Lihat emosimu setalah curhat, dan pantau di dalam Dashboard.'
    },
    {
      id: 3,
      icon: 'fas fa-hourglass-half',
      title: 'Time Capsule',
      description: 'Tulis pesan untuk dirimu di masa depan saat kamu sudah sepenuhnya pulih dan bangkit.'
    },
    {
      id: 4,
      icon: 'fas fa-bullseye',
      title: 'Set Goals',
      description: 'Susun langkah kecil untuk kembali produktif.'
    }
  ];

  const stats = [
    { icon: 'fas fa-shield-alt', text: '100% Anonim & Privat' },
    { icon: 'fas fa-brain', text: 'Berbasis NLP & AI Support' },
    { icon: 'fas fa-hand-holding-heart', text: 'Mengurangi Risiko Depresi' },
    { icon: 'fas fa-clock', text: 'Pendampingan 24/7' }
  ];

  return (
    <div className="min-h-screen bg-white font-['Poppins']">
      {/* Header */}
      <header className="bg-[#0E3B3A] text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-6 py-4 md:py-5 flex justify-between items-center">
          <a href="#" className="text-xl md:text-2xl font-bold flex items-center gap-2 group flex-shrink-0">
            <i className="fas fa-heart-pulse text-[#22D1D1] group-hover:scale-110 transition-transform"></i>
            <span className="group-hover:text-[#22D1D1] transition-colors hidden sm:inline">HealMate AI</span>
            <span className="group-hover:text-[#22D1D1] transition-colors sm:hidden text-base">HealMate</span>
          </a>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-6 lg:gap-8 items-center">
            <a href="#features" className="hover:text-[#22D1D1] transition-colors text-sm font-medium">Fitur</a>
            <a href="#stats" className="hover:text-[#22D1D1] transition-colors text-sm font-medium">Keunggulan</a>
            <button
              onClick={() => navigate('/login')}
              className="ml-4 px-6 py-2 bg-gradient-to-r from-[#22D1D1] to-[#20A4A0] text-[#0E3B3A] rounded-full font-bold text-sm hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Login
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-xl text-[#22D1D1] hover:scale-110 transition-transform"
          >
            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#072524] px-4 py-4 space-y-3 border-t border-[#22D1D1]/20">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-4 hover:bg-[#20A4A0]/20 rounded-lg text-sm font-medium transition-colors"
            >
              Fitur
            </a>
            <a
              href="#stats"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-4 hover:bg-[#20A4A0]/20 rounded-lg text-sm font-medium transition-colors"
            >
              Keunggulan
            </a>
            <button
              onClick={() => {
                navigate('/login');
                setMobileMenuOpen(false);
              }}
              className="w-full px-4 py-2 bg-gradient-to-r from-[#22D1D1] to-[#20A4A0] text-[#0E3B3A] rounded-full font-bold text-sm hover:shadow-lg transition-all duration-300"
            >
              Login
            </button>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#20A4A0] via-[#1a8983] to-[#147A77] text-white py-16 md:py-32 px-4 md:px-6 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#22D1D1]/5 rounded-full blur-3xl -z-0"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -z-0"></div>

          <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center relative z-10">
            {/* Content */}
            <div className="animate-fade-in order-2 lg:order-1 space-y-6 md:space-y-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Pulih Lebih Cepat,
                <br />
                <span className="text-[#FFEAA7] drop-shadow-lg">Tumbuh Lebih Kuat</span>
                <br />
                <span className="text-[#22D1D1]">bersama HealMate!</span>
              </h1>
              <p className="text-base sm:text-lg text-white/95 leading-relaxed max-w-lg font-light">
                Pendamping pemulihan emosional yang dirancang khusus membantumu menghadapi putus cinta, overthinking, dan ketidakpastian. Privat, personal, dan selalu menemanimu.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-8 py-3.5 bg-white text-[#0E3B3A] font-bold rounded-full hover:bg-white hover:shadow-2xl shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-base"
                >
                  <i className="fas fa-robot"></i> Curhat Sekarang
                </button>
                <button
                  onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-3.5 border-2 border-white text-white font-semibold rounded-full hover:bg-white/20 backdrop-blur transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-base"
                >
                  <i className="fas fa-play"></i> Pelajari Lebih
                </button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="flex justify-center order-1 lg:order-2">
              <div className="relative group w-full max-w-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-[#22D1D1] via-[#20A4A0] to-[#0E3B3A] rounded-3xl blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                <img
                  src="https://cdni.iconscout.com/illustration/premium/thumb/friendly-robot-helping-man-and-woman-4409384-3669147.png"
                  alt="HealMate AI Robot"
                  className="relative w-full rounded-3xl shadow-2xl transform group-hover:scale-110 transition-transform duration-500 object-cover border-2 border-white/20"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="h-1 bg-gradient-to-r from-transparent via-[#20A4A0]/30 to-transparent"></div>

        {/* Features Section Title */}
        <section className="bg-gradient-to-b from-white to-[#F8FAFB] py-16 md:py-20 px-4 md:px-6">
          <div className="container mx-auto text-center max-w-3xl space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0E3B3A]">
              Fitur-Fitur Unggulan
            </h2>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              Dilengkapi dengan teknologi AI untuk mendampingmu dalam perjalanan pemulihan emosional
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-gradient-to-b from-[#F8FAFB] to-white py-16 md:py-24 px-4 md:px-6">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  onMouseEnter={() => setHoveredFeature(feature.id)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  onClick={() => setHoveredFeature(hoveredFeature === feature.id ? null : feature.id)}
                  className={`bg-white text-[#0E3B3A] p-6 md:p-8 rounded-2xl border-2 border-gray-100 text-center transition-all duration-500 cursor-pointer transform hover:border-[#20A4A0] ${
                    hoveredFeature === feature.id
                      ? 'scale-105 shadow-xl border-[#20A4A0] bg-gradient-to-br from-white to-[#F0F8F8]'
                      : 'hover:shadow-lg'
                  }`}
                >
                  <div className={`w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-2xl transition-all duration-500 ${
                    hoveredFeature === feature.id
                      ? 'bg-gradient-to-br from-[#20A4A0] to-[#22D1D1] text-white'
                      : 'bg-[#F0F8F8] text-[#20A4A0]'
                  }`}>
                    <i className={`${feature.icon} text-2xl`}></i>
                  </div>
                  <h4 className="text-lg font-bold mb-3">{feature.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="h-1 bg-gradient-to-r from-transparent via-[#20A4A0]/30 to-transparent"></div>

        {/* Stats Section */}
        <section id="stats" className="bg-[#0E3B3A] text-white py-16 md:py-24 px-4 md:px-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-20 w-72 h-72 bg-[#22D1D1] rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-64 h-64 bg-[#20A4A0] rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="text-center group hover:scale-110 transition-transform duration-300 transform"
                >
                  <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-[#22D1D1] to-[#20A4A0] rounded-2xl text-lg md:text-xl group-hover:shadow-lg group-hover:shadow-[#22D1D1]/50 transition-shadow">
                    <i className={stat.icon}></i>
                  </div>
                  <p className="text-xs sm:text-sm md:text-base font-semibold text-white/90 leading-tight">
                    {stat.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="h-1 bg-gradient-to-r from-transparent via-[#20A4A0]/30 to-transparent"></div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-[#0E3B3A] to-[#051B1A] text-white px-4 md:px-6 py-16 md:py-20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">
            {/* Brand */}
            <div className="space-y-4">
              <a href="#" className="text-xl md:text-2xl font-bold flex items-center gap-2 group hover:text-[#22D1D1] transition-colors w-fit">
                <i className="fas fa-heart-pulse text-[#22D1D1]"></i>
                <span>HealMate</span>
              </a>
              <p className="text-white/70 text-sm leading-relaxed">
                Aplikasi pendampingan pemulihan emosional berteknologi AI yang tersedia 24/7 untuk kamu.
              </p>
            </div>

            {/* Fitur */}
            <div className="space-y-4">
              <h6 className="text-base font-bold text-white">Fitur</h6>
              <ul className="space-y-3">
                <li><a href="#" className="text-white/70 hover:text-[#22D1D1] transition-colors text-sm">Dashboard</a></li>
                <li><a href="#" className="text-white/70 hover:text-[#22D1D1] transition-colors text-sm">AI Chatbot</a></li>
                <li><a href="#" className="text-white/70 hover:text-[#22D1D1] transition-colors text-sm">Time Capsule</a></li>
                <li><a href="#" className="text-white/70 hover:text-[#22D1D1] transition-colors text-sm">Mood Tracker</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h6 className="text-base font-bold text-white">Legal</h6>
              <ul className="space-y-3">
                <li><a href="#" className="text-white/70 hover:text-[#22D1D1] transition-colors text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-white/70 hover:text-[#22D1D1] transition-colors text-sm">Terms of Service</a></li>
                <li><a href="#" className="text-white/70 hover:text-[#22D1D1] transition-colors text-sm">Contact Us</a></li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8"></div>

          {/* Bottom */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-white/60 text-xs md:text-sm">
            <p>&copy; 2026 HealMate AI. All rights reserved.</p>
            <p>Dibuat untuk kesehatan mentalmu</p>
          </div>
        </div>
      </footer>

      {/* CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
