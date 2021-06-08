import {
    CommunicationIdentifier,
    CommunicationUserIdentifier,
    isCommunicationUserIdentifier,
    isMicrosoftTeamsUserIdentifier,
    isPhoneNumberIdentifier,
    MicrosoftTeamsUserIdentifier,
    PhoneNumberIdentifier,
    UnknownIdentifier,
} from '@azure/communication-common';

export class AcsHelper {
    public static parseIdentifier(
        identifier?: CommunicationIdentifier,
    ): UnknownIdentifier | undefined {
        if (!identifier) {
            return undefined;
        }

        if (isCommunicationUserIdentifier(identifier)) {
            return {
                id: (identifier as CommunicationUserIdentifier)
                    .communicationUserId,
            };
        }

        if (isPhoneNumberIdentifier(identifier)) {
            return { id: (identifier as PhoneNumberIdentifier).phoneNumber };
        }

        if (isMicrosoftTeamsUserIdentifier(identifier)) {
            return {
                id: (identifier as MicrosoftTeamsUserIdentifier)
                    .microsoftTeamsUserId,
            };
        }

        return identifier as UnknownIdentifier;
    }
}
