# Política de Segurança

## Escopo

Este repositório gera o **docs.robostage.com.br**, um site estático sem login, banco de dados ou formulários. A superfície de ataque é pequena, mas alguns problemas ainda são relevantes:

| Dentro do escopo deste repositório | Onde reportar |
| --- | --- |
| Credenciais, tokens ou dados pessoais publicados em uma página ou no histórico do Git | Aqui, de forma privada |
| Conteúdo da documentação que pode ser interpretado como HTML ou script (XSS) | Aqui, de forma privada |
| Dependência do site com vulnerabilidade conhecida e explorável | Aqui, de forma privada |
| Documentação que orienta uma configuração insegura | Aqui (pode ser issue pública, se não expuser nada) |

| Fora do escopo | Onde reportar |
| --- | --- |
| Vulnerabilidades na **plataforma** robostage.com.br (login, API, banco, permissões) | [Política de Segurança do roboStage](https://github.com/ohthias/roboStage/blob/main/.github/SECURITY.md) |

## Versões suportadas

Apenas a versão publicada em docs.robostage.com.br, gerada a partir da branch `main`, recebe correções.

| Versão | Suportada |
| --- | :---: |
| `main` (publicada) | ✅ |
| Versões anteriores | ❌ |

## Como reportar

**Não** abra uma issue pública para problemas de segurança.

Use o **Private Vulnerability Reporting** do GitHub:

1. Abra a aba **Security** do repositório.
2. Clique em **Report a vulnerability**.
3. Descreva o problema e envie.

Inclua sempre que possível:

- a página ou o arquivo afetado;
- o que foi exposto ou como explorar o problema;
- os passos para reproduzir;
- capturas de tela, se ajudarem.

### Encontrou uma credencial publicada?

Reporte de forma privada e **não use** a credencial. Os mantenedores vão revogá-la, removê-la do conteúdo e, se for preciso, reescrever o histórico do Git.

## O que esperar

1. Confirmação do recebimento em até **5 dias úteis**.
2. Avaliação da gravidade e da reprodutibilidade.
3. Correção e publicação de uma nova versão do site, quando o problema for confirmado.
4. Se não for um problema de segurança, explicaremos o motivo.

Obrigado por ajudar a manter o RoboStage seguro.
