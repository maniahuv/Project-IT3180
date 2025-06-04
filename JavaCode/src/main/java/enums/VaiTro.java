package enums;

public enum VaiTro {
    TO_TRUONG(1, "TO_TRUONG"),
    TO_PHO(2, "TO_PHO"),
    KE_TOAN(3, "KE_TOAN");

    private final int value;
    private final String roleName;

    VaiTro(int value, String roleName) {
        this.value = value;
        this.roleName = roleName;
    }

    public int getValue() {
        return value;
    }

    public String getRoleName() {
        return roleName;
    }

    public static VaiTro fromValue(int value) {
        for (VaiTro v : values()) {
            if (v.getValue() == value) return v;
        }
        throw new IllegalArgumentException("Invalid role value: " + value);
    }
}
