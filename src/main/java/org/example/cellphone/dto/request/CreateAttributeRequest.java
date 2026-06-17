package org.example.cellphone.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateAttributeRequest {
    @NotBlank(message = "Tên thuộc tính không được để trống")
    private String name;
}
