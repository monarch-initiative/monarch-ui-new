import { library } from "@fortawesome/fontawesome-svg-core";

import * as fas from "@fortawesome/free-solid-svg-icons";
import * as fab from "@fortawesome/free-brands-svg-icons";
import Loading from "@/assets/icons/Loading.vue";

// create collection/"palette" of useable icons

library.add(
  fab.faGithub,
  fab.faTwitter,
  fas.faAngleDoubleLeft,
  fas.faAngleDoubleRight,
  fas.faAngleDown,
  fas.faAngleLeft,
  fas.faAngleRight,
  fas.faAngleUp,
  fas.faArrowDown,
  fas.faArrowRight,
  fas.faArrowUp,
  fas.faAsterisk,
  fas.faBalanceScale,
  fas.faBars,
  fas.faBarsProgress,
  fas.faBlog,
  fas.faCalendarAlt,
  fas.faCheck,
  fas.faCheckCircle,
  fas.faCode,
  fas.faCogs,
  fas.faComment,
  fas.faComments,
  fas.faDatabase,
  fas.faDownload,
  fas.faEnvelopeOpenText,
  fas.faExclamationCircle,
  fas.faExternalLinkAlt,
  fas.faFeatherAlt,
  fas.faFilter,
  fas.faHandsHelping,
  fas.faHistory,
  fas.faHome,
  fas.faInfoCircle,
  fas.faLink,
  fas.faNewspaper,
  fas.faPaperPlane,
  fas.faPauseCircle,
  fas.faPuzzlePiece,
  fas.faQuestionCircle,
  fas.faSearch,
  fas.faSignature,
  fas.faSubscript,
  fas.faTimes,
  fas.faTimesCircle,
  fas.faTools,
  fas.faUsers
);

// custom svg icons
export const customIcons = {
  Loading,
};
