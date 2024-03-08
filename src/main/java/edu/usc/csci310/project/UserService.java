package edu.usc.csci310.project;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;


@Service
public class UserService {
    private UserRepository userRepository;
    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    public void setMyRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Autowired
    public void setPasswordEncoder(BCryptPasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public ResponseEntity<?> registerUser(String username, String email, String password) {
        if (userRepository.findByEmail(email) == null && userRepository.findByUsername(username) == null) {
            String hashedPassword = passwordEncoder.encode(password);
            User newUser = new User();
            newUser.setUsername(username);
            newUser.setEmail(email);
            newUser.setPassword(hashedPassword);
            return ResponseEntity.ok(userRepository.save(newUser));
        } else if(userRepository.findByUsername(username) != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User already exists with this username");
        }
        else{
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User already exists with this email");
        }
    }
}
