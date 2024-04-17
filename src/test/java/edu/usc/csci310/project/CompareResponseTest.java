package edu.usc.csci310.project;

import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

public class CompareResponseTest {

    @Test
    void testSetAndGetSortedIDs(){
        CompareResponse cr = new CompareResponse();

        assertNull(cr.getSortedIDs());

        List<Map.Entry<String, Integer>> sortedIDs = new ArrayList<>();
        sortedIDs.add(Map.entry("CAT_TEST", 2));
        cr.setSortedIDs(sortedIDs);
        assertEquals(1, cr.getSortedIDs().size());
        assertEquals("CAT_TEST", cr.getSortedIDs().get(0).getKey());
        assertEquals(2, cr.getSortedIDs().get(0).getValue());
    }

    @Test
    void testSetAndGetGroupSize(){
        CompareResponse cr = new CompareResponse();

        assertEquals(0, cr.getGroupSize());
        cr.setGroupSize(2);
        assertEquals(2, cr.getGroupSize());
    }

    @Test
    void testSetAndGetParksToUsers(){
        CompareResponse cr = new CompareResponse();

        assertNull(cr.getParksToUsers());
        HashMap<String, List<String>> parksToUsers = new HashMap<>();
        List<String> usernames = new ArrayList<>();
        usernames.add("NickoOG_CR_TEST");
        parksToUsers.put("CAT_TEST", usernames);
        cr.setParksToUsers(parksToUsers);
        assertEquals(1, cr.getParksToUsers().size());
        assertEquals(usernames, cr.getParksToUsers().get("CAT_TEST"));
    }
}
