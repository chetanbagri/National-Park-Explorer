package edu.usc.csci310.project;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Groups {
    private static Map<String, List<String>> groupOfFriends = new HashMap<>();

    protected Groups(){}

    public static List<String> getGroupOfFriends(String u) {
        return groupOfFriends.getOrDefault(u, new ArrayList<>());
    }
    public static void addToGroupOfFriends(String u1, String u2) {
        List<String> group = groupOfFriends.getOrDefault(u1, new ArrayList<>());
        group.add(u2);
        groupOfFriends.put(u1, group);
    }
}
