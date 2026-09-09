# Revisão do Meu Financeiro — v58

## Corrigido

- Visual completo na primeira abertura: arquivos declarados no HTML, sem depender de uma segunda navegação e de alterações no documento pelo service worker.
- Removido o ciclo contínuo dos logos: o observador alterava o mesmo elemento que observava. Agora os logos são aplicados durante a renderização e reaproveitados quando o nome não muda.
- Cinco complementos visuais ativos reduzidos a dois; lógica principal extraída do HTML para um arquivo que pode ser armazenado em cache. Bibliotecas carregam com `defer`.
- Cache limitado aos arquivos públicos deste app, com recuperação da página sem conexão. Consultas financeiras e autenticação não entram no cache. Os dados continuam exigindo internet.
- Vencimentos de hoje permanecem hoje; dia 31 é ajustado ao último dia de meses curtos. Datas sem horário não recuam um dia no fuso brasileiro.
- Calendário e resumo dos cartões passam a usar `dia_fechamento` e `dia_vencimento`, que são os campos reais do cadastro. Limite disponível usa o saldo comprometido com as parcelas restantes.
- Receitas deixam de consumir o orçamento de despesas. Categorias com aspas são tratadas corretamente nos controles.
- Filtros preservados após atualização; busca com pequeno atraso para evitar trabalho a cada tecla; opção “Todo o período” funcional; botão “Mostrar mais”. Leitura de gastos paginada para não truncar históricos acima do limite padrão da API.
- Atualizações simultâneas compartilham a mesma consulta. Renovação de sessão e atualização de perfil não reiniciam a tela nem as consultas.
- Gráficos existentes são atualizados, em vez de destruídos e recriados a cada alteração.
- Formulários protegidos contra envio duplicado. Recorrências usam uma chave determinística de usuário/recorrência/mês e inserção que ignora conflitos, permitindo repetir tentativas sem criar outra linha para o mesmo período.
- Saudação por usuário, limpeza de dados visíveis na troca de conta e descarte de respostas antigas.
- Perfil abre corretamente; assinatura tem exclusão visível; extrato mostra data e botão de exclusão sem exigir gesto lateral.
- Botões de navegação semânticos, foco nos modais, Escape para fechar, controles com nomes acessíveis, tamanho de campos adequado ao iPhone e suporte a movimento reduzido.
- Tema claro respeita a seleção mesmo com o sistema em modo escuro. Cadastro sem sessão pede confirmação por e-mail, em vez de afirmar que o usuário já entrou.
- Rolagem normal deixa de disparar atualização como se fosse o gesto de puxar a tela.
- Erros de conexão aparecem com opção de tentar novamente. CSV trata conteúdo que poderia ser interpretado como fórmula.

## Verificação

- `TZ=America/Sao_Paulo node --test tests/regression.cjs`: sete testes de calendário, orçamento, paginação, cache e chaves de recorrências.
- Testes de integração em DOM simulado com 65 transações: inicialização, identidade, paginação, busca preservada, logos estáveis em repouso, perfil, modais, renovação de sessão, requisições e gravações duplicadas, erro de rede e saída da conta.
- Sintaxe de todos os arquivos JavaScript e referências locais do HTML verificadas.
- Não foi realizado teste visual em Safari/iPhone real, medição de velocidade no aparelho ou operação com dados financeiros reais. Nenhum dado real foi alterado por estes testes.

## Pontos que ainda exigem confirmação ou acesso ao serviço

- O cálculo de parcelas ainda é uma projeção por mês de compra, como no app original. Não há conciliação com faturas reais nem registro de pagamento da fatura; é necessário definir esse fluxo antes de mudar o significado dos valores.
- A biometria existente é um bloqueio local da interface; não implementa autenticação WebAuthn verificada pelo servidor. Não foi convertida em um sistema novo nesta revisão.
- Não há acesso ao painel Supabase nesta tarefa para confirmar políticas de segurança em produção, configuração de e-mails e agendamento de notificações. O código da função de notificações do servidor também precisa de revisão de fuso/calendário antes de uma nova publicação dessa função.
- Os marcadores legados de recorrência são respeitados. Duplicatas antigas, caso existam, não são excluídas automaticamente.
- Os saldos de contas são cadastrados manualmente; lançamentos no extrato não alteram esses saldos nem representam sincronização bancária.

As mudanças estão preparadas para revisão no GitHub. A versão pública só muda quando estas alterações forem incorporadas à branch publicada.
