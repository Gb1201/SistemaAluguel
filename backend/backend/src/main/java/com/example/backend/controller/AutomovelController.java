package com.example.backend.controller;

import com.example.backend.model.Automovel;
import com.example.backend.service.AutomovelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/automoveis")
public class AutomovelController {

    @Autowired
    private AutomovelService automovelService;

    // POST /automoveis — cadastra um novo automóvel
    @PostMapping
    public ResponseEntity<?> cadastrar(@RequestBody Automovel automovel) {
        try {
            Automovel novo = automovelService.cadastrar(automovel);
            return ResponseEntity.status(HttpStatus.CREATED).body(novo);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // GET /automoveis — lista todos
    @GetMapping
    public ResponseEntity<List<Automovel>> listarTodos() {
        return ResponseEntity.ok(automovelService.listarTodos());
    }

    // GET /automoveis/{id} — busca por id
    @GetMapping("/{id}")
    public ResponseEntity<Automovel> buscarPorId(@PathVariable Long id) {
        return automovelService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // PUT /automoveis/{id} — atualiza um automóvel
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody Automovel automovel) {
        try {
            Automovel atualizado = automovelService.atualizar(id, automovel);
            return ResponseEntity.ok(atualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DELETE /automoveis/{id} — remove um automóvel
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id) {
        try {
            automovelService.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
