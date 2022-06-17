export type Option = {
  /** unique id used in state of select */
  id: string;
  /** icon name */
  icon?: string;
  /** display name */
  name?: string;
  /** highlighting html */
  highlight?: string;
  /** info col */
  info?: string;
  /** allows returning multiple options instead when selecting this option, e.g. clicking a gene result and getting/selecting its 8 associated phenotypes instead */
  getOptions?: () => Promise<Array<Option>>;
};

export type Options = Array<Option>;

/** instead of providing a static list of options, you can provide this function that receives the user-typed search string and dynamically returns a list of options */
export type OptionsFunc = (
  search: string
) => Promise<
  Options | { autoAccept: boolean; options: Options; message: string }
>;
