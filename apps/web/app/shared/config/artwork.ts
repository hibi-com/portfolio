import {
    MESSAGE_HIRE_CONOSLE,
    SITE_AUTHOR,
    SITE_EMAIL_ADDRESS,
    SITE_YEAR,
    SOCIAL_GITHUB,
    SOCIAL_LINKEDIN,
    SOCIAL_TWITTER,
} from "~/shared/config/constants";

const artwork = String.raw`
<!--

  ${MESSAGE_HIRE_CONOSLE}

           |
          / \\
         / _ \\         ${SITE_AUTHOR}
        |.o '.|        ${SITE_EMAIL_ADDRESS}
        |'._.'|
        |     |         - Github: ${SOCIAL_GITHUB}
      .*|  |  |*.       - LinkedIn ${SOCIAL_LINKEDIN}
     /  |  |  |  \\      - Twitter ${SOCIAL_TWITTER}
     |,-'--|--'-.|
        \\     /        Ⓒ ${SITE_YEAR}
         \\ | /
           |

-->
`;

export { artwork };
