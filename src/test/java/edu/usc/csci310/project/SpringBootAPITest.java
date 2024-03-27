package edu.usc.csci310.project;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertEquals;


@ExtendWith(MockitoExtension.class)
@SpringBootTest
class SpringBootAPITest {

    @InjectMocks
    private SpringBootAPI springBootAPI;


    @Test
    void testMain() {

        String[] args = {};

        try (MockedStatic<SpringApplication> mockSpringApplication = Mockito.mockStatic(SpringApplication.class))
        {
            SpringBootAPI.main(args);
            mockSpringApplication.verify(() -> SpringApplication.run(SpringBootAPI.class, args));
        }
    }

    @Test
    void testRedirect() {
        SpringBootAPI springBootAPI = new SpringBootAPI();

        String result = springBootAPI.redirect();

        assertEquals("forward:/", result);
    }
}