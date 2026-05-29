import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Card } from '../components';
import authService from '../services/authService';
import { useAuthStore } from '../stores/authStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, login } = useAuthStore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Arahkan ke dashboard jika sudah login
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

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
      if (!formData.email) throw new Error('Email tidak boleh kosong');
      if (!formData.password) throw new Error('Kata sandi tidak boleh kosong');

      const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
      };

      if (!validateEmail(formData.email)) {
        throw new Error('Format email tidak valid');
      }

      const response = await authService.login(
        formData.email,
        formData.password
      );

      login(
        {
          user_id: response.user_id,
          email: response.email,
          username: response.username,
          fullName: response.fullName
        },
        response.token
      );

      navigate('/dashboard');

    } catch (err) {
      setError(err.message || 'Gagal masuk. Silakan periksa email dan kata sandi Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8F8] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ornamen Latar Belakang */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#22B2B0] rounded-full blur-[100px] opacity-20"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#113C3A] rounded-full blur-[100px] opacity-20"></div>

      <Card className="w-full max-w-md relative z-10 !rounded-3xl !shadow-xl !border-0 p-8">
        <div className="text-center mb-8">
          <div className="bg-[#E8F6F6] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-heartbeat text-3xl text-[#22B2B0]"></i>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#113C3A] mb-2">Selamat Datang</h1>
          <p className="text-gray-500 text-sm">Mari lanjutkan perjalanan pemulihanmu hari ini.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg flex items-center gap-3">
            <i className="fas fa-exclamation-circle"></i>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#22B2B0] hover:bg-[#1E9E9D] text-white py-3 mt-4 rounded-xl shadow-md shadow-[#22B2B0]/20 transition-all active:scale-[0.98]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <i className="fas fa-circle-notch fa-spin"></i> Memproses...
              </span>
            ) : (
              'Masuk Sekarang'
            )}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          Belum memiliki akun?{' '}
          <Link to="/register" className="text-[#22B2B0] hover:text-[#113C3A] font-bold transition-colors">
            Daftar di sini
          </Link>
        </div>
      </Card>
    </div>
  );
}