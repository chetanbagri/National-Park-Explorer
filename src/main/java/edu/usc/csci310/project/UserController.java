package edu.usc.csci310.project;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {
    private UserService userService;
    @Autowired
    public void setMyService(UserService userService) {
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
}
