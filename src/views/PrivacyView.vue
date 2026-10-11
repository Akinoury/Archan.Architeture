<script setup lang="ts">
import DefaultLayout from '@/components/layout/DefaultLayout.vue'

const lastUpdated = '11 de outubro de 2026'
const privacyEmail = 'privacidade@archanarquitetura.com'
const contactEmail = 'contato@archanarquitetura.com'
</script>

<template>
  <DefaultLayout>
    <section class="legal-page reveal" aria-labelledby="privacy-title">
      <div class="container-custom">
        <header class="legal-header">
          <span class="section-label">Legal</span>
          <h1 id="privacy-title">Política de Privacidade</h1>
          <p>
            Esta política explica como o estúdio <strong>Archan Architecture</strong>
            trata os seus dados pessoais, em conformidade com a
            <strong>Lei Geral de Proteção de Dados Pessoais (LGPD — Lei nº 13.709/2018)</strong>.
          </p>
          <p class="legal-updated">Última atualização: {{ lastUpdated }}</p>
        </header>

        <article class="legal-content">
          <nav class="legal-toc" aria-label="Índice desta política">
            <h2>Índice</h2>
            <ol>
              <li><a href="#introducao">Introdução e controlador</a></li>
              <li><a href="#dados">Dados pessoais que tratamos</a></li>
              <li><a href="#finalidades">Finalidades e bases legais</a></li>
              <li><a href="#cookies">Cookies e armazenamento local</a></li>
              <li><a href="#compartilhamento">Compartilhamento de dados</a></li>
              <li><a href="#transferencia">Transferência internacional</a></li>
              <li><a href="#seguranca">Segurança e armazenamento</a></li>
              <li><a href="#retencao">Retenção de dados</a></li>
              <li><a href="#direitos">Direitos do titular</a></li>
              <li><a href="#exercer">Como exercer seus direitos</a></li>
              <li><a href="#encarregado">Encarregado (DPO)</a></li>
              <li><a href="#alteracoes">Alterações desta política</a></li>
            </ol>
          </nav>

          <h2 id="introducao">1. Introdução e controlador</h2>
          <p>
            O controlador dos dados pessoais tratados neste site é o estúdio
            <strong>Archan Architecture</strong>, responsável pelas decisões sobre o
            tratamento de dados pessoais. Esta política se aplica a todas as
            interações realizadas por meio deste site, como o envio de mensagens,
            a criação de conta e a navegação.
          </p>

          <h2 id="dados">2. Dados pessoais que tratamos</h2>
          <p>
            Tratamos apenas os dados necessários para as finalidades abaixo
            (princípio da minimização). Conforme a sua interação, podemos tratar:
          </p>
          <ul>
            <li><strong>Formulário de contato:</strong> nome, e-mail, telefone (opcional) e o conteúdo da mensagem.</li>
            <li><strong>Criação de conta / área restrita:</strong> nome, e-mail e senha (armazenada de forma protegida).</li>
            <li><strong>Dados de navegação:</strong> informações técnicas essenciais ao funcionamento e à segurança do site.</li>
            <li><strong>Preferências:</strong> as suas escolhas de consentimento de cookies.</li>
          </ul>
          <div class="legal-note">
            <p>
              Não coletamos dados considerados <strong>sensíveis</strong> (Art. 5º, II, da LGPD)
              e não solicitamos informações que não sejam necessárias às finalidades informadas.
            </p>
          </div>

          <h2 id="finalidades">3. Finalidades e bases legais</h2>
          <p>
            Cada tratamento é realizado com uma finalidade específica e amparado por
            uma das bases legais previstas no Art. 7º da LGPD:
          </p>
          <table class="legal-table">
            <thead>
              <tr>
                <th scope="col">Finalidade</th>
                <th scope="col">Dados</th>
                <th scope="col">Base legal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Responder a solicitações de contato e elaborar orçamentos</td>
                <td>Nome, e-mail, telefone, mensagem</td>
                <td>Consentimento e procedimentos preliminares de contrato</td>
              </tr>
              <tr>
                <td>Permitir acesso à área restrita e gerenciar a conta</td>
                <td>Nome, e-mail, senha</td>
                <td>Execução de contrato / consentimento</td>
              </tr>
              <tr>
                <td>Manter a segurança, prevenir fraudes e garantir o funcionamento do site</td>
                <td>Dados de navegação essenciais</td>
                <td>Legítimo interesse e cumprimento de obrigação legal</td>
              </tr>
              <tr>
                <td>Registrar e respeitar as suas preferências de cookies</td>
                <td>Preferências de consentimento</td>
                <td>Consentimento e cumprimento de obrigação legal</td>
              </tr>
            </tbody>
          </table>

          <h2 id="cookies">4. Cookies e armazenamento local</h2>
          <p>
            Utilizamos recursos necessários ao funcionamento do site e, mediante o
            seu consentimento, recursos de análise e marketing. Você pode aceitar,
            rejeitar ou personalizar essas escolhas a qualquer momento no banner de
            cookies ou na opção <strong>“Preferências de cookies”</strong> no rodapé.
            Consulte a <RouterLink to="/cookies">Política de Cookies</RouterLink> para
            detalhes sobre cada categoria.
          </p>

          <h2 id="compartilhamento">5. Compartilhamento de dados</h2>
          <p>
            Não vendemos os seus dados pessoais. Podemos compartilhá-los apenas com:
          </p>
          <ul>
            <li>Provedores de serviços essenciais (por exemplo, hospedagem e infraestrutura), que atuam como operadores e seguem as nossas instruções;</li>
            <li>Autoridades públicas, quando houver obrigação legal ou requisição fundamentada.</li>
          </ul>
          <p>
            Todo compartilhamento respeita as finalidades desta política e a LGPD.
          </p>

          <h2 id="transferencia">6. Transferência internacional</h2>
          <p>
            Alguns prestadores de infraestrutura podem armazenar dados em servidores
            localizados fora do Brasil. Nesses casos, adotamos garantias adequadas e
            exigimos dos operadores o cumprimento de padrões de proteção compatíveis
            com a LGPD (Art. 33).
          </p>

          <h2 id="seguranca">7. Segurança e armazenamento</h2>
          <p>
            Adotamos medidas técnicas e administrativas razoáveis para proteger os
            dados pessoais contra acessos não autorizados, perda, alteração ou
            destruição, como o uso de conexões criptografadas e o controle de acesso
            às informações.
          </p>

          <h2 id="retencao">8. Retenção de dados</h2>
          <p>
            Mantemos os dados pessoais apenas pelo tempo necessário ao cumprimento das
            finalidades informadas, para o exercício regular de direitos ou para
            atender a obrigações legais. Encerrado esse período, os dados são
            eliminados ou anonimizados, salvo quando a lei exigir a sua conservação.
          </p>

          <h2 id="direitos">9. Direitos do titular</h2>
          <p>
            Nos termos do Art. 18 da LGPD, você pode solicitar, a qualquer momento:
          </p>
          <ul>
            <li>Confirmação da existência de tratamento;</li>
            <li>Acesso aos seus dados pessoais;</li>
            <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
            <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos;</li>
            <li>Portabilidade dos dados, observados os segredos comercial e industrial;</li>
            <li>Eliminação dos dados tratados com base no consentimento;</li>
            <li>Informações sobre entidades com as quais compartilhamos dados;</li>
            <li>Informação sobre a possibilidade de não fornecer consentimento e suas consequências;</li>
            <li>Revogação do consentimento.</li>
          </ul>

          <h2 id="exercer">10. Como exercer seus direitos</h2>
          <p>
            Para exercer os seus direitos, envie um e-mail para
            <a :href="`mailto:${privacyEmail}`">{{ privacyEmail }}</a> com a sua
            solicitação. Responderemos no menor prazo possível, dentro dos limites da lei.
          </p>
          <p>
            Você também pode registrar reclamações relacionadas à proteção de dados
            pessoais à <strong>Autoridade Nacional de Proteção de Dados (ANPD)</strong>.
          </p>

          <h2 id="encarregado">11. Encarregado (DPO)</h2>
          <div class="legal-contact-box">
            <p><strong>Encarregado pelo Tratamento de Dados Pessoais (DPO)</strong></p>
            <p>Archan Architecture</p>
            <p>E-mail: <a :href="`mailto:${privacyEmail}`">{{ privacyEmail }}</a></p>
            <p>E-mail geral: <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a></p>
          </div>

          <h2 id="alteracoes">12. Alterações desta política</h2>
          <p>
            Esta política pode ser atualizada para refletir mudanças na legislação ou
            nos nossos processos. A versão vigente e a data da última atualização
            estarão sempre disponíveis nesta página.
          </p>

          <h2>13. Contato</h2>
          <p>
            Em caso de dúvidas sobre esta política ou sobre o tratamento dos seus dados,
            fale conosco pelo e-mail
            <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>.
          </p>
        </article>
      </div>
    </section>
  </DefaultLayout>
</template>
