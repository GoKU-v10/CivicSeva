package com.civicseva.backend.model;

public enum IssueCategory {
    POTHOLE("Pothole"),
    GRAFFITI("Graffiti"),
    STREETLIGHT_OUTAGE("Streetlight Outage"),
    WASTE_MANAGEMENT("Waste Management"),
    DAMAGED_SIGN("Damaged Sign"),
    WATER_LEAK("Water Leak"),
    OTHER("Other");

    private final String displayName;

    IssueCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static IssueCategory fromDisplayName(String displayName) {
        for (IssueCategory category : IssueCategory.values()) {
            if (category.displayName.equals(displayName)) {
                return category;
            }
        }
        throw new IllegalArgumentException("Unknown category: " + displayName);
    }
}
