package com.inscribe.backend.storage;

import com.inscribe.backend.config.StorageProperties;
import com.inscribe.backend.storage.dto.PresignedUrlResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class S3Service {

    private final StorageProperties storageProperties;

    public PresignedUrlResponse generatePresignedUploadUrl(String fileName, String contentType, long contentLength) {

        validateFile(fileName, contentType, contentLength);

        String sanitizedName = fileName.replaceAll("[^a-zA-Z0-9._-]", "_");
        String fileKey = "posts/" + UUID.randomUUID() + "-" + sanitizedName;

        try (S3Presigner presigner = S3Presigner.builder()
                .region(Region.of(storageProperties.getRegion()))
                .credentialsProvider(DefaultCredentialsProvider.create())
                .build()) {

            // Upload request
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(storageProperties.getS3Bucket())
                    .key(fileKey)
                    .contentType(contentType)
                    .contentLength(contentLength)
                    .build();

            PutObjectPresignRequest presignRequest =
                    PutObjectPresignRequest.builder()
                            .signatureDuration(Duration.ofMinutes(storageProperties.getUploadUrlDurationMinutes()))
                            .putObjectRequest(putObjectRequest)
                            .build();

            PresignedPutObjectRequest presignedPutRequest =
                    presigner.presignPutObject(presignRequest);

            // Generate temporary view URL (GET)
            String viewUrl = generatePresignedGetUrl(fileKey);

            return PresignedUrlResponse.builder()
                    .uploadUrl(presignedPutRequest.url().toString())
                    .fileKey(fileKey)
                    .viewUrl(viewUrl)
                    .build();
        }
    }

    public String generatePresignedGetUrl(String fileKey) {

        try (S3Presigner presigner = S3Presigner.builder()
                .region(Region.of(storageProperties.getRegion()))
                .credentialsProvider(DefaultCredentialsProvider.create())
                .build()) {

            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(storageProperties.getS3Bucket())
                    .key(fileKey)
                    .build();

            GetObjectPresignRequest presignRequest =
                    GetObjectPresignRequest.builder()
                            .signatureDuration(Duration.ofMinutes(storageProperties.getViewUrlDurationMinutes()))
                            .getObjectRequest(getObjectRequest)
                            .build();

            PresignedGetObjectRequest presignedGetRequest =
                    presigner.presignGetObject(presignRequest);

            return presignedGetRequest.url().toString();
        }
    }

    private void validateFile(String fileName, String contentType, long contentLength) {
        if (fileName == null || fileName.isBlank()) {
            throw new IllegalArgumentException("Invalid file name");
        }

        String lowercaseName = fileName.toLowerCase(Locale.ROOT);
        if (!(lowercaseName.endsWith(".png")
                || lowercaseName.endsWith(".jpg")
                || lowercaseName.endsWith(".jpeg")
                || lowercaseName.endsWith(".webp"))) {
            throw new IllegalArgumentException("Only image files are allowed");
        }

        if (contentType == null || !allowedContentTypes().contains(contentType.toLowerCase(Locale.ROOT))) {
            throw new IllegalArgumentException("Unsupported content type");
        }

        if (contentLength <= 0 || contentLength > storageProperties.getMaxUploadSizeBytes()) {
            throw new IllegalArgumentException("Invalid file size");
        }
    }

    private Set<String> allowedContentTypes() {
        return storageProperties.getAllowedContentTypes().stream()
                .map(type -> type.toLowerCase(Locale.ROOT))
                .collect(Collectors.toUnmodifiableSet());
    }
}
