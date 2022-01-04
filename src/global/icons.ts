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
  fas.faBlog,
  fas.faCalendarAlt,
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
  fas.faHandsHelping,
  fas.faHistory,
  fas.faHome,
  fas.faLink,
  fas.faNewspaper,
  fas.faPaperPlane,
  fas.faPauseCircle,
  fas.faPuzzlePiece,
  fas.faQuestionCircle,
  fas.faSignature,
  fas.faTimes,
  fas.faTimesCircle,
  fas.faTools,
  fas.faUsers
);

// custom svg icons
export const customIcons = {
  Loading,
};
