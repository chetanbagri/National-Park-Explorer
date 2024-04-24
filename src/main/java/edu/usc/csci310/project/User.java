package edu.usc.csci310.project;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.*;


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


    //Favorites:
    @ElementCollection
    private List<String> favorites = new ArrayList<>();

    private boolean favPrivate = true;

    @ElementCollection
    @CollectionTable(name = "favorite_ranks", joinColumns = @JoinColumn(name = "user_id"))
    @MapKeyColumn(name = "park_id")
    @Column(name = "rank")
    private Map<String, Integer> favoriteRanks = new HashMap<>();
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

    public List<String> getFavorites() {
        return favorites;
    }

    public void setFavorites(List<String> favorites) {
        this.favorites = favorites;
    }

    public boolean isFavPrivate(){
        return favPrivate;
    }

    public void setFavPrivate(boolean favPrivate){
        this.favPrivate = favPrivate;
    }


    public Map<String, Integer> getFavoriteRanks() {
        return favoriteRanks;
    }

    public void setFavoriteRanks(Map<String, Integer> favoriteRanks) {
        this.favoriteRanks = favoriteRanks;
    }


    public void updateFavoriteRank(String parkId, Integer rank) {
        this.favoriteRanks.put(parkId, rank);
    }

    public void removeFavoriteRank(String parkId) {
        this.favoriteRanks.remove(parkId);
    }
}
