package com.example.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.dtos.ClienteDTO;
import com.example.backend.model.Cliente;
import com.example.backend.model.Rendimento;
import com.example.backend.repository.ClienteRepository;

@Service
@Transactional
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    // Criar cliente — associa cada rendimento ao cliente antes de salvar
    public Cliente criarCliente(Cliente cliente) {
        if (cliente.getRendimentos() != null) {
            for (Rendimento r : cliente.getRendimentos()) {
                r.setCliente(cliente);
            }
        }
        return clienteRepository.save(cliente);
    }

    // Listar todos os clientes
    public List<Cliente> listarClientes() {
        return clienteRepository.findAll();
    }

    // Listar clientes pelo DTO (id + nome)
    public List<ClienteDTO> listarClientesDTO() {
        return clienteRepository.findAll()
                .stream()
                .map(ClienteDTO::new)
                .toList();
    }

    // Buscar cliente por id
    public Optional<Cliente> buscarClientePorId(Long id) {
        return clienteRepository.findById(id);
    }

    // Atualizar cliente — substitui os rendimentos existentes pelos novos
    public Cliente atualizarCliente(Long id, Cliente clienteAtualizado) {
        return clienteRepository.findById(id)
            .map(cliente -> {
                cliente.setNome(clienteAtualizado.getNome());
                cliente.setRg(clienteAtualizado.getRg());
                cliente.setCpf(clienteAtualizado.getCpf());
                cliente.setEndereco(clienteAtualizado.getEndereco());
                cliente.setProfissao(clienteAtualizado.getProfissao());

                
                cliente.getRendimentos().clear();

                
                if (clienteAtualizado.getRendimentos() != null) {
                    for (Rendimento r : clienteAtualizado.getRendimentos()) {
                        r.setCliente(cliente);
                        cliente.getRendimentos().add(r);
                    }
                }

                return clienteRepository.save(cliente);
            })
            .orElseThrow(() -> new RuntimeException("Cliente não encontrado com id " + id));
    }

    // Deletar cliente 
    public void deletarCliente(Long id) {
        if (clienteRepository.existsById(id)) {
            clienteRepository.deleteById(id);
        } else {
            throw new RuntimeException("Cliente não encontrado com id " + id);
        }
    }
}
