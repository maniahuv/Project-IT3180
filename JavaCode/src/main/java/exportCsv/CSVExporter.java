package exportCsv;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;

public class CSVExporter {

	public static void exportScoreBoard() {
		// Tao file csv va encode duoi dang UTF-8
		try (OutputStreamWriter writer = new OutputStreamWriter(new FileOutputStream("STF.csv"), "UTF-8")) {
			writer.write('\uFEFF'); // Sua loi phong
		} catch (IOException ex) {
			ex.printStackTrace(System.err);
		}
	}
}