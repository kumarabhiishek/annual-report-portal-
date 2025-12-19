package com.annual.report.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
import org.springframework.data.repository.cdi.Eager;

@Entity
@Getter@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name ="admin")
public class Admin {

    @Id
    private String username;
    private String password;

}
