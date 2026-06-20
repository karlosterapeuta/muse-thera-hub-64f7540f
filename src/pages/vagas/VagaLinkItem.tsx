import { ExternalLink } from "lucide-react";

interface VagaLinkItemProps {
  /** URL externa da vaga/fonte */
  url: string;
  /** Nome principal exibido em destaque */
  name: string;
  /** Descrição curta complementar */
  description?: string;
}

/**
 * Item unificado de vaga/fonte usado em toda a página de Vagas.
 * Garante o mesmo estilo e estrutura para todas as listagens
 * (portais, categorias e clínicas).
 */
export function VagaLinkItem({ url, name, description }: VagaLinkItemProps) {
  return (
    <li>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-start gap-2 rounded-lg p-2 -mx-2 hover:bg-cyan-500/10 transition-colors"
      >
        <ExternalLink className="h-3.5 w-3.5 mt-0.5 text-cyan-500 shrink-0" />
        <span className="min-w-0">
          <span className="block text-sm font-medium text-foreground group-hover:text-cyan-500 transition-colors">
            {name}
          </span>
          {description && (
            <span className="block text-xs text-muted-foreground leading-snug">
              {description}
            </span>
          )}
        </span>
      </a>
    </li>
  );
}
