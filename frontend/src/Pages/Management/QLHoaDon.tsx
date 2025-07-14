
import React, { useState, useEffect, useRef } from 'react';
import MainLayout from '../../Layout/MainLayout';
import { SanPham, fetchSanPhamById, updateSanPham, tinhLoiNhuan } from '../../api/SanPhamAPI';

const HoaDon: React.FC = () => {
  const [productId, setProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [products, setProducts] = useState<{ idSp: string; ten: string; giaBan: number; soLuong: number; tonKho: number }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const currentDateTime = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setError(null);
  }, [productId, quantity]);

  const handleAddProduct = async () => {
    if (!productId.trim()) {
      setError('Vui lòng nhập ID sản phẩm.');
      return;
    }

    try {
      const response = await fetchSanPhamById(productId);
      const product: SanPham = response.data;
      if (!product.idSp) {
        setError('Sản phẩm không tồn tại.');
        return;
      }
      if (product.tonKho === 0) {
        setError('Sản phẩm đã hết hàng.');
        return;
      }
      if (product.tonKho < quantity) {
        setError(`Chỉ còn ${product.tonKho} sản phẩm trong kho.`);
        return;
      }

      const existingProduct = products.find((p) => p.idSp === product.idSp);
      if (existingProduct) {
        setProducts(
          products.map((p) =>
            p.idSp === product.idSp ? { ...p, soLuong: p.soLuong + quantity } : p
          )
        );
      } else {
        setProducts([
          ...products,
          { idSp: product.idSp!, ten: product.ten, giaBan: product.giaBan, soLuong: quantity, tonKho: product.tonKho },
        ]);
      }

      // Cập nhật tồn kho và đã bán
      const newTonKho = product.tonKho - quantity;
      const newDaBan = (product.daBan || 0) + quantity;
      await updateSanPham(product.idSp!, {
        ...product,
        tonKho: newTonKho,
        daBan: newDaBan,
      });

      setProductId('');
      setQuantity(1);
    } catch (err: any) {
      setError('Có lỗi xảy ra: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleRemoveProduct = async (idSp: string) => {
    const productToRemove = products.find((p) => p.idSp === idSp);
    if (productToRemove) {
      const response = await fetchSanPhamById(idSp);
      const originalProduct: SanPham = response.data;
      const revertQuantity = productToRemove.soLuong;
      const newTonKho = originalProduct.tonKho + revertQuantity;
      const newDaBan = (originalProduct.daBan || 0) - revertQuantity;
      await updateSanPham(idSp, {
        ...originalProduct,
        tonKho: newTonKho,
        daBan: newDaBan,
      }).catch((err) => console.error('Error reverting stock:', err));
    }
    setProducts(products.filter((p) => p.idSp !== idSp));
  };

  const calculateTotal = (): number => {
    return products.reduce((total, p) => total + p.giaBan * p.soLuong, 0);
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open('', '', 'height=600,width=800');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Hóa Đơn</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20mm; }
                .invoice { width: 100%; max-width: 210mm; margin: 0 auto; }
                .header { text-align: center; margin-bottom: 20mm; }
                .header h1 { margin: 0; font-size: 24pt; }
                .header p { margin: 5mm 0; font-size: 12pt; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20mm; }
                th, td { border: 1px solid #000; padding: 8pt; text-align: left; font-size: 10pt; }
                th { background-color: #f2f2f2; }
                .total { font-size: 14pt; text-align: right; margin-top: 10mm; }
                @page { margin: 20mm; }
              </style>
            </head>
            <body>
              <div class="invoice">
                <div class="header">
                  <h1>HÓA ĐƠN</h1>
                  <p>Ngày giờ: ${currentDateTime}</p>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>ID Sản phẩm</th>
                      <th>Tên sản phẩm</th>
                      <th>Giá bán</th>
                      <th>Số lượng</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${products
                      .map(
                        (p) => `
                          <tr>
                            <td>${p.idSp}</td>
                            <td>${p.ten}</td>
                            <td>${p.giaBan.toLocaleString()} VNĐ</td>
                            <td>${p.soLuong}</td>
                            <td>${(p.giaBan * p.soLuong).toLocaleString()} VNĐ</td>
                          </tr>
                        `
                      )
                      .join('')}
                  </tbody>
                </table>
                <div class="total">
                  <strong>Tổng tiền: ${calculateTotal().toLocaleString()} VNĐ</strong>
                </div>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();

        // Hiển thị nút "Tạo hóa đơn mới" sau khi in
        setShowNewInvoiceButton(true);
      }
    }
  };

  const [showNewInvoiceButton, setShowNewInvoiceButton] = useState<boolean>(false);

  const handleNewInvoice = () => {
    setProducts([]);
    setProductId('');
    setQuantity(1);
    setError(null);
    setShowNewInvoiceButton(false);
  };

  return (
    <MainLayout>
      <div className="flex-1 flex flex-col p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Tạo Hóa Đơn</h2>

        <div className="mb-6">
          <div className="flex space-x-4 mb-4">
            <input
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="Nhập ID sản phẩm"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
              min="1"
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddProduct}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Thêm sản phẩm
            </button>
          </div>
          {error && <p className="text-red-600 mb-2">{error}</p>}
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">ID Sản phẩm</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tên sản phẩm</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Giá bán</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Số lượng</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Thành tiền</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((p) => (
                <tr key={p.idSp}>
                  <td className="px-4 py-3 text-sm text-gray-900">{p.idSp}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{p.ten}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{p.giaBan.toLocaleString()} VNĐ</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{p.soLuong}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{(p.giaBan * p.soLuong).toLocaleString()} VNĐ</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleRemoveProduct(p.idSp)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-right mb-6">
          <p className="text-xl font-bold">
            Tổng tiền: {calculateTotal().toLocaleString()} VNĐ
          </p>
        </div>

        <div className="text-right">
          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mr-2"
          >
            In hóa đơn (PDF)
          </button>
          {showNewInvoiceButton && (
            <button
              onClick={handleNewInvoice}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Tạo hóa đơn mới
            </button>
          )}
        </div>

        {/* Phần tử ẩn để in */}
        <div ref={printRef} style={{ display: 'none' }}>
          <div className="invoice">
            <div className="header">
              <h1>HÓA ĐƠN</h1>
              <p>Ngày giờ: {currentDateTime}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>ID Sản phẩm</th>
                  <th>Tên sản phẩm</th>
                  <th>Giá bán</th>
                  <th>Số lượng</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.idSp}>
                    <td>{p.idSp}</td>
                    <td>{p.ten}</td>
                    <td>{p.giaBan.toLocaleString()} VNĐ</td>
                    <td>{p.soLuong}</td>
                    <td>{(p.giaBan * p.soLuong).toLocaleString()} VNĐ</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="total">
              <strong>Tổng tiền: {calculateTotal().toLocaleString()} VNĐ</strong>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HoaDon;
