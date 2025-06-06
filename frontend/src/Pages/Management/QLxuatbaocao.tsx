import React, { useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../../Layout/MainLayout";
import { jsPDF } from "jspdf";
import { fetchNopPhiById } from "../../api/NopPhiApi"; // Import API đã tạo
import "./xuatbaocao.css";

const XuatBaoCao: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string>("");
  const [id, setId] = useState<string>("");

  // Handle modal visibility
  const openExportModal = (type: string) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeExportModal = () => {
    setIsModalOpen(false);
    setId(''); // Reset ID when modal is closed
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  };

  // Validate input before generating PDF
  const validateInput = (): boolean => {
    if (!id.trim()) {
      alert("Vui lòng nhập mã hộ khẩu hoặc mã nhân khẩu.");
      return false;
    }
    return true;
  };

  // Fetch data from API based on type
  const generatePDF = async (type: string) => {
    if (!validateInput()) return;

    let data;

    // Fetch data from API based on type
    try {
      if (type === "receipt") {
        // Fetch data for receipt report
        const response = await fetchNopPhiById(Number(id)); // Ensure id is converted to number
        data = response.data;
      } else if (type === "resident") {
        // Fetch data for resident report (similar to above)
        const response = await fetchNopPhiById(Number(id)); // Assume API works the same
        data = response.data;
      }
      // You can modify this to call an API specific for statistics if necessary.
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Không tìm thấy dữ liệu!");
      return;
    }

    const doc = new jsPDF();

    // Add PDF content based on modal type
    if (type === "receipt") {
      const response = await fetchNopPhiById(Number(id))
      data = response.data;
      doc.text(`Phiếu thu hộ khẩu - Mã hộ khẩu: ${data.maHoKhau}`, 10, 10);
      doc.text(`Số tiền: ${data.soTien}`, 10, 20);
      doc.text(`Người nộp: ${data.nguoiNop}`, 10, 30);
    } else if (type === "resident") {
        const response = await fetchNopPhiById(Number(id))
        data = response.data;
        doc.text(`Phiếu báo cáo tạm trú - Mã nhân khẩu: ${data.id}`, 10, 10);
        doc.text(`Người nộp: ${data.nguoiNop}`, 10, 20);
    } else if (type === "statistic") {
        doc.text("Báo cáo thống kê", 10, 10);
        doc.text("Tổng số hộ đã đóng và chưa đóng", 10, 20);
    }

    doc.save(`${type}_report.pdf`);
    closeExportModal();
  };

  return (
    <MainLayout>
      <div className="app">
        <div className="main">
          <section className="export-section">
            <h2>Xuất báo cáo</h2>

            <div className="export-boxes">
              <div className="export-box">
                <h3>Xuất phiếu nộp phí</h3>
                <button onClick={() => openExportModal("receipt")}>Xuất file PDF</button>
              </div>

              <div className="export-box">
                <h3>Báo cáo thống kê</h3>
                <button onClick={() => openExportModal("statistic")}>Xuất thống kê</button>
              </div>

              <div className="export-box">
                <h3>Xuất báo cáo tạm trú tạm vắng</h3>
                <button onClick={() => openExportModal("resident")}>Xuất file PDF</button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Modal xuất báo cáo */}
      {isModalOpen && (
        <div className="modal active">
          <div className="modal-content">
            <h3 id="modalTitle">Xuất báo cáo</h3>
            <form id="exportForm">
              <div id="modalInputs">
                {/* Inputs dynamically generated based on modalType */}
                {modalType === "receipt" && (
                  <>
                    <label htmlFor="modalHouseholdId">Nhập mã hộ khẩu</label>
                    <input
                      type="text"
                      id="modalHouseholdId"
                      name="householdId"
                      required
                      value={id}
                      onChange={handleInputChange}
                    />
                  </>
                )}
                {modalType === "resident" && (
                  <>
                    <label htmlFor="modalResidentId">Nhập mã nhân khẩu</label>
                    <input
                      type="text"
                      id="modalResidentId"
                      name="residentId"
                      required
                      value={id}
                      onChange={handleInputChange}
                    />
                  </>
                )}
                {modalType === "statistic" && (
                  <p>Báo cáo tổng số hộ đã đóng và tổng số hộ chưa đóng sẽ được xuất.</p>
                )}
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={closeExportModal}>
                  Hủy
                </button>
                <button
                  type="button"
                  className="btn-submit"
                  onClick={() => generatePDF(modalType)}
                >
                  Xuất file PDF
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default XuatBaoCao;
