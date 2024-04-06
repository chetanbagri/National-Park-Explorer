package edu.usc.csci310.project;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private Long time1;
    private Long time2;
    private Long lockoutTime;

    private String username;

    private String password;

    // WARNING: Do not use a User object or you may have a infinite cycle of referencing if two users have each other in a group.
    // // @OneToMany (cascade = CascadeType.ALL) // CascadeType.ALL ensures cascading operations (use if making List<User>)
    // @ElementCollection
    // private List<String> groupOfFriends = new ArrayList<>();

    // Constructors, Getters, and Setters
    protected User() {}

    public void setUsername(String username) {
        this.username = username;
    }
    public void setPassword(String password) {
        this.password = password;
    }
    public void setTime1(Long time1) {
        this.time1 = time1;
    }
    public void setTime2(Long time2) {
        this.time2 = time2;
    }
    public void setLockoutTime(Long lockoutTime) {
        this.lockoutTime = lockoutTime;
    }
    public String getUsername(){
        return username;
    }
    public String getPassword(){
        return password;
    }
    public long getTime1() {
        return time1;
    }
    public long getTime2() {
        return time2;
    }
    public long getLockoutTime() {
        return lockoutTime;
    }

//    public List<String> getGroupOfFriends() {
//        return groupOfFriends;
//    }
//    public void addToGroupOfFriends(String u) {
//        groupOfFriends.add(u);
//    }
}
