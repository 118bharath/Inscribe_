package com.inscribe.backend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.function.Supplier;

@Slf4j
@Service
public class RedisService {

    public <T> Optional<T> execute(String operation, Supplier<T> supplier) {
        try {
            return Optional.ofNullable(supplier.get());
        } catch (DataAccessException ex) {
            log.warn("Redis operation failed: {}", operation, ex);
            return Optional.empty();
        }
    }

    public boolean run(String operation, Runnable runnable) {
        try {
            runnable.run();
            return true;
        } catch (DataAccessException ex) {
            log.warn("Redis operation failed: {}", operation, ex);
            return false;
        }
    }
}
