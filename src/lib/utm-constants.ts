// Lista de Origens (Source) — De onde o visitante vem
export const SOURCE_GROUPS = [
  {
    group: 'Redes Sociais',
    options: [
      { label: 'Instagram', value: 'instagram' },
      { label: 'LinkedIn', value: 'linkedin' },
      { label: 'Facebook', value: 'facebook' },
      { label: 'YouTube', value: 'youtube' },
      { label: 'TikTok', value: 'tiktok' },
      { label: 'X (antigo Twitter)', value: 'twitter' },
    ],
  },
  {
    group: 'Mecanismos de Busca & Anúncios',
    options: [
      { label: 'Google', value: 'google' },
      { label: 'Meta Ads (Gerenciador de Anúncios)', value: 'meta-ads' },
      { label: 'Bing', value: 'bing' },
    ],
  },
  {
    group: 'Mensageria & E-mail',
    options: [
      { label: 'WhatsApp', value: 'whatsapp' },
      { label: 'E-mail / Newsletter', value: 'email-marketing' },
      { label: 'Telegram', value: 'telegram' },
    ],
  },
  {
    group: 'Outros Canais',
    options: [
      { label: 'Pop-up no Site / E-commerce', value: 'popup-site' },
      { label: 'QR Code Impresso', value: 'qrcode' },
      { label: 'Portal de Notícias / Assessoria', value: 'imprensa' },
      { label: 'Outro (digitar manualmente)', value: 'custom' },
    ],
  },
]

// Lista de Mídias (Medium) — Desagrupada, granular e dividida por tipo de mídia
export const MEDIUM_GROUPS = [
  {
    group: 'Mídias Patrocinadas (Tráfego Pago)',
    options: [
      { label: 'Post Patrocinado', value: 'post-patrocinado' },
      { label: 'Vídeo Patrocinado', value: 'video-patrocinado' },
      { label: 'Stories Patrocinado', value: 'stories-patrocinado' },
      { label: 'Reels Patrocinado', value: 'reels-patrocinado' },
      { label: 'Banner Patrocinado', value: 'banner-patrocinado' },
      { label: 'Display Patrocinado', value: 'display-patrocinado' },
      { label: 'Anúncio de Pesquisa (CPC / Google Search)', value: 'cpc' },
    ],
  },
  {
    group: 'Redes Sociais (Orgânico)',
    options: [
      { label: 'Stories (Instagram)', value: 'stories' },
      { label: 'Feed (Post / Carrossel)', value: 'feed' },
      { label: 'Reels (Instagram)', value: 'reels' },
      { label: 'Shorts (YouTube)', value: 'shorts' },
      { label: 'Link na Bio', value: 'link-bio' },
      { label: 'Post Orgânico (LinkedIn / Facebook)', value: 'post-organico' },
      { label: 'Vídeo Orgânico', value: 'video' },
    ],
  },
  {
    group: 'E-mail & Mensagens',
    options: [
      { label: 'E-mail Marketing', value: 'email' },
      { label: 'Newsletter', value: 'newsletter' },
      { label: 'Mensagem Direta (WhatsApp / Direct)', value: 'mensagem-direta' },
    ],
  },
  {
    group: 'Materiais Físicos & Outros',
    options: [
      { label: 'Cartaz / Banner Físico (QR Code)', value: 'cartaz-impresso' },
      { label: 'Crachá / Folder de Evento', value: 'evento-impresso' },
      { label: 'Outro (digitar manualmente)', value: 'custom' },
    ],
  },
]
