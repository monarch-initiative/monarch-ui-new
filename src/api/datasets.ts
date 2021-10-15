import { Source } from "@/views/about/sources.types";

// get metadata of all datasets used in monarch from biolink, in format of source
export const getDatasets = async (): Promise<Array<Source>> => {
  // temporary dummy info (in desired format)
  const ids = [
    "mgi",
    "zfin",
    "zfinslim",
    "wormbase",
    "flybase",
    "impc",
    "mpd",
    "omim",
    "orphanet",
    "panther",
    "coriell",
    "ctd",
    "hpoa",
    "kegg",
    "ncbigene",
    "biogrid",
    "gwascatalog",
    "animalqtldb",
    "ensembl",
    "go",
    "hgnc",
    "mmrrc",
    "reactome",
    "bgee",
    "string",
    "rgd",
    "sgd",
    "eom",
    "mgi_slim",
    "monarch",
    "monochrom",
    "mychem",
    "ucscbands",
    "omia",
    "clinvar",
    "udp",
  ];
  return ids.map(
    (id): Source => ({
      id,
      date: "2021-10-13",
      rdf: "https://monarchinitiative.org/",
      files: Array(10).fill("https://monarchinitiative.org/test-file.txt"),
    })
  );
};
