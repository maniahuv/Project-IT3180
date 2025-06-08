import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import { FaFilePdf } from "react-icons/fa";
import MainLayout from "../../Layout/MainLayout";
import { fetchHoKhauById, HoKhau } from "../../api/HoKhauApi";
import { fetchNhanKhauById, NhanKhau } from "../../api/NhanKhauApi";
import { fetchAllNopPhi, NopPhi } from "../../api/NopPhiApi";

const ExportReport: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"receipt" | "statistic" | "resident" | "">("");
  const [householdId, setHouseholdId] = useState("");
  const [residentId, setResidentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Check for token
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  const openExportModal = (type: "receipt" | "statistic" | "resident") => {
    setModalType(type);
    setModalOpen(true);
    setError("");
  };

  const closeExportModal = () => {
    setModalOpen(false);
    setModalType("");
    setHouseholdId("");
    setResidentId("");
    setError("");
  };

  const generateReceiptPDF = async (id: string) => {
    setLoading(true);
    setError("");
    try {
      const householdResponse = await fetchHoKhauById(Number(id));
      const household: HoKhau = householdResponse.data;
      const nopPhiResponse = await fetchAllNopPhi();
      const nopPhiList: NopPhi[] = nopPhiResponse.data.filter(
        (np) => np.maHoKhau === Number(id)
      );
      const totalFees = nopPhiList.reduce((sum, np) => sum + (np.soTien || 0), 0);

      const content = document.createElement("div");
      content.style.fontFamily = "'Arial', sans-serif";
      content.style.padding = "20px";
      content.style.width = "210mm";
      content.innerHTML = `
        <h2 style="text-align:center; margin-top: 10px;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
        <h3 style="text-align:center;"><span style="text-decoration: underline;">Độc lập - Tự do - Hạnh phúc</span></h3>
        <div style="width: 90%; text-align: right; font-style: italic;">
          <p>Hà Nội, ngày ${new Date().toLocaleDateString('vi-VN')}</p>
        </div>
        <h3 style="text-align:center; margin-top: 10px;">PHIẾU THU HỘ KHẨU</h3>
        <p style="margin-top:20px;"><strong>Kính gửi:</strong> Chủ hộ: ${household.chuHo}</p>
        <p style="margin-top:15px;">Chúng tôi xin thông báo thông tin chi tiết về khoản thu phí của hộ khẩu có thông tin như sau:</p>
        <p style="margin-top:15px; line-height:1.6;">
          <strong>Số hộ khẩu:</strong> ${household.maHoKhau}<br>
          <strong>Số căn hộ:</strong> ${household.soNha}<br>
          <strong>Diện tích:</strong> ${household.dienTich} m²<br>
          <strong>Số nhân khẩu:</strong> ${household.danhSachNhanKhau?.length || 0}<br>
          <strong>Khoản phí vệ sinh:</strong> 200,000 (Nghìn Đồng)<br>
          <strong>Khoản phí gửi xe chung cư:</strong> 300,000 (Nghìn Đồng)<br>
          <strong>Khoản phí bảo trì:</strong> 100,000 (Nghìn Đồng)<br>
          <strong>Tổng khoản phí đã đóng:</strong> ${totalFees.toLocaleString()} (Nghìn Đồng)<br>
        </p>
        <div style="margin-top:30px; width:90%; text-align:right; padding-right:40px;">
          <p><strong>Người làm phiếu</strong></p>
          <p style="margin-top:60px;">(Ký và ghi rõ họ tên)</p>
          <p style="margin-top:60px;">Trần văn B</p>
        </div>
      `;

      await html2pdf()
        .set({
          margin: 10,
          filename: `PhieuThu_HoKhau_${id}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, letterRendering: true, dpi: 192 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(content)
        .save();
      closeExportModal();
    } catch (err: any) {
      setError("Lỗi khi xuất phiếu thu: " + (err.response?.data?.message || err.message));
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const generateResidentReportPDF = async (id: string) => {
    setLoading(true);
    setError("");
    try {
      const residentResponse = await fetchNhanKhauById(Number(id));
      const resident: NhanKhau = residentResponse.data;
      const householdResponse = await fetchHoKhauById(Number(resident.maHoKhau));
      const household: HoKhau = householdResponse.data;

      const content = document.createElement("div");
      content.style.fontFamily = "'Arial', sans-serif";
      content.style.padding = "20px";
      content.style.width = "210mm";
      content.innerHTML = `
        <h2 style="text-align:center; margin-top: 10px;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
        <h3 style="text-align:center;"><span style="text-decoration: underline;">Độc lập - Tự do - Hạnh phúc</span></h3>
        <div style="width: 90%; text-align: right; font-style:;">
          <p>Hà Nội, ngày ${new Date().toLocaleDateString('vi-VN')}</p>
        </div>
        <h3 style="text-align:center; margin-top: 10px;">PHIẾU KHAI BÁO TẠM TRÚ - TẠM VẮNG</h3>
        <p style="margin-top:20px;"><strong>Kính gửi:</strong> Công an phường/xã/thị trấn</p>
        <p style="margin-top:15px;">Ban quản lý chung cư BlueMoon xin kính gửi thông tin về tình trạng tạm trú tạm vắng của cá nhân.</p>
        <p style="margin-top:15px; line-height:1.6;">
          <strong>Số hộ khẩu:</strong> ${resident.maHoKhau}<br>
          <strong>Họ và tên:</strong> ${resident.hoTen}<br>
          <strong>Ngày tháng năm sinh:</strong> ${new Date(resident.ngaySinh).toLocaleDateString('vi-VN')}<br>
          <strong>Số định danh cá nhân/CMND:</strong> ${resident.cccd}<br>
          <strong>Giới tính:</strong> Nữ<br>
          <strong>Nghề nghiệp:</strong>Giáo viên<br>
          <strong>Quan hệ với chủ hộ:</strong> Con<br>
          <strong>Tình trạng cư trú:</strong> Tạm Trú<br>
          <strong>Lý do tạm vắng (Nếu có):</strong> ............................<br>
        </p>
        <div style="margin-top:30px; width:90%; text-align:right; padding-right:40px;">
          <p><strong>Người làm báo cáo</strong></p>
          <p style="margin-top:60px;">(Ký và ghi rõ họ tên)</p>
        </div>
      `;

      await html2pdf()
        .set({
          margin: 10,
          filename: `BaoCao_TamTruTamVang_${id}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, letterRendering: true, dpi: 192 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(content)
        .save();
      closeExportModal();
    } catch (err: any) {
      setError("Lỗi khi xuất báo cáo tạm trú: " + (err.response?.data?.message || err.message));
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const generateStatisticReportPDF = async () => {
    setLoading(true);
    setError("");
    try {
      const nopPhiResponse = await fetchAllNopPhi();
      const nopPhiList: NopPhi[] = nopPhiResponse.data;
      const uniqueHouseholdsPaid = new Set(nopPhiList.map((np) => np.maHoKhau));
      const totalPaid = uniqueHouseholdsPaid.size;
      // Assume total households from API or hardcoded for demo; ideally fetch from HoKhau API
      const totalHouseholds = 400; // Replace with fetchAllHoKhau().length if available
      const totalUnpaid = totalHouseholds - totalPaid;

      const content = document.createElement("div");
      content.style.fontFamily = "'Arial', sans-serif";
      content.style.padding = "20px";
      content.style.width = "210mm";
      content.innerHTML = `
        <h2 style="text-align:center; margin-top: 10px;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2>
        <h3 style="text-align:center;"><span style="text-decoration: underline;">Độc lập - Tự do - Hạnh phúc</span></h3>
        <div style="width: 90%; text-align: right; font-style: italic;">
          <p>Hà Nội, ngày ${new Date().toLocaleDateString('vi-VN')}</p>
        </div>
        <h3 style="text-align:center; margin-top: 10px;">BÁO CÁO THỐNG KÊ HỘ KHẨU</h3>
        <p style="margin-top:20px;"><strong>Kính gửi:</strong> Ban quản lý chung cư BlueMoon</p>
        <p style="margin-top:15px;">Trưởng ban thu phí xin báo cáo thống kê tình hình đóng phí của các hộ khẩu như sau:</p>
        <div style="display:flex; justify-content: space-around; margin-top: 30px; line-height:1.6;">
          <div style="text-align:center;">
            <p><strong>Số hộ đã đóng</strong></p>
            <p style="font-size: 48px; color: green;">${totalPaid}</p>
          </div>
          <div style="text-align:center;">
            <p><strong>Số hộ chưa đóng</strong></p>
            <p style="font-size: 48px; color: red;">${totalUnpaid}</p>
          </div>
        </div>
        <div style="margin-top:40px; width:90%; text-align:right; padding-right:40px;">
          <p><strong>Người lập báo cáo</strong></p>
          <p style="margin-top:60px;">(Ký và ghi rõ họ tên)</p>
          <p style="margin-top:60px;">Trần văn A</p>
        </div>
      `;

      await html2pdf()
        .set({
          margin: 10,
          filename: "BaoCao_ThongKe_HoKhau.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, letterRendering: true, dpi: 192 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(content)
        .save();
      closeExportModal();
    } catch (err: any) {
      setError("Lỗi khi xuất báo cáo thống kê: " + (err.response?.data?.message || err.message));
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === "receipt") {
      if (!householdId.trim()) {
        setError("Vui lòng nhập mã hộ khẩu.");
        return;
      }
      await generateReceiptPDF(householdId);
    } else if (modalType === "statistic") {
      await generateStatisticReportPDF();
    } else if (modalType === "resident") {
      if (!residentId.trim()) {
        setError("Vui lòng nhập mã nhân khẩu.");
        return;
      }
      await generateResidentReportPDF(residentId);
    }
  };

  return (
    <MainLayout>
      <section className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Xuất báo cáo</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Box xuất phiếu thu */}
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
            <h3 className="text-xl font-semibold mb-4 text-pink-500 border-b-2 border-pink-500 pb-2">
              Xuất phiếu thu của hộ khẩu
            </h3>
            <label htmlFor="householdId" className="block font-semibold mb-2 text-sm text-gray-700">
              Nhập mã hộ khẩu
            </label>
            <input
              type="text"
              id="householdId"
              value={householdId}
              onChange={(e) => setHouseholdId(e.target.value)}
              placeholder="Nhập mã hộ khẩu..."
              className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            />
            <button
              onClick={() => openExportModal("receipt")}
              className="flex items-center justify-center bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition-colors"
              disabled={loading}
            >
              <FaFilePdf className="mr-2" /> Xuất file PDF
            </button>
          </div>

          {/* Box xuất thống kê */}
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
            <h3 className="text-xl font-semibold mb-4 text-pink-500 border-b-2 border-pink-500 pb-2">
              Báo cáo thống kê
            </h3>
            <p className="mb-4 text-gray-600 pb-5">Báo cáo tổng hộ đã đóng và tổng số hộ chưa đóng.</p>
            <button
              onClick={() => openExportModal("statistic")}
              className="flex items-center justify-center bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition-colors"
              disabled={loading}
            >
              <FaFilePdf className="mr-2" /> Xuất thống kê
            </button>
          </div>

          {/* Box xuất tạm trú tạm vắng */}
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col">
            <h3 className="text-xl font-semibold mb-4 text-pink-500 border-b-2 border-pink-500 pb-2">
              Xuất báo cáo tạm trú tạm vắng
            </h3>
            <label htmlFor="residentId" className="block font-semibold mb-2 text-sm text-gray-700">
              Nhập mã nhân khẩu
            </label>
            <input
              type="text"
              id="residentId"
              value={residentId}
              onChange={(e) => setResidentId(e.target.value)}
              placeholder="Nhập mã nhân khẩu..."
              className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
            />
            <button
              onClick={() => openExportModal("resident")}
              className="flex items-center justify-center bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition-colors"
              disabled={loading}
            >
              <FaFilePdf className="mr-2" /> Xuất file PDF
            </button>
          </div>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                {modalType === "receipt"
                  ? "Xuất phiếu thu của hộ khẩu"
                  : modalType === "statistic"
                  ? "Xuất báo cáo thống kê"
                  : "Xuất báo cáo tạm trú tạm vắng"}
              </h3>
              <form onSubmit={handleSubmit}>
                <div>
                  {modalType === "receipt" && (
                    <>
                      <label htmlFor="modalHouseholdId" className="block font-semibold mb-2 text-sm text-gray-700">
                        Nhập mã hộ khẩu
                      </label>
                      <input
                        type="text"
                        id="modalHouseholdId"
                        value={householdId}
                        onChange={(e) => setHouseholdId(e.target.value)}
                        placeholder="Nhập mã hộ khẩu..."
                        className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                        required
                      />
                    </>
                  )}
                  {modalType === "statistic" && (
                    <p className="mb-4 text-gray-600">
                      Báo cáo tổng số hộ đã đóng và tổng số hộ chưa đóng sẽ được xuất.
                    </p>
                  )}
                  {modalType === "resident" && (
                    <>
                      <label htmlFor="modalResidentId" className="block font-semibold mb-2 text-sm text-gray-700">
                        Nhập mã nhân khẩu
                      </label>
                      <input
                        type="text"
                        id="modalResidentId"
                        value={residentId}
                        onChange={(e) => setResidentId(e.target.value)}
                        placeholder="Nhập mã nhân khẩu..."
                        className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                        required
                      />
                    </>
                  )}
                  {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                  {loading && <p className="text-blue-500 text-sm mb-4">Đang xử lý...</p>}
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="button"
                    onClick={closeExportModal}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                    disabled={loading}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition-colors"
                    disabled={loading}
                  >
                    Xuất file PDF
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </MainLayout>
  );
};

export default ExportReport;