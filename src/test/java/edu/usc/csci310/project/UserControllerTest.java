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

import java.util.List;
import java.util.Map;
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

    @Test
    void testGroup() {
        UserComparing UC = new UserComparing();
        UC.setUsername("NickoOG");
        UC.setUsernameQuery("NickoOG1");

        ResponseEntity mockResponse = ResponseEntity.ok("User added to group");
        when(userService.addUserToGroup(anyString(), anyString())).thenReturn(mockResponse);

        ResponseEntity<?> response = userController.addUserToGroup(UC);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("User added to group", response.getBody());

        verify(userService).addUserToGroup("NickoOG", "NickoOG1");
    }

    @Test
    void testCompareParks() {
        UserComparing UC = new UserComparing();
        UC.setUsername("NickoOG");
        UC.setUsernameQuery("NickoOG1");

        ResponseEntity mockResponse = ResponseEntity.ok("Parks compared");
        when(userService.compareParks(anyString())).thenReturn(mockResponse);

        ResponseEntity<?> response = userController.compareParks(UC);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Parks compared", response.getBody());

        verify(userService).compareParks("NickoOG");
    }

    @Test
    void testGetFavorites() {
        String username = "Alice";
        String[] expectedFavorites = {"park1", "park2", "park3"};

        ResponseEntity mockResponse = ResponseEntity.ok(Map.of("favorites", expectedFavorites));
        when(userService.getFavorites(username)).thenReturn(mockResponse);

        ResponseEntity<?> response = userController.getFavorites(username);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody() instanceof Map);
        @SuppressWarnings("unchecked")
        Map<String, String[]> body = (Map<String, String[]>) response.getBody();
        assertArrayEquals(expectedFavorites, body.get("favorites"));

        verify(userService).getFavorites(username);
    }

    @Test
    void testGetFavoritesSuggest() {
        String username = "Alice";
        String[] expectedFavorites = {"park1", "park2", "park3"};

        ResponseEntity mockResponse = ResponseEntity.ok(Map.of("favorites", expectedFavorites));
        when(userService.getFavoritesSuggest(username)).thenReturn(mockResponse);

        ResponseEntity<?> response = userController.getFavoritesSuggest(username);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody() instanceof Map);
        @SuppressWarnings("unchecked")
        Map<String, String[]> body = (Map<String, String[]>) response.getBody();
        assertArrayEquals(expectedFavorites, body.get("favorites"));

        verify(userService).getFavoritesSuggest(username);
    }

    @Test
    void testAddFavorite() {
        String username = "Alice";
        String parkId = "park1";

        ResponseEntity mockResponse = ResponseEntity.ok("Favorite added");
        when(userService.addFavorite(username, parkId)).thenReturn(mockResponse);

        ResponseEntity<?> response = userController.addFavorite(username, parkId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Favorite added", response.getBody());

        verify(userService).addFavorite(username, parkId);
    }

    @Test
    void testRemoveFavorite() {
        String username = "Alice";
        String parkId = "park1";

        ResponseEntity mockResponse = ResponseEntity.ok("Favorite removed");
        when(userService.removeFavorite(username, parkId)).thenReturn(mockResponse);

        ResponseEntity<?> response = userController.removeFavorite(username, parkId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Favorite removed", response.getBody());

        verify(userService).removeFavorite(username, parkId);
    }

    @Test
    void testClearFavorites() {
        String username = "Alice";

        ResponseEntity mockResponse = ResponseEntity.ok("Favorites cleared");
        when(userService.clearFavorites(username)).thenReturn(mockResponse);

        ResponseEntity<?> response = userController.clearFavorites(username);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Favorites cleared", response.getBody());

        verify(userService).clearFavorites(username);
    }

    @Test
    void testToggleFavoritesPrivacy() {
        String username = "Alice";

        ResponseEntity mockResponse = ResponseEntity.ok("Privacy toggled");
        when(userService.toggleFavoritesPrivacy(username)).thenReturn(mockResponse);

        ResponseEntity<?> response = userController.toggleFavoritesPrivacy(username);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Privacy toggled", response.getBody());

        verify(userService).toggleFavoritesPrivacy(username);
    }

//    @Test
//    void testSetRank() {
//        String username = "Alice";
//        String parkId = "park1";
//        int rank = 5;
//
//        ResponseEntity mockResponse = ResponseEntity.ok("Favorite added with rank successfully");
//        doNothing().when(userService).addFavoriteWithRank(username, parkId, rank);
//
//        ResponseEntity<?> response = userController.setRank(username, parkId, rank);
//
//        assertEquals(HttpStatus.OK, response.getStatusCode());
//        assertEquals("Favorite added with rank successfully", response.getBody());
//
//        verify(userService).addFavoriteWithRank(username, parkId, rank);
//    }

//    @Test
//    void testUpdateRank() {
//        String username = "Alice";
//        String parkId = "park2";
//        int newRank = 3;
//
//        ResponseEntity mockResponse = ResponseEntity.ok("Rank updated successfully");
//        doNothing().when(userService).updateFavoriteRank(username, parkId, newRank);
//
//        ResponseEntity<?> response = userController.updateRank(username, parkId, newRank);
//
//        assertEquals(HttpStatus.OK, response.getStatusCode());
//        assertEquals("Rank updated successfully", response.getBody());
//
//        verify(userService).updateFavoriteRank(username, parkId, newRank);
//    }

    @Test
    void testReorderFavorites() {
        String username = "Alice";
        List<String> newOrder = List.of("park3", "park1", "park2");

        ResponseEntity mockResponse = ResponseEntity.ok("Favorites reordered");
        when(userService.reorderFavorites(username, newOrder)).thenReturn(mockResponse);

        ResponseEntity<?> response = userController.reorderFavorites(username, newOrder);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Favorites reordered", response.getBody());

        verify(userService).reorderFavorites(username, newOrder);
    }

//    @Test
//    void testSetRankWithException() {
//        String username = "Alice";
//        String parkId = "park1";
//        int rank = 5;
//
//        // Simulate a runtime exception
//        doThrow(new RuntimeException("Invalid rank")).when(userService).addFavoriteWithRank(anyString(), anyString(), anyInt());
//
//        // Call the method which is expected to handle the exception
//        ResponseEntity<?> response = userController.setRank(username, parkId, rank);
//
//        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
//        assertEquals("Invalid rank", response.getBody());
//
//        verify(userService).addFavoriteWithRank(username, parkId, rank);
//    }
//
//    @Test
//    void testUpdateRankWithException() {
//        String username = "Alice";
//        String parkId = "park2";
//        int newRank = 3;
//
//        // Simulate a runtime exception
//        doThrow(new RuntimeException("Invalid update operation")).when(userService).updateFavoriteRank(anyString(), anyString(), anyInt());
//
//        // Call the method which is expected to handle the exception
//        ResponseEntity<?> response = userController.updateRank(username, parkId, newRank);
//
//        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
//        assertEquals("Invalid update operation", response.getBody());
//
//        verify(userService).updateFavoriteRank(username, parkId, newRank);
//    }





}
