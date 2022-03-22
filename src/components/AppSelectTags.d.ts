export type Option = {
  // unique id used in state of select
  value: number | string;
  // allows returning multiple options instead when selecting this option
  // e.g. clicking a gene result and getting/selecting its 8 associated phenotypes instead
  getOptions?: () => Promise<Array<Option>>;
  // highlighting html
  highlight?: string;
  // display name
  label?: string;
  // icon name
  icon?: string;
  // info col
  info?: number | string;
};

export type Options = Array<Option>;

export type OptionsFunc = (
  value: string
) => Promise<
  Options | { autoAccept: boolean; options: Options; message: string }
>;
