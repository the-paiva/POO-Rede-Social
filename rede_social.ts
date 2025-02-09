import { Perfil } from "./perfil";
import { Publicacao } from "./publicacao";
import {
    PerfilJaCadastradoError,
    PerfilNaoAutorizadoError,
    PerfilInativoError,
    InteracaoDuplicadaError,
    AmizadeJaExistenteError,
    ValorInvalidoException,
} from "./excecoes";

// Classe que representa a rede social
export class RedeSocial {
    private perfis: Perfil[] = [];
    private publicacoes: Publicacao[] = [];
    private solicitacoesAmizade: Map<Perfil, Perfil> = new Map();

    // Adiciona um perfil à rede social
    adicionarPerfil(perfil: Perfil): void {
        if (this.perfis.some(p => p.apelido.toLowerCase() === perfil.apelido.toLowerCase())) {
            throw new PerfilJaCadastradoError("Apelido já está em uso.");
        }

        if (!perfil.status) {
            throw new PerfilInativoError("Perfil inativo não pode ser adicionado.");
        }

        this.perfis.push(perfil);
    }

    // Busca um perfil por email
    buscarPerfilPorEmail(email: string): Perfil | undefined {
        if (!email.includes("@")) {
            throw new ValorInvalidoException("Email inválido.");
        }

        return this.perfis.find(p => p.email === email);
    }

    // Busca um perfil por apelido
    buscarPerfilPorApelido(apelido: string): Perfil | undefined {
        if (!apelido.trim()) {
            throw new ValorInvalidoException("Apelido inválido.");
        }

        return this.perfis.find(p => p.apelido === apelido);
    }

    // Lista todos os perfis
    listarPerfis(): Perfil[] {
        return this.perfis;
    }

    // Adiciona uma publicação à rede social
    adicionarPublicacao(publicacao: Publicacao): void {
        if (!publicacao.perfil.status) {
            throw new PerfilInativoError("Perfil inativo não pode adicionar publicações.");
        }

        this.publicacoes.push(publicacao);
    }

    // Lista todas as publicações ordenadas por data
    listarPublicacoes(): Publicacao[] {
        return this.publicacoes.sort((a, b) => b.dataHora.getTime() - a.dataHora.getTime());
    }

    // Busca uma publicação por ID
    buscarPublicacaoPorId(id: string): Publicacao | undefined {
        if (!id.trim()) {
            throw new ValorInvalidoException("ID inválido.");
        }

        return this.publicacoes.find(p => p.id === id);
    }

    // Envia uma solicitação de amizade
    enviarSolicitacaoAmizade(de: Perfil, para: Perfil): void {
        if (!de.status || !para.status) {
            throw new PerfilInativoError("Perfis inativos não podem enviar solicitações de amizade.");
        }

        if (this.solicitacoesAmizade.has(de)) {
            throw new AmizadeJaExistenteError("Solicitação de amizade já enviada.");
        }

        this.solicitacoesAmizade.set(de, para);
    }

    // Aceita uma solicitação de amizade
    aceitarSolicitacaoAmizade(de: Perfil, para: Perfil): void {
        if (!de.status || !para.status) {
            throw new PerfilInativoError("Perfis inativos não podem aceitar solicitações de amizade.");
        }

        if (de.amigos.includes(para)) {
            throw new AmizadeJaExistenteError("Amizade já existe.");
        }

        de.adicionarAmigo(para);
        para.adicionarAmigo(de);
        this.solicitacoesAmizade.delete(de);
    }

    // Recusa uma solicitação de amizade
    recusarSolicitacaoAmizade(de: Perfil, para: Perfil): void {
        if (!this.solicitacoesAmizade.has(de)) {
            throw new PerfilNaoAutorizadoError("Solicitação de amizade não encontrada.");
        }

        this.solicitacoesAmizade.delete(de);
    }
}