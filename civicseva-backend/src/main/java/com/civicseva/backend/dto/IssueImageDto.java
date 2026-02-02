package com.civicseva.backend.dto;

public class IssueImageDto {

    private String url;
    private String caption;

    // Constructors
    public IssueImageDto() {}

    public IssueImageDto(String url, String caption) {
        this.url = url;
        this.caption = caption;
    }

    // Getters and Setters
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getCaption() { return caption; }
    public void setCaption(String caption) { this.caption = caption; }
}
