package com.example.backend.repository;

import com.example.backend.enums.StatusAutomovel;
import com.example.backend.model.Automovel;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AutomovelRepository extends JpaRepository<Automovel, Long> {

    // Verifica se já existe um carro com a mesma placa
    boolean existsByPlaca(String placa);
    List<Automovel> findByStatus(StatusAutomovel status);
}
