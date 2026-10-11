<script setup lang="ts">
import DefaultLayout from '@/components/layout/DefaultLayout.vue'

const lastUpdated = '11 de outubro de 2026'
const contactEmail = 'contato@archanarquitetura.com'
</script>

<template>
  <DefaultLayout>
    <section class="legal-page reveal" aria-labelledby="terms-title">
      <div class="container-custom">
        <header class="legal-header">
          <span class="section-label">Legal</span>
          <h1 id="terms-title">Termos de Uso</h1>
          <p>
            Estes termos definem as regras para acesso e uso do site do estúdio
            <strong>Archan Arquitetura</strong>. Ao navegar ou utilizar o site, você
            concorda com as condições abaixo.
          </p>
          <p class="legal-updated">Última atualização: {{ lastUpdated }}</p>
        </header>

        <article class="legal-content">
          <h2 id="aceitacao">1. Aceitação dos termos</h2>
          <p>
            Ao acessar ou utilizar este site, você declara ter lido, compreendido e
            aceito integralmente estes Termos de Uso e a
            <RouterLink to="/privacidade">Política de Privacidade</RouterLink>. Caso
            não concorde, recomendamos que não utilize o site.
          </p>

          <h2 id="uso">2. Uso do site</h2>
          <p>Você se compromete a utilizar o site de forma lícita, especialmente a não:</p>
          <ul>
            <li>Utilizar o site para fins ilícitos ou que violem direitos de terceiros;</li>
            <li>Tentar obter acesso não autorizado a áreas restritas, sistemas ou dados;</li>
            <li>Introduzir vírus, códigos maliciosos ou realizar ações que possam comprometer a segurança e o funcionamento do site;</li>
            <li>Copiar, reproduzir ou distribuir o conteúdo sem autorização prévia e expressa.</li>
          </ul>

          <h2 id="propriedade">3. Propriedade intelectual</h2>
          <p>
            Todo o conteúdo deste site — incluindo textos, imagens, projetos, marcas,
            logotipos, ilustrações e o próprio layout — é de titularidade da
            Archan Arquitetura ou de terceiros que autorizaram o seu uso, sendo
            protegido pela legislação de propriedade intelectual (Lei nº 9.610/1998 e
            demais normas aplicáveis).
          </p>
          <p>
            É vedada a reprodução, adaptação ou utilização para fins comerciais sem
            autorização prévia e por escrito.
          </p>

          <h2 id="conteudo">4. Informações e conteúdo</h2>
          <p>
            As informações sobre projetos, valores e prazos têm caráter informativo e
            não constituem proposta comercial vinculante. Orçamentos e condições são
            definidos individualmente por meio dos nossos canais de atendimento.
          </p>

          <h2 id="conta">5. Cadastro e conta</h2>
          <p>
            Ao criar uma conta, você é responsável pela veracidade das informações
            fornecidas e pela confidencialidade das suas credenciais de acesso. O uso
            indevido da conta é de sua responsabilidade, devendo comunicar-nos
            imediatamente sobre qualquer suspeita de uso não autorizado.
          </p>

          <h2 id="responsabilidade">6. Limitação de responsabilidade</h2>
          <p>
            Empregamos esforços razoáveis para manter o site disponível, correto e
            seguro, mas não garantimos que o acesso será ininterrupto ou livre de
            erros. Não nos responsabilizamos por indisponibilidades temporárias,
            falhas de terceiros ou por danos decorrentes do uso indevido do site.
          </p>

          <h2 id="links">7. Links externos</h2>
          <p>
            O site pode conter links para páginas de terceiros. Não controlamos esses
            conteúdos e não nos responsabilizamos por suas práticas, políticas ou
            informações. Recomendamos a leitura dos termos e políticas desses sites.
          </p>

          <h2 id="privacidade">8. Privacidade</h2>
          <p>
            O tratamento de dados pessoais realizado por meio do site segue a nossa
            <RouterLink to="/privacidade">Política de Privacidade</RouterLink> e a
            <RouterLink to="/cookies">Política de Cookies</RouterLink>, em conformidade
            com a LGPD.
          </p>

          <h2 id="alteracoes">9. Alterações destes termos</h2>
          <p>
            Podemos atualizar estes Termos de Uso a qualquer momento. A versão vigente
            e a data da última atualização estarão sempre disponíveis nesta página. O
            uso continuado do site após as alterações implica concordância com os
            novos termos.
          </p>

          <h2 id="legislacao">10. Legislação e foro</h2>
          <p>
            Estes termos são regidos pelas leis brasileiras. Fica eleito o foro da
            comarca de São Paulo/SP para dirimir eventuais controvérsias, salvo
            disposição legal em contrário aplicável ao consumidor.
          </p>

          <h2 id="contato">11. Contato</h2>
          <p>
            Em caso de dúvidas sobre estes Termos de Uso, fale conosco pelo e-mail
            <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a>.
          </p>
        </article>
      </div>
    </section>
  </DefaultLayout>
</template>
