package edu.usc.csci310.project;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;


@Service
public class UserService {
    private UserRepository userRepository;
    @Autowired
    public void setMyRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(String username, String email, String password) {
        if (userRepository.findByEmail(email) == null && userRepository.findByUsername(username) == null) {
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            String hashedPassword = passwordEncoder.encode(password);
            User newUser = new User();
            newUser.setUsername(username);
            newUser.setEmail(email);
            newUser.setPassword(hashedPassword);
            return userRepository.save(newUser);
        } else if(userRepository.findByEmail(email) != null) {
            throw new IllegalStateException("User already exists with this email");
        }
        else{
            throw new IllegalStateException("User already exists with this username");
        }
    }
}
