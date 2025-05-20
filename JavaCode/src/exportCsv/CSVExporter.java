package exportCsv;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;

import dao.HocDAO;
import dao.SinhvienDAO;
import dao.SubjectDAO;
import model.Hoc;
import model.Sinhvien;
import model.Subject;

public class CSVExporter {

	public static void exportScoreBoard() {
		// Tao file DiemSinhViet.csv va encode duoi dang UTF-8
		try (OutputStreamWriter writer = new OutputStreamWriter(new FileOutputStream("DiemSinhVien.csv"), "UTF-8")) {
			writer.write('\uFEFF'); // Sua loi phong
			writer.append("Tên Sinh Viên"); // Ten SV
			for (Subject subject : SubjectDAO.getInstance().selectALL()) {
				writer.append(',').append(subject.getName()); // Cot tiep theo + ten mon hoc
			}
			writer.append('\n'); // Hang tiep theo

			for (Sinhvien sv : SinhvienDAO.getInstance().selectALL()) {
				writer.append(sv.getName()); // Them ten SV vao o
				for (Subject subject : SubjectDAO.getInstance().selectALL()) {
					writer.append(','); // Cot tiep theo
					Hoc hoc = HocDAO.getInstance().selectByID(sv.getId(), subject.getId());
					if (hoc != null) {
						writer.append(String.valueOf(hoc.getScore())); // Them diem SV vao o
					}
				}
				writer.append('\n'); // Hang tiep theo
			}

		} catch (IOException ex) {
			ex.printStackTrace(System.err);
		}
	}
}