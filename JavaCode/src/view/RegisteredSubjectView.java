package view;

import javax.swing.*;
import java.awt.*;
import java.util.ArrayList;
import java.util.List;
import java.util.TreeMap;

import controller.RegisterSubjectController;
import model.Subject;

public class RegisteredSubjectView extends RegisterSubjectView {
    private RegisterSubjectController controller = new RegisterSubjectController(); // Controller để tương tác với dữ liệu
    private String[] columnNames = {"STT", "Tên môn học", "Số tín chỉ"}; // Tên cột cho bảng

    public RegisteredSubjectView() {
        setTitle("Môn học đã đăng kí"); // Tiêu đề của cửa sổ
        setSize(800, 500); // Kích thước cửa sổ
        setLocationRelativeTo(null); // Đặt cửa sổ ở giữa màn hình
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE); // Đóng ứng dụng khi cửa sổ bị đóng
        setLayout(new BorderLayout()); // Sử dụng layout BorderLayout cho cửa sổ
    }

    public void renderAllRegisteredSubject(int sinhvienId) {
        JPanel tablePanel = new JPanel(); // Tạo panel chứa bảng
        tablePanel.setLayout(new BoxLayout(tablePanel, BoxLayout.Y_AXIS)); // Sử dụng BoxLayout theo chiều dọc

        // Header
        tablePanel.add(super.createHeaderRow(columnNames)); // Tạo và thêm hàng tiêu đề vào bảng

        // phần body của bảng
        // Lấy danh sách môn học đã đăng ký
        List<Subject> registeredSubjects = getRegisteredSubjects(sinhvienId);
        int stt = 1; // Số thứ tự cho hàng
        for (Subject subject : registeredSubjects) {
            JPanel row = new JPanel(new GridLayout(1, columnNames.length)); // Tạo panel cho mỗi hàng
            row.setOpaque(true); // Đặt background cho panel
            row.setBackground(Color.WHITE); // Màu nền hàng
            row.setBorder(BorderFactory.createMatteBorder(0, 0, 1, 0, Color.GRAY)); // Border dưới
            row.setMaximumSize(new Dimension(Integer.MAX_VALUE, 50)); // Chiều cao hàng cố định

            // Ô số thứ tự
            JLabel sttLabel = super.createCellLabel(String.valueOf(stt++), JLabel.CENTER); // Căn giữa

            // Ô tên môn
            JLabel nameLabel = super.createCellLabel(subject.getNameSubject(), JLabel.LEFT);

            // Ô số tín chỉ
            JLabel tcLabel = super.createCellLabel(String.valueOf(subject.getSoTC()), JLabel.CENTER); // Căn giữa

            // Thêm các ô vào hàng
            row.add(sttLabel);
            row.add(nameLabel);
            row.add(tcLabel);
            
            tablePanel.add(row); // Thêm hàng vào bảng
        }

        // Đặt wrapperPanel để giữ tablePanel không co lại
        JPanel wrapperPanel = new JPanel();
        wrapperPanel.setLayout(new BoxLayout(wrapperPanel, BoxLayout.Y_AXIS));
        wrapperPanel.add(tablePanel); // Thêm bảng vào wrapperPanel
        wrapperPanel.add(Box.createVerticalGlue()); // Thêm khoảng trống ở dưới cùng

        // JScrollPane với thanh cuộn dọc
        JScrollPane scrollPane = new JScrollPane(
            wrapperPanel, // Panel chứa bảng
            JScrollPane.VERTICAL_SCROLLBAR_AS_NEEDED, // Hiện thanh cuộn dọc khi cần
            JScrollPane.HORIZONTAL_SCROLLBAR_NEVER // Không hiện thanh cuộn ngang
        );
        add(scrollPane, BorderLayout.CENTER); // Thêm JScrollPane vào giữa cửa sổ
        
        // Panel để chứa các nút
        JPanel buttonPanel = new JPanel(); // Tạo panel cho nút
        JButton btnBack = new JButton("Quay lại đăng ký"); // Nút quay lại
        JButton btnViewFees = new JButton("Xem học phí"); // Nút xem học phí

        // Thêm sự kiện cho nút Quay lại đăng ký
        btnBack.addActionListener(e -> {
            dispose(); // Đóng cửa sổ hiện tại
        });

        // Thêm sự kiện cho nút Xem học phí
        btnViewFees.addActionListener(e -> {
            JOptionPane.showMessageDialog(this, 
                "Học phí phải đóng: " + calculateFees(registeredSubjects) + 
                "\nHọc phí đã đóng: 0\nCòn nợ: " + calculateFees(registeredSubjects));
        });

        // Thêm nút vào panel
        buttonPanel.add(btnBack);
        buttonPanel.add(btnViewFees);

        // Thêm panel chứa nút vào giao diện
        add(buttonPanel, BorderLayout.SOUTH); // Đặt panel nút ở phía dưới
        setVisible(true); // Hiện cửa sổ
    }
    
    // Lấy danh sách môn học đã đăng ký của sinh viên
    private List<Subject> getRegisteredSubjects(int sinhvienId) {
        TreeMap<Subject, Boolean> subjectsAndState = controller.getSubjectsAndState(sinhvienId); // Lấy danh sách môn học
        List<Subject> subjects = new ArrayList<>(); // Danh sách lưu các môn đã đăng ký
        subjectsAndState.forEach((key, value) -> {
            if (value == true) { // Nếu môn học đã được đăng ký
                subjects.add(key); // Thêm môn học vào danh sách
            }
        });
        return subjects; // Trả về danh sách môn học đã đăng ký
    }

    // Tính học phí tổng cho danh sách môn học
    private int calculateFees(List<Subject> subjects) {
        int totalFees = 0; // Biến lưu tổng học phí
        for (Subject subject : subjects) {
            totalFees += subject.getSoTC() * 700; // Tính học phí theo số tín chỉ
        }
        return totalFees; // Trả về tổng học phí
    }
}
