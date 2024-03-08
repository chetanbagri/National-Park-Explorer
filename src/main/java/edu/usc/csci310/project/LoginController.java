package edu.usc.csci310.project;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class LoginController {


    // private static Map<String, Integer> attempts = new HashMap<>(); // Key=username, Value=number of attempts

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> processLogin(@RequestBody LoginRequest request){
        String message = "Login Unsuccessful";
        String username = request.getParam0();
        String password = request.getParam1();

        // System.out.println("Received " + username);

        LoginResponse response = new LoginResponse();

        if(username.isEmpty() && password.isEmpty()){
            message = "Login Unsuccessful, username and password required";
            response.setData(message);
            return ResponseEntity.ok().body(response);
        }
        else if(username.isEmpty()){
            message = "Login Unsuccessful, username required";
            response.setData(message);
            return ResponseEntity.ok().body(response);
        }
        else if(password.isEmpty()){
            message = "Login Unsuccessful, password required";
            response.setData(message);
            return ResponseEntity.ok().body(response);
        }

//        if(attempts.containsKey(username)){ // User exists
//            attempts.put(username, attempts.get(username) + 1);
//        }
//        else{ // User does not exist yet
//            attempts.put(username, 1);
//        }
//
//        if(username.equals("Tommy") && password.equals("Trojan")){
//            attempts.put(username, 0);
//            message = "Login Successful";
//            response.setData(message);
//            return ResponseEntity.ok().body(response);
//        }
//
//
//        if(attempts.get(username) == 2){
//            message = "Login Unsuccessful, one more attempt to log in allowed";
//            response.setData(message);
//            return ResponseEntity.ok().body(response);
//        }
//        else if(attempts.get(username) == 3){
//            message = "Account Blocked";
//            response.setData(message);
//            return ResponseEntity.ok().body(response);
//        }


        response.setData(message);
        return ResponseEntity.ok().body(response);
    }
}

