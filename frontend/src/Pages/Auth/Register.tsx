import React, { useState, FormEvent } from 'react';
import axios from 'axios';

export default function Register() {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setStatus(null);

    try {
      const response = await axios.post('/api/register', data);
      if (response.status === 201 || response.status === 200) {
        setStatus('Đăng ký thành công! Vui lòng đăng nhập.');
        setData({ name: '', email: '', password: '', password_confirmation: '' });
      } else {
        setStatus('Đăng ký thất bại.');
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        // Backend trả lỗi theo dạng { errors: { field: message, ... } }
        setErrors(error.response.data.errors || {});
        setStatus(error.response.data.message || 'Đăng ký thất bại.');
      } else {
        setStatus('Lỗi kết nối đến server.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-white px-6">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md border border-pink-200">
        <h1 className="text-2xl font-bold text-[#dc3545] mb-6 text-center">Bluemoon - Đăng ký</h1>

        {status && (
          <div
            className={`mb-4 font-medium text-sm ${
              status.includes('thành công') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {status}
          </div>
        )}

        <form onSubmit={submit} noValidate>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              id="name"
              name="name"
              value={data.name}
              onChange={handleChange}
              required
              className={`mt-1 block w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              autoComplete="name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={data.email}
              onChange={handleChange}
              required
              className={`mt-1 block w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              autoComplete="email"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={data.password}
              onChange={handleChange}
              required
              className={`mt-1 block w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              autoComplete="new-password"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <div className="mb-6">
            <label
              htmlFor="password_confirmation"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              value={data.password_confirmation}
              onChange={handleChange}
              required
              className={`mt-1 block w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
              }`}
              autoComplete="new-password"
            />
            {errors.password_confirmation && (
              <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>
            )}
          </div>

          <div className="flex items-center justify-end">
            <a
              href="//login"
              className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              Already registered?
            </a>

            <button
              type="submit"
              disabled={loading}
              className="ms-4 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded transition disabled:opacity-50"
            >
              {loading ? 'Đang đăng ký...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
