package edu.usc.csci310.project;

import java.util.List;

public class FavoritesResponse {
    private List<String> favorites;

    public FavoritesResponse(List<String> favorites) {
        this.favorites = favorites;
    }

    public List<String> getFavorites() {
        return favorites;
    }
}