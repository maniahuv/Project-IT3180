package view;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class MainFrame extends JFrame {

    private JButton teacherButton, classButton, documentButton;

    public MainFrame() {
        setTitle("Quản lý Giảng viên");
        setSize(600, 400);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);

        // Tạo các nút cho các chức năng
        teacherButton = new JButton("Hiển thị thông tin giảng viên");
        classButton = new JButton("Hiển thị Lớp học Giảng viên");
        documentButton = new JButton("Hiển thị Tài liệu tham khảo");

        // Đặt bố cục cho các nút
        JPanel panel = new JPanel(new GridLayout(3, 1, 10, 10));
        panel.add(teacherButton);
        panel.add(classButton);
        panel.add(documentButton);

        // Thêm panel vào JFrame
        add(panel, BorderLayout.CENTER);

        // Sự kiện cho nút Quản lý Giảng viên
        teacherButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                // Mở cửa sổ quản lý giảng viên
                new TeacherFrame().setVisible(true);
            }
        });

        // Sự kiện cho nút Hiển thị Lớp học
        classButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                // Mở cửa sổ hiển thị lớp học của giảng viên
                new ClassFrame().setVisible(true);
            }
        });

        // Sự kiện cho nút Hiển thị Tài liệu
        documentButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                // Mở cửa sổ hiển thị tài liệu tham khảo của giảng viên
                new DocumentFrame().setVisible(true);
            }
        });
    }

    public static void main(String[] args) {
        // Mở cửa sổ chính
        new MainFrame().setVisible(true);
    }
}
