// interacao.ts


import { Perfil } from "./perfil";

// Enumeração dos tipos de interação disponíveis
export enum TipoInteracao {
    CURTIR = "👍",
    NAO_CURTIR = "👎",
    RISO = "😂",
    SURPRESA = "😮"
}

// Classe que representa uma interação com uma publicação
export class Interacao {
    constructor(
        private _id: number,
        private _tipo: TipoInteracao,
        private _perfil: Perfil
    ) {}

    // Getters para acessar os atributos privados
    get id(): number {
        return this._id;
    }

    get tipo(): TipoInteracao {
        return this._tipo;
    }

    get perfil(): Perfil {
        return this._perfil;
    }
}