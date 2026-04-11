package com.example.backend.service;

import com.example.backend.model.*;
import com.example.backend.enums.StatusAutomovel;
import com.example.backend.enums.StatusPedido;
import com.example.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private AutomovelRepository automovelRepository;

    public Pedido criarPedido(Long clienteId, Long automovelId, LocalDate dataInicio, LocalDate dataFim) {

        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        Automovel automovel = automovelRepository.findById(automovelId)
                .orElseThrow(() -> new RuntimeException("Automóvel não encontrado"));

        
        if (!automovel.getStatus().name().equals("DISPONIVEL")) {
            throw new RuntimeException("Automóvel não está disponível");
        }

        // cria pedido
        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setAutomovel(automovel);
        pedido.setDataInicio(dataInicio);
        pedido.setDataFim(dataFim);
        pedido.setStatus(StatusPedido.PENDENTE);

        
        automovel.setStatus(StatusAutomovel.ALUGADO);
        automovelRepository.save(automovel);

        return pedidoRepository.save(pedido);
    }

    public List<Pedido> listarTodos() {
        return pedidoRepository.findAll();
    }

    public List<Pedido> listarPorCliente(Long clienteId) {
        return pedidoRepository.findByClienteId(clienteId);
    }

    public Pedido atualizarStatus(Long pedidoId, StatusPedido novoStatus) {

        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));

        if (pedido.getStatus() != StatusPedido.PENDENTE) {
            throw new RuntimeException("Pedido já foi processado");
        }

        pedido.setStatus(novoStatus);

        // REGRA IMPORTANTE
        if (novoStatus == StatusPedido.CANCELADO) {
            Automovel automovel = pedido.getAutomovel();
            automovel.setStatus(StatusAutomovel.DISPONIVEL);
            automovelRepository.save(automovel);
        }

        return pedidoRepository.save(pedido);
    }
}
