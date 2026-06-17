package org.example.cellphone.mapper;

import org.example.cellphone.dto.response.UserResponse;
import org.example.cellphone.dto.response.RoleResponse;
import org.example.cellphone.entities.User;
import org.example.cellphone.entities.Role;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserResponse toResponse(User user);
    RoleResponse toResponse(Role role);
}
