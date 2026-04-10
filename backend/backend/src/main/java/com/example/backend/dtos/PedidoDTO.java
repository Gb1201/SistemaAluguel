package com.example.backend.dtos;

import java.time.LocalDate;

public class PedidoDTO {

    private Long clienteId;
    private Long automovelId;
    private LocalDate dataInicio;
    private LocalDate dataFim;

    public Long getClienteId() {
        return clienteId;
    }

    public Long getAutomovelId() {
        return automovelId;
    }

    public LocalDate getDataInicio() {
        return dataInicio;
    }

    public LocalDate getDataFim() {
        return dataFim;
    }
}
