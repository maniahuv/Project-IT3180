import React, { useState } from "react";
import MainLayout from "../../Layout/MainLayout";
import html2pdf from "html2pdf.js";

window.html2pdf = html2pdf;


// Bạn cần cài package: html2pdf.js và fontawesome css link trong public/index.html hoặc import

declare global {
  interface Window {
    html2pdf: any;
  }
}

const XuatBaoCao: React.FC = () => {
  // Modal quản lý trạng thái hiển thị và loại modal
  const [modalType, setModalType] = useState<"receipt" | "statistic" | "resident" | null>(null);

  // Các input trong main content
  const [householdId, setHouseholdId] = useState("");
  const [residentId, setResidentId] = useState("");

  // Input modal (đồng bộ với main hoặc nhập lại)
  const [modalHouseholdId, setModalHouseholdId] = useState("");
  const [modalResidentId, setModalResidentId] = useState("");

  // Mở modal theo loại
  const openExportModal = (type: "receipt" | "statistic" | "resident") => {
    setModalType(type);
    if (type === "receipt") {
      setModalHouseholdId(householdId.trim());
    } else if (type === "resident") {
      setModalResidentId(residentId.trim());
    }
  };

  // Đóng modal và reset input modal
  const closeExportModal = () => {
    setModalType(null);
    setModalHouseholdId("");
    setModalResidentId("");
  };

  // Hàm tạo PDF receipt
  const generateReceiptPDF = (id: string) => {
    if (!window.html2pdf) {
      alert("html2pdf.js chưa được load");
      return;
    }
    const data = {
      householdId: id,
      apartmentNumber: "A12-05",
      area: "85 m²",
      numberOfPeople: 4,
      householdOwner: "Nguyễn Văn A",
    };

    const content = document.createElement("div");
    content.style.fontFamily = "'Arial', sans-serif";
    content.style.padding = "20px";
    content.style.width = "210mm"; // chuẩn A4
    content.innerHTML = `
    <h2 style="text-align:center; margin-top: 10px;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2> 
    <h3 style="text-align:center;"><span style="text-decoration: underline;">Độc lập - Tự do - Hạnh phúc</span></h3>

    <div style="width: 90%; text-align: right; font-style: italic;">
      <p>..., ngày ... tháng ... năm 20...</p>
    </div>

    <h3 style="text-align:center; margin-top: 10px;">PHIẾU THU HỘ KHẨU</h3>

    <p style="margin-top:20px;"><strong>Kính gửi:</strong><strong>Chủ hộ:</strong> ${data.householdOwner}</p>
    <p style="margin-top:15px;">Chúng tôi xin thông báo thông tin chi tiết về khoản thu phí của hộ khẩu có thông tin như sau:</p>

    <p style="margin-top:15px; line-height:1.6;">
      <strong>Số hộ khẩu:</strong> ${data.householdId}<br>
      <strong>Số căn hộ:</strong> ${data.apartmentNumber}<br>
      <strong>Diện tích:</strong> ${data.area}<br>
      <strong>Số nhân khẩu:</strong> ${data.numberOfPeople}<br>
      <strong>Khoản phí vệ sinh: ............................................... (Nghìn Đồng)</strong><br>
      <strong>Khoản phí gửi xe chung cư: ....................................... (Nghìn Đồng)</strong> <br>
      <strong>Khoản phí bảo trì: ............................................... (Nghìn Đồng)</strong> <br>
      <strong>Khoản phí cần phải đóng: ......................................... (Nghìn Đồng)</strong> <br>
      <strong>Khoản tiền đóng góp cho hoạt động hỗ trợ trẻ em vùng cao (Nếu có): .....</strong> <br>
      <strong>Khoản tiền đóng góp cho hoạt động cặp lá yêu thương (Nếu có): .....</strong><br>
      <strong>Khoản tiền đóng góp cho hoạt động vì một ngày mai tươi sáng (Nếu có): .....</strong>  <br>
    </p>

    <div style="margin-top:30px; width:90%; text-align:right; padding-right:40px;">
      <p><strong>Người làm phiếu</strong></p>
      <p style="margin-top:60px;">(Ký và ghi rõ họ tên)</p>
    </div>
  `;

    window.html2pdf()
      .set({
        margin: 10,
        filename: `PhieuThu_HoKhau_${data.householdId}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, letterRendering: true, dpi: 192 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(content)
      .save();
  };

  // Hàm tạo PDF resident report
  const generateResidentReportPDF = (id: string) => {
    if (!window.html2pdf) {
      alert("html2pdf.js chưa được load");
      return;
    }
    const data = {
      residentId: id,
      householdId: "HK001",
      fullName: "Nguyễn Văn B",
      cccd: "123456789012",
      dob: "01/01/1990",
      gender: "Nam",
      job: "Kỹ sư",
      residenceStatus: "Tạm trú",
      relationToOwner: "Con",
    };

    const content = document.createElement("div");
    content.style.fontFamily = "'Arial', sans-serif";
    content.style.padding = "20px";
    content.style.width = "210mm";
    content.innerHTML = `
    <h2 style="text-align:center; margin-top: 10px;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h2> 
    <h3 style="text-align:center;"><span style="text-decoration: underline;">Độc lập - Tự do - Hạnh phúc</span></h3>

    <div style="width: 90%; text-align: right; font-style: italic;">
      <p>..., ngày ... tháng ... năm 20...</p>
    </div>

    <h3 style="text-align:center; margin-top: 10px;">BÁO CÁO THÔNG TIN NHÂN KHẨU</h3>

    <p style="margin-top:20px;">
      <strong>Mã nhân khẩu:</strong> ${data.residentId} <br>
      <strong>Mã hộ khẩu:</strong> ${data.householdId} <br>
      <strong>Họ và tên:</strong> ${data.fullName} <br>
      <strong>CCCD:</strong> ${data.cccd} <br>
      <strong>Ngày sinh:</strong> ${data.dob} <br>
      <strong>Giới tính:</strong> ${data.gender} <br>
      <strong>Nghề nghiệp:</strong> ${data.job} <br>
      <strong>Trạng thái cư trú:</strong> ${data.residenceStatus} <br>
      <strong>Mối quan hệ với chủ hộ:</strong> ${data.relationToOwner} <br>
    </p>

    <div style="margin-top:30px; width:90%; text-align:right; padding-right:40px;">
      <p><strong>Người làm báo cáo</strong></p>
      <p style="margin-top:60px;">(Ký và ghi rõ họ tên)</p>
    </div>
  `;

    window.html2pdf()
      .set({
        margin: 10,
        filename: `BaoCaoNhanKhau_${data.residentId}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, letterRendering: true, dpi: 192 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(content)
      .save();
  };

  // Hàm xử lý nút Tạo phiếu thu
  const handleCreateReceipt = () => {
    if (!modalHouseholdId) {
      alert("Vui lòng nhập số hộ khẩu để tạo phiếu thu.");
      return;
    }
    generateReceiptPDF(modalHouseholdId);
    closeExportModal();
  };

  // Hàm xử lý nút Tạo báo cáo nhân khẩu
  const handleCreateResidentReport = () => {
    if (!modalResidentId) {
      alert("Vui lòng nhập mã nhân khẩu để tạo báo cáo.");
      return;
    }
    generateResidentReportPDF(modalResidentId);
    closeExportModal();
  };

  return (
    <MainLayout>
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-white border-b">
        <h1 className="text-2xl font-semibold">Xuất Báo Cáo</h1>
        <div>
          <input
            type="text"
            placeholder="Nhập số hộ khẩu"
            value={householdId}
            onChange={(e) => setHouseholdId(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1 mr-3"
          />
          <input
            type="text"
            placeholder="Nhập mã nhân khẩu"
            value={residentId}
            onChange={(e) => setResidentId(e.target.value)}
            className="border border-gray-300 rounded px-3 py-1"
          />
        </div>
      </header>

      {/* Nội dung chính */}
      <div className="p-6 space-y-4">
        {/* Nút mở modal */}
        <button
          onClick={() => openExportModal("receipt")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Tạo phiếu thu hộ khẩu
        </button>
        <button
          onClick={() => openExportModal("resident")}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Tạo báo cáo nhân khẩu
        </button>
      </div>

      {/* Modal export */}
      {modalType && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-[480px] max-w-full p-6 relative">
            <button
              onClick={closeExportModal}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              aria-label="Đóng modal"
            >
              &times;
            </button>

            {modalType === "receipt" && (
              <>
                <h2 className="text-xl font-semibold mb-4">Tạo phiếu thu hộ khẩu</h2>
                <input
                  type="text"
                  placeholder="Nhập số hộ khẩu"
                  value={modalHouseholdId}
                  onChange={(e) => setModalHouseholdId(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                />
                <div className="text-sm mb-4 text-gray-700">
                  Mẫu phiếu thu sẽ bao gồm các thông tin về số hộ khẩu, số căn hộ, diện tích, số nhân khẩu, chủ hộ và các khoản phí.
                </div>
                <button
                  onClick={handleCreateReceipt}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Tạo phiếu thu PDF
                </button>
              </>
            )}

            {modalType === "resident" && (
              <>
                <h2 className="text-xl font-semibold mb-4">Tạo báo cáo nhân khẩu</h2>
                <input
                  type="text"
                  placeholder="Nhập mã nhân khẩu"
                  value={modalResidentId}
                  onChange={(e) => setModalResidentId(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                />
                <div className="text-sm mb-4 text-gray-700">
                  Mẫu báo cáo nhân khẩu sẽ bao gồm thông tin chi tiết về nhân khẩu như mã, họ tên, CCCD, nghề nghiệp, trạng thái cư trú.
                </div>
                <button
                  onClick={handleCreateResidentReport}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Tạo báo cáo PDF
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default XuatBaoCao;
