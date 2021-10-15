// possible properties of a source
// chosen/constructed for convenience of display on sources page
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
