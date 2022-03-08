export type Option = {
  // unique id
  value: number | string;
  // function to execute to get values when selecting this option
  valueFunc?: () => Promise<Array<Option>>;
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
) => Promise<Options | { autoAccept: boolean; options: Options }>;
