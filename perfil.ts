// perfil.ts


import { Publicacao } from "./publicacao";
import { AmizadeJaExistenteError, PerfilInativoError, PerfilNaoAutorizadoError } from "./excecoes";
import { ulid } from "ulid";


export class Perfil {
    constructor(
        private _id: string = ulid(),
        private _apelido: string,
        private _foto: string,
        private _email: string,
        private _status: boolean,
        private _amigos: Perfil[] = [],
        private _postagens: Publicacao[] = []
    ) {}


    // Getters para acessar os atributos privados
    get id(): string {
        return this._id;
    }


    get apelido(): string {
        return this._apelido;
    }


    get foto(): string {
        return this._foto;
    }


    get email(): string {
        return this._email;
    }


    get status(): boolean {
        return this._status;
    }


    get amigos(): Perfil[] {
        return this._amigos;
    }


    get postagens(): Publicacao[] {
        return this._postagens;
    }


    adicionarAmigo(amigo: Perfil): void {
        if (this._amigos.includes(amigo)) {
            throw new AmizadeJaExistenteError("Amizade já existe.");
        }
        this._amigos.push(amigo);
    }


    removerAmigo(amigo: Perfil): void {
        this._amigos = this._amigos.filter(a => a !== amigo);
    }


    adicionarPublicacao(publicacao: Publicacao): void {
        if (!this._status) {
            throw new PerfilInativoError("Perfil inativo não pode adicionar publicações.");
        }
        this._postagens.push(publicacao);
    }


    listarAmigos(): Perfil[] {
        return this._amigos;
    }


    listarPostagens(): Publicacao[] {
        return this._postagens;
    }


    ativarDesativarPerfil(status: boolean): void {
        this._status = status;
    }
}


export class PerfilAvancado extends Perfil {
    habilitarDesabilitarPerfil(perfil: Perfil, status: boolean): void {
        if (!(this instanceof PerfilAvancado)) {
            throw new PerfilNaoAutorizadoError("Apenas perfis avançados podem habilitar/desabilitar outros perfis.");
        }
        perfil.ativarDesativarPerfil(status);
    }
}
