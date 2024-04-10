package edu.usc.csci310.project;

import org.junit.jupiter.api.Test;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.Mockito.when;

class UserTest {
    @Test
    void setGetFavorites() {

        User user = new User();
        List<String> expectedFavorites = new ArrayList<>();
        expectedFavorites.add("park1");
        expectedFavorites.add("park2");

        user.setFavorites(expectedFavorites);
        List<String> actualFavorites = user.getFavorites();

        Assertions.assertEquals(expectedFavorites, actualFavorites);
    }

}