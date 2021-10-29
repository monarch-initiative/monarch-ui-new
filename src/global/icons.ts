import { library } from "@fortawesome/fontawesome-svg-core";

import * as fas from "@fortawesome/free-solid-svg-icons";
import * as fab from "@fortawesome/free-brands-svg-icons";
import Loading from "@/assets/icons/Loading.vue";

// create collection/"palette" of useable icons

library.add(fab.faGithub);
library.add(fab.faTwitter);
library.add(fas.faAngleDown);
library.add(fas.faAngleUp);
library.add(fas.faArrowRight);
library.add(fas.faAsterisk);
library.add(fas.faBalanceScale);
library.add(fas.faBars);
library.add(fas.faBlog);
library.add(fas.faCalendarAlt);
library.add(fas.faCheckCircle);
library.add(fas.faComment);
library.add(fas.faComments);
library.add(fas.faDatabase);
library.add(fas.faDownload);
library.add(fas.faEnvelopeOpenText);
library.add(fas.faExclamationCircle);
library.add(fas.faFeatherAlt);
library.add(fas.faHandsHelping);
library.add(fas.faHistory);
library.add(fas.faHome);
library.add(fas.faLink);
library.add(fas.faNewspaper);
library.add(fas.faPaperPlane);
library.add(fas.faPauseCircle);
library.add(fas.faPuzzlePiece);
library.add(fas.faQuestionCircle);
library.add(fas.faSignature);
library.add(fas.faTimes);
library.add(fas.faTimesCircle);
library.add(fas.faTools);
library.add(fas.faUsers);

// custom svg icons
export const customIcons = {
  Loading,
};
