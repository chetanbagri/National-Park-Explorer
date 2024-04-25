package edu.usc.csci310.project;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RUser user) {
        return userService.registerUser(user.getUsername(), user.getPassword(), user.getConfirmPassword());
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        return userService.loginUser(user.getUsername(), user.getPassword());
    }

    @PostMapping("/adduser")
    public ResponseEntity<?> addUserToGroup(@RequestBody UserComparing req) {
        return userService.addUserToGroup(req.getUsername(), req.getUsernameQuery());
    }

    @PostMapping("/compareparks")
    public ResponseEntity<?> compareParks(@RequestBody UserComparing req) {
        return userService.compareParks(req.getUsername());
    }

    @GetMapping("/favorites")
    public ResponseEntity<?> getFavorites(@RequestParam String username) {
        return userService.getFavorites(username);
    }

    @PostMapping("/favorites/add")
    public ResponseEntity<?> addFavorite(@RequestParam String username, @RequestParam String parkId) {
        return userService.addFavorite(username, parkId);
    }

    @DeleteMapping("/favorites/remove")
    public ResponseEntity<?> removeFavorite(@RequestParam String username, @RequestParam String parkId) {
        return userService.removeFavorite(username, parkId);
    }

    @DeleteMapping("/favorites/clear")
    public ResponseEntity<?> clearFavorites(@RequestParam String username) {
        return userService.clearFavorites(username);
    }

    @PutMapping("/favorites/privacy")
    public ResponseEntity<?> toggleFavoritesPrivacy(@RequestParam String username) {
        return userService.toggleFavoritesPrivacy(username);
    }

//    @PostMapping("/users/{username}/favorites/{parkId}/rank")
//    public ResponseEntity<?> setRank(@PathVariable String username, @PathVariable String parkId, @RequestBody int rank) {
//        try {
//            userService.addFavoriteWithRank(username, parkId, rank);
//            return ResponseEntity.ok("Favorite added with rank successfully");
//        } catch (RuntimeException e) {
//            return ResponseEntity.badRequest().body(e.getMessage());
//        }
//    }
//
//    @PatchMapping("/users/{username}/favorites/{parkId}/rank")
//    public ResponseEntity<?> updateRank(@PathVariable String username, @PathVariable String parkId, @RequestBody int newRank) {
//        try {
//            userService.updateFavoriteRank(username, parkId, newRank);
//            return ResponseEntity.ok("Rank updated successfully");
//        } catch (RuntimeException e) {
//            return ResponseEntity.badRequest().body(e.getMessage());
//        }
//    }

    @PostMapping("/favorites/reorder")
    public ResponseEntity<?> reorderFavorites(@RequestParam String username, @RequestBody List<String> newOrder) {
        return userService.reorderFavorites(username, newOrder);
    }




}