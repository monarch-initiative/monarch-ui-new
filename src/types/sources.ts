// possible properties of a source on the sources page
export interface Source {
  name?: string;
  id?: string;
  type?: string;
  link?: string;
  license?: string;
  rdf?: string;
  date?: string;
  image?: string;
  description?: string;
  usage?: string;
  vocabulary?: string;
  iri?: string;
  reusable?: string;
  files?: Array<string>;
}
