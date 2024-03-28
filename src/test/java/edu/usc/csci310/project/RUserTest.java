package edu.usc.csci310.project;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

class RUserTest {

    @Test
    void testSetAndGetUsername() {
        RUser user = new RUser();
        user.setUsername("TestUser");

        String result = user.getUsername();

        assertEquals("TestUser", result);
    }

    @Test
    void testSetAndGetPassword() {
        RUser user = new RUser();
        user.setPassword("TestPassword");

        String result = user.getPassword();

        assertEquals("TestPassword", result);
    }

    @Test
    void testSetAndGetConfirmPassword() {
        RUser user = new RUser();
        user.setConfirmPassword("TestConfirmPassword");

        String result = user.getConfirmPassword();

        assertEquals("TestConfirmPassword", result);
    }
}
