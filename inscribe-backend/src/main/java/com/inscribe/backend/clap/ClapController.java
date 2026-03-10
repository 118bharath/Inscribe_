package com.inscribe.backend.clap;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class ClapController {

    private final ClapService clapService;

    @PostMapping("/{id}/clap")
    public void clap(
            @PathVariable Long id,
            Authentication authentication
    ) {
        clapService.clapPost(id, authentication);
    }

    @DeleteMapping("/{id}/clap")
    public void unclap(
            @PathVariable Long id,
            Authentication authentication
    ) {
        clapService.unclapPost(id, authentication);
    }
}
