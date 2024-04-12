package edu.usc.csci310.project;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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



}
