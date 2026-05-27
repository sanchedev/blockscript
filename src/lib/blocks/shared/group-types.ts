import type { ComponentType } from 'react'
import type { BlockThemeColor, SectionThemeColor } from '../../theme'

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
  header: string
}

export interface GroupConfig<TItem extends string> {
  title: string
  items: TItem[]
  blockColor: BlockThemeColor
  sectionColor: SectionThemeColor
  icon: ComponentType<{ className?: string }>
}
