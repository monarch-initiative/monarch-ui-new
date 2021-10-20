import axios from "axios";
import yaml from "js-yaml";
import { Source } from "@/views/about/sources.types";

// source for ontology metadata
const obo =
  "https://raw.githubusercontent.com/OBOFoundry/OBOFoundry.github.io/master/registry/ontologies.yml";

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
  const { data } = await axios.get(obo, { responseType: "text" });
  const json = (await yaml.load(data as string)) as Response;
  const { ontologies = [] } = json;

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
