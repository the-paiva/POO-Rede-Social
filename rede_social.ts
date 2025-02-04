// redeSocial.ts

import { Perfil, PerfilAvancado } from "./perfil";
import { Publicacao, PublicacaoAvancada } from "./publicacao";
import { Interacao } from "./interacao";
import {
    PerfilJaCadastradoError,
    PerfilNaoAutorizadoError,
    PerfilInativoError,
    InteracaoDuplicadaError,
    AmizadeJaExistenteError,
    ValorInvalidoException,
} from "./excecoes";

export class RedeSocial {
    private perfis: Perfil[] = [];
    private publicacoes: Publicacao[] = [];
    private solicitacoesAmizade: Map<Perfil, Perfil> = new Map();

    // Método para adicionar um perfil
    adicionarPerfil(perfil: Perfil): void {
        if (this.perfis.some(p => p.apelido.toLowerCase() === perfil.apelido.toLowerCase())) {
            throw new PerfilJaCadastradoError("Apelido já está em uso.");
        }

        if (!perfil.status) {
            throw new PerfilInativoError("Perfil inativo não pode ser adicionado.");
        }

        this.perfis.push(perfil);
    }

    // Método para buscar um perfil por email
    buscarPerfilPorEmail(email: string): Perfil | undefined {
        if (!email.includes("@")) {
            throw new ValorInvalidoException("Email inválido.");
        }

        return this.perfis.find(p => p.email === email);
    }

    // Método para buscar um perfil por apelido
    buscarPerfilPorApelido(apelido: string): Perfil | undefined {
        if (!apelido.trim()) {
            throw new ValorInvalidoException("Apelido inválido.");
        }

        return this.perfis.find(p => p.apelido === apelido);
    }

    // Método para listar perfis
    listarPerfis(): Perfil[] {
        return this.perfis;
    }

    // Método para adicionar uma publicação
    adicionarPublicacao(publicacao: Publicacao): void {
        if (!publicacao.perfil.status) {
            throw new PerfilInativoError("Perfil inativo não pode adicionar publicações.");
        }

        this.publicacoes.push(publicacao);
    }

    // Método para listar publicações
    listarPublicacoes(): Publicacao[] {
        return this.publicacoes.sort((a, b) => b.dataHora.getTime() - a.dataHora.getTime());
    }

    // Método para buscar uma publicação por ID
    buscarPublicacaoPorId(id: string): Publicacao | undefined {
        if (!id.trim()) {
            throw new ValorInvalidoException("ID inválido.");
        }

        return this.publicacoes.find(p => p.id === id);
    }

    // Método para enviar solicitação de amizade
    enviarSolicitacaoAmizade(de: Perfil, para: Perfil): void {
        if (!de.status || !para.status) {
            throw new PerfilInativoError("Perfis inativos não podem enviar solicitações de amizade.");
        }

        if (this.solicitacoesAmizade.has(de)) {
            throw new AmizadeJaExistenteError("Solicitação de amizade já enviada.");
        }

        this.solicitacoesAmizade.set(de, para);
    }

    // Método para aceitar solicitação de amizade
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

    // Método para recusar solicitação de amizade
    recusarSolicitacaoAmizade(de: Perfil, para: Perfil): void {
        if (!this.solicitacoesAmizade.has(de)) {
            throw new PerfilNaoAutorizadoError("Solicitação de amizade não encontrada.");
        }

        this.solicitacoesAmizade.delete(de);
    }
}
