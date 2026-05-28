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

  // Redirect if already logged in
  // if (user) {
  //   navigate('/dashboard');
  // }
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
      if (!formData.email) {
        throw new Error('Email tidak boleh kosong');
      }

      if (!formData.password) {
        throw new Error('Password tidak boleh kosong');
      }

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

console.log("LOGIN RESPONSE:", response);

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
      setError(err.message || 'Login gagal. Cek email dan password Anda');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark to-primary-light flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary-dark mb-2">HealMate</h1>
          <p className="text-gray-600">Your Post-Breakup Recovery</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-500 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Belum punya akun?{' '}
          <Link to="/register" className="text-primary-light hover:underline font-semibold">
            Daftar di sini
          </Link>
        </div>
      </Card>
    </div>
  );
}
