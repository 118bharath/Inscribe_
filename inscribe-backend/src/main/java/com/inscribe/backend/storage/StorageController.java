package com.inscribe.backend.storage;

import com.inscribe.backend.storage.dto.PresignedUrlRequest;
import com.inscribe.backend.storage.dto.PresignedUrlResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/storage")
@RequiredArgsConstructor
public class StorageController {

    private final S3Service s3Service;

    @PostMapping("/presigned-url")
    public PresignedUrlResponse getPresignedUrl(
            @Valid @RequestBody PresignedUrlRequest request
    ) {
        return s3Service.generatePresignedUploadUrl(
                request.getFileName(),
                request.getContentType(),
                request.getContentLength()
        );
    }
}
