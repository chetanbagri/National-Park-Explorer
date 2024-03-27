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
        System.out.println("UserRepository set in UserService");
        this.userRepository = userRepository;
    }

    @Autowired
    public void setPasswordEncoder(BCryptPasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public ResponseEntity<?> registerUser(String username, String password, String confirmPassword) {
        if (userRepository.findByUsername(username) == null) {
            int checker= isValidPassword(password);
            if (checker!=4) {
                if(checker == 1) return ResponseEntity.badRequest().body("Password must have one uppercase character");
                if(checker == 2) return ResponseEntity.badRequest().body("Password must have one lowercase character");
                if(checker == 3) return ResponseEntity.badRequest().body("Password must have one numerical character");
            }
            if(!confirmPassword.equals(password)) return ResponseEntity.badRequest().body("Password and confirm password must match");
            String hashedPassword = passwordEncoder.encode(password);
            User newUser = new User();
            newUser.setTime1(0L);
            newUser.setTime2(0L);
            newUser.setLockoutTime(0L);
            newUser.setUsername(username);
            newUser.setPassword(hashedPassword);
            return ResponseEntity.ok(userRepository.save(newUser));
        } else {
            return ResponseEntity.badRequest().body("User already exists with this username");
        }
    }

    public ResponseEntity<?> loginUser(String username, String password) {
        if(userRepository.findByUsername(username) != null) {
            User user = userRepository.findByUsername(username);
            if((System.currentTimeMillis()-user.getLockoutTime())<30000)
            {
                user.setTime1(0L);
                user.setTime2(0L);
                user.setLockoutTime(System.currentTimeMillis());
                userRepository.save(user);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You have to wait 30 seconds before trying" +
                        " to log in again. Lockout timer has been reset");

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
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Incorrect password. One more and " +
                                "you may get locked out");
                    } else {
                        if (System.currentTimeMillis() - user.getTime1() < 60000) {
                            user.setLockoutTime(System.currentTimeMillis());
                            user.setTime1(0L);
                            user.setTime2(0L);
                            userRepository.save(user);
                            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You are locked out for 30 seconds!");
                        } else {
                            user.setTime1(user.getTime2());
                            user.setTime2(System.currentTimeMillis());
                            userRepository.save(user);
                            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Incorrect password. One more and " +
                                    "you may get locked out");
                        }
                    }
                }
            }
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username does not exist");
        }
    }

    public ResponseEntity<?> removeUser(String username) {
        if(userRepository.findByUsername(username) != null){
            userRepository.delete(userRepository.findByUsername(username));
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
}
