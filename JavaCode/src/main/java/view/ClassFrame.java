package view;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import dao.ClassDAOImpl;
import model.ClassModel;
import java.util.List;

public class ClassFrame extends JFrame {

    private JTextField teacherIdField;
    private JTextArea displayArea;
    private JButton showButton;

    public ClassFrame() {
        setTitle("Lớp học Giảng viên dạy");
        setSize(400, 300);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);

        teacherIdField = new JTextField(15);
        displayArea = new JTextArea(10, 30);
        displayArea.setEditable(false);
        showButton = new JButton("Hiển thị Lớp học");

        JPanel panel = new JPanel();
        panel.add(new JLabel("ID Giảng viên:"));
        panel.add(teacherIdField);
        panel.add(showButton);

        JPanel displayPanel = new JPanel();
        displayPanel.add(new JScrollPane(displayArea));

        setLayout(new BorderLayout());
        add(panel, BorderLayout.NORTH);
        add(displayPanel, BorderLayout.CENTER);

        showButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                showClasses();
            }
        });
    }

    private void showClasses() {
        String teacherId = teacherIdField.getText();
        ClassDAOImpl classDAO = new ClassDAOImpl();
        List<ClassModel> classes = classDAO.getClassesByTeacherId(teacherId);
        if (classes.isEmpty()) {
            displayArea.setText("Không tồn tại lớp học cho giảng viên này.");
        } else {
            displayArea.setText("");
            for (ClassModel classModel : classes) {
                displayArea.append(classModel.getNameClass() + "\n");
            }
        }
    }
}
