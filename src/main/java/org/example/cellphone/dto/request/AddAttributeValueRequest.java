package org.example.cellphone.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddAttributeValueRequest {
    @NotBlank(message = "Giá trị không được để trống")
    private String value;
}
