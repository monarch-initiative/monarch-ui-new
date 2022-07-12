/** external references */

/** get external link from identifier */
export const getXrefLink = (id = "", name = ""): string => {
  /** get parts of id */
  const prefix = id.split(":")[0] || "";
  let reference = id.split(":")[1] || "";

  /** OMIM:1234.123 -> OMIM:1234#123 */
  if (prefix === "OMIM") reference = reference.replace(".", "#");

  /** get link template from map */
  const url = (map[prefix.toLowerCase()] || {})[prefix] || "";

  /** make id replacements */
  return url.replace("[reference]", reference).replace("[label]", name);
};

/**
 * hard coded map of external reference urls based on identifier prefix. keep
 * sorted. https://r37r0m0d3l.github.io/json_sort/
 */
const map: Record<string, Record<string, string>> = {
  animalqtldb: {
    AQTLPub:
      "https://www.animalgenome.org/cgi-bin/QTLdb/BT/qabstract?PUBMED_ID=[reference]",
    AQTLTrait: "http://identifiers.org/animalqtltrait/[reference]",
    catfishQTL:
      "https://www.animalgenome.org/cgi-bin/QTLdb/IP/qdetails?QTL_ID=[reference]",
    cattleQTL:
      "https://www.animalgenome.org/cgi-bin/QTLdb/BT/qdetails?QTL_ID=[reference]",
    chickenQTL:
      "https://www.animalgenome.org/cgi-bin/QTLdb/GG/qdetails?QTL_ID=[reference]",
    horseQTL:
      "https://www.animalgenome.org/cgi-bin/QTLdb/EC/qdetails?QTL_ID=[reference]",
    pigQTL:
      "https://www.animalgenome.org/cgi-bin/QTLdb/SS/qdetails?QTL_ID=[reference]",
    rainbow_troutQTL:
      "https://www.animalgenome.org/cgi-bin/QTLdb/OM/qdetails?QTL_ID=[reference]",
    sheepQTL:
      "https://www.animalgenome.org/cgi-bin/QTLdb/OA/qdetails?QTL_ID=[reference]",
  },
  apb: {
    APB: "http://pb.apf.edu.au/phenbank/strain.html?id=[reference]",
  },
  apo: {
    APO: "http://purl.obolibrary.org/obo/APO_[reference]",
  },
  aspgd: {
    AspGD: "http://www.aspergillusgenome.org/cgi-bin/locus.pl?dbid=[reference]",
  },
  aspgd_ref: {
    AspGD_REF:
      "http://www.aspergillusgenome.org/cgi-bin/reference/reference.pl?dbid=[reference]",
  },
  bfo: {
    BFO: "http://purl.obolibrary.org/obo/BFO_[reference]",
  },
  biogrid: {
    BIOGRID: "http://thebiogrid.org/[reference]",
  },
  bt: {
    BT: "http://c.biothings.io/#[reference]",
  },
  ccds: {
    CCDS: "http://www.ncbi.nlm.nih.gov/CCDS/CcdsBrowse.cgi?REQUEST=CCDS&DATA=[reference]",
  },
  cgnc: {
    CGNC: "http://birdgenenames.org/cgnc/GeneReport?id=[reference]",
  },
  chebi: {
    CHEBI: "http://purl.obolibrary.org/obo/CHEBI_[reference]",
  },
  chr: {
    CHR: "http://purl.obolibrary.org/obo/CHR_[reference]",
  },
  cid: {
    CID: "http://pubchem.ncbi.nlm.nih.gov/compound/[reference]",
  },
  cito: {
    cito: "http://purl.org/spar/cito/[reference]",
  },
  cl: {
    CL: "http://purl.obolibrary.org/obo/CL_[reference]",
  },
  clinvar: {
    ClinVar: "http://www.ncbi.nlm.nih.gov/clinvar/[reference]",
    ClinVarSubmitters:
      "http://www.ncbi.nlm.nih.gov/clinvar/submitters/[reference]",
    ClinVarVariant: "http://www.ncbi.nlm.nih.gov/clinvar/variation/[reference]",
  },
  clo: {
    CLO: "http://purl.obolibrary.org/obo/CLO_[reference]",
  },
  cmmr: {
    CMMR: "http://www.cmmr.ca/order.php?t=m&id=[reference]",
  },
  cmo: {
    CMO: "http://purl.obolibrary.org/obo/CMO_[reference]",
  },
  coriell: {
    Coriell:
      "https://catalog.coriell.org/0/Sections/Search/Sample_Detail.aspx?Ref=[reference]",
    CoriellCollection: "https://catalog.coriell.org/1/[reference]",
    CoriellFamily:
      "https://catalog.coriell.org/0/Sections/BrowseCatalog/FamilyTypeSubDetail.aspx?fam=[reference]",
    CoriellIndividual: "https://catalog.coriell.org/Search?q=[reference]",
  },
  cosmic: {
    COSMIC:
      "http://cancer.sanger.ac.uk/cosmic/mutation/overview?id=[reference]",
  },
  dbsnp: {
    dbSNP:
      "http://www.ncbi.nlm.nih.gov/projects/SNP/snp_ref.cgi?rs=[reference]",
  },
  dbsnpindividual: {
    dbSNPIndividual:
      "http://www.ncbi.nlm.nih.gov/SNP/snp_ind.cgi?ind_id=[reference]",
  },
  dbvar: {
    dbVar: "http://www.ncbi.nlm.nih.gov/dbvar/[reference]",
  },
  dc_cl: {
    DC_CL: "http://purl.obolibrary.org/obo/DC_CL[reference]",
  },
  decipher: {
    DECIPHER: "https://decipher.sanger.ac.uk/syndrome/[reference]",
  },
  dictybase: {
    dictyBase: "http://dictybase.org/gene/[reference]",
  },
  doi: {
    DOI: "http://dx.doi.org/[reference]",
  },
  doid: {
    DOID: "http://purl.obolibrary.org/obo/DOID_[reference]",
  },
  drugbank: {
    DrugBank: "http://www.drugbank.ca/drugs/[reference]",
  },
  ec: {
    EC: "https://www.enzyme-database.org/query.php?ec=[reference]",
  },
  eco: {
    ECO: "http://purl.obolibrary.org/obo/ECO_[reference]",
  },
  ecogene: {
    EcoGene: "http://ecogene.org/gene/[reference]",
  },
  "edam-data": {
    "EDAM-DATA": "http://edamontology.org/data_[reference]",
  },
  efo: {
    EFO: "http://www.ebi.ac.uk/efo/EFO_[reference]",
  },
  emapa: {
    EMAPA: "http://purl.obolibrary.org/obo/EMAPA_[reference]",
  },
  emma: {
    EMMA: "https://www.infrafrontier.eu/search?keyword=EM:[reference]",
  },
  ensembl: {
    ENSEMBL: "http://ensembl.org/id/[reference]",
    EnsemblGenome: "http://www.ensemblgenomes.org/id/[reference]",
  },
  envo: {
    ENVO: "http://purl.obolibrary.org/obo/ENVO_[reference]",
  },
  eom: {
    EOM: "https://elementsofmorphology.nih.gov/index.cgi?tid=[reference]",
  },
  ero: {
    ERO: "http://purl.obolibrary.org/obo/ERO_[reference]",
  },
  faldo: {
    faldo: "http://biohackathon.org/resource/faldo#[reference]",
  },
  fbbt: {
    FBbt: "http://purl.obolibrary.org/obo/FBbt_[reference]",
  },
  fbcv: {
    FBcv: "http://purl.obolibrary.org/obo/FBcv_[reference]",
  },
  fbdv: {
    FBdv: "http://purl.obolibrary.org/obo/FBdv_[reference]",
  },
  fdadrug: {
    FDADrug: "http://www.fda.gov/Drugs/InformationOnDrugs/[reference]",
  },
  flybase: {
    FlyBase: "http://flybase.org/reports/[reference]",
  },
  genatlas: {
    Genatlas:
      "http://genatlas.medecine.univ-paris5.fr/fiche.php?symbol=[reference]",
  },
  genbank: {
    GenBank: "http://www.ncbi.nlm.nih.gov/nuccore/[reference]",
  },
  genereviews: {
    GeneReviews: "http://www.ncbi.nlm.nih.gov/books/[reference]",
  },
  geno: {
    GENO: "http://purl.obolibrary.org/obo/GENO_[reference]",
  },
  ginas: {
    GINAS: "http://tripod.nih.gov/ginas/app/substance#[reference]",
  },
  go: {
    GO: "http://amigo.geneontology.org/amigo/term/GO:[reference]",
    GO_REF:
      "http://www.geneontology.org/cgi-bin/references.cgi#GO_REF:[reference]",
    PAINT_REF:
      "http://www.geneontology.org/gene-associations/submission/paint/[reference]",
  },
  gwascatalog: {
    dbSNP: "https://www.ebi.ac.uk/gwas/variants/[reference]",
    ENSEMBL: "https://www.ebi.ac.uk/gwas/genes/[label]",
    GWAS: "https://www.ebi.ac.uk/gwas/variants/[reference]",
  },
  hgmd: {
    HGMD: "http://www.hgmd.cf.ac.uk/ac/gene.php?gene=[reference]",
  },
  hgnc: {
    HGNC: "https://www.genenames.org/data/gene-symbol-report/#!/hgnc_id/HGNC:[reference]",
  },
  hmdb: {
    HMDB: "http://www.hmdb.ca/metabolites/[reference]",
  },
  homologene: {
    HOMOLOGENE: "http://www.ncbi.nlm.nih.gov/homologene/[reference]",
  },
  hp: {
    HP: "http://purl.obolibrary.org/obo/HP_[reference]",
  },
  hpoa: {
    HP: "https://hpo.jax.org/app/browse/term/HP:[reference]",
    OMIM: "http://omim.org/entry/[reference]",
    OMIMPS: "http://www.omim.org/phenotypicSeries/[reference]",
    ORPHA:
      "https://www.orpha.net/consor/cgi-bin/OC_Exp.php?Lng=EN&Expert=[reference]",
  },
  hprd: {
    HPRD: "http://www.hprd.org/protein/[reference]",
  },
  iao: {
    IAO: "http://purl.obolibrary.org/obo/IAO_[reference]",
  },
  impc: {
    IMPC: "http://www.mousephenotype.org/data/genes/[reference]",
    "IMPRESS-parameter":
      "https://www.mousephenotype.org/impress/parameterontologies/[reference]",
    "IMPRESS-procedure":
      "https://www.mousephenotype.org/impress/procedures/[reference]",
    "IMPRESS-protocol":
      "https://www.mousephenotype.org/impress/protocol/[reference]",
    MGI: "https://www.mousephenotype.org/data/genes/MGI:[reference]",
    MP: "https://www.mousephenotype.org/data/phenotypes/MP:[reference]",
  },
  isbn: {
    ISBN: "https://monarchinitiative.org/ISBN_[reference]",
  },
  "isbn-10": {
    "ISBN-10": "https://monarchinitiative.org/ISBN10_[reference]",
  },
  "isbn-13": {
    "ISBN-13": "https://monarchinitiative.org/ISBN13_[reference]",
  },
  iuphar: {
    IUPHAR:
      "http://www.guidetopharmacology.org/GRAC/ObjectDisplayForward?objectId=[reference]",
  },
  jax: {
    JAX: "http://jaxmice.jax.org/strain/[reference]",
  },
  kegg: {
    "KEGG-ds": "http://purl.obolibrary.org/KEGG-ds_[reference]",
    "KEGG-hsa": "http://www.kegg.jp/dbget-bin/www_bget?hsa:[reference]",
    "KEGG-img": "http://www.genome.jp/kegg/pathway/map/map[reference]",
    "KEGG-ko": "http://www.kegg.jp/dbget-bin/www_bget?ko:[reference]",
    "KEGG-path": "http://www.kegg.jp/dbget-bin/www_bget?path:[reference]",
  },
  lpt: {
    LPT: "http://purl.obolibrary.org/obo/LPT_[reference]",
  },
  ma: {
    MA: "http://purl.obolibrary.org/obo/MA_[reference]",
  },
  meddra: {
    MEDDRA: "http://purl.bioontology.org/ontology/MEDDRA/[reference]",
  },
  medgen: {
    MedGen: "http://www.ncbi.nlm.nih.gov/medgen/[reference]",
  },
  mgi: {
    J: "http://www.informatics.jax.org/reference/J:[reference]",
    MGI: "http://www.informatics.jax.org/accession/MGI:[reference]",
    MP: "http://www.informatics.jax.org/vocab/mp_ontology/MP:[reference]",
  },
  mirbase: {
    miRBase: "http://www.mirbase.org/cgi-bin/mirna_entry.pl?acc=[reference]",
  },
  mmrrc: {
    MMRRC: "https://www.mmrrc.org/catalog/sds.php?mmrrc_id=[reference]",
  },
  mpath: {
    MPATH: "http://purl.obolibrary.org/obo/MPATH_[reference]",
  },
  mpd: {
    MPD: "https://phenome.jax.org/[reference]",
    "MPD-assay":
      "https://phenome.jax.org/db/qp?rtn=views/catlines&keymeas=[reference]",
    "MPD-strain":
      "http://phenome.jax.org/db/q?rtn=strains/details&strainid=[reference]",
  },
  mugen: {
    MUGEN:
      "http://bioit.fleming.gr/mugen/Controller?workflow=ViewModel&expand_all=true&name_begins=model.block&eid=[reference]",
  },
  nbo: {
    NBO: "http://purl.obolibrary.org/obo/NBO_[reference]",
  },
  ncbiassembly: {
    NCBIAssembly: "https://www.ncbi.nlm.nih.gov/assembly?term=[reference]",
  },
  ncbigene: {
    NCBIGene: "https://www.ncbi.nlm.nih.gov/gene/[reference]",
  },
  ncbigenome: {
    NCBIGenome: "https://www.ncbi.nlm.nih.gov/genome/[reference]",
  },
  ncbiprotein: {
    NCBIProtein: "http://www.ncbi.nlm.nih.gov/protein/[reference]",
  },
  ncbitaxon: {
    NCBITaxon: "http://purl.obolibrary.org/obo/NCBITaxon_[reference]",
  },
  ncimr: {
    NCIMR: "https://mouse.ncifcrf.gov/available_details.asp?ID=[reference]",
  },
  ncit: {
    NCIT: "http://purl.obolibrary.org/obo/NCIT_[reference]",
  },
  oae: {
    OAE: "http://purl.obolibrary.org/obo/OAE_[reference]",
  },
  oba: {
    OBA: "http://purl.obolibrary.org/obo/OBA_[reference]",
  },
  omia: {
    OMIA: "https://omia.org/OMIA[reference]",
    "OMIA-breed": "https://monarchinitiative.org/model/OMIA-breed:[reference]",
  },
  omim: {
    OMIM: "http://omim.org/entry/[reference]",
    OMIMPS: "http://www.omim.org/phenotypicSeries/[reference]",
  },
  orphanet: {
    ORPHA:
      "https://www.orpha.net/consor/cgi-bin/OC_Exp.php?Lng=EN&Expert=[reference]",
    Orphanet:
      "https://www.orpha.net/consor/cgi-bin/OC_Exp.php?Lng=EN&Expert=[reference]",
  },
  panther: {
    PANTHER:
      "http://www.pantherdb.org/panther/family.do?clsAccession=[reference]",
  },
  pato: {
    PATO: "http://purl.obolibrary.org/obo/PATO_[reference]",
  },
  pco: {
    PCO: "http://purl.obolibrary.org/obo/PCO_[reference]",
  },
  pdb: {
    PDB: "http://www.ebi.ac.uk/pdbsum/[reference]",
  },
  pmcid: {
    PMCID: "http://www.ncbi.nlm.nih.gov/pmc/[reference]",
  },
  pmid: {
    PMID: "http://www.ncbi.nlm.nih.gov/pubmed/[reference]",
  },
  pombase: {
    PomBase: "https://www.pombase.org/spombe/result/[reference]",
  },
  pr: {
    PR: "http://purl.obolibrary.org/obo/PR_[reference]",
  },
  pw: {
    PW: "http://purl.obolibrary.org/obo/PW_[reference]",
  },
  rbrc: {
    RBRC: "http://www2.brc.riken.jp/lab/animal/detail.php?brc_no=RBRC[reference]",
  },
  react: {
    REACT: "http://www.reactome.org/PathwayBrowser/#/[reference]",
  },
  refseq: {
    RefSeq: "http://www.ncbi.nlm.nih.gov/refseq/?term=[reference]",
  },
  rgd: {
    RGD: "http://rgd.mcw.edu/rgdweb/report/gene/main.html?id=[reference]",
    RGDRef:
      "http://rgd.mcw.edu/rgdweb/report/reference/main.html?id=[reference]",
  },
  ro: {
    RO: "http://purl.obolibrary.org/obo/RO_[reference]",
  },
  rxcui: {
    RXCUI: "http://purl.bioontology.org/ontology/RXNORM/[reference]",
  },
  sepio: {
    SEPIO: "http://purl.obolibrary.org/obo/SEPIO_[reference]",
  },
  sgd: {
    SGD: "https://www.yeastgenome.org/locus/[reference]",
    SGD_REF: "https://www.yeastgenome.org/reference/[reference]",
  },
  sio: {
    SIO: "http://semanticscience.org/resource/SIO_[reference]",
  },
  smpdb: {
    SMPDB: "http://smpdb.ca/view/[reference]",
  },
  snomed: {
    SNOMED: "http://purl.obolibrary.org/obo/SNOMED_[reference]",
  },
  so: {
    SO: "http://purl.obolibrary.org/obo/SO_[reference]",
  },
  stato: {
    STATO: "http://purl.obolibrary.org/obo/STATO_[reference]",
  },
  string: {
    home: "https://string-db.org",
  },
  swissprot: {
    SwissProt: "http://identifiers.org/SwissProt:[reference]",
  },
  tair: {
    TAIR: "https://www.arabidopsis.org/servlets/TairObject?type=locus&id=[reference]",
  },
  trembl: {
    TrEMBL: "http://purl.uniprot.org/uniprot/[reference]",
  },
  uberon: {
    UBERON: "http://purl.obolibrary.org/obo/UBERON_[reference]",
  },
  ucscbands: {
    UCSC: "ftp://hgdownload.cse.ucsc.edu/goldenPath/[reference]",
    UCSCBuild: "http://genome.ucsc.edu/cgi-bin/hgGateway?db=[reference]",
  },
  umls: {
    UMLS: "http://linkedlifedata.com/resource/umls/id/[reference]",
  },
  unii: {
    UNII: "http://fdasis.nlm.nih.gov/srs/unii/[reference]",
  },
  uniprotkb: {
    UniProtKB: "http://identifiers.org/uniprot/[reference]",
  },
  uo: {
    UO: "http://purl.obolibrary.org/obo/UO_[reference]",
  },
  vfb: {
    vfb: "http://virtualflybrain.org/reports/[reference]",
  },
  vgnc: {
    VGNC: "https://vertebrate.genenames.org/data/gene-symbol-report/#!/vgnc_id/[reference]",
  },
  vivo: {
    VIVO: "http://vivoweb.org/ontology/core#[reference]",
  },
  vt: {
    VT: "http://purl.obolibrary.org/obo/VT_[reference]",
  },
  wbbt: {
    WBbt: "http://purl.obolibrary.org/obo/WBbt_[reference]",
  },
  wbphenotype: {
    WBPhenotype: "http://purl.obolibrary.org/obo/WBPhenotype_[reference]",
  },
  wikidata: {
    WD_Entity: "https://www.wikidata.org/wiki/[reference]",
    WD_Prop: "https://www.wikidata.org/wiki/Property:[reference]",
  },
  wormbase: {
    WormBase: "https://www.wormbase.org/get?name=[reference]",
  },
  xao: {
    XAO: "http://purl.obolibrary.org/obo/XAO_[reference]",
  },
  xco: {
    XCO: "http://purl.obolibrary.org/obo/XCO_[reference]",
  },
  xenbase: {
    Xenbase:
      "http://www.xenbase.org/gene/showgene.do?method=display&geneId=[reference]",
  },
  zfa: {
    ZFA: "http://purl.obolibrary.org/obo/ZFA_[reference]",
  },
  zfin: {
    ZFIN: "http://zfin.org/[reference]",
  },
  zfs: {
    ZFS: "http://purl.obolibrary.org/obo/ZFS_[reference]",
  },
  zp: {
    ZP: "http://purl.obolibrary.org/obo/ZP_[reference]",
  },
};
