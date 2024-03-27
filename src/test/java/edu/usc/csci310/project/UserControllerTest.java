package edu.usc.csci310.project;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    private AutoCloseable closeable;


    @BeforeEach
    void setUp() {
        closeable = MockitoAnnotations.openMocks(this);
    }

    @AfterEach
    void tearDown() throws Exception{
        closeable.close();
    }

    @Test
    void testRegisterUser() {
        RUser rUser = new RUser();
        rUser.setUsername("Alice");
        rUser.setPassword("Password123");
        rUser.setConfirmPassword("Password123");

        ResponseEntity mockResponse = ResponseEntity.ok("User Registered");
        when(userService.registerUser(anyString(), anyString(), anyString())).thenReturn(mockResponse);

        ResponseEntity<?> response = userController.registerUser(rUser);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("User Registered", response.getBody());

        verify(userService).registerUser("Alice", "Password123", "Password123");
    }

    @Test
    void testLoginUser() {
        User user = new User();
        user.setUsername("Alice");
        user.setPassword("Password123");

        ResponseEntity mockResponse = ResponseEntity.ok("User Logged In");
        when(userService.loginUser(anyString(), anyString())).thenReturn(mockResponse);

        ResponseEntity<?> response = userController.loginUser(user);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("User Logged In", response.getBody());

        verify(userService).loginUser("Alice", "Password123");
    }
}
