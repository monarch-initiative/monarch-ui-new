export type Option = {
  value: number | string;
  label?: string;
  icon?: string;
  count?: number | string;
};

export type Options = Array<Option>;

export type OptionsFunc = (
  value: string
) => Promise<Options | { autoAccept: boolean; options: Options }>;
