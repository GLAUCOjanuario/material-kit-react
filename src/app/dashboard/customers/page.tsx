"use client"; // Next.js precisa disso para componentes que usam useState e useEffect

import * as React from "react";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Download as DownloadIcon } from "@phosphor-icons/react/dist/ssr/Download";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { Upload as UploadIcon } from "@phosphor-icons/react/dist/ssr/Upload";
import { CustomersFilters } from "@/components/dashboard/customer/customers-filters";
import { CustomersTable } from "@/components/dashboard/customer/customers-table";
import { MembroService, Membro } from "@/services/membros"; // Importa MembroService
import  AddMembros from "./AddMembros"; // Importa o componente AddMembros
 
export default function Page(): React.JSX.Element {
  const [membros, setMembros] = useState<Membro[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState(false); // 📌 Estado para controlar o modal

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function carregarMembros() {
      try {
        setLoading(true);
        const resposta = await MembroService.listarMembros();
        setMembros(resposta.membros);
      } catch (err) {
        setError("Erro ao carregar membros");
        console.error("Erro ao buscar membros:", err);
      } finally {
        setLoading(false);
      }
    }

    carregarMembros();
  }, []);

  const page = 0;
  const rowsPerPage = 5;
  const paginatedMembros = applyPagination(membros, page, rowsPerPage);

  if (loading) return <Typography>Carregando membros...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  function carregarMembros(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: "1 1 auto" }}>
          <Typography variant="h4">Lista de Membros</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Importar
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Exportar
            </Button>
          </Stack>
        </Stack>
        <div>
          <Button
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={() => setOpenDialog(true)} // 📌 Abre o modal ao clicar
          >
            Adicionar Membros
          </Button>
        </div>
      </Stack>
      <CustomersFilters />
      <CustomersTable count={paginatedMembros.length} page={page} rows={paginatedMembros} rowsPerPage={rowsPerPage} />
        {/* 📌 Modal de Cadastro de Membro */}
        <AddMembros
        open={openDialog}
        onClose={() => setOpenDialog(false)} // 📌 Fecha o modal
        onMembroAdded={carregarMembros} // 📌 Recarrega a lista após adicionar um membro
      />
    </Stack>
  );
}

function applyPagination(rows: Membro[], page: number, rowsPerPage: number): Membro[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
