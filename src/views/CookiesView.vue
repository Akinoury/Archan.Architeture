<script setup lang="ts">
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { useConsentStore } from '@/stores/consent'

const consent = useConsentStore()

const lastUpdated = '11 de outubro de 2026'
const privacyEmail = 'privacidade@archanarquitetura.com'
</script>

<template>
  <DefaultLayout>
    <section class="legal-page reveal" aria-labelledby="cookies-title">
      <div class="container-custom">
        <header class="legal-header">
          <span class="section-label">Legal</span>
          <h1 id="cookies-title">Política de Cookies</h1>
          <p>
            Esta política explica como o site da <strong>Archan Arquitetura</strong>
            utiliza cookies e tecnologias de armazenamento local, em conformidade com
            a <strong>LGPD (Lei nº 13.709/2018)</strong>.
          </p>
          <p class="legal-updated">Última atualização: {{ lastUpdated }}</p>
        </header>

        <article class="legal-content">
          <h2 id="o-que-sao">1. O que são cookies</h2>
          <p>
            Cookies são pequenos arquivos armazenados no seu navegador que ajudam o
            site a funcionar e a lembrar as suas preferências. Além de cookies,
            utilizamos o <em>armazenamento local</em> (localStorage/sessionStorage),
            que guarda informações no seu dispositivo de forma semelhante.
          </p>

          <h2 id="como-usamos">2. Como usamos</h2>
          <p>
            Classificamos os recursos em três categorias. Os
            <strong>necessários</strong> estão sempre ativos, pois sem eles o site não
            funciona corretamente. As demais categorias dependem do seu consentimento.
          </p>

          <table class="legal-table">
            <thead>
              <tr>
                <th scope="col">Categoria</th>
                <th scope="col">Descrição</th>
                <th scope="col">Consentimento</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Necessários</strong></td>
                <td>Garantem o funcionamento, a segurança e a sua sessão de acesso.</td>
                <td>Sempre ativos</td>
              </tr>
              <tr>
                <td><strong>Análise e desempenho</strong></td>
                <td>Ajudam a entender como o site é utilizado, para melhorá-lo.</td>
                <td>Opcional</td>
              </tr>
              <tr>
                <td><strong>Marketing</strong></td>
                <td>Permitem apresentar conteúdo e campanhas relevantes.</td>
                <td>Opcional</td>
              </tr>
            </tbody>
          </table>

          <h2 id="necessarios">3. Recursos necessários (sempre ativos)</h2>
          <p>
            São utilizados para funções essenciais e não dependem de consentimento,
            pois sem eles o serviço solicitado não pode ser prestado:
          </p>
          <table class="legal-table">
            <thead>
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">Onde</th>
                <th scope="col">Finalidade</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>archan_auth_token</code></td>
                <td>Armazenamento local</td>
                <td>Manter a sua sessão autenticada na área restrita.</td>
              </tr>
              <tr>
                <td><code>archan_user</code></td>
                <td>Armazenamento local</td>
                <td>Guardar os dados básicos da conta para exibir a área restrita.</td>
              </tr>
              <tr>
                <td><code>archan:cookie-consent</code></td>
                <td>Armazenamento local</td>
                <td>Registrar as suas escolhas de consentimento de cookies.</td>
              </tr>
              <tr>
                <td><code>archan:chunk-reload-at</code></td>
                <td>Armazenamento de sessão</td>
                <td>Evitar falhas ao carregar o site durante atualizações; apagado ao fechar a aba.</td>
              </tr>
            </tbody>
          </table>

          <h2 id="opcionais">4. Recursos opcionais</h2>
          <p>
            Atualmente <strong>não utilizamos</strong> cookies de análise ou de
            marketing. Caso venham a ser utilizados, eles só serão ativados se você
            conceder o consentimento correspondente e poderão ser recusados ou
            revogados a qualquer momento.
          </p>

          <h2 id="gerenciar">5. Gerenciar suas preferências</h2>
          <p>
            Você pode aceitar, rejeitar ou personalizar os cookies opcionais quando o
            banner aparecer e, a qualquer momento, revisar a sua escolha:
          </p>
          <div class="legal-note">
            <p>
              <button type="button" class="btn btn-accent btn-sm" @click="consent.openPreferences()">
                Abrir preferências de cookies
              </button>
            </p>
          </div>
          <p>
            A opção <strong>“Preferências de cookies”</strong> também está disponível no
            rodapé de todas as páginas. Além disso, você pode gerenciar ou excluir
            cookies diretamente nas configurações do seu navegador.
          </p>

          <h2 id="consentimento">6. Consentimento e revogação</h2>
          <p>
            O consentimento é solicitado de forma livre, informada e inequívoca, com
            opções de aceitar e recusar em igual destaque. Você pode revogá-lo a
            qualquer momento pelas preferências de cookies, sem prejuízo do uso das
            funcionalidades essenciais do site.
          </p>

          <h2 id="contato">7. Contato</h2>
          <p>
            Para dúvidas sobre esta política ou sobre os seus dados pessoais, fale
            conosco pelo e-mail
            <a :href="`mailto:${privacyEmail}`">{{ privacyEmail }}</a>. Consulte também
            a <RouterLink to="/privacidade">Política de Privacidade</RouterLink>.
          </p>
        </article>
      </div>
    </section>
  </DefaultLayout>
</template>
