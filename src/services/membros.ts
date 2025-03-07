export interface Membro {
    id?: number;
    nome: string;
    email?: string;
    telefone?: string;
    cargo: "Pastor" | "Supervisor" | "Líder" | "Membro";
    endereco?: string;
    celula_id?: number;
    lider_id?: number;
  }
  
  export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api";
  
  export const MembroService = {
    async listarMembros(): Promise<{ membros: Membro[] }> {
      try {
        const response = await fetch(`${API_BASE_URL}/membros`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
  
        if (!response.ok) throw new Error("Erro ao buscar membros");
        return await response.json();
      } catch (error) {
        console.error("Erro na requisição:", error);
        throw error;
      }
    },
  
    async criarMembro(dados: Membro): Promise<{ mensagem: string; id: number }> {
      try {
        const response = await fetch(`${API_BASE_URL}/membros`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados),
        });
  
        if (!response.ok) throw new Error("Erro ao criar membro");
        return await response.json();
      } catch (error) {
        console.error("Erro na requisição:", error);
        throw error;
      }
    },
  
    async contarMembros(): Promise<{ total_membros: number; cargos: Record<string, number> }> {
      try {
        const response = await fetch(`${API_BASE_URL}/membros/contagem`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
  
        if (!response.ok) throw new Error("Erro ao contar membros");
        return await response.json();
      } catch (error) {
        console.error("Erro na requisição:", error);
        throw error;
      }
    },
  };
  