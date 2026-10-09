// 排除 Base UI Root 的 render function children
type WithNodeChildren<C extends React.ElementType> = Omit<React.ComponentProps<C>, 'children'> & {
  children?: React.ReactNode
}
