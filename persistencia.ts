import { Perfil, PerfilAvancado } from "./perfil";
import { Publicacao, PublicacaoAvancada } from "./publicacao";
import { Interacao } from "./interacao";
import * as fs from "fs";
import * as path from "path";

const PERSISTENCIA_DIR = "saves";

// Garante que a pasta de persistência existe
function garantirPastaPersistencia() {
    if (!fs.existsSync(PERSISTENCIA_DIR)) {
        fs.mkdirSync(PERSISTENCIA_DIR);
    }
}

// Carrega os dados salvos
export function carregarDados(): { perfis: Perfil[], publicacoes: Publicacao[] } {
    try {
        garantirPastaPersistencia();

        // Carrega perfis simples e avançados
        const perfisSimples = JSON.parse(fs.readFileSync(path.join(PERSISTENCIA_DIR, "perfilSimples.json"), "utf-8"));
        const perfisAvancados = JSON.parse(fs.readFileSync(path.join(PERSISTENCIA_DIR, "perfilAvancado.json"), "utf-8"));
        const perfisMap = new Map<string, Perfil>();

        // Carrega perfis simples
        perfisSimples.forEach((p: any) => {
            let perfil: Perfil = new Perfil(p.id, p.apelido, p.foto, p.email, p.status);
            perfisMap.set(p.id, perfil);
        });

        // Carrega perfis avançados
        perfisAvancados.forEach((p: any) => {
            let perfil: Perfil = new PerfilAvancado(p.id, p.apelido, p.foto, p.email, p.status);
            perfisMap.set(p.id, perfil);
        });

        // Carrega amizades (perfil avançado)
        perfisAvancados.forEach((p: any) => {
            const perfil = perfisMap.get(p.id)!;

            if (perfil instanceof PerfilAvancado) {
                p.amigos.forEach((idAmigo: string) => {
                    const amigo = perfisMap.get(idAmigo);
                    if (amigo) perfil.adicionarAmigo(amigo);
                });
            }
        });

        // Carrega publicações simples
        const publicacoesSimples = JSON.parse(fs.readFileSync(path.join(PERSISTENCIA_DIR, "publicacaoSimples.json"), "utf-8"));
        const publicacoes: Publicacao[] = [];

        publicacoesSimples.forEach((p: any) => {
            const perfil = perfisMap.get(p.id_perfil);

            if (perfil) {
                const publicacao = new Publicacao(p.id, p.conteudo, new Date(p.dataHora), perfil);
                publicacoes.push(publicacao);
                perfil.adicionarPublicacao(publicacao);
            }
        });

        // Carrega publicações avançadas e interações
        const publicacoesAvancadas = JSON.parse(fs.readFileSync(path.join(PERSISTENCIA_DIR, "publicacaoAvancada.json"), "utf-8"));

        publicacoesAvancadas.forEach((p: any) => {
            const perfil = perfisMap.get(p.id_perfil);

            if (perfil) {
                const publicacao = new PublicacaoAvancada(p.id, p.conteudo, new Date(p.dataHora), perfil);

                if (p.interacoes) {
                    p.interacoes.forEach((i: any) => {
                        const perfilInteracao = perfisMap.get(i.id_perfil);

                        if (perfilInteracao) {
                            const interacao = new Interacao(i.id, i.tipo, perfilInteracao);
                            publicacao.adicionarInteracao(interacao);
                        }
                    });
                }

                publicacoes.push(publicacao);
                perfil.adicionarPublicacao(publicacao);
            }
        });

        return {
            perfis: Array.from(perfisMap.values()),
            publicacoes: publicacoes
        };
    } catch (error) {
        return { perfis: [], publicacoes: [] };
    }
}

// Salva os dados atuais
export function salvarDados(perfis: Perfil[], publicacoes: Publicacao[]): void {
    try {
        garantirPastaPersistencia();

        // Separa perfis simples e avançados
        const perfisSimples = perfis
            .filter(perfil => !(perfil instanceof PerfilAvancado))
            .map(perfil => ({
                id: perfil.id,
                apelido: perfil.apelido,
                foto: perfil.foto,
                email: perfil.email,
                status: perfil.status,
                tipo: "simples" // Todos aqui são simples
            }));

        const perfisAvancados = perfis
            .filter(perfil => perfil instanceof PerfilAvancado)
            .map(perfil => ({
                id: perfil.id,
                apelido: perfil.apelido,
                foto: perfil.foto,
                email: perfil.email,
                status: perfil.status,
                tipo: "avancado", // Todos aqui são avançados
                amigos: (perfil as PerfilAvancado).amigos.map(amigo => amigo.id) // Adiciona a lista de amigos
            }));

        // Salva perfis simples
        fs.writeFileSync(path.join(PERSISTENCIA_DIR, "perfilSimples.json"), JSON.stringify(perfisSimples, null, 2), "utf-8");

        // Salva perfis avançados
        fs.writeFileSync(path.join(PERSISTENCIA_DIR, "perfilAvancado.json"), JSON.stringify(perfisAvancados, null, 2), "utf-8");

        // Salva publicações simples
        const publicacoesSimples = publicacoes
            .filter(p => !(p instanceof PublicacaoAvancada))
            .map(publicacao => ({
                id: publicacao.id,
                conteudo: publicacao.conteudo,
                dataHora: publicacao.dataHora.toISOString(),
                id_perfil: publicacao.perfil.id,
                apelido_perfil: publicacao.perfil.apelido
            }));

        fs.writeFileSync(path.join(PERSISTENCIA_DIR, "publicacaoSimples.json"), JSON.stringify(publicacoesSimples, null, 2), "utf-8");

        // Salva publicações avançadas e interações
        const publicacoesAvancadas = publicacoes
            .filter(p => p instanceof PublicacaoAvancada)
            .map(publicacao => ({
                id: publicacao.id,
                conteudo: publicacao.conteudo,
                dataHora: publicacao.dataHora.toISOString(),
                id_perfil: publicacao.perfil.id,
                apelido_perfil: publicacao.perfil.apelido,
                interacoes: (publicacao as PublicacaoAvancada).listarInteracoes().map(i => ({
                    id: i.id,
                    tipo: i.tipo,
                    id_perfil: i.perfil.id
                }))
            }));

        fs.writeFileSync(path.join(PERSISTENCIA_DIR, "publicacaoAvancada.json"), JSON.stringify(publicacoesAvancadas, null, 2), "utf-8");
    } catch (error) {
        console.error("Erro ao salvar dados:", error);
    }
}