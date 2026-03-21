/**
 * @public
 */
export interface ThriveOSSuggestion {
  mode: 'chat' | 'agent'
  message: string
}

/**
 * @public
 */
export const useThriveOSSuggestions = ({
  query,
}: {
  query: string
}): ThriveOSSuggestion[] => {
  return [
    {
      mode: 'agent',
      message: query,
    },
  ]
}
