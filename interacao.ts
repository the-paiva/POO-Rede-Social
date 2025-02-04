// interacao.ts


import { Perfil } from "./perfil";


export enum TipoInteracao {
    CURTIR = "👍",
    NAO_CURTIR = "👎",
    RISO = "😂",
    SURPRESA = "😮"
}


export class Interacao {
    constructor(
        private _id: number,
        private _tipo: TipoInteracao,
        private _perfil: Perfil
    ) {}
    

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
