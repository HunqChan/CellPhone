package org.example.cellphone.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Table(name = "product_variants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double price;

    private Integer quantityInStock;

    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonBackReference("product-variants")
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Product product;

    @ManyToMany
    @JoinTable(
            name = "product_variant_attributes",
            joinColumns = @JoinColumn(name = "product_variant_id"),
            inverseJoinColumns = @JoinColumn(name = "attribute_value_id")
    )
    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    private Set<AttributeValue> attributes;
}
