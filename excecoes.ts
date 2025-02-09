// Exceção para quando um perfil já está cadastrado
export class PerfilJaCadastradoError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "PerfilJaCadastradoError";
    }
}

// Exceção para quando um perfil não está autorizado a realizar uma ação
export class PerfilNaoAutorizadoError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "PerfilNaoAutorizadoError";
    }
}

// Exceção para quando um perfil está inativo
export class PerfilInativoError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "PerfilInativoError";
    }
}

// Exceção para quando uma interação já foi feita
export class InteracaoDuplicadaError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InteracaoDuplicadaError";
    }
}

// Exceção para quando uma amizade já existe
export class AmizadeJaExistenteError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "AmizadeJaExistenteError";
    }
}

// Exceção para valores inválidos
export class ValorInvalidoException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ValorInvalidoException";
    }
}