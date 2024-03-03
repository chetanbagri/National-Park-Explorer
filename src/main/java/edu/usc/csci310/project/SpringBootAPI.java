package edu.usc.csci310.project;

import com.google.api.core.ApiFuture;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Objects;
import java.io.File;

@Controller
@SpringBootApplication
public class SpringBootAPI {

    public static void main(String[] args) throws IOException {
        try {
            SpringApplication.run(SpringBootAPI.class, args);

            ClassLoader cl = SpringBootAPI.class.getClassLoader();
            File file = new File(Objects.requireNonNull(cl.getResource("team20.json")).getFile());
            FileInputStream serviceAccount =
                    new FileInputStream(file.getAbsolutePath());

            FirebaseOptions options = new FirebaseOptions.Builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .setDatabaseUrl("https://team20-e9c98-default-rtdb.firebaseio.com")
                    .build();

            FirebaseApp.initializeApp(options);

            // example use - below code inserts into users collection
            // Firestore dbFirestore = FirestoreClient.getFirestore();
            // User u = new User();
            // u.name = "testuser";
            // u.password = "testpass";
            // ApiFuture<WriteResult> x = dbFirestore.collection("users").document("testuser").set(u);


        }
        catch (Exception e) {
            throw e;
        }
    }

    @RequestMapping(value = "{_:^(?!index\\.html|api).*$}")
    public String redirect() {
        // Forward to home page so that route is preserved.(i.e forward:/index.html)
        return "forward:/";
    }
}
