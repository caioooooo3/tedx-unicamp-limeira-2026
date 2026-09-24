# TEDxUnicamp Limeira — Site v1.1

Protótipo estático para a edição 2026 — **Desconectados**.

## Dados já configurados
- Data: 20 de outubro de 2026
- Horário: 14h
- Cidade: Limeira, SP
- Inscrições: https://eventos.galoa.com.br/tedxunicamp-2026/registration/intro
- Landing da EPTV: `/eptv/`

## Como testar no seu computador
1. Extraia o ZIP.
2. Abra a pasta extraída.
3. Dê duplo clique em `index.html`.
4. Teste no navegador e clique nos botões de inscrição.

> Para uma prévia mais fiel das URLs, você também pode usar a extensão Live Server no VS Code.

## Como editar informações
Abra `data.js`. Nele você pode alterar:
- tema, data, horário, cidade e local;
- link de ingressos;
- nomes e descrições dos speakers.

As fotos ficam em `assets/speakers/`.

## Publicação recomendada
Suba todos os arquivos para um repositório GitHub e conecte o repositório ao Cloudflare Pages. Como o site é estático, não é necessário comando de build. O diretório publicado é a raiz do repositório.

## QR Code da EPTV
Depois que o site estiver publicado, use no QR Code a URL estável que termina em `/eptv/`, por exemplo:

`https://SEU-SITE.pages.dev/eptv/`

Não aponte o QR diretamente para o Galoá. Assim o destino pode ser alterado depois sem trocar o QR Code já veiculado.
