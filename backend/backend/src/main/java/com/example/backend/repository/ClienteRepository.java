package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.backend.model.Cliente;


@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    
}
