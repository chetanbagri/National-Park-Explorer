package edu.usc.csci310.project;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class UserComparingTest {
    @Test
    void testSetAndGetUsername() {
        UserComparing user = new UserComparing();
        user.setUsername("TestUser");

        String result = user.getUsername();

        assertEquals("TestUser", result);
    }

    @Test
    void testSetAndGetUsernameQuery() {
        UserComparing user = new UserComparing();
        user.setUsernameQuery("TestUserQuery");

        String result = user.getUsernameQuery();

        assertEquals("TestUserQuery", result);
    }
}
