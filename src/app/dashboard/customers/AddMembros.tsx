"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MembroService, Membro } from "@/services/membros";

// Material UI Components
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Stack,
    Alert,
    Snackbar,
} from "@mui/material";

// ✅ Definição do schema de validação
const schema = z.object({
    nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    email: z.string().email("E-mail inválido").optional(),
    telefone: z.string().optional(),
    cargo: z.enum(["Pastor", "Supervisor", "Líder", "Membro"]),
    endereco: z.string().optional(),
    celula_id: z.union([z.string(), z.number()]).optional(),
    lider_id: z.union([z.string(), z.number()]).optional(),
  });

type FormValues = z.infer<typeof schema>;

interface MembroDialogProps {
    open: boolean;
    onClose: () => void;
    onMembroAdded: () => void; // Para atualizar a lista após adicionar
  }

export default function MembroDialog({ open, onClose, onMembroAdded }: MembroDialogProps) {
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
      resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormValues) => {
        try {
          const payload: Membro = {
            ...data,
            celula_id: data.celula_id ? Number(data.celula_id) : undefined,
            lider_id: data.lider_id ? Number(data.lider_id) : undefined,
          };
    
          const response = await MembroService.criarMembro(payload);
          
          setSuccessMessage(response.mensagem || "Membro cadastrado com sucesso!");
          reset(); // Limpa o formulário após sucesso
          onMembroAdded(); // Atualiza a lista de membros
          
          // Aguarda um tempo antes de fechar o modal para o usuário ver o sucesso
          setTimeout(() => {
            setSuccessMessage(null);
            onClose();
          }, 1500);
          
        } catch (error) {
          setError("Erro ao cadastrar membro. Verifique os dados e tente novamente.");
          console.error("Erro ao cadastrar membro:", error);
        }
      };

      return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
          <DialogTitle>Cadastrar Novo Membro</DialogTitle>
          <DialogContent>
            {error && <Alert severity="error">{error}</Alert>}
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField label="Nome" {...register("nome")} error={!!errors.nome} helperText={errors.nome?.message} />
              <TextField label="E-mail" {...register("email")} error={!!errors.email} helperText={errors.email?.message} />
              <TextField label="Telefone" {...register("telefone")} error={!!errors.telefone} helperText={errors.telefone?.message} />
              <TextField select label="Cargo" {...register("cargo")} error={!!errors.cargo} helperText={errors.cargo?.message}>
                <MenuItem value="Pastor">Pastor</MenuItem>
                <MenuItem value="Supervisor">Supervisor</MenuItem>
                <MenuItem value="Líder">Líder</MenuItem>
                <MenuItem value="Membro">Membro</MenuItem>
              </TextField>
              <TextField label="Endereço" {...register("endereco")} error={!!errors.endereco} helperText={errors.endereco?.message} />
              <TextField label="ID da Célula" {...register("celula_id")} error={!!errors.celula_id} helperText={errors.celula_id?.message} />
              <TextField label="ID do Líder" {...register("lider_id")} error={!!errors.lider_id} helperText={errors.lider_id?.message} />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="inherit">Cancelar</Button>
            <Button onClick={handleSubmit(onSubmit)} variant="contained">Cadastrar</Button>
          </DialogActions>
    
          {/* ✅ Snackbar para exibir mensagem de sucesso */}
          <Snackbar
            open={!!successMessage}
            autoHideDuration={1500}
            onClose={() => setSuccessMessage(null)}
            message={successMessage}
          />
        </Dialog>
      );
    }
