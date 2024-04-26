package edu.usc.csci310.project;
import org.jasypt.encryption.pbe.StandardPBEStringEncryptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import java.lang.reflect.Type;
import java.util.*;

import java.util.List;


@Service
public class UserService {
    private UserRepository userRepository;
    private BCryptPasswordEncoder passwordEncoder;
    private StandardPBEStringEncryptor textEncryptor;
    private static final Gson gson = new Gson();

    @Autowired
    public void setMyRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Autowired
    public void setPasswordEncoder(BCryptPasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Autowired
    public void setTextEncryptor(StandardPBEStringEncryptor textEncryptor) {this.textEncryptor = textEncryptor;}

    public ResponseEntity<?> registerUser(String username, String password, String confirmPassword) {
        String encryptedUsername = textEncryptor.encrypt(username);
        if (userRepository.findByUsername(encryptedUsername) == null) {
            if(password.isEmpty()) return ResponseEntity.badRequest().body("Password field cannot be empty");
            int checker= isValidPassword(password);
            if (checker!=4) {
                if(checker == 1) return ResponseEntity.badRequest().body("Password must have one uppercase character");
                if(checker == 2) return ResponseEntity.badRequest().body("Password must have one lowercase character");
                return ResponseEntity.badRequest().body("Password must have one numerical character");
            }
            if(!confirmPassword.equals(password)) return ResponseEntity.badRequest().body("Password and confirm password must match");
            String hashedPassword = passwordEncoder.encode(password);
            User newUser = new User();
            newUser.setTime1(0L);
            newUser.setTime2(0L);
            newUser.setLockoutTime(0L);
            newUser.setUsername(encryptedUsername);
            newUser.setPassword(hashedPassword);
            return ResponseEntity.ok(userRepository.save(newUser));
        } else {
            return ResponseEntity.badRequest().body("Username exists");
        }
    }

    public ResponseEntity<?> loginUser(String username, String password) {
        if(userRepository.findByUsername(textEncryptor.encrypt(username)) != null) {
            User user = userRepository.findByUsername(textEncryptor.encrypt(username));
            if((System.currentTimeMillis()-user.getLockoutTime())<30000)
            {
                user.setTime1(0L);
                user.setTime2(0L);
                user.setLockoutTime(System.currentTimeMillis());
                userRepository.save(user);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Wait 30 seconds!");

            }
            else {
                user.setLockoutTime(0L);
                if (passwordEncoder.matches(password, user.getPassword())) {
                    user.setTime1(0L);
                    user.setTime2(0L);
                    userRepository.save(user);
                    return ResponseEntity.ok(user);
                } else {
                    if (user.getTime1() == 0L) {
                        user.setTime1(System.currentTimeMillis());
                        userRepository.save(user);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Incorrect password");
                    } else if (user.getTime2() == 0L) {
                        user.setTime2(System.currentTimeMillis());
                        userRepository.save(user);
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("One more fail may lockout");
                    } else {
                        if ((System.currentTimeMillis() - user.getTime1()) < 60000) {
                            user.setLockoutTime(System.currentTimeMillis());
                            user.setTime1(0L);
                            user.setTime2(0L);
                            userRepository.save(user);
                            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You are locked out for 30 seconds");
                        } else {
                            user.setTime1(user.getTime2());
                            user.setTime2(System.currentTimeMillis());
                            userRepository.save(user);
                            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("One more fail may lockout");
                        }
                    }
                }
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username does not exist");
        }
    }

    public ResponseEntity<?> removeUser(String username) {
        if(userRepository.findByUsername(textEncryptor.encrypt(username)) != null){
            userRepository.delete(userRepository.findByUsername(textEncryptor.encrypt(username)));
            return ResponseEntity.ok("User Deleted");
        }
        else{
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username does not exist");
        }
    }

    private int isValidPassword(String password) {
        boolean hasUppercase = !password.equals(password.toLowerCase());
        boolean hasLowercase = !password.equals(password.toUpperCase());
        boolean hasNumber  = password.matches(".*[0-9].*");

        if(!hasUppercase)return 1;
        else if(!hasLowercase) return 2;
        else if(!hasNumber) return 3;
        else return 4;
    }

    public ResponseEntity<?> addUserToGroup(String username, String usernameQuery) {
        User user = userRepository.findByUsername(username);
        User userB = userRepository.findByUsername(textEncryptor.encrypt(usernameQuery));
        if(user != null && userB != null) { // Both usernames exists within database
            if(Objects.equals(username, usernameQuery)){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cannot add yourself to your own friend group");
            }
            if(Groups.getGroupOfFriends(username).contains(usernameQuery)){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username is already in your friend group");
            }
//            if(userB.isFavPrivate() == true){ // userB has private list
//                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User cannot be added due to them having a private favorite park list");
//            }
            Groups.addToGroupOfFriends(username, usernameQuery);
            // userRepository.save(user); // Update the database

            return ResponseEntity.ok(Groups.getGroupOfFriends(username));
        }
        else { // Username does not exists within database
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username does not exist");
        }
    }

    public ResponseEntity<?> compareParks(String username) {
        User user = userRepository.findByUsername(username);
        if(user != null){
            // Get string usernames of friends in group
            List<String> userGroup = Groups.getGroupOfFriends(username);
            if(userGroup.isEmpty()){
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You have no friends in your group to compare parks with");
            }

            // Retrieve ALL favorite parks of each username, including myself
            HashMap<String, Integer> parkCounts = new HashMap<>();
            HashMap<String, List<String>> parksToUsers = new HashMap<>(); // Map park ID to associated usernames

            List<String> favs = new ArrayList<>();
            String favoritesString = user.getFavorites();
            if(favoritesString != null && !(favoritesString.isEmpty())) {
                favoritesString = textEncryptor.decrypt(favoritesString);
                Type type = new TypeToken<ArrayList<String>>() {}.getType();
                favs = gson.fromJson(favoritesString, type);
            }
            System.out.println(favoritesString);
            System.out.println(favs);
            // List<String> favs = user.getFavorites(); OUTDATED

            for(String parkID : favs) { // each parkID in userI favorites list
                int count = parkCounts.getOrDefault(parkID, 0);
                System.out.println(parkID);
                System.out.println(count);
                parkCounts.put(parkID, count + 1);
//                if(!parksToUsers.containsKey(parkID)){ // IMPOSSIBLE to fail since I'm starting with fresh parksToUsers
                parksToUsers.put(parkID, new ArrayList<>());
//                }
                parksToUsers.get(parkID).add(textEncryptor.decrypt(user.getUsername()));
            }
            for(String userI : userGroup){ // Now retrieve for the entire group
                // do something with userI
                // favs = new ArrayList<>();
                System.out.println("userI: " + userI);
                List<String> favs2 = new ArrayList<>();
                favoritesString = userRepository.findByUsername(textEncryptor.encrypt(userI)).getFavorites();
                if(favoritesString != null && !(favoritesString.isEmpty())) {
                    favoritesString = textEncryptor.decrypt(favoritesString);
                    Type type = new TypeToken<ArrayList<String>>() {}.getType();
                    favs2 = gson.fromJson(favoritesString, type);
                }
                // favs = userRepository.findByUsername(userI).getFavorites();

                System.out.println(favoritesString);
                System.out.println("favs2: " + favs2);
                for(String parkID : favs2) { // each parkID in userI favorites list
                    int count = parkCounts.getOrDefault(parkID, 0);
                    System.out.println(parkID);
                    System.out.println(count);
                    parkCounts.put(parkID, count + 1);
                    if(!parksToUsers.containsKey(parkID)){
                        parksToUsers.put(parkID, new ArrayList<>());
                    }
                    parksToUsers.get(parkID).add(userI);
                }
            }


            // Sort the HashMap based on their count values
            List<Map.Entry<String, Integer>> sortedIDs = new ArrayList<>(parkCounts.entrySet());
            sortedIDs.sort(new Comparator<Map.Entry<String, Integer>>() {
                @Override
                public int compare(Map.Entry<String, Integer> entry1, Map.Entry<String, Integer> entry2) {
                    return entry2.getValue().compareTo(entry1.getValue()); // Sort in descending order of count values
                }
            });

            CompareResponse cr = new CompareResponse();
            cr.setSortedIDs(sortedIDs);
            cr.setParksToUsers(parksToUsers);
            cr.setGroupSize(userGroup.size());
            cr.setGroupMembers(userGroup);
            return ResponseEntity.ok(cr);
        }
        else { // Username does not exists within database
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username does not exist");
        }
    }


    public ResponseEntity<?> getFavorites(String username) {
        User user = userRepository.findByUsername(username);
        List<String> favorites = new ArrayList<>();
        String favoritesString = user.getFavorites();
        if(favoritesString != null && !(favoritesString.isEmpty())) {
            favoritesString = textEncryptor.decrypt(favoritesString);
            Type type = new TypeToken<ArrayList<String>>() {}.getType();
            favorites = gson.fromJson(favoritesString, type);
        }
        return ResponseEntity.ok(new FavoritesResponse(favorites));
    }

    public ResponseEntity<?> getFavoritesSuggest(String username) {
        User user = userRepository.findByUsername(textEncryptor.encrypt(username));
        List<String> favorites = new ArrayList<>();
        String favoritesString = user.getFavorites();
        if(favoritesString != null && !(favoritesString.isEmpty())) {
            favoritesString = textEncryptor.decrypt(favoritesString);
            Type type = new TypeToken<ArrayList<String>>() {}.getType();
            favorites = gson.fromJson(favoritesString, type);
        }
        return ResponseEntity.ok(new FavoritesResponse(favorites));
    }

    public ResponseEntity<?> addFavorite(String username, String parkId) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }
        List<String> favorites = null;
        String favoritesString = user.getFavorites();
        if(favoritesString != null && !(favoritesString.isEmpty())) {
            favoritesString = textEncryptor.decrypt(favoritesString);
            Type type = new TypeToken<ArrayList<String>>() {}.getType();
            favorites = gson.fromJson(favoritesString, type);
        }
//        Map<String, Integer> favoriteRanks = null;
//        String favoriteRanksString = user.getFavoriteRanks();
//        if(favoriteRanksString != null) {
//            favoriteRanksString = textEncryptor.decrypt(favoriteRanksString);
//            Type type = new TypeToken<Map<String, Integer>>() {}.getType();
//            favoriteRanks = gson.fromJson(favoriteRanksString, type);
//        }


        if (favorites == null) {
            favorites = new ArrayList<>();
           // user.setFavorites(favorites);
        }
//        if (favoriteRanks == null) {
//            favoriteRanks = new HashMap<>();
//           // user.setFavoriteRanks(favoriteRanks);
//        }

        if (!favorites.contains(parkId)) {
            favorites.add(parkId);
            String newfavoritesString = gson.toJson(favorites);
            user.setFavorites(textEncryptor.encrypt(newfavoritesString));
//            favoriteRanks.put(parkId, favorites.size());
//            String newfavoriteRanksString = gson.toJson(favoriteRanks);
//            user.setFavoriteRanks(textEncryptor.encrypt(newfavoriteRanksString));
            userRepository.save(user);
            return ResponseEntity.ok(new FavoritesResponse(favorites));
        } else {
            return ResponseEntity.badRequest().body("Park already in favorites");
        }
    }


    public ResponseEntity<?> removeFavorite(String username, String parkId) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        List<String> favorites;
        String favoritesString = user.getFavorites();
        favoritesString = textEncryptor.decrypt(favoritesString);
        Type type = new TypeToken<ArrayList<String>>() {}.getType();
        favorites = gson.fromJson(favoritesString, type);
//        Map<String, Integer> favoriteRanks = new HashMap<>();
//        String favoriteRanksString = user.getFavoriteRanks();
//        if(favoriteRanksString != null) {
//            favoriteRanksString = textEncryptor.decrypt(favoriteRanksString);
//            Type type = new TypeToken<Map<String, Integer>>() {}.getType();
//            favoriteRanks = gson.fromJson(favoriteRanksString, type);
//        }

        if (!favorites.contains(parkId)) {
            return ResponseEntity.badRequest().body("Park not in favorites");
        }

        favorites.remove(parkId);
//        favoriteRanks.remove(parkId);
//        int rank = 1;
//        for (String favId : favorites) {
//            favoriteRanks.put(favId, rank++);
//        }
        String newfavoritesString = gson.toJson(favorites);
        user.setFavorites(textEncryptor.encrypt(newfavoritesString));
//        String newfavoriteRanksString = gson.toJson(favoriteRanks);
//        user.setFavoriteRanks(textEncryptor.encrypt(newfavoriteRanksString));
        userRepository.save(user);
        return ResponseEntity.ok("Park removed from favorites");
    }


    public ResponseEntity<?> clearFavorites(String username) {
        System.out.println("Username in service1: "+username);
        User user = userRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        user.setFavorites(null);
//        user.setFavoriteRanks(new HashMap<>());
        userRepository.save(user);
        return ResponseEntity.ok("All favorites cleared");
    }


    public ResponseEntity<?> toggleFavoritesPrivacy(String username) {
        System.out.println("Username in service: "+username);
        User user = userRepository.findByUsername(username);

        boolean currentStatus = user.getFavPrivate();
        user.setFavPrivate(!currentStatus);
        userRepository.save(user);
        System.out.println("User in Service: "+user.getUsername());
        return ResponseEntity.ok(user);
    }

//    public void addFavoriteWithRank(String username, String parkId, int rank) {
//        User user = userRepository.findByUsername(username);
//
//        Map<String, Integer> favoriteRanks = user.getFavoriteRanks();
//        favoriteRanks.put(parkId, rank);
//        userRepository.save(user);
//    }
//
//    public void updateFavoriteRank(String username, String parkId, int newRank) {
//        User user = userRepository.findByUsername(username);
//        Map<String, Integer> favoriteRanks = user.getFavoriteRanks();
//        if (favoriteRanks.containsKey(parkId)) {
//            favoriteRanks.put(parkId, newRank);
//            userRepository.save(user);
//        } else {
//            throw new RuntimeException("Park not found in favorites");
//        }
//    }

    public ResponseEntity<?> reorderFavorites(String username, List<String> newOrder) {
        User user = userRepository.findByUsername(username);
//        List<String> currentFavorites = user.getFavorites();
//        if (new HashSet<>(currentFavorites).equals(new HashSet<>(newOrder))) {
//            user.setFavorites(newOrder);
//            Map<String, Integer> updatedRanks = new HashMap<>();
//            int rank = 1;
//            for (String parkId : newOrder) {
//                updatedRanks.put(parkId, rank++);
//            }
//            user.setFavoriteRanks(updatedRanks);
//            userRepository.save(user);
//            return ResponseEntity.ok("Favorites reordered successfully");
//        } else {
//            return ResponseEntity.badRequest().body("Invalid park list submitted");
//        }
        String newOrderString = gson.toJson(newOrder);
        user.setFavorites(textEncryptor.encrypt(newOrderString));
        userRepository.save(user);
        return ResponseEntity.ok("Favorites reordered successfully");
    }

    public ResponseEntity<?> decryptUsername(String username) {
//        CompareResponse cr = new CompareResponse();
//        List<String> tmpList = new ArrayList<>();
//        tmpList.add(textEncryptor.decrypt(username));
//        cr.setSortedIDs(null);
//        cr.setParksToUsers(null);
//        cr.setGroupSize(0);
//        cr.setGroupMembers(tmpList);
//        System.out.println(tmpList.get(0));
        String tmp = textEncryptor.decrypt(username);
        return ResponseEntity.ok(tmp);
//        return ResponseEntity.ok(cr);

    }
}