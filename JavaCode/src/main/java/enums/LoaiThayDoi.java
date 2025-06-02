package enums;

public enum LoaiThayDoi {
    CREATE(1), UPDATE(2), DELETE(3);

    private final int value;

    LoaiThayDoi(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}