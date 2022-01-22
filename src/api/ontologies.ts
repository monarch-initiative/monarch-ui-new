import axios from "axios";
import { Source } from "@/types/sources";

// source for ontology metadata
const obo = "https://obofoundry.org/registry/ontologies.jsonld";

// expected schemas to be returned from obo
interface Response {
  ontologies?: Array<Ontology>;
}
interface Ontology {
  id?: string;
  title?: string;
  homepage?: string;
  license?: { url?: string };
  depicted_by?: string;
  description?: string;
}

// get metadata of all ontologies listed on obo
export const getOntologies = async (): Promise<Array<Source>> => {
  // get data from endpoint
  const { data } = await axios.get(obo, { responseType: "json" });
  const { ontologies = [] } = data as Response;

  // convert results to desired format
  const results = ontologies.map(
    (ontology: Ontology): Source => ({
      id: ontology.id,
      name: ontology.title,
      link: ontology.homepage,
      license: ontology.license?.url,
      image: ontology.depicted_by,
      description: ontology.description,
    })
  );

  return results;
};
