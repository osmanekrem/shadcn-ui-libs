type DepthCounter = [never, 1, 2, 3, 4, 5, 6];

export type DeepKeys<
  T,
  Prefix extends string = "",
  Depth extends number = 6,
> = [Depth] extends [never]
  ? never
  : T extends object
    ? {
        [K in keyof T]-?: K extends string
          ?
              | `${Prefix}${Prefix extends "" ? "" : "."}${K}`
              | DeepKeys<
                  T[K],
                  `${Prefix}${Prefix extends "" ? "" : "."}${K}`,
                  Prev<Depth>
                >
          : never;
      }[keyof T]
    : "";

type Prev<N extends number> = DepthCounter[N];

type FieldWithPossiblyUndefined<T, key> =
  | GetFieldType<Exclude<T, undefined>, key>
  | Extract<T, undefined>;

type GetIndexedField<T, K> = K extends keyof T
  ? T[K]
  : K extends `${number}`
    ? "0" extends keyof T
      ? undefined
      : number extends keyof T
        ? T[number]
        : undefined
    : undefined;

export type GetFieldType<T, P> = P extends `${infer Left}.${infer Right}`
  ? Left extends keyof T
    ? FieldWithPossiblyUndefined<T[Left], Right>
    : Left extends `${infer FieldKey}[${infer IndexKey}]`
      ? FieldKey extends keyof T
        ? FieldWithPossiblyUndefined<
            | GetIndexedField<Exclude<T[FieldKey], undefined>, IndexKey>
            | Extract<T[FieldKey], undefined>,
            Right
          >
        : undefined
      : undefined
  : P extends keyof T
    ? T[P]
    : P extends `${infer FieldKey}[${infer IndexKey}]`
      ? FieldKey extends keyof T
        ?
            | GetIndexedField<Exclude<T[FieldKey], undefined>, IndexKey>
            | Extract<T[FieldKey], undefined>
        : undefined
      : undefined;
