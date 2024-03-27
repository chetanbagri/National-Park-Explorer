package edu.usc.csci310.project;

import org.jacoco.agent.rt.internal_4742761.IExceptionLogger;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.http.HttpStatus;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class UserServiceTest {

    @Mock
    private UserRepository mockRepository;

    @Mock
    private BCryptPasswordEncoder mockEncoder;

    @InjectMocks
    private UserService userService;

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
    void testRegisterUserWithValidData() {
        when(mockRepository.findByUsername(anyString())).thenReturn(null);
        when(mockEncoder.encode(anyString())).thenReturn("hashedPassword");

        ResponseEntity<?> response = userService.registerUser("newUser", "ValidPassword1",  "ValidPassword1");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        // Maybe further assertions needed
    }

    @Test
    void testRegisterUserWithExistingUsername() {
        User existingUser = new User();
        existingUser.setUsername("existingUser");
        when(mockRepository.findByUsername("existingUser")).thenReturn(existingUser);

        ResponseEntity<?> response = userService.registerUser("existingUser", "ValidPassword1!", "ValidPassword1!");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("User already exists with this username", response.getBody());
    }

    @Test
    void testRegisterUserWithPasswordMissingUppercase() {
        when(mockRepository.findByUsername(anyString())).thenReturn(null);

        ResponseEntity<?> response = userService.registerUser("newUser", "validpassword1", "validpassword1");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Password must have one uppercase character", response.getBody());
    }

    @Test
    void testRegisterUserWithPasswordMissingLowercase() {
        when(mockRepository.findByUsername(anyString())).thenReturn(null);

        ResponseEntity<?> response = userService.registerUser("newUser", "VALIDPASSWORD1", "VALIDPASSWORD1");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Password must have one lowercase character", response.getBody());
    }

    @Test
    void testRegisterUserWithPasswordMissingNumber() {
        when(mockRepository.findByUsername(anyString())).thenReturn(null);

        ResponseEntity<?> response = userService.registerUser("newUser", "ValidPassword", "ValidPassword");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Password must have one numerical character", response.getBody());
    }

    @Test
    void testRegisterUserWithMismatchPasswords() {
        when(mockRepository.findByUsername(anyString())).thenReturn(null);

        ResponseEntity<?> response = userService.registerUser("newUser", "ValidPassword1", "InvalidPassword2");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Password and confirm password must match", response.getBody());
    }

    @Test
    void testLoginUserWithValidCredentials() {
        User user = new User();
        user.setUsername("user");
        user.setPassword("hashedPassword");
        user.setTime1(0L);
        user.setTime2(0L);
        user.setLockoutTime(0L);
        when(mockRepository.findByUsername("user")).thenReturn(user);
        when(mockEncoder.matches("ValidPassword1!", "hashedPassword")).thenReturn(true);

        ResponseEntity<?> response = userService.loginUser("user", "ValidPassword1!");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        // Additional assertions can be made here to verify the returned user details
    }

    @Test
    void testLoginUserWithInvalidUsername() {
        when(mockRepository.findByUsername("nonExistentUser")).thenReturn(null);

        ResponseEntity<?> response = userService.loginUser("nonExistentUser", "ValidPassword1!");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Username does not exist", response.getBody());
    }

    @Test
    void testLoginUserWithIncorrectPasswordFirstAttempt() {
        User user = new User();
        user.setUsername("user");
        user.setPassword("hashedPassword");
        user.setTime1(0L);
        user.setTime2(0L);
        user.setLockoutTime(0L);
        when(mockRepository.findByUsername("user")).thenReturn(user);
        when(mockEncoder.matches("InvalidPassword", "hashedPassword")).thenReturn(false);

        ResponseEntity<?> response = userService.loginUser("user", "InvalidPassword");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Incorrect password", response.getBody());
        // Verify that user.getTime1() is set to the current time
    }

    @Test
    void testLoginUserWithIncorrectPasswordSecondAttempt() {
        User user = new User();
        user.setUsername("user");
        user.setPassword("hashedPassword");
        user.setTime1(System.currentTimeMillis() - 10000); // Simulate a previous failed attempt 10 seconds ago
        user.setTime2(0L);
        user.setLockoutTime(0L);
        when(mockRepository.findByUsername("user")).thenReturn(user);
        when(mockEncoder.matches("InvalidPassword", "hashedPassword")).thenReturn(false);

        ResponseEntity<?> response = userService.loginUser("user", "InvalidPassword");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Incorrect password. One more and you may get locked out", response.getBody());
        // Verify that user.getTime2() is set to the current time
    }

    @Test
    void testLoginUserWithIncorrectPasswordOutside60() {
        User user = new User();
        user.setUsername("user");
        user.setPassword("hashedPassword");
        user.setTime1(System.currentTimeMillis() - 61000); // 61 seconds ago
        user.setTime2(System.currentTimeMillis() - 30000); // 30 seconds ago
        user.setLockoutTime(0L);

        when(mockRepository.findByUsername("user")).thenReturn(user);
        when(mockEncoder.matches("InvalidPassword", "hashedPassword")).thenReturn(false);

        ResponseEntity<?> response = userService.loginUser("user", "InvalidPassword");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Incorrect password. One more and you may get locked out", response.getBody());
    }


    @Test
    void testLoginUserWithIncorrectPasswordLockout() {
        User user = new User();
        user.setUsername("user");
        user.setPassword("hashedPassword");
        user.setTime1(System.currentTimeMillis() - 50000); // First failed attempt 50 seconds ago
        user.setTime2(System.currentTimeMillis() - 20000); // Second failed attempt 20 seconds ago
        user.setLockoutTime(0L);
        when(mockRepository.findByUsername("user")).thenReturn(user);
        when(mockEncoder.matches("InvalidPassword", "hashedPassword")).thenReturn(false);

        ResponseEntity<?> response = userService.loginUser("user", "InvalidPassword");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("You are locked out for 30 seconds!", response.getBody());
        // Verify that user.getLockoutTime() is set to the current time
    }

    @Test
    void testLoginUserDuringLockoutPeriod() {
        User lockedOutUser = new User();
        lockedOutUser.setUsername("lockedUser");
        lockedOutUser.setPassword("hashedPassword");
        lockedOutUser.setLockoutTime(System.currentTimeMillis() - 10000); // 10 seconds ago

        when(mockRepository.findByUsername("lockedUser")).thenReturn(lockedOutUser);

        ResponseEntity<?> response = userService.loginUser("lockedUser", "anyPassword");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("You have to wait 30 seconds before trying to log in again. Lockout timer has been reset", response.getBody());
    }


    @Test
    void testRemoveExistingUser() {
        User user = new User();
        user.setUsername("user");
        when(mockRepository.findByUsername("user")).thenReturn(user);
        doNothing().when(mockRepository).delete(any(User.class));

        ResponseEntity<?> response = userService.removeUser("user");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("User Deleted", response.getBody());
    }

    @Test
    void testRemoveNonExistentUser() {
        when(mockRepository.findByUsername("nonExistentUser")).thenReturn(null);

        ResponseEntity<?> response = userService.removeUser("nonExistentUser");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Username does not exist", response.getBody());
    }

    @Test
    void testGetUsername() {
        User user = new User();
        user.setUsername("TestUser");

        String result = user.getUsername();

        assertEquals("TestUser", result);
    }


}
