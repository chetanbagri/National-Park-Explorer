package edu.usc.csci310.project;

import com.google.gson.Gson;
import org.jasypt.encryption.pbe.StandardPBEStringEncryptor;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.http.HttpStatus;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.*;

class UserServiceTest {

    @Mock
    private UserRepository mockRepository;

    @Mock
    private BCryptPasswordEncoder mockEncoder;

    @Mock
    private StandardPBEStringEncryptor mockEncryptor;

    @InjectMocks
    private UserService userService;


    private AutoCloseable closeable;

    private static final Gson gson = new Gson();

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
        String username = "newUser";
        String password = "Validpassword1";
        String confirmPassword = "Validpassword1";
        String encryptedUsername = mockEncryptor.encrypt(username);

        when(mockRepository.findByUsername(encryptedUsername)).thenReturn(new User());

        ResponseEntity<?> response = userService.registerUser(username, password, confirmPassword);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Username exists", response.getBody());
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
    void testRegisterUserWithMissingPassword() {
        when(mockRepository.findByUsername(anyString())).thenReturn(null);

        ResponseEntity<?> response = userService.registerUser("newUser", "", "InvalidPassword2");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Password field cannot be empty", response.getBody());
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
        user.setUsername(mockEncryptor.encrypt("user"));
        user.setPassword("hashedPassword");
        user.setTime1(0L);
        user.setTime2(0L);
        user.setLockoutTime(0L);
        when(mockRepository.findByUsername(mockEncryptor.encrypt("user"))).thenReturn(user);
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
        user.setUsername(mockEncryptor.encrypt("user"));
        user.setPassword("hashedPassword");
        user.setTime1(0L);
        user.setTime2(0L);
        user.setLockoutTime(0L);
        when(mockRepository.findByUsername(mockEncryptor.encrypt("user"))).thenReturn(user);
        when(mockEncoder.matches("InvalidPassword", "hashedPassword")).thenReturn(false);

        ResponseEntity<?> response = userService.loginUser("user", "InvalidPassword");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Incorrect password", response.getBody());
        // Verify that user.getTime1() is set to the current time
    }

    @Test
    void testLoginUserWithIncorrectPasswordSecondAttempt() {
        User user = new User();
        user.setUsername(mockEncryptor.encrypt("user"));
        user.setPassword("hashedPassword");
        user.setTime1(System.currentTimeMillis() - 10000); // Simulate a previous failed attempt 10 seconds ago
        user.setTime2(0L);
        user.setLockoutTime(0L);
        when(mockRepository.findByUsername(mockEncryptor.encrypt("user"))).thenReturn(user);
        when(mockEncoder.matches("InvalidPassword", "hashedPassword")).thenReturn(false);

        ResponseEntity<?> response = userService.loginUser("user", "InvalidPassword");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("One more fail may lockout", response.getBody());
        // Verify that user.getTime2() is set to the current time
    }

    @Test
    void testLoginUserWithIncorrectPasswordOutside60() {
        User user = new User();
        user.setUsername(mockEncryptor.encrypt("user"));
        user.setPassword("hashedPassword");
        user.setTime1(System.currentTimeMillis() - 61000); // 61 seconds ago
        user.setTime2(System.currentTimeMillis() - 30000); // 30 seconds ago
        user.setLockoutTime(0L);

        when(mockRepository.findByUsername(mockEncryptor.encrypt("user"))).thenReturn(user);
        when(mockEncoder.matches("InvalidPassword", "hashedPassword")).thenReturn(false);

        ResponseEntity<?> response = userService.loginUser("user", "InvalidPassword");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("One more fail may lockout", response.getBody());
    }


    @Test
    void testLoginUserWithIncorrectPasswordLockout() {
        User user = new User();
        user.setUsername(mockEncryptor.encrypt("user"));
        user.setPassword("hashedPassword");
        user.setTime1(System.currentTimeMillis() - 50000); // First failed attempt 50 seconds ago
        user.setTime2(System.currentTimeMillis() - 20000); // Second failed attempt 20 seconds ago
        user.setLockoutTime(0L);
        when(mockRepository.findByUsername(mockEncryptor.encrypt("user"))).thenReturn(user);
        when(mockEncoder.matches("InvalidPassword", "hashedPassword")).thenReturn(false);

        ResponseEntity<?> response = userService.loginUser("user", "InvalidPassword");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("You are locked out for 30 seconds", response.getBody());
        // Verify that user.getLockoutTime() is set to the current time
    }

    @Test
    void testLoginUserDuringLockoutPeriod() {
        User lockedOutUser = new User();
        lockedOutUser.setUsername(mockEncryptor.encrypt("lockedUser"));
        lockedOutUser.setPassword("hashedPassword");
        lockedOutUser.setLockoutTime(System.currentTimeMillis() - 10000); // 10 seconds ago

        when(mockRepository.findByUsername(mockEncryptor.encrypt("lockedUser"))).thenReturn(lockedOutUser);

        ResponseEntity<?> response = userService.loginUser("lockedUser", "anyPassword");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Wait 30 seconds!", response.getBody());
    }


    @Test
    void testRemoveExistingUser() {
        User user = new User();
        user.setUsername(mockEncryptor.encrypt("user"));
        when(mockRepository.findByUsername(mockEncryptor.encrypt("user"))).thenReturn(user);
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

    @Test
    void testAddUserToGroup() {
        User user = new User();
        User userB = new User();
        user.setUsername("NickoOG");
        userB.setUsername("EncryptedNickoOG1");
        when(mockRepository.findByUsername("NickoOG")).thenReturn(user);
        when(mockRepository.findByUsername("EncryptedNickoOG1")).thenReturn(userB);
        when(mockEncryptor.encrypt("NickoOG1")).thenReturn("EncryptedNickoOG1");

        ResponseEntity<?> response = userService.addUserToGroup("NickoOG", "NickoOG1");
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }
    @Test
    void testTwoNullUser() {
        when(mockRepository.findByUsername("NickoOG")).thenReturn(null);
        when(mockRepository.findByUsername("NickoOG1")).thenReturn(null);

        ResponseEntity<?> response = userService.addUserToGroup("NickoOG", "NickoOG1");
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Username does not exist", response.getBody());
    }

    @Test
    void testNullUserA() {
        User userB = new User();
        userB.setUsername("NickoOG1");
        when(mockRepository.findByUsername("NickoOG")).thenReturn(null);
        when(mockRepository.findByUsername("NickoOG1")).thenReturn(userB);

        ResponseEntity<?> response = userService.addUserToGroup("NickoOG", "NickoOG1");
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Username does not exist", response.getBody());
    }

    @Test
    void testNullUserB() {
        User user = new User();
        user.setUsername("NickoOG");
        when(mockRepository.findByUsername("NickoOG")).thenReturn(user);
        when(mockRepository.findByUsername("NickoOG1")).thenReturn(null);

        ResponseEntity<?> response = userService.addUserToGroup("NickoOG", "NickoOG1");
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Username does not exist", response.getBody());
    }

    @Test
    void testAddItSelfToGroup() {
        User user = new User();
        user.setUsername("NickoOG");
        when(mockEncryptor.encrypt("NickoOG")).thenReturn("NickoOG");
        when(mockRepository.findByUsername("NickoOG")).thenReturn(user);

        ResponseEntity<?> response = userService.addUserToGroup("NickoOG", "NickoOG");
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Cannot add yourself to your own friend group", response.getBody());
    }

    @Test
    void testAddDuplicateToGroup() {
        User user = new User();
        User userB = new User();
        user.setUsername("NickoOG");
        userB.setUsername("EncryptedNickoOG2");
        when(mockRepository.findByUsername("NickoOG")).thenReturn(user);

        when(mockEncryptor.encrypt("NickoOG2")).thenReturn("EncryptedNickoOG2");
        when(mockRepository.findByUsername("EncryptedNickoOG2")).thenReturn(userB);

        ResponseEntity<?> response = userService.addUserToGroup("NickoOG", "NickoOG2");
        assertEquals(HttpStatus.OK, response.getStatusCode());

        response = userService.addUserToGroup("NickoOG", "NickoOG2");
        assertEquals("Username is already in your friend group", response.getBody());
    }

    @Test
    void testNullUsernameCompare() {
        User user = null;
        when(mockRepository.findByUsername("NickoOG")).thenReturn(null);

        ResponseEntity<?> response = userService.compareParks("NickoOG");
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Username does not exist", response.getBody());
    }

    @Test
    void testNoFriendsToCompare() {
        User user = new User();
        user.setUsername("NickoOG_comp_tmp_no_friend");
        when(mockRepository.findByUsername("NickoOG_comp_tmp_no_friend")).thenReturn(user);
        userService.registerUser("NickoOG_comp_tmp_no_friend", "Happy1", "Happy1");

        ResponseEntity<?> response = userService.compareParks("NickoOG_comp_tmp_no_friend");
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("You have no friends in your group to compare parks with", response.getBody());
    }

    @Test
    void testSuccessfulCompareNoFavorites() {
        User user = new User();
        User userB = new User();
        user.setUsername("NickoOG_comp_tmp");
        userB.setUsername("NickoOG_comp_tmp_friend");
        when(mockRepository.findByUsername("NickoOG_comp_tmp")).thenReturn(user);
        when(mockRepository.findByUsername("NickoOG_comp_tmp_friend")).thenReturn(userB);
        when(mockEncryptor.encrypt("NickoOG_comp_tmp")).thenReturn("NickoOG_comp_tmp");
        when(mockEncryptor.encrypt("NickoOG_comp_tmp_friend")).thenReturn("NickoOG_comp_tmp_friend");

        userService.registerUser("NickoOG_comp_tmp", "Happy1", "Happy1");
        userService.registerUser("NickoOG_comp_tmp_friend", "Happy1", "Happy1");
        userService.addUserToGroup("NickoOG_comp_tmp", "NickoOG_comp_tmp_friend");
        ResponseEntity<?> response = userService.compareParks("NickoOG_comp_tmp");
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

//    @Test
//    void testSuccessfulCompare() {
//        String u1 = "NickoOG_comp_tmp";
//        String u2 = "NickoOG_comp_tmp_friend";
//        List<String> favs = new ArrayList<>();
//        List<String> favs2 = new ArrayList<>();
//        favs.add("CAT");
//        favs.add("DOG");
//        favs2.add("DOG");
//        favs2.add("PIG");
//        User user = new User();
//        User userB = new User();
//        user.setUsername(u1);
//        user.setFavorites(favs);
//        userB.setUsername(u2);
//        userB.setFavorites(favs2);
//        when(mockRepository.findByUsername(u1)).thenReturn(user);
//        when(mockRepository.findByUsername(u2)).thenReturn(userB);
//
//        userService.registerUser(u1, "Happy1", "Happy1");
//        userService.registerUser(u2, "Happy1", "Happy1");
//        userService.addUserToGroup(u1, u2);
//        ResponseEntity<?> response = userService.compareParks(u1);
//        assertEquals(HttpStatus.OK, response.getStatusCode());
//
//        // Cleanup
//        userService.removeUser(u1);
//        userService.removeUser(u2);
//    }

    @Test
    void testGetFavorites() {
        User user = new User();
        user.setUsername("testUser");
        List<String> favorites = new ArrayList<>();
        favorites.add("park1");
        favorites.add("park2");
        String jsonFavorites = gson.toJson(favorites);
        String encryptedFavorites = "encryptedFavoritesString";
        user.setFavorites(encryptedFavorites);

        when(mockRepository.findByUsername("testUser")).thenReturn(user);
        when(mockEncryptor.encrypt(jsonFavorites)).thenReturn(encryptedFavorites);
        when(mockEncryptor.decrypt(encryptedFavorites)).thenReturn(jsonFavorites);

        ResponseEntity<?> response = userService.getFavorites("testUser");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        FavoritesResponse favoritesResponse = (FavoritesResponse) response.getBody();
        assertNotNull(favoritesResponse);
        assertEquals(favorites, favoritesResponse.getFavorites());
    }

    @Test
    public void testGetFavoritesWhenFavoritesStringIsNull() {
        User user = new User();
        user.setUsername("testUser");
        user.setFavorites(null);

        when(mockRepository.findByUsername("testUser")).thenReturn(user);

        ResponseEntity<?> response = userService.getFavorites("testUser");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        FavoritesResponse favoritesResponse = (FavoritesResponse) response.getBody();
        assertTrue(favoritesResponse.getFavorites().isEmpty());
    }

    @Test
    public void testGetFavoritesWhenFavoritesStringIsEmpty() {
        User user = new User();
        user.setUsername("testUser");
        user.setFavorites("");

        when(mockRepository.findByUsername("testUser")).thenReturn(user);

        ResponseEntity<?> response = userService.getFavorites("testUser");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        FavoritesResponse favoritesResponse = (FavoritesResponse) response.getBody();
        assertTrue(favoritesResponse.getFavorites().isEmpty());
    }
//    @Test
//    void testGetFavoritesForNonExistentUser() {
//        when(mockRepository.findByUsername("nonExistentUser")).thenReturn(null);
//
//        ResponseEntity<?> response = userService.getFavorites("nonExistentUser");
//
//        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
//        assertEquals("User not found", response.getBody());
//    }
//


    @Test
    void testAddFavorite() {
        User user = new User();
        user.setUsername("testUser");
        List<String> favorites = new ArrayList<>();
        favorites.add("park1");
        String jsonFavorites = gson.toJson(favorites);
        String encryptedFavorites = "encryptedFavoritesString";
        user.setFavorites(encryptedFavorites);

        when(mockRepository.findByUsername("testUser")).thenReturn(user);
        when(mockEncryptor.encrypt(jsonFavorites)).thenReturn(encryptedFavorites);
        when(mockEncryptor.decrypt(encryptedFavorites)).thenReturn(jsonFavorites);

        ResponseEntity<?> response = userService.addFavorite("testUser", "park2");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        FavoritesResponse favoritesResponse = (FavoritesResponse) response.getBody();
        assertNotNull(favoritesResponse);
        assertEquals(2, favoritesResponse.getFavorites().size());
        assertTrue(favoritesResponse.getFavorites().contains("park1"));
        assertTrue(favoritesResponse.getFavorites().contains("park2"));
    }

    @Test
    public void testAddFavoriteWhenFavoritesStringIsNull() {
        User user = new User();
        user.setUsername("testUser");
        user.setFavorites(null);

        when(mockRepository.findByUsername("testUser")).thenReturn(user);

        ResponseEntity<?> response = userService.addFavorite("testUser", "park1");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        FavoritesResponse favoritesResponse = (FavoritesResponse) response.getBody();
        assertNotNull(favoritesResponse);
        assertEquals(1, favoritesResponse.getFavorites().size());
        assertTrue(favoritesResponse.getFavorites().contains("park1"));
    }

    @Test
    public void testAddFavoriteWhenFavoritesStringIsEmpty() {
        User user = new User();
        user.setUsername("testUser");
        user.setFavorites("");

        when(mockRepository.findByUsername("testUser")).thenReturn(user);

        ResponseEntity<?> response = userService.addFavorite("testUser", "park1");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        FavoritesResponse favoritesResponse = (FavoritesResponse) response.getBody();
        assertNotNull(favoritesResponse);
        assertEquals(1, favoritesResponse.getFavorites().size());
        assertTrue(favoritesResponse.getFavorites().contains("park1"));
    }

    @Test
    void testAddDuplicateFavorite() {
        User user = new User();
        user.setUsername("testUser");
        List<String> favorites = new ArrayList<>();
        favorites.add("park1");
        String jsonFavorites = gson.toJson(favorites);
        String encryptedFavorites = "encryptedFavoritesString";
        user.setFavorites(encryptedFavorites);

        when(mockRepository.findByUsername("testUser")).thenReturn(user);
        when(mockEncryptor.encrypt(jsonFavorites)).thenReturn(encryptedFavorites);
        when(mockEncryptor.decrypt(encryptedFavorites)).thenReturn(jsonFavorites);

        ResponseEntity<?> response = userService.addFavorite("testUser", "park1");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Park already in favorites", response.getBody());
    }

    @Test
    void testAddFavoriteForNonExistentUser() {
        when(mockRepository.findByUsername("nonExistentUser")).thenReturn(null);

        ResponseEntity<?> response = userService.addFavorite("nonExistentUser", "park1");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("User not found", response.getBody());
    }

    @Test
    void testRemoveFavorite() {
        User user = new User();
        user.setUsername("testUser");
        List<String> favorites = new ArrayList<>();
        List<String> favorites2 = new ArrayList<>();
        favorites.add("park1");
        favorites.add("park2");
        favorites2.add("park2");
        String jsonFavorites = gson.toJson(favorites);
        String encryptedFavorites = "encryptedFavoritesString";
        user.setFavorites(encryptedFavorites);

        when(mockEncryptor.decrypt(encryptedFavorites)).thenReturn(jsonFavorites);
        when(mockRepository.findByUsername("testUser")).thenReturn(user);
        String updatedJsonFavorites = gson.toJson(favorites2);
        String updatedEncryptedFavorites = "updatedEncryptedFavoritesString";
        when(mockEncryptor.encrypt(updatedJsonFavorites)).thenReturn(updatedEncryptedFavorites);

        ResponseEntity<?> response = userService.removeFavorite("testUser", "park1");

        when(mockEncryptor.decrypt(updatedEncryptedFavorites)).thenReturn(updatedJsonFavorites);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Park removed from favorites", response.getBody());
    }

    @Test
    void testRemoveFavoriteForNonExistentUser() {
        when(mockRepository.findByUsername("nonExistentUser")).thenReturn(null);

        ResponseEntity<?> response = userService.removeFavorite("nonExistentUser", "park1");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("User not found", response.getBody());
    }

    @Test
    void testRemoveNonExistentFavorite() {
        User user = new User();
        user.setUsername("testUser");
        List<String> favorites = new ArrayList<>();
        favorites.add("park1");
        String jsonFavorites = gson.toJson(favorites);
        String encryptedFavorites = "encryptedFavoritesString";
        user.setFavorites(encryptedFavorites);

        when(mockEncryptor.decrypt(encryptedFavorites)).thenReturn(jsonFavorites);

        when(mockRepository.findByUsername("testUser")).thenReturn(user);

        ResponseEntity<?> response = userService.removeFavorite("testUser", "park2");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Park not in favorites", response.getBody());
    }

    @Test
    void testClearFavorites() {
        User user = new User();
        user.setUsername("testUser");
        List<String> favorites = new ArrayList<>();
        favorites.add("park1");
        favorites.add("park2");
        String jsonFavorites = gson.toJson(favorites);
        String encryptedFavorites = "encryptedFavoritesString";
        user.setFavorites(encryptedFavorites);

        when(mockRepository.findByUsername("testUser")).thenReturn(user);
        when(mockEncryptor.encrypt(jsonFavorites)).thenReturn(encryptedFavorites);
        when(mockEncryptor.decrypt(encryptedFavorites)).thenReturn(jsonFavorites);

        ResponseEntity<?> response = userService.clearFavorites("testUser");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("All favorites cleared", response.getBody());
        assertNull(user.getFavorites());
    }

    @Test
    void testClearFavoritesForNonExistentUser() {
        when(mockRepository.findByUsername("nonExistentUser")).thenReturn(null);

        ResponseEntity<?> response = userService.clearFavorites("nonExistentUser");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("User not found", response.getBody());
    }

    @Test
    void testAddFavoriteWithNullFavorites() {
        User user = new User();
        user.setUsername("testUser");
        user.setFavorites(null);

        when(mockRepository.findByUsername("testUser")).thenReturn(user);

        ResponseEntity<?> response = userService.addFavorite("testUser", "park1");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        FavoritesResponse favoritesResponse = (FavoritesResponse) response.getBody();
        assertNotNull(favoritesResponse);
        assertEquals(1, favoritesResponse.getFavorites().size());
        assertTrue(favoritesResponse.getFavorites().contains("park1"));
    }

//    @Test
//    void testRemoveFavoriteWithNullFavorites() {
//        User user = new User();
//        user.setUsername("testUser");
//        user.setFavorites(null);
//
//        when(mockRepository.findByUsername("testUser")).thenReturn(user);
//
//        ResponseEntity<?> response = userService.removeFavorite("testUser", "park1");
//
//        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
//        assertEquals("Park not in favorites", response.getBody());
//    }

    @Test
    void testClearFavoritesWithNullFavorites() {
        User user = new User();
        user.setUsername("testUser");
        user.setFavorites(null);

        when(mockRepository.findByUsername("testUser")).thenReturn(user);

        ResponseEntity<?> response = userService.clearFavorites("testUser");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("All favorites cleared", response.getBody());
        assertNull(user.getFavorites());
    }

    @Test
    void testToggleFavoritesPrivacy() {
        User user = new User();
        user.setUsername("testUser");
        user.setFavPrivate(false); // initially set to false

        when(mockRepository.findByUsername("testUser")).thenReturn(user);

        ResponseEntity<?> initialResponse = userService.toggleFavoritesPrivacy("testUser");
        assertEquals(HttpStatus.OK, initialResponse.getStatusCode());
        assertEquals("Favorites privacy status updated to true", initialResponse.getBody());

        assertTrue(user.isFavPrivate());

        ResponseEntity<?> secondResponse = userService.toggleFavoritesPrivacy("testUser");
        assertEquals(HttpStatus.OK, secondResponse.getStatusCode());
        assertEquals("Favorites privacy status updated to false", secondResponse.getBody());

        assertFalse(user.isFavPrivate());
    }

//    @Test
//    void testAddFavoriteWithRank() {
//        User user = new User();
//        user.setUsername("testUser");
//        Map<String, Integer> favoriteRanks = new HashMap<>();
//        user.setFavoriteRanks(favoriteRanks);
//
//        when(mockRepository.findByUsername("testUser")).thenReturn(user);
//
//        userService.addFavoriteWithRank("testUser", "park1", 1);
//
//        verify(mockRepository).save(user);
//        assertTrue(user.getFavoriteRanks().containsKey("park1"));
//        assertEquals(1, (int) user.getFavoriteRanks().get("park1"));
//    }


//    @Test
//    void testUpdateFavoriteRankSuccessfully() {
//        User user = new User();
//        user.setUsername("testUser");
//        Map<String, Integer> favoriteRanks = new HashMap<>();
//        favoriteRanks.put("park1", 1);
//        user.setFavoriteRanks(favoriteRanks);
//
//        when(mockRepository.findByUsername("testUser")).thenReturn(user);
//
//        userService.updateFavoriteRank("testUser", "park1", 2);
//
//        assertEquals(2, (int) user.getFavoriteRanks().get("park1"));
//        verify(mockRepository).save(user);
//    }

//    @Test
//    void testUpdateFavoriteRankFailForNonExistentPark() {
//        User user = new User();
//        user.setUsername("testUser");
//        Map<String, Integer> favoriteRanks = new HashMap<>();
//        favoriteRanks.put("park1", 1);
//        user.setFavoriteRanks(favoriteRanks);
//
//        when(mockRepository.findByUsername("testUser")).thenReturn(user);
//
//        Exception exception = assertThrows(RuntimeException.class, () -> {
//            userService.updateFavoriteRank("testUser", "park2", 2);
//        });
//
//        assertEquals("Park not found in favorites", exception.getMessage());
//    }

    @Test
    void testReorderFavoritesSuccessfully() {
        User user = new User();
        user.setUsername("testUser");
        List<String> favorites = new ArrayList<>();
        favorites.add("park1");
        favorites.add("park2");
        String favoritesString = mockEncryptor.encrypt(gson.toJson(favorites));
        user.setFavorites(favoritesString);
        List<String> newList = Arrays.asList("park2", "park1");

        when(mockRepository.findByUsername("testUser")).thenReturn(user);

        ResponseEntity<?> response = userService.reorderFavorites("testUser", newList);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Favorites reordered successfully", response.getBody());
    }

//    @Test
//    void testReorderFavoritesWithInvalidList() {
//        User user = new User();
//        user.setUsername("testUser");
//        List<String> originalFavorites = Arrays.asList("park1", "park2", "park3");
//        user.setFavorites(new ArrayList<>(originalFavorites));
//
//        when(mockRepository.findByUsername("testUser")).thenReturn(user);
//
//        List<String> newOrder = Arrays.asList("park3", "park4");
//        ResponseEntity<?> response = userService.reorderFavorites("testUser", newOrder);
//
//        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
//        assertEquals("Invalid park list submitted", response.getBody());
//    }

//    @Test
//    void testAddFavoriteInitializesFavoriteRanksWhenNull() {
//        User user = mock(User.class);
//        when(user.getFavoriteRanks()).thenReturn(null);
//
//        when(mockRepository.findByUsername("testUser")).thenReturn(user);
//
//        doAnswer(invocation -> {
//            Map<String, Integer> favoriteRanks = invocation.getArgument(0);
//            assertNotNull(favoriteRanks);
//            assertTrue(favoriteRanks.isEmpty());
//            return null;
//        }).when(user).setFavoriteRanks(anyMap());
//
//        userService.addFavorite("testUser", "parkId");
//
//        verify(user).setFavoriteRanks(anyMap());
//    }







}
