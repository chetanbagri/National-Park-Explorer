package edu.usc.csci310.project;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class GroupsTest {

    @Test
    void testGetGroupOfFriends(){
        new Groups(); // Without this and constructor in class, 1 line stays red

        List<String> myGroup = Groups.getGroupOfFriends("Nickoo");
        assertEquals(0, myGroup.size());
    }

    @Test
    void testAddToGroupOfFriends(){
        Groups.addToGroupOfFriends("Nickoo", "NickooFriend");
        List<String> myGroup = Groups.getGroupOfFriends("Nickoo");
        assertEquals(1, myGroup.size());
        assertEquals(myGroup.get(0), "NickooFriend");
    }
}
