package edu.usc.csci310.project;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserController {
    private UserService userService;
    @Autowired
    public void setMyService(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userService.registerUser(user.getUsername(), user.getEmail(), user.getPassword());
    }
}
