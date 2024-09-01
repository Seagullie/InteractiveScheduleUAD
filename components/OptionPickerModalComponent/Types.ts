export type OptionPickerModalProps<OptionT> = {
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
  options: OptionT[]
  /**
   * Option to be selected
   */
  selectedOption?: OptionT
  /**
   * Custom render function for
   */
  renderItem?: (option: OptionT, idx: number) => JSX.Element
  /**
   * Callback for closing the modal
   */
  onCloseModal: () => void
  /**
   * Callback for when an option is selected
   */
  onSelected?: (option: OptionT) => void
  /**
   * Icon to display next to each option
   */
  optionIcon?: JSX.Element
  /**
   * Whether the options are selectable
   */
  isOptionSelectable?: boolean
}
