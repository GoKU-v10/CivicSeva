package com.civicseva.backend.controller;

import com.civicseva.backend.dto.CreateIssueDto;
import com.civicseva.backend.service.IssueService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(IssueController.class)
public class IssueControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private IssueService issueService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testGetAllIssues() throws Exception {
        mockMvc.perform(get("/issues"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }

    @Test
    public void testCreateIssue() throws Exception {
        CreateIssueDto createIssueDto = new CreateIssueDto();
        createIssueDto.setTitle("Test Issue");
        createIssueDto.setDescription("This is a test issue description");
        createIssueDto.setLatitude(40.7128);
        createIssueDto.setLongitude(-74.0060);
        createIssueDto.setAddress("Test Address");
        createIssueDto.setCategory("Pothole");

        mockMvc.perform(post("/issues")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createIssueDto)))
                .andExpect(status().isCreated());
    }
}
