package view;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ItemEvent;
import java.util.ArrayList;
import java.util.List;
import java.util.TreeMap;

import controller.RegisterSubjectController;
import model.Subject;

public class RegisterSubjectView extends JFrame {
    private RegisterSubjectController controller = new RegisterSubjectController(); // Controller để quản lý các môn học
    private int sinhvienId = 1; // ID của sinh viên

    private List<JCheckBox> checkBoxList = new ArrayList<>(); // Danh sách checkbox để chọn môn
    private List<JPanel> rowPanels = new ArrayList<>(); // Danh sách panel cho từng hàng
    private TreeMap<Subject, Boolean> subjectList = new TreeMap<>(); // Danh sách môn học và trạng thái đăng ký
    private int height = 50; // Chiều cao cố định cho hàng
    private String[] columnNames = {"STT", "Chọn", "Tên môn học", "Số tín chỉ"}; // Tên cột cho bảng

    public RegisterSubjectView() {
        setTitle("Đăng ký môn học"); // Tiêu đề của cửa sổ
        setSize(800, 500); // Kích thước cửa sổ
        setLocationRelativeTo(null); // Đặt cửa sổ ở giữa màn hình
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE); // Đóng ứng dụng khi cửa sổ bị đóng
        setLayout(new BorderLayout()); // Sử dụng layout BorderLayout cho cửa sổ
    }

    public void renderAllSubjects() {
        JPanel tablePanel = new JPanel(); // Tạo panel chứa bảng
        tablePanel.setLayout(new BoxLayout(tablePanel, BoxLayout.Y_AXIS)); // Sử dụng BoxLayout theo chiều dọc

        // Header
        tablePanel.add(createHeaderRow(columnNames)); // Tạo và thêm hàng tiêu đề vào bảng

        // Body của bảng
        subjectList = controller.getSubjectsAndState(sinhvienId); // Lấy danh sách môn học và trạng thái
        int stt = 1; // Số thứ tự cho hàng
        for (Subject subject : subjectList.keySet()) {
            boolean state = subjectList.get(subject); // Trạng thái của môn học
            JPanel row = new JPanel(new GridLayout(1, columnNames.length)); // Tạo panel cho mỗi hàng
            row.setOpaque(true); // Đặt background cho panel
            row.setBackground(state ? new Color(200, 255, 200) : Color.WHITE); // Màu nền hàng
            row.setBorder(BorderFactory.createMatteBorder(0, 0, 1, 0, Color.GRAY)); // Border dưới
            row.setMaximumSize(new Dimension(Integer.MAX_VALUE, height)); // Chiều cao cố định

            // Ô số thứ tự
            JLabel sttLabel = createCellLabel(String.valueOf(stt++), JLabel.CENTER); // Tạo ô số thứ tự

            // Ô checkbox
            JCheckBox checkBox = new JCheckBox(); // Tạo checkbox cho việc chọn môn
            JPanel checkboxPanel = new JPanel(new GridBagLayout()); // Tạo panel cho checkbox
            checkBox.setSelected(state); // Đặt trạng thái của checkbox
            checkboxPanel.setOpaque(false); // Đặt panel checkbox trong suốt
            checkboxPanel.add(checkBox); // Thêm checkbox vào panel
            checkboxPanel.setBorder(BorderFactory.createMatteBorder(0, 1, 0, 1, Color.GRAY)); // Border trái phải

            // Ô tên môn học
            JLabel nameLabel = createCellLabel(subject.getNameSubject(), JLabel.LEFT); // Tạo ô tên môn

            // Ô số tín chỉ
            JLabel tcLabel = createCellLabel(String.valueOf(subject.getSoTC()), JLabel.CENTER); // Tạo ô số tín chỉ

            int subjectId = subject.getIdSubject(); // Lấy ID môn học
            checkBox.addItemListener(e -> { // Thêm sự kiện cho checkbox
                if (e.getStateChange() == ItemEvent.SELECTED) { // Nếu checkbox được chọn
                    controller.registerSubjects(sinhvienId, subjectId); // Đăng ký môn học
                    row.setBackground(new Color(200, 255, 200)); // Đổi màu hàng
                } else { // Nếu checkbox không được chọn
                    controller.unRegisterSubjects(sinhvienId, subjectId); // Hủy đăng ký môn học
                    row.setBackground(Color.WHITE); // Đổi lại màu hàng
                }
            });

            // Thêm các ô vào hàng
            row.add(sttLabel);
            row.add(checkboxPanel);
            row.add(nameLabel);
            row.add(tcLabel);

            tablePanel.add(row); // Thêm hàng vào bảng
            checkBoxList.add(checkBox); // Thêm checkbox vào danh sách
            rowPanels.add(row); // Thêm hàng vào danh sách panel hàng
        }

        // Đặt wrapperPanel để giữ tablePanel không co lại
        JPanel wrapperPanel = new JPanel(); // Tạo panel wrapper
        wrapperPanel.setLayout(new BoxLayout(wrapperPanel, BoxLayout.Y_AXIS)); // Sử dụng BoxLayout theo chiều dọc
        wrapperPanel.add(tablePanel); // Thêm bảng vào wrapperPanel
        wrapperPanel.add(Box.createVerticalGlue()); // Thêm khoảng trống ở dưới cùng

        // JScrollPane với thanh cuộn dọc
        JScrollPane scrollPane = new JScrollPane(
            wrapperPanel, // Panel chứa bảng
            JScrollPane.VERTICAL_SCROLLBAR_AS_NEEDED, // Hiện thanh cuộn dọc khi cần
            JScrollPane.HORIZONTAL_SCROLLBAR_NEVER // Không hiện thanh cuộn ngang
        );

        add(scrollPane, BorderLayout.CENTER); // Thêm JScrollPane vào giữa cửa sổ

        // Nút dưới cùng
        JPanel btnPanel = new JPanel(new FlowLayout(FlowLayout.CENTER)); // Tạo panel cho nút
        JButton btnNext = new JButton("Xem môn đã đăng ký"); // Nút xem môn đã đăng ký
        JButton btnExit = new JButton("Thoát"); // Nút thoát

        // Thêm sự kiện cho nút Xem môn đã đăng ký
        btnNext.addActionListener(e -> {
            RegisteredSubjectView registeredSubjectView = new RegisteredSubjectView(); // Tạo cửa sổ xem môn đã đăng ký
            registeredSubjectView.renderAllRegisteredSubject(sinhvienId); // Gọi phương thức render cho cửa sổ mới
        });

        // Thêm sự kiện cho nút Thoát
        btnExit.addActionListener(e -> dispose()); // Đóng cửa sổ hiện tại

        // Thêm nút vào panel
        btnPanel.add(btnNext);
        btnPanel.add(btnExit);
        add(btnPanel, BorderLayout.SOUTH); // Đặt panel nút ở phía dưới
        setVisible(true); // Hiện cửa sổ
    }

    // Tạo hàng tiêu đề cho bảng
    public JPanel createHeaderRow(String[] columnNames) {
        JPanel headerRow = new JPanel(new GridLayout(1, columnNames.length)); // Tạo panel cho hàng tiêu đề
        headerRow.setBackground(new Color(172, 23, 28)); // Màu nền hàng tiêu đề
        headerRow.setBorder(BorderFactory.createMatteBorder(1, 1, 1, 1, Color.GRAY)); // Border xung quanh
        headerRow.setMaximumSize(new Dimension(Integer.MAX_VALUE, height)); // Chiều cao header cố định

        for (String name : columnNames) { // Duyệt qua tên cột
            headerRow.add(createHeaderLabel(name)); // Tạo và thêm label cho mỗi tên cột
        }

        return headerRow; // Trả về hàng tiêu đề
    }

    // Tạo label cho tiêu đề
    public JLabel createHeaderLabel(String text) {
        JLabel label = new JLabel(text, JLabel.CENTER); // Tạo label căn giữa
        label.setForeground(Color.WHITE); // Màu chữ trắng
        label.setFont(label.getFont().deriveFont(Font.BOLD)); // Đặt font chữ đậm
        label.setOpaque(true); // Bật độ trong suốt
        label.setBackground(new Color(172, 23, 28)); // Màu nền cho tiêu đề
        label.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createMatteBorder(0, 0, 0, 1, Color.GRAY), // Border phải
                BorderFactory.createEmptyBorder(10, 10, 10, 10) // Padding 10px
        ));
        return label; // Trả về label tiêu đề
    }

    // Tạo label cho các ô trong bảng
    public JLabel createCellLabel(String text, int alignment) {
        JLabel label = new JLabel(text, alignment); // Tạo label với văn bản và căn chỉnh
        label.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createMatteBorder(0, 0, 0, 1, Color.GRAY), // Border phải
            BorderFactory.createEmptyBorder(10, 10, 10, 10) // Padding 10px
        ));
        return label; // Trả về label ô
    }
}
