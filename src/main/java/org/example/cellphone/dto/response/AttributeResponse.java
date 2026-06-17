package org.example.cellphone.dto.response;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class AttributeResponse {
    private Long id;
    private String name;
    private List<AttributeValueResponse> values;
}
