// app.ts

// Arquivo que contêm o menu principal do programa


import chalk from "chalk";
import * as readline from "readline";
import{
    limparTela,
    adicionarPerfil,
    ativarDesativarPerfil,
    adicionarPublicacao,
    adicionarPublicacaoAvancada,
    listarPerfis,
    listarPublicacoes,
    adicionarAmigo,
    adicionarInteracao,
    listarInteracoes,
    removerAmigo,
    listarAmigos,
    salvarEstado,
} from "./funcionalidades";


// Interface readline e instância da RedeSocial
export const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


export function menuPrincipal(): void {
    limparTela();
    console.log(chalk.bold.blue("======== JACK NET ========"));
    console.log(chalk.green("1. Adicionar Perfil"));
    console.log(chalk.green("2. Listar Perfis"));
    console.log(chalk.green("3. Ativar/Desativar Perfil"))
    console.log(chalk.green("4. Adicionar Publicação Simples"));
    console.log(chalk.green("5. Adicionar Publicação Avançada"));
    console.log(chalk.green("6. Listar Publicações"));
    console.log(chalk.green("7. Adicionar Interação"));
    console.log(chalk.green("8. Listar Interações"));
    console.log(chalk.green("9. Adicionar Amigo"));
    console.log(chalk.green("10. Remover Amigo"));
    console.log(chalk.green("11. Listar Amigos"));
    console.log(chalk.red("0. Sair"));
    console.log(chalk.gray("=========================="));

    rl.question("Escolha uma opção: ", (opcao) => {
        try {
            switch (opcao) {
                case "1":
                    adicionarPerfil();
                    break;
                case "2":
                    listarPerfis();
                    break;
                case "3":
                    ativarDesativarPerfil();
                    break;
                case "4":
                    adicionarPublicacao();
                    break;
                case "5":
                    adicionarPublicacaoAvancada();
                    break;
                case "6":
                    listarPublicacoes();
                    break;
                case "7":
                    adicionarInteracao()
                    break;
                case "8":
                    listarInteracoes();
                    break;
                case "9":
                    adicionarAmigo();
                    break;
                case "10":
                    removerAmigo();
                    break;
                case "11":
                    listarAmigos();
                    break;
                case "0":
                    console.log(chalk.yellow("\nSaindo..."));
                    salvarEstado();
                    rl.close();
                    break;
                default:
                    console.log(chalk.red("Opção inválida. Tente novamente."));
                    setTimeout(() => menuPrincipal(), 1000);
            }
        } catch (error) {
            console.error(chalk.red("Erro inesperado:"), error);
            setTimeout(() => menuPrincipal(), 1000);
        }
    });
}


menuPrincipal();
