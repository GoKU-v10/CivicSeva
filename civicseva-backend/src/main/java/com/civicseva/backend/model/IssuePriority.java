package com.civicseva.backend.model;

public enum IssuePriority {
    LOW("Low"),
    MEDIUM("Medium"),
    HIGH("High");

    private final String displayName;

    IssuePriority(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static IssuePriority fromDisplayName(String displayName) {
        for (IssuePriority priority : IssuePriority.values()) {
            if (priority.displayName.equals(displayName)) {
                return priority;
            }
        }
        throw new IllegalArgumentException("Unknown priority: " + displayName);
    }
}
