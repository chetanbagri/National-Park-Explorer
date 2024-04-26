package edu.usc.csci310.project;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CompareResponse {
    private List<Map.Entry<String, Integer>> sortedIDs;

    private HashMap<String, List<String>> parksToUsers;

    private Integer groupSize = 0;

    private List<String> groupMembers;

    public List<Map.Entry<String, Integer>> getSortedIDs() {
        return sortedIDs;
    }

    public void setSortedIDs(List<Map.Entry<String, Integer>> sortedIDs) {
        this.sortedIDs = sortedIDs;
    }

    public Integer getGroupSize() {
        return groupSize;
    }

    public void setGroupSize(Integer groupSize) {
        this.groupSize = groupSize;
    }

    public HashMap<String, List<String>> getParksToUsers() {
        return parksToUsers;
    }

    public void setParksToUsers(HashMap<String, List<String>> parksToUsers) {
        this.parksToUsers = parksToUsers;
    }

    public List<String> getGroupMembers() {
        return groupMembers;
    }

    public void setGroupMembers(List<String> groupMembers) {
        this.groupMembers = groupMembers;
    }
}
