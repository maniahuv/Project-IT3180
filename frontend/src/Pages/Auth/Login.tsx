import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import { Route } from 'react-router-dom';

export default function Login() {
  const [data, setData] = useState({
    email: '',
    password: '',
    remember: false,
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

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
      const response = await axios.post('/api/login', data);

      if (response.status === 200) {
        setStatus('Đăng nhập thành công!');
        // TODO: lưu token, chuyển trang ...
      } else {
        setErrors({ general: 'Đăng nhập thất bại' });
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        const respData = error.response.data;
        // Giả sử backend trả lỗi dạng { errors: { email: "...", password: "..." }, message: "..." }
        setErrors(respData.errors || { general: respData.message || 'Đăng nhập thất bại' });
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              className={`mt-1 block w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              autoComplete="username"
              required
              autoFocus
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
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
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded transition"
          >
            {loading ? 'Đang đăng nhập...' : 'Log in'}
          </button>
        </form>

        <div className="mt-4 flex justify-between text-sm text-gray-600">
          <a href="/password-reset" className="underline hover:text-pink-600">
            Forgot your password?
          </a>
          {/* <Route path="/register" element={<Login />} /> */}
          <a href="/auth/register" className="underline hover:text-pink-600">
            Register
          </a>
        </div>
      </div>
    </div>
  );
}
