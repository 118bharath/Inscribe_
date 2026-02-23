package com.inscribe.backend.common;

public class SlugUtil {

    public static String toSlug(String input) {
        return input
                .toLowerCase()
                .replaceAll("[^a-z0-9\\s]", "")
                .trim()
                .replaceAll("\\s+", "-");
    }
}