// persistencia.ts


import { Perfil } from "./perfil";
import { Publicacao } from "./publicacao";
import * as fs from "fs";


export function carregarDados(): { perfis: Perfil[], publicacoes: Publicacao[] } {
    try {
        const dados = JSON.parse(fs.readFileSync("dados.json", "utf-8"));
        
        // Reconstruir perfis
        const perfisMap = new Map<string, Perfil>(); // Usando string para o ID (ULID)
        dados.perfis.forEach((p: any) => {
            const perfil = new Perfil(p.id, p.apelido, p.foto, p.email, p.status);
            perfisMap.set(p.id, perfil);
        });

        // Reconstruir amizades
        dados.perfis.forEach((p: any) => {
            const perfil = perfisMap.get(p.id)!;
            p.amigos.forEach((idAmigo: string) => {
                const amigo = perfisMap.get(idAmigo);
                if (amigo) perfil.adicionarAmigo(amigo);
            });
        });

        // Reconstruir publicações
        const publicacoes: Publicacao[] = [];
        dados.publicacoes.forEach((p: any) => {
            const perfil = perfisMap.get(p.id_perfil); // Recupera o perfil pelo ID
            if (perfil) {
                const publicacao = new Publicacao(p.id, p.conteudo, new Date(p.dataHora), perfil);
                publicacoes.push(publicacao);
                perfil.adicionarPublicacao(publicacao);
            }
        });

        return {
            perfis: Array.from(perfisMap.values()),
            publicacoes: publicacoes
        };
    } catch (error) {
        return { perfis: [], publicacoes: [] };
    }
}


export function salvarDados(perfis: Perfil[], publicacoes: Publicacao[]): void {
    try {
        const dados = {
            perfis: perfis.map(perfil => ({
                id: perfil.id,
                apelido: perfil.apelido,
                foto: perfil.foto,
                email: perfil.email,
                status: perfil.status,
                amigos: perfil.amigos.map(amigo => amigo.id)
            })),
            publicacoes: publicacoes.map(publicacao => ({
                id: publicacao.id,
                conteudo: publicacao.conteudo,
                dataHora: publicacao.dataHora.toISOString(),
                id_perfil: publicacao.perfil.id, // ID do perfil
                apelido_perfil: publicacao.perfil.apelido // Apelido do perfil
            }))
        };

        fs.writeFileSync("dados.json", JSON.stringify(dados, null, 2), "utf-8");
    } catch (error) {
        console.error("Erro ao salvar dados:", error);
    }
}
