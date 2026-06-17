package org.example.cellphone.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddressResponse {
    private Long id;
    private String detailAddress;
    private Boolean isDefault;
    private ProvinceResponse province;
    private WardResponse ward;
}
