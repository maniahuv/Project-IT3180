package view;

import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import dao.DocumentDAOImpl;
import model.Document;
import java.util.List;

public class DocumentFrame extends JFrame {

    private JTextField teacherIdField;
    private JTextArea displayArea;
    private JButton showButton;

    public DocumentFrame() {
        setTitle("Tài liệu tham khảo Giảng viên");
        setSize(400, 300);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);

        teacherIdField = new JTextField(15);
        displayArea = new JTextArea(10, 30);
        displayArea.setEditable(false);
        showButton = new JButton("Hiển thị Tài liệu");

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
                showDocuments();
            }
        });
    }

    private void showDocuments() {
        String teacherId = teacherIdField.getText();
        DocumentDAOImpl documentDAO = new DocumentDAOImpl();
        List<Document> documents = documentDAO.getDocumentsByTeacherId(teacherId);
        if (documents.isEmpty()) {
            displayArea.setText("Không tồn tại tài liệu tham khảo cho giảng viên này.");
        } else {
            displayArea.setText("");
            for (Document document : documents) {
                displayArea.append(document.getNameDoc() + "\n");
            }
        }
    }
}
