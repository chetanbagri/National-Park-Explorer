//package edu.usc.csci310.project;
//
//import org.junit.jupiter.api.Test;
//
//import org.junit.jupiter.api.Assertions;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//
//import java.util.ArrayList;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//
//import static org.junit.jupiter.api.Assertions.*;
//import static org.mockito.Mockito.when;
//
//class UserTest {
//
//    private User user;
//
//    @BeforeEach
//    void setUp() {
//        user = new User();
////        HashMap<String, Integer> ranks = new HashMap<>();
////        ranks.put("Yosemite", 1);
////        ranks.put("Zion", 2);
////        user.setFavoriteRanks(ranks);
//    }
//
////    @Test
////    void testUpdateFavoriteRank() {
////        user.updateFavoriteRank("Yosemite", 3);
////        assertEquals(3, user.getFavoriteRanks().get("Yosemite"), "Updating existing park rank should change its value.");
////        user.updateFavoriteRank("Grand Canyon", 5);
////        assertEquals(5, user.getFavoriteRanks().get("Grand Canyon"), "Adding a new park rank should store the value correctly.");
////    }
////
////    @Test
////    void testRemoveFavoriteRank() {
////        user.removeFavoriteRank("Zion");
////        assertFalse(user.getFavoriteRanks().containsKey("Zion"), "Removing a park should delete its entry from ranks.");
////        assertNull(user.getFavoriteRanks().get("Zion"), "Accessing a removed park should return null.");
////    }
//
//    @Test
//    void testPrivacySettings() {
//        user.setFavPrivate(false);
//        assertFalse(user.isFavPrivate(), "setFavPrivate should correctly update the privacy setting.");
//        user.setFavPrivate(true);
//        assertTrue(user.isFavPrivate(), "setFavPrivate should correctly revert the privacy setting.");
//    }
//    @Test
//    void setGetFavorites() {
//
//        User user = new User();
//        List<String> expectedFavorites = new ArrayList<>();
//        expectedFavorites.add("park1");
//        expectedFavorites.add("park2");
//
//        user.setFavorites(expectedFavorites);
//        List<String> actualFavorites = user.getFavorites();
//
//        assertEquals(expectedFavorites, actualFavorites);
//    }
//
//
//
//}