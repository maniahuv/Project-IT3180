import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, LoginCredentials } from '../../api/AuthApi';

export default function Login() {
  const [data, setData] = useState<LoginCredentials & { remember: boolean }>({
    username: '',
    password: '',
    remember: false,
  });
  const [errors, setErrors] = useState<{ username?: string; password?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setStatus(null);

    try {
      const response = await login({ username: data.username, password: data.password });

      if (response.status === 200) {
        setStatus('Đăng nhập thành công!');
        // Redirect to /homepage after successful login
        navigate('/homepage');
      } else {
        setErrors({ general: 'Đăng nhập thất bại' });
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        const respData = error.response.data;
        // Handle error messages from backend (e.g., "Đăng nhập thất bại" or detailed errors)
        setErrors({ general: respData || 'Đăng nhập thất bại' });
      } else {
        setErrors({ general: 'Lỗi kết nối đến server' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-6">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md border border-pink-200">
        <h1 className="text-2xl font-bold text-[#dc3545] mb-6 text-center">Bluemoon</h1>

        {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}
        {errors.general && <div className="mb-4 font-medium text-sm text-red-600">{errors.general}</div>}

        <form onSubmit={submit} noValidate>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Tên đăng nhập
            </label>
            <input
              id="username"
              type="text"
              name="username"
              value={data.username}
              onChange={handleChange}
              className={`mt-1 block w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                errors.username ? 'border-red-500' : 'border-gray-300'
              }`}
              autoComplete="username"
              required
              autoFocus
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              className={`mt-1 block w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              autoComplete="current-password"
              required
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <div className="flex items-center mb-6">
            <input
              id="remember"
              type="checkbox"
              name="remember"
              checked={data.remember}
              onChange={handleChange}
              className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-gray-600">
              Ghi nhớ đăng nhập
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded transition"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <div className="mt-4 flex justify-between text-sm text-gray-600">
          <a href="/password-reset" className="underline hover:text-pink-600">
            Quên mật khẩu?
          </a>
        </div>
      </div>
    </div>
  );
}