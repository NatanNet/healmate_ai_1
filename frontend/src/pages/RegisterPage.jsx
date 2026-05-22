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
      if (!formData.fullName) {
        throw new Error('Nama lengkap tidak boleh kosong');
      }

      if (!formData.username) {
        throw new Error('Username tidak boleh kosong');
      }

      if (formData.username.length < 3) {
        throw new Error('Username minimal 3 karakter');
      }

      if (!formData.email) {
        throw new Error('Email tidak boleh kosong');
      }

      const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
      };

      if (!validateEmail(formData.email)) {
        throw new Error('Format email tidak valid');
      }

      if (!formData.password) {
        throw new Error('Password tidak boleh kosong');
      }

      if (formData.password.length < 6) {
        throw new Error('Password minimal 6 karakter');
      }

      await authService.register(
        formData.email,
        formData.username,
        formData.password,
        formData.fullName
      );

      // Navigate to login page (don't auto-login)
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Pendaftaran gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark to-primary-light flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary-dark mb-2">🌱 HealMate</h1>
          <p className="text-gray-600">Buat Akun Baru</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-500 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama Lengkap"
            type="text"
            name="fullName"
            placeholder="Nama lengkap Anda"
            value={formData.fullName}
            onChange={handleChange}
            disabled={loading}
          />

          <Input
            label="Username"
            type="text"
            name="username"
            placeholder="namapanggilan"
            value={formData.username}
            onChange={handleChange}
            disabled={loading}
          />

          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="nama@example.com"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
          />

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Mendaftar...' : 'Daftar'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-primary-light hover:underline font-semibold">
            Login di sini
          </Link>
        </div>
      </Card>
    </div>
  );
}
