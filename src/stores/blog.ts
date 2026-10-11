import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { BlogPost } from '@/types'

const demoPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Tendências de Arquitetura Sustentável para 2024',
    excerpt: 'Descubra as principais tendências que vão moldar a arquitetura verde nos próximos anos, desde materiais inovadores até sistemas passivos de climatização.',
    content: `
      <h2>Introdução</h2>
      <p>A arquitetura sustentável deixou de ser uma tendência para se tornar uma necessidade. Em 2024, vemos uma convergência de tecnologia, design e consciência ambiental criando edifícios que não apenas minimizam impacto, mas regeneram o ambiente.</p>

      <h2>Materiais Inovadores</h2>
      <p>O uso de materiais como hempcrete (concreto de cânhamo), micélio (fungos) e plástico reciclado está revolucionando a construção. Esses materiais oferecem excelente performance térmica com pegada de carbono negativa.</p>

      <h2>Design Biofílico</h2>
      <p>A integração da natureza nos espaços construídos melhora produtividade, reduz stress e aumenta bem-estar. Paredes verdes, iluminação natural otimizada e ventilação cruzada são essenciais.</p>

      <h2>Sistemas Passivos</h2>
      <p>Estratégias como orientação solar, massa térmica, chaminés solares e ventilação natural reduzem drasticamente a necessidade de sistemas ativos de climatização.</p>

      <h2>Conclusão</h2>
      <p>O futuro da arquitetura é regenerativo. Cada projeto deve ser pensado como parte de um ecossistema maior, contribuindo positivamente para o meio ambiente e a qualidade de vida.</p>
    `,
    image: '/assets/images/project_render_1776171965188.png',
    author: 'Archan Team',
    publishedAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
    tags: ['Sustentabilidade', 'Tendências', 'Inovação'],
    featured: true
  },
  {
    id: '2',
    title: 'Como Escolher o Projeto Arquitetônico Ideal para seu Investimento',
    excerpt: 'Guia completo para investidores imobiliários entenderem o valor de um bom projeto arquitetônico e como ele impacta o retorno financeiro.',
    content: `
      <h2>O Valor do Projeto</h2>
      <p>Um projeto bem executado pode aumentar o valor de um imóvel em 15-30%. Não é apenas estética - é funcionalidade, eficiência e atratividade de mercado.</p>

      <h2>Análise de Viabilidade</h2>
      <p>Antes de investir, analise: zoneamento, topografia, insolação, ventilação, infraestrutura local e potencial de valorização da região.</p>

      <h2>Tipologia e Público-Alvo</h2>
      <p>Defina quem vai morar ou usar o espaço. Famílias buscam quartos e áreas externas; jovens profissionais valorizam home office e localização; idosos precisam de acessibilidade.</p>

      <h2>Custo-Benefício a Longo Prazo</h2>
      <p>Materiais de qualidade e sistemas eficientes têm custo inicial maior, mas reduzem manutenção e aumentam durabilidade. O TCO (Total Cost of Ownership) deve guiar decisões.</p>
    `,
    image: '/assets/images/exterior_render_2.png',
    author: 'Archan Team',
    publishedAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-02-15T10:00:00Z',
    tags: ['Investimento', 'Guia', 'Mercado Imobiliário'],
    featured: true
  },
  {
    id: '3',
    title: 'Arquitetura de Interiores: Transformando Espaços Pequenos',
    excerpt: 'Estratégias inteligentes de design de interiores para maximizar espaços compactos sem sacrificar estilo ou funcionalidade.',
    content: `
      <h2>O Desafio dos Espaços Compactos</h2>
      <p>Com a urbanização, espaços menores são a norma. O segredo está em mobiliário multifuncional, armazenamento vertical e paleta de cores claras.</p>

      <h2>Mobiliário Inteligente</h2>
      <p>Camas com gavetas, mesas dobráveis, sofás-cama premium e sistemas modulares permitem múltiplas configurações no mesmo espaço.</p>

      <h2>Iluminação e Espelhos</h2>
      <p>Iluminação em camadas (ambiente, tarefa, destaque) e espelhos estrategicamente posicionados ampliam visualmente o ambiente.</p>

      <h2>Integração de Ambientes</h2>
      <p>Cozinha, sala e varanda integradas criam sensação de amplitude. Divisórias móveis permitem privacidade quando necessário.</p>
    `,
    image: '/assets/images/interior_shot_1776171949307.png',
    author: 'Archan Team',
    publishedAt: '2024-03-08T10:00:00Z',
    updatedAt: '2024-03-08T10:00:00Z',
    tags: ['Interiores', 'Pequenos Espaços', 'Design'],
    featured: false
  },
  {
    id: '4',
    title: 'O Processo Criativo: Do Conceito à Execução',
    excerpt: 'Entenda as etapas do nosso processo de projeto arquitetônico, desde o briefing inicial até a entrega final da obra.',
    content: `
      <h2>1. Briefing e Análise</h2>
      <p>Entrevista profunda com o cliente, análise do terreno, estudo de viabilidade legal e financeira.</p>

      <h2>2. Estudo Preliminar</h2>
      <p>Conceitos iniciais, partições espaciais, volumetria e implantação. Apresentação de 2-3 opções.</p>

      <h2>3. Anteprojeto</h2>
      <p>Desenvolvimento da opção escolhida: plantas, cortes, fachadas, perspectivas e maquete eletrônica.</p>

      <h2>4. Projeto Executivo</h2>
      <p>Detalhamento técnico completo: estrutural, instalações, esquadrias, acabamentos, especificações.</p>

      <h2>5. Acompanhamento de Obra</h2>
      <p>Visitas técnicas, compatibilização, solução de imprevistos e controle de qualidade até a entrega.</p>
    `,
    image: '/assets/images/floor_plan_1776171933189.png',
    author: 'Archan Team',
    publishedAt: '2024-04-10T10:00:00Z',
    updatedAt: '2024-04-10T10:00:00Z',
    tags: ['Processo', 'Metodologia', 'Execução'],
    featured: false
  }
]

export const useBlogStore = defineStore('blog', () => {
  const posts = ref<BlogPost[]>([...demoPosts])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const featuredPosts = computed(() => posts.value.filter(p => p.featured))
  const recentPosts = computed(() => [...posts.value].sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  ))

  function getPostById(id: string): BlogPost | undefined {
    return posts.value.find(p => p.id === id)
  }

  function getPostBySlug(slug: string): BlogPost | undefined {
    return posts.value.find(p => p.id === slug || p.title.toLowerCase().replace(/\s+/g, '-') === slug)
  }

  async function addPost(post: Omit<BlogPost, 'id' | 'updatedAt'>) {
    loading.value = true
    error.value = null

    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      const newPost: BlogPost = {
        ...post,
        id: String(Date.now()),
        updatedAt: new Date().toISOString()
      }

      posts.value.unshift(newPost)
      return newPost
    } catch (err) {
      error.value = 'Erro ao criar post'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updatePost(id: string, updates: Partial<BlogPost>) {
    loading.value = true
    error.value = null

    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      const index = posts.value.findIndex(p => p.id === id)
      if (index !== -1) {
        posts.value[index] = {
          ...posts.value[index],
          ...updates,
          updatedAt: new Date().toISOString()
        }
        return posts.value[index]
      }
      throw new Error('Post não encontrado')
    } catch (err) {
      error.value = 'Erro ao atualizar post'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deletePost(id: string) {
    loading.value = true
    error.value = null

    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      const index = posts.value.findIndex(p => p.id === id)
      if (index !== -1) {
        posts.value.splice(index, 1)
        return true
      }
      throw new Error('Post não encontrado')
    } catch (err) {
      error.value = 'Erro ao excluir post'
      throw err
    } finally {
      loading.value = false
    }
  }

  function toggleFeatured(id: string) {
    const post = posts.value.find(p => p.id === id)
    if (post) {
      post.featured = !post.featured
      post.updatedAt = new Date().toISOString()
    }
  }

  return {
    posts,
    loading,
    error,
    featuredPosts,
    recentPosts,
    getPostById,
    getPostBySlug,
    addPost,
    updatePost,
    deletePost,
    toggleFeatured
  }
})