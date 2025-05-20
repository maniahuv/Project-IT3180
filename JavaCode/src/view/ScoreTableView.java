package view;

import java.awt.BorderLayout;
import java.awt.GridLayout;
import java.awt.event.ActionEvent;
import java.util.ArrayList;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTable;
import javax.swing.JTextField;
import javax.swing.SwingUtilities;
import javax.swing.table.AbstractTableModel;

import dao.HocDAO;
import dao.SinhvienDAO;
import dao.SubjectDAO;
import exportCsv.CSVExporter;
import model.Hoc;
import model.Sinhvien;
import model.Subject;

public class ScoreTableView extends JFrame {

	private static final long serialVersionUID = 1586218636796582149L;
	private static final long REFRESH_INTERVAL = 10000; // 10 seconds

	private boolean stopRefreshIntervals;

	private JTextField textID;
	private JTextField textIDSubject;
	private JTextField textScore;
	private JTable table;

	private String[][] rowData;
	private String[] columnNames;

	public static void main(String[] args) {
		// Create window
		SwingUtilities.invokeLater(() -> new ScoreTableView().setVisible(true));
	}

	public ScoreTableView() {
		// Set window attributes
		setTitle("Bảng điếm sinh viên");
		setSize(1200, 600);
		setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
		setLocationRelativeTo(null); // Set position middle

		// Create UI
		JPanel panel = new JPanel(new BorderLayout());
		JPanel inputPanel = new JPanel(new GridLayout(4, 2, 5, 5));
		JLabel labelID = new JLabel("Mã sinh viên:");
		JLabel labelIDSubject = new JLabel("Mã môn học:");
		JLabel labelScore = new JLabel("Điểm:");
		textID = new JTextField(); // Create input field for student id
		textIDSubject = new JTextField(); // Create input field for subject id
		textScore = new JTextField(); // Create input field for score

		// Add all input fields to input panel
		inputPanel.add(labelID);
		inputPanel.add(textID);
		inputPanel.add(labelIDSubject);
		inputPanel.add(textIDSubject);
		inputPanel.add(labelScore);
		inputPanel.add(textScore);

		panel.add(inputPanel, BorderLayout.CENTER); // Put input panel at the center of the window layout

		// Create Table
		table = new JTable();
		JScrollPane scrollPane = new JScrollPane(table);
		panel.add(scrollPane, BorderLayout.NORTH);

		// Create buttons
		JPanel buttonPanel = new JPanel();
		JButton buttonAdd = new JButton("Thêm");
		JButton buttonUpdate = new JButton("Sửa");
		JButton buttonDelete = new JButton("Xóa");
		JButton buttonExport = new JButton("Xuất Excel");

		// Add all buttons to button panel
		buttonPanel.add(buttonAdd);
		buttonPanel.add(buttonUpdate);
		buttonPanel.add(buttonDelete);
		buttonPanel.add(buttonExport);
		panel.add(buttonPanel, BorderLayout.SOUTH); // Put button panel at the bottom of the window layout

		add(panel);

		// Set action when buttons are pressed
		buttonAdd.addActionListener((ActionEvent e) -> {
			HocDAO.getInstance().insert(searchScore(true)); // Them diem
		});
		buttonUpdate.addActionListener((ActionEvent e) -> {
			HocDAO.getInstance().update(searchScore(true)); // Sua diem
		});
		buttonDelete.addActionListener((ActionEvent e) -> {
			HocDAO.getInstance().delete(searchScore(false)); // Xoa diem
		});
		buttonExport.addActionListener((ActionEvent e) -> {
			CSVExporter.exportScoreBoard(); // Xuat Excel
		});

		startRefreshIntervals(); // load table and start refresh interval (refresh every REFRESH_INTERVAL)
	}

	// Tao ra diem(Hoc) tu input panel de su dung cho them sua xoa
	private Hoc searchScore(boolean checkScore) {
		float score = 0;
		score = Float.parseFloat(textScore.getText());
		// Check score validity
		// try {

		// }
		// catch (NumberFormatException x) {
		// if (checkScore) {
		// JOptionPane.showMessageDialog(null, "Điểm không hợp lệ!", "ERROR",
		// JOptionPane.ERROR_MESSAGE);
		// return null;
		// }
		// }
		// if (checkScore && (score < 0 || score > 10)) {
		// JOptionPane.showMessageDialog(null, "Điểm phải trong khoảng [0, 10]!",
		// "ERROR", JOptionPane.ERROR_MESSAGE);
		// return null;
		// }

		// Check id validity
		try {
			// Tao Hoc tu input panel
			Hoc hoc = new Hoc(Integer.parseInt(textID.getText()), Integer.parseInt(textIDSubject.getText()), score);
			// if (SinhvienDAO.getInstance().selectByID(new Sinhvien(hoc.getId())) == null)
			// {
			// JOptionPane.showMessageDialog(null, "Mã sinh viên không tồn tại!", "ERROR",
			// JOptionPane.ERROR_MESSAGE);
			// return null;
			// }
			// if (SubjectDAO.getInstance().selectByID(new Subject(hoc.getIdSubject(), ""))
			// == null) {
			// JOptionPane.showMessageDialog(null, "Mã môn học không tồn tại!", "ERROR",
			// JOptionPane.ERROR_MESSAGE);
			// return null;
			// }
			return hoc;
		} catch (NumberFormatException x) {
			JOptionPane.showMessageDialog(null, "Mã sinh viên hoặc mã môn học không hợp lệ!", "ERROR",
					JOptionPane.ERROR_MESSAGE);
		}
		return null;
	}

	private void loadTable() {
		rowData = generateTable(); // Tao bang
		columnNames = generateColumns(); // Tao cot
		// Tao mo hinh bang co the update duoc bang mang String 2 chieu
		table.setModel(new AbstractTableModel() {
			private static final long serialVersionUID = -2779964935065445499L;

			public String getColumnName(int column) {
				return columnNames[column].toString();
			}

			public int getRowCount() {
				return rowData.length;
			}

			public int getColumnCount() {
				return columnNames.length;
			}

			public Object getValueAt(int row, int col) {
				return rowData[row][col];
			}

			public boolean isCellEditable(int row, int column) {
				return true;
			}

			public void setValueAt(Object value, int row, int col) {
				rowData[row][col] = (String) value;
				fireTableCellUpdated(row, col);
			}
		});
	}

	// Generate subject list as a String array
	private String[] generateColumns() {
		ArrayList<Subject> subjects = SubjectDAO.getInstance().selectALL();
		String[] col = new String[subjects.size() + 3]; // +3: Mã SV, Tên SV, 1 Spacing, Các môn đang học
		col[0] = "Mã Sinh Viên"; // Ma SV
		col[1] = "Tên Sinh Viên"; // Ten SV

		for (int i = 0; i < subjects.size(); i++) {
			col[i + 3] = subjects.get(i).getName(); // Cac mon hoc
		}
		return col;
	}

	// Generate score table as 2D String array
	private String[][] generateTable() {
		ArrayList<Subject> subjects = SubjectDAO.getInstance().selectALL();
		ArrayList<Sinhvien> sv = SinhvienDAO.getInstance().selectALL();
		String[][] table = new String[sv.size()][];

		for (int i = 0; i < table.length; i++) {
			table[i] = new String[subjects.size() + 3];
			table[i][0] = String.valueOf(sv.get(i).getId()); // Mã sinh viên
			table[i][1] = sv.get(i).getName(); // Tên sinh viên

			StringBuilder currentSubjects = new StringBuilder();
			for (int j = 0; j < subjects.size(); j++) {
				Hoc hoc = HocDAO.getInstance().selectByID(sv.get(i).getId(), subjects.get(j).getId());
				if (hoc != null) {
					table[i][j + 3] = String.format("%.2f", hoc.getScore());
					currentSubjects.append(subjects.get(j).getName()).append(", "); // Diem mon hoc
				} else {
					table[i][j + 3] = "";
				}
			}

			// Remove last comma
			if (currentSubjects.length() > 0) {
				currentSubjects.setLength(currentSubjects.length() - 2);
			}
			table[i][2] = currentSubjects.toString(); // Các môn đang học
		}
		return table;
	}

	public void startRefreshIntervals() {
		new Thread(() -> {
			while (!stopRefreshIntervals) {
				// Reload every refresh interval
				loadTable(); // This update table
				try {
					Thread.sleep(REFRESH_INTERVAL);
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
			}
		}).start(); // Start thread
	}

	@Override
	public void dispose() {
		stopRefreshIntervals = true; // stop refresh intervals when window is closed
		super.dispose();
	}

}
