 
export type Model<PlainModel, ExcludeFields> = {
  [K in Exclude<keyof PlainModel, keyof ExcludeFields>]-?: TSField<PlainModel[K]>
}; 



type TSField<T> = T extends string ? string :
  T extends number ? number :
  T extends Date ? Date :
  T extends string | null ? string | undefined : 
  T extends number | null ? number | undefined :
  T extends Date | null ? Date | undefined :
  never;