// app.ts

// Arquivo que contêm o menu principal do programa


import chalk from "chalk";
import * as readline from "readline";
import{
    limparTela,
    adicionarPerfil,
    adicionarPublicacao,
    listarPerfis,
    listarPublicacoes,
    adicionarAmigo,
    removerAmigo,
    listarAmigos,
    salvarEstado,
    adicionarInteracao,
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
    console.log(chalk.green("2. Adicionar Publicação"));
    console.log(chalk.green("3. Listar Perfis"));
    console.log(chalk.green("4. Listar Publicações"));
    console.log(chalk.green("5. Adicionar Amigo"));
    console.log(chalk.green("6. Remover Amigo"));
    console.log(chalk.green("7. Listar Amigos"));
    console.log(chalk.green("8. Adicionar Interação"));
    console.log(chalk.red("9. Sair"));
    console.log(chalk.gray("=========================="));

    rl.question("Escolha uma opção: ", (opcao) => {
        try {
            switch (opcao) {
                case "1":
                    adicionarPerfil();
                    break;
                case "2":
                    adicionarPublicacao();
                    break;
                case "3":
                    listarPerfis();
                    break;
                case "4":
                    listarPublicacoes();
                    break;
                case "5":
                    adicionarAmigo();
                    break;
                case "6":
                    removerAmigo();
                    break;
                case "7":
                    listarAmigos();
                    break;
                case "8":
                    adicionarInteracao();
                    break;
                case "9":
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
