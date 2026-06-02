import type { BlockThemeColor, SectionThemeColor } from '../../theme'
import type { IconProps } from '@tabler/icons-react'

export interface ItemStyle {
  bg: string
  text: string
  border: string
}

export interface SectionStyle {
  bg: string
  text: string
  border: string
  ring: string
}

export interface GroupConfig<TItem extends string> {
  title: string
  items: TItem[]
  blockColor: BlockThemeColor
  sectionColor: SectionThemeColor
  icon: (props: IconProps) => React.ReactNode
}
