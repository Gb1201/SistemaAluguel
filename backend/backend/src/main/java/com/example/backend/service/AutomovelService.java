package com.example.backend.service;

import com.example.backend.enums.StatusAutomovel;
import com.example.backend.model.Automovel;
import com.example.backend.repository.AutomovelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AutomovelService {

    @Autowired
    private AutomovelRepository automovelRepository;

    // Cadastrar automóvel — valida placa duplicada
    public Automovel cadastrar(Automovel automovel) {
        if (automovelRepository.existsByPlaca(automovel.getPlaca())) {
            throw new RuntimeException("Já existe um automóvel com a placa: " + automovel.getPlaca());
        }
        return automovelRepository.save(automovel);
    }

    // Listar todos os automóveis
    public List<Automovel> listarTodos() {
        return automovelRepository.findAll();
    }

    // Buscar por id
    public Optional<Automovel> buscarPorId(Long id) {
        return automovelRepository.findById(id);
    }

    // Atualizar automóvel
    public Automovel atualizar(Long id, Automovel dadosAtualizados) {
        return automovelRepository.findById(id)
            .map(automovel -> {
                // Valida placa duplicada apenas se a placa mudou
                if (!automovel.getPlaca().equals(dadosAtualizados.getPlaca())
                        && automovelRepository.existsByPlaca(dadosAtualizados.getPlaca())) {
                    throw new RuntimeException("Já existe um automóvel com a placa: " + dadosAtualizados.getPlaca());
                }
                automovel.setMarca(dadosAtualizados.getMarca());
                automovel.setModelo(dadosAtualizados.getModelo());
                automovel.setAno(dadosAtualizados.getAno());
                automovel.setPlaca(dadosAtualizados.getPlaca());
                return automovelRepository.save(automovel);
            })
            .orElseThrow(() -> new RuntimeException("Automóvel não encontrado com id: " + id));
    }

    // Deletar automóvel
    public void deletar(Long id) {
        if (!automovelRepository.existsById(id)) {
            throw new RuntimeException("Automóvel não encontrado com id: " + id);
        }
        automovelRepository.deleteById(id);
    }

    public List<Automovel> listarDisponiveis() {
        return automovelRepository.findByStatus(StatusAutomovel.DISPONIVEL);
    }
}
