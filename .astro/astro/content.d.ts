declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"articles": {
"arenda-frontalnogo-pogruzchika.md": {
	id: "arenda-frontalnogo-pogruzchika.md";
  slug: "arenda-frontalnogo-pogruzchika";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"arenda-mini-pogruzchika-zadachi.md": {
	id: "arenda-mini-pogruzchika-zadachi.md";
  slug: "arenda-mini-pogruzchika-zadachi";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"arenda-samosvala-vyvoz-grunta.md": {
	id: "arenda-samosvala-vyvoz-grunta.md";
  slug: "arenda-samosvala-vyvoz-grunta";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"arenda-spectehniki-s-operatorom.md": {
	id: "arenda-spectehniki-s-operatorom.md";
  slug: "arenda-spectehniki-s-operatorom";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"kak-vybrat-ekskavator.md": {
	id: "kak-vybrat-ekskavator.md";
  slug: "kak-vybrat-ekskavator";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"manipulator-ili-avtokran.md": {
	id: "manipulator-ili-avtokran.md";
  slug: "manipulator-ili-avtokran";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"skolko-stoit-arenda-avtokrana.md": {
	id: "skolko-stoit-arenda-avtokrana.md";
  slug: "skolko-stoit-arenda-avtokrana";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"skolko-stoit-vyryt-kotlovan.md": {
	id: "skolko-stoit-vyryt-kotlovan.md";
  slug: "skolko-stoit-vyryt-kotlovan";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
"teleskopicheskij-pogruzchik-vmesto-krana.md": {
	id: "teleskopicheskij-pogruzchik-vmesto-krana.md";
  slug: "teleskopicheskij-pogruzchik-vmesto-krana";
  body: string;
  collection: "articles";
  data: InferEntrySchema<"articles">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("./../../src/content/config.js");
}
