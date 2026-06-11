package org.example.cellphone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddressRequest {

    private Long userId;

    private Long provinceId;

    private Long wardId;

    private String detailAddress;

    private Boolean isDefault;
}
