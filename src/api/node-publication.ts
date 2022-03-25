import { request, cleanError } from ".";
// entrez endpoint for getting publication metadata
const entrez = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/";

// get metadata of publication from entrez
export const getPublication = async (id = ""): Promise<Result> => {
  try {
    id = id.replace("PMID:", "");
    const summary = await getSummary(id);
    const abstract = await getAbstract(id);

    return { ...summary, abstract };
  } catch (error) {
    throw cleanError(error);
  }
};

interface SummaryResponse {
  result: {
    [key: string]: {
      uid: string;
      pubdate: string;
      epubdate: string;
      source: string;
      authors: Array<{ name: string }>;
      title: string;
      volume: string;
      issue: string;
      pages: string;
      lang: Array<string>;
      issn: string;
      essn: string;
      pubtype: Array<string>;
      articleids: Array<{ idtype: string; value: string }>;
      fulljournalname: string;
      elocationid: string;
      doctype: string;
      medium: string;
      edition: string;
      publishername: string;
    };
  };
}

// get summary information of publication from entrez
export const getSummary = async (id = ""): Promise<SummaryResult> => {
  try {
    // make query
    const params = { db: "pubmed", retmode: "json", id };
    const url = `${entrez}/esummary.fcgi`;
    const { result } = await request<SummaryResponse>(url, params);
    const publication = Object.values(result)[0];

    // convert into desired result format
    return {
      id: publication.uid,
      title: publication.title,
      authors: (publication.authors || []).map(({ name }) => name),
      date: new Date(publication.epubdate),
      doi:
        (publication.articleids || []).find(({ idtype }) => idtype === "doi")
          ?.value || "",
      journal: publication.fulljournalname,
    };
  } catch (error) {
    throw cleanError(error);
  }
};
// get abstract text of publication from entrez
export const getAbstract = async (id = ""): Promise<AbstractResult> => {
  try {
    // make query
    const params = { db: "pubmed", retmode: "text", rettype: "abstract", id };
    const url = `${entrez}/efetch.fcgi`;
    return await request<string>(url, params, {}, "text");
  } catch (error) {
    throw cleanError(error);
  }
};

interface SummaryResult {
  id: string;
  title: string;
  authors: Array<string>;
  date: Date;
  doi: string;
  journal: string;
}

type AbstractResult = string;

export interface Result extends SummaryResult {
  abstract: AbstractResult;
}
