package test;

import javax.swing.SwingUtilities;
import view.LogInView;
public class Main {
	
	public static void main(String[] args) {
		SwingUtilities.invokeLater(() -> new LogInView().setVisible(true));


	}
}
