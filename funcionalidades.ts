// funcionalidades.ts

// Arquivo que contêm as funcionalidades gerais do programa


import { rl } from "./app";
import { RedeSocial } from "./rede_social";
import { Perfil, PerfilAvancado } from "./perfil";
import { Publicacao, PublicacaoAvancada } from "./publicacao";
import { salvarDados, carregarDados } from "./persistencia";
import { Interacao, TipoInteracao } from "./interacao";
import { menuPrincipal } from "./app";
import chalk from "chalk";


const dadosIniciais = carregarDados();
export const redeSocial = new RedeSocial();

// Carregar perfis e publicações iniciais
dadosIniciais.perfis.forEach(p => {
    try {
        redeSocial.adicionarPerfil(p);
    } catch (error) {
        console.error(chalk.red("Erro ao carregar perfil:"), error);
    }
});

dadosIniciais.publicacoes.forEach(p => {
    try {
        redeSocial.adicionarPublicacao(p);
    } catch (error) {
        console.error(chalk.red("Erro ao carregar publicação:"), error);
    }
});


export function salvarEstado(): void {
    try {
        salvarDados(redeSocial.listarPerfis(), redeSocial.listarPublicacoes());
    } catch (error) {
        console.error(chalk.red("Erro ao salvar dados:"), error);
    }
}


export function limparTela(): void {
    console.clear();
}


export function enterParaContinuar(): void {
    console.log(chalk.gray("======================="));
    rl.question("Pressione Enter para voltar ao menu...", () => menuPrincipal());
}


export function adicionarPerfil(): void {
    limparTela();
    console.log(chalk.bold.blue("=== ADICIONAR PERFIL ==="));

    rl.question("Apelido: ", (apelido) => {
        if (!apelido.trim()) {
            console.log(chalk.red("Apelido inválido!"));
            enterParaContinuar();
        }

        rl.question("Email: ", (email) => {
            if (!email.includes("@")) {
                console.log(chalk.red("Email inválido!"));
                enterParaContinuar();
            }

            rl.question("Tipo de Perfil (simples/avancado): ", (tipoPerfil) => {
                try {
                    let perfil: Perfil;

                    if (tipoPerfil.toLowerCase() === "avancado") {
                        // Cria um perfil avançado
                        perfil = new PerfilAvancado(undefined, apelido.toLowerCase(), "😊", email.toLowerCase(), true);
                        console.log(chalk.green("Perfil avançado adicionado com sucesso!"));
                    } else if (tipoPerfil.toLowerCase() === "simples") {
                        // Cria um perfil simples
                        perfil = new Perfil(undefined, apelido.toLowerCase(), "😊", email.toLowerCase(), true);
                        console.log(chalk.green("Perfil simples adicionado com sucesso!"));
                    } else {
                        throw new Error("Tipo de perfil inválido. Use 'simples' ou 'avancado'.");
                    }

                    // Adiciona o perfil à rede social
                    redeSocial.adicionarPerfil(perfil);
                    salvarEstado();

                    console.log(chalk.cyan(`ID do perfil: ${perfil.id}`));
                } catch (error: any) {
                    console.error(chalk.red(error.message));
                } finally {
                    enterParaContinuar();
                }
            });
        });
    });
}


export function ativarDesativarPerfil(): void {
    limparTela();
    console.log(chalk.bold.blue("=== HABILITAR/DESABILITAR PERFIL ==="));

    rl.question("Apelido do Perfil Avançado: ", (apelidoPerfilAvancado) => {
        rl.question("Apelido do Perfil a ser Modificado: ", (apelidoPerfilModificar) => {
            rl.question("Habilitar (true) ou Desabilitar (false): ", (status) => {
                try {
                    const perfilAvancado = redeSocial.buscarPerfilPorApelido(apelidoPerfilAvancado);
                    const perfilModificar = redeSocial.buscarPerfilPorApelido(apelidoPerfilModificar);

                    if (!perfilAvancado || !perfilModificar) {
                        throw new Error("Perfil não encontrado. Verifique os apelidos e tente novamente.");
                    }

                    if (!(perfilAvancado instanceof PerfilAvancado)) {
                        throw new Error("Apenas perfis avançados podem habilitar/desabilitar outros perfis.");
                    }

                    // Converte a entrada do usuário para booleano
                    const novoStatus = status.toLowerCase() === "true";

                    // Habilita/desabilita o perfil
                    perfilAvancado.habilitarDesabilitarPerfil(perfilModificar, novoStatus);
                    salvarEstado();

                    console.log(chalk.green(`Perfil ${perfilModificar.apelido} foi ${novoStatus ? "habilitado" : "desabilitado"} com sucesso!`));
                } catch (error: any) {
                    console.log(chalk.red(error.message));
                } finally {
                    setTimeout(() => menuPrincipal(), 1000);
                }
            });
        });
    });
}


export function adicionarPublicacao(): void {
    limparTela();
    console.log(chalk.bold.blue("=== ADICIONAR PUBLICAÇÃO ==="));

    rl.question("Conteúdo: ", (conteudo) => {
        if (!conteudo.trim()) {
            console.log(chalk.red("Conteúdo não pode ser vazio!"));
            return setTimeout(() => menuPrincipal(), 1000);
        }

        rl.question("Apelido do Perfil: ", (apelido) => {
            try {
                const perfil = redeSocial.buscarPerfilPorApelido(apelido);
                if (perfil) {
                    // Cria a publicação associando o perfil
                    const publicacao = new Publicacao(undefined, conteudo, new Date(), perfil);
                    
                    // Adiciona a publicação à rede social
                    redeSocial.adicionarPublicacao(publicacao);
                    
                    // Salva o estado atual (persistência)
                    salvarEstado();
                    
                    console.log(chalk.green("Publicação adicionada com sucesso!"));
                    console.log(chalk.cyan(`ID da publicação: ${publicacao.id}`));
                } else {
                    console.log(chalk.red("Perfil não encontrado!"));
                }
            } catch (error) {
                console.error(chalk.red("Erro ao adicionar publicação:"), error);
            } finally {
                enterParaContinuar();
            }
        });
    });
}

export function adicionarPublicacaoAvancada(): void {
    limparTela();
    console.log(chalk.bold.blue("=== ADICIONAR PUBLICAÇÃO AVANÇADA ==="));

    rl.question("Conteúdo: ", (conteudo) => {
        if (!conteudo.trim()) {
            console.log(chalk.red("Conteúdo não pode ser vazio!"));
            return setTimeout(() => menuPrincipal(), 1000);
        }

        rl.question("Apelido do Perfil: ", (apelido) => {
            try {
                const perfil = redeSocial.buscarPerfilPorApelido(apelido);
                if (perfil) {
                    // Cria a publicação avançada associando o perfil
                    const publicacao = new PublicacaoAvancada(undefined, conteudo, new Date(), perfil);
                    
                    // Adiciona a publicação avançada à rede social
                    redeSocial.adicionarPublicacao(publicacao);
                    
                    // Salva o estado atual (persistência)
                    salvarEstado();
                    
                    console.log(chalk.green("Publicação avançada adicionada com sucesso!"));
                    console.log(chalk.cyan(`ID da publicação: ${publicacao.id}`));
                } else {
                    console.log(chalk.red("Perfil não encontrado!"));
                }
            } catch (error) {
                console.error(chalk.red("Erro ao adicionar publicação avançada:"), error);
            } finally {
                enterParaContinuar();
            }
        });
    });
}

export function listarPerfis(): void {
    try {
        limparTela();
        console.log(chalk.bold.blue("=== LISTA DE PERFIS ==="));

        const perfis = redeSocial.listarPerfis();

        if (perfis.length > 0) {
            perfis.forEach(p => {
                // Verifica se o perfil é avançado ou simples
                const tipoPerfil = p instanceof PerfilAvancado ? "Avançado" : "Simples";

                // Verifica o status do perfil
                const statusPerfil = p.status ? "Ativado" : "Desativado";

                console.log(chalk.cyan(
                    `ID: ${p.id}, Apelido: ${p.apelido}, Email: ${p.email}, Tipo: ${tipoPerfil}, Status: ${statusPerfil}`
                ));
            });
        } else {
            console.log(chalk.yellow("Nenhum perfil cadastrado."));
        }
    } catch (error) {
        console.log(chalk.red("Erro ao listar perfis: "), error);
    } finally {
        console.log(chalk.gray("======================="));
        rl.question("Pressione Enter para voltar ao menu...", () => menuPrincipal());
    }
}

export function listarPublicacoes(): void {
    try {
        limparTela();
        console.log(chalk.bold.blue("=== LISTA DE PUBLICAÇÕES ==="));

        const publicacoes = redeSocial.listarPublicacoes();

        if (publicacoes.length > 0) {
            publicacoes.forEach(p => {
                // Verifica se a publicação é avançada ou simples
                const tipoPublicacao = p instanceof PublicacaoAvancada ? "Avançada" : "Simples";

                console.log(chalk.cyan(
                    `\nID da publicação: ${p.id}, Data: ${p.dataHora}\nID do Usuário: ${p.perfil.id}, Apelido do Usuário: ${p.perfil.apelido}\nConteúdo: ${p.conteudo}\nTipo: ${tipoPublicacao}`
                ));
            });
        } else {
            console.log(chalk.yellow("Nenhuma publicação encontrada."));
        }
    } catch (error) {
        console.log(chalk.red("Erro ao listar publicações: "), error);
    } finally {
        enterParaContinuar();
    }
}

export function adicionarAmigo(): void {
    limparTela();
    console.log(chalk.bold.blue("=== ADICIONAR AMIGO ==="));

    rl.question("Apelido do Perfil que irá solicitar amizade: ", (apelidoPerfil) => {
        rl.question("Apelido do Amigo: ", (apelidoAmigo) => {
            try {
                const perfil = redeSocial.buscarPerfilPorApelido(apelidoPerfil);
                const amigo = redeSocial.buscarPerfilPorApelido(apelidoAmigo);

                if (!perfil || !amigo) {
                    throw new Error("Perfil ou amigo não encontrado. Verifique os apelidos e tente novamente.");
                }

                perfil.adicionarAmigo(amigo);
                salvarEstado();
                console.log(chalk.green("Amigo adicionado com sucesso!"));
            } catch (error: any) {
                console.log(chalk.red(error.message));
            } finally {
                setTimeout(() => menuPrincipal(), 1000);
            }
        });
    });
}

export function removerAmigo(): void {
    limparTela();
    console.log(chalk.bold.blue("=== REMOVER AMIGO ==="));

    rl.question("Apelido do Perfil: ", (apelidoPerfil) => {
        rl.question("Apelido do Amigo: ", (apelidoAmigo) => {
            try {
                const perfil = redeSocial.buscarPerfilPorApelido(apelidoPerfil);
                const amigo = redeSocial.buscarPerfilPorApelido(apelidoAmigo);

                if (!perfil || !amigo) {
                    throw new Error("Perfil ou amigo não encontrado. Verifique os apelidos e tente novamente.");
                }

                // Verifica se a amizade existe antes de tentar remover
                if (!perfil.amigos.includes(amigo)) {
                    throw new Error("Amizade não encontrada. Verifique os apelidos e tente novamente.");
                }

                // Remove a amizade
                perfil.removerAmigo(amigo);
                salvarEstado();
                console.log(chalk.green("Amigo removido com sucesso!"));
            } catch (error: any) {
                console.log(chalk.red(error.message));
            } finally {
                setTimeout(() => menuPrincipal(), 1000);
            }
        });
    });
}


export function listarAmigos(): void {
    limparTela();
    console.log(chalk.bold.blue("======= LISTA DE AMIGOS ======="));

    rl.question("Apelido do Perfil: ", (apelidoPerfil) => {
        try {
            const perfil = redeSocial.buscarPerfilPorApelido(apelidoPerfil);

            if (!perfil) {
                throw new Error("Perfil não encontrado. Verifique o apelido e tente novamente.");
            }

            const amigos = perfil.listarAmigos();

            if (amigos.length > 0) {
                amigos.forEach(a => console.log(chalk.cyan(`ID: ${a.id}, Apelido: ${a.apelido}, Email: ${a.email}`)));
            } else {
                console.log(chalk.yellow("Nenhum amigo encontrado."));
            }
        } catch (error: any) {
            console.log(chalk.red(error.message));
        } finally {
            console.log(chalk.gray("==============================="));
            rl.question("Pressione Enter para voltar ao menu...", () => menuPrincipal());
        }
    });
}

export function adicionarInteracao(): void {
    limparTela();
    console.log(chalk.bold.blue("=== ADICIONAR INTERAÇÃO ==="));

    // Mostra a lista de publicações avançadas
    console.log(chalk.bold.blue("\nLista de publicações avançadas:"));
    const publicacoes = redeSocial.listarPublicacoes().filter(p => p instanceof PublicacaoAvancada);

    if (publicacoes.length > 0) {
        publicacoes.forEach(p => {
            console.log(chalk.cyan(
                `\nID da publicação: ${p.id}, Data: ${p.dataHora},\nID do Usuário: ${p.perfil.id}, Apelido do Usuário: ${p.perfil.apelido},\nConteúdo: ${p.conteudo}`
            ));
        });
    } else {
        console.log(chalk.yellow("Nenhuma publicação avançada encontrada."));
    }

    rl.question("\nApelido do Perfil que irá interagir: ", (apelidoPerfil) => {
        rl.question("ID da Publicação: ", (idPublicacao) => {
            rl.question("Tipo de Interação (CURTIR, NAO_CURTIR, RISO, SURPRESA): ", (tipoInteracao) => {
                try {
                    const perfil = redeSocial.buscarPerfilPorApelido(apelidoPerfil);
                    if (!perfil) {
                        throw new Error("Perfil não encontrado. Verifique o apelido e tente novamente.");
                    }

                    const publicacao = redeSocial.buscarPublicacaoPorId(idPublicacao);
                    if (!publicacao || !(publicacao instanceof PublicacaoAvancada)) {
                        throw new Error("Publicação não encontrada ou não suporta interações avançadas.");
                    }

                    // Verifica se o tipo de interação é válido
                    const tipo = TipoInteracao[tipoInteracao as keyof typeof TipoInteracao];
                    if (tipo === undefined) {
                        throw new Error("Tipo de interação inválido. Use CURTIR, NAO_CURTIR, RISO ou SURPRESA.");
                    }

                    // Cria a interação
                    const interacao = new Interacao(Date.now(), tipo, perfil);

                    // Adiciona a interação à publicação avançada
                    publicacao.adicionarInteracao(interacao);
                    salvarEstado();

                    console.log(chalk.green("Interação adicionada com sucesso!"));
                } catch (error: any) {
                    console.log(chalk.red(error.message));
                } finally {
                    setTimeout(() => menuPrincipal(), 1000);
                }
            });
        });
    });
}


export function listarInteracoes(): void {
    limparTela();
    console.log(chalk.bold.blue("=== LISTAR INTERAÇÕES DE UMA PUBLICAÇÃO ==="));

    // Mostra a lista de publicações avançadas
    console.log(chalk.bold.blue("\nLista de publicações avançadas:"));
    const publicacoes = redeSocial.listarPublicacoes().filter(p => p instanceof PublicacaoAvancada);

    if (publicacoes.length > 0) {
        publicacoes.forEach(p => {
            console.log(chalk.cyan(
                `\nID da publicação: ${p.id}, Data: ${p.dataHora},\nID do Usuário: ${p.perfil.id}, Apelido do Usuário: ${p.perfil.apelido},\nConteúdo: ${p.conteudo}`
            ));
        });
    } else {
        console.log(chalk.yellow("Nenhuma publicação avançada encontrada."));
        setTimeout(() => menuPrincipal(), 1000);
        return;
    }

    rl.question("\nID da Publicação: ", (idPublicacao) => {
        try {
            const publicacao = redeSocial.buscarPublicacaoPorId(idPublicacao);
            if (!publicacao || !(publicacao instanceof PublicacaoAvancada)) {
                throw new Error("Publicação não encontrada ou não suporta interações avançadas.");
            }

            limparTela();
            console.log(chalk.bold.blue("=== PUBLICAÇÃO SELECIONADA ===\n"));
            console.log(chalk.cyan(
                `ID da publicação: ${publicacao.id}, Data: ${publicacao.dataHora},\nID do Usuário: ${publicacao.perfil.id}, Apelido do Usuário: ${publicacao.perfil.apelido},\nConteúdo: ${publicacao.conteudo}`
            ));
            
            const interacoes = publicacao.listarInteracoes(); // Lista as interações da publicação

            if (interacoes.length > 0) {
                console.log(chalk.bold.blue("\nLista de Interações:"));
                interacoes.forEach(i => {
                    console.log(chalk.cyan(
                        `Tipo: ${i.tipo}, Perfil: ${i.perfil.apelido} (ID: ${i.perfil.id})`
                    ));
                });
            } else {
                console.log(chalk.yellow("Nenhuma interação encontrada para esta publicação."));
            }
        } catch (error: any) {
            console.log(chalk.red(error.message));
        } finally {
            console.log(chalk.gray("======================="));
            rl.question("Pressione Enter para voltar ao menu...", () => menuPrincipal());
        }
    });
}
