export type OptionPickerModalProps = {
  /**
   * Whether to display search bar
   */
  hasSearchBar?: boolean
  /**
   * Text to display in the header
   */
  headerText?: string
  /**
   * Whether the modal is open
   */
  isOpen: boolean
  /**
   * Whether to display separators between options
   */
  displaySeparators?: boolean
  /**
   * Options to display
   */
  options: string[]
  /**
   * Option to be selected
   */
  selectedOption: string
  /**
   * Custom render function for
   */
  renderItem?: (option: string, idx: number) => JSX.Element
  /**
   * Callback for closing the modal
   */
  onCloseModal: () => void
  /**
   * Callback for when an option is selected
   */
  onSelected: (option: string) => void
  /**
   * Icon to display next to each option
   */
  optionIcon?: JSX.Element
  /**
   * Whether the options are selectable
   */
  isOptionSelectable?: boolean
}
