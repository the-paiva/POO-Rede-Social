// publicacao.ts


import { Perfil } from "./perfil";
import { Interacao, TipoInteracao } from "./interacao";
import { InteracaoDuplicadaError } from "./excecoes";
import { ulid } from "ulid";


export class Publicacao {
    constructor(
        private _id: string = ulid(),
        private _conteudo: string,
        private _dataHora: Date,
        private _perfil: Perfil
    ) {}


    // Getters para os atributos privados
    get id(): string {
        return this._id;
    }


    get conteudo(): string {
        return this._conteudo;
    }


    get dataHora(): Date {
        return this._dataHora;
    }


    get perfil(): Perfil {
        return this._perfil;
    }
}


export class PublicacaoAvancada extends Publicacao {
    private _interacoes: Interacao[] = [];


    adicionarInteracao(interacao: Interacao): void {
        if (this._interacoes.some(i => i.perfil === interacao.perfil)) {
            throw new InteracaoDuplicadaError("Interação duplicada.");
        }
        this._interacoes.push(interacao);
    }


    listarInteracoes(): Interacao[] {
        return this._interacoes;
    }
}
