import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faLink,
  faBars,
  faTimes,
  faBalanceScale,
  faEnvelopeOpenText,
  faBlog,
  faArrowRight,
  faFeatherAlt,
  faUsers,
  faNewspaper,
  faDatabase,
  faSignature,
  faComment,
  faHandsHelping,
  faTools,
  faPauseCircle,
  faCheckCircle,
  faExclamationCircle,
  faTimesCircle,
  faQuestionCircle,
  faHistory,
  faAngleUp,
  faAngleDown,
  faPuzzlePiece,
  faHome,
  faDownload,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons";
import Loading from "@/assets/icons/Loading.vue";

// create collection/"palette" of useable icons

// general
library.add(faLink);
library.add(faBars);
library.add(faTimes);
library.add(faBalanceScale);
library.add(faArrowRight);
library.add(faFeatherAlt);
library.add(faUsers);
library.add(faNewspaper);
library.add(faDatabase);
library.add(faSignature);
library.add(faComment);
library.add(faHandsHelping);
library.add(faTools);
library.add(faPauseCircle);
library.add(faCheckCircle);
library.add(faExclamationCircle);
library.add(faTimesCircle);
library.add(faQuestionCircle);
library.add(faHistory);
library.add(faAngleUp);
library.add(faAngleDown);
library.add(faPuzzlePiece);
library.add(faHome);
library.add(faDownload);
library.add(faCalendarAlt);

// social
library.add(faEnvelopeOpenText);
library.add(faGithub);
library.add(faBlog);
library.add(faTwitter);

// custom svg icons
export const customIcons = {
  Loading,
};
