
package com.stockflow.supplier.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SupplierRequest(

        @NotBlank(message = "Supplier name is required")
        @Size(max = 150)
        String name,

        @Size(max = 120)
        String contactPerson,

        @Email(message = "Email must be valid")
        @Size(max = 180)
        String email,

        @Size(max = 30)
        String phone,

        @Size(max = 500)
        String address,

        @Size(max = 100)
        String taxNumber

) {}
