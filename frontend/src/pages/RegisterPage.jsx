import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Card } from '../components';
import authService from '../services/authService';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    fullName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.fullName) throw new Error('Nama lengkap wajib diisi');
      if (!formData.username) throw new Error('Nama panggilan wajib diisi');
      if (formData.username.length < 3) throw new Error('Nama panggilan minimal 3 karakter');
      if (!formData.email) throw new Error('Email wajib diisi');

      const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
      };

      if (!validateEmail(formData.email)) throw new Error('Format email tidak valid');
      if (!formData.password) throw new Error('Kata sandi wajib diisi');
      if (formData.password.length < 6) throw new Error('Kata sandi minimal 6 karakter');

      await authService.register(
        formData.email,
        formData.username,
        formData.password,
        formData.fullName
      );

      // Setelah berhasil daftar,mengarah ke Login
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Pendaftaran gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8F8] flex items-center justify-center p-4 relative overflow-hidden py-10">
      {/* Ornamen Latar Belakang */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[#22B2B0] rounded-full blur-[100px] opacity-20"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-[#113C3A] rounded-full blur-[100px] opacity-20"></div>

      <Card className="w-full max-w-md relative z-10 !rounded-3xl !shadow-xl !border-0 p-8">
        <div className="text-center mb-8">
          <div className="bg-[#E8F6F6] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-heartbeat text-3xl text-[#22B2B0]"></i>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#113C3A] mb-2">Buat Akun</h1>
          <p className="text-gray-500 text-sm">Langkah pertama untuk memulihkan senyummu.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg flex items-center gap-3">
            <i className="fas fa-exclamation-circle"></i>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama Lengkap"
            type="text"
            name="fullName"
            placeholder="Ketik nama lengkapmu"
            value={formData.fullName}
            onChange={handleChange}
            disabled={loading}
          />

          <Input
            label="Nama Panggilan"
            type="text"
            name="username"
            placeholder="Ketik nama panggilanmu"
            value={formData.username}
            onChange={handleChange}
            disabled={loading}
          />

          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="nama@email.com"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />

          <Input
            label="Kata Sandi"
            type="password"
            name="password"
            placeholder="Minimal 6 karakter"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#113C3A] hover:bg-[#0A2625] text-white py-3 mt-4 rounded-xl shadow-md transition-all active:scale-[0.98]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <i className="fas fa-circle-notch fa-spin"></i> Mendaftarkan...
              </span>
            ) : (
              'Daftar Sekarang'
            )}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          Sudah memiliki akun?{' '}
          <Link to="/login" className="text-[#113C3A] hover:text-[#22B2B0] font-bold transition-colors">
            Masuk di sini
          </Link>
        </div>
      </Card>
    </div>
  );
}